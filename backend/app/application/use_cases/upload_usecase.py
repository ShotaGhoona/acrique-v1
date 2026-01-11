"""入稿データユースケース"""

from app.application.interfaces.storage_service import IStorageService
from app.application.schemas.upload_schemas import (
    CreateUploadInputDTO,
    CreateUploadOutputDTO,
    DeleteUploadOutputDTO,
    GetPresignedUrlInputDTO,
    GetPresignedUrlOutputDTO,
    GetUploadListOutputDTO,
    GetUploadOutputDTO,
    LinkUploadsInputDTO,
    LinkUploadsOutputDTO,
    UploadDTO,
)
from app.domain.entities.order import OrderStatus
from app.domain.entities.upload import Upload
from app.domain.exceptions.upload import (
    InvalidContentTypeError,
    UploadNotDeletableError,
    UploadNotFoundError,
    UploadNotOwnedError,
)
from app.domain.repositories.order_repository import IOrderRepository
from app.domain.repositories.upload_repository import IUploadRepository

# ファイルサイズ上限（20MB）
MAX_FILE_SIZE = 20 * 1024 * 1024

# 許可されるupload_type
VALID_UPLOAD_TYPES = frozenset(['logo', 'qr', 'photo', 'text'])


class UploadUsecase:
    """入稿データユースケース"""

    def __init__(
        self,
        upload_repository: IUploadRepository,
        storage_service: IStorageService,
        order_repository: IOrderRepository,
    ):
        self.upload_repository = upload_repository
        self.storage_service = storage_service
        self.order_repository = order_repository

    def get_presigned_url(
        self,
        user_id: int,
        input_dto: GetPresignedUrlInputDTO,
    ) -> GetPresignedUrlOutputDTO:
        """Presigned URLを取得"""
        # ユーザー専用フォルダを指定
        folder = f'uploads/user-{user_id}'

        try:
            result = self.storage_service.generate_presigned_url(
                file_name=input_dto.file_name,
                content_type=input_dto.content_type,
                folder=folder,
            )
        except ValueError as e:
            raise InvalidContentTypeError(input_dto.content_type) from e

        return GetPresignedUrlOutputDTO(
            upload_url=result.upload_url,
            file_url=result.file_url,
            s3_key=result.s3_key,
            expires_in=result.expires_in,
        )

    def create_upload(
        self,
        user_id: int,
        input_dto: CreateUploadInputDTO,
    ) -> CreateUploadOutputDTO:
        """アップロード完了を登録"""
        upload = Upload(
            user_id=user_id,
            file_name=input_dto.file_name,
            s3_key=input_dto.s3_key,
            file_url=input_dto.file_url,
            file_type=input_dto.file_type,
            file_size=input_dto.file_size,
            upload_type=input_dto.upload_type,
            status='pending',
        )

        created_upload = self.upload_repository.create(upload)

        return CreateUploadOutputDTO(upload=self._to_dto(created_upload))

    def get_upload_list(self, user_id: int) -> GetUploadListOutputDTO:
        """入稿データ一覧を取得"""
        uploads = self.upload_repository.get_by_user_id(user_id)
        total = self.upload_repository.count_by_user_id(user_id)

        upload_dtos = [self._to_dto(upload) for upload in uploads]

        return GetUploadListOutputDTO(uploads=upload_dtos, total=total)

    def get_upload(self, user_id: int, upload_id: int) -> GetUploadOutputDTO:
        """入稿データ詳細を取得"""
        upload = self.upload_repository.get_by_id(upload_id)

        if upload is None:
            raise UploadNotFoundError()

        # 他人のデータへのアクセスを防止
        if upload.user_id != user_id:
            raise UploadNotOwnedError()

        return GetUploadOutputDTO(upload=self._to_dto(upload))

    def delete_upload(self, user_id: int, upload_id: int) -> DeleteUploadOutputDTO:
        """入稿データを削除"""
        upload = self.upload_repository.get_by_id(upload_id)

        if upload is None:
            raise UploadNotFoundError()

        # 他人のデータへのアクセスを防止
        if upload.user_id != user_id:
            raise UploadNotOwnedError()

        # pendingステータスのみ削除可能
        if not upload.is_deletable:
            raise UploadNotDeletableError()

        # S3からオブジェクトを削除
        self.storage_service.delete_object(upload.file_url)

        # DBから削除
        self.upload_repository.delete(upload_id)

        return DeleteUploadOutputDTO(message='入稿データを削除しました')

    def link_uploads_to_order_item(
        self,
        user_id: int,
        order_id: int,
        order_item_id: int,
        input_dto: LinkUploadsInputDTO,
    ) -> LinkUploadsOutputDTO:
        """入稿データを注文明細に紐付け

        注文確定時またはマイページから呼び出される。
        - uploads.order_id と uploads.order_item_id を設定
        - uploads.status を pending → submitted に変更
        - マイページからの再入稿時（revision_required）のみ reviewing に変更
        """
        # 各upload_idが自分のものか確認
        for upload_id in input_dto.upload_ids:
            upload = self.upload_repository.get_by_id(upload_id)
            if upload is None:
                raise UploadNotFoundError()
            if upload.user_id != user_id:
                raise UploadNotOwnedError()

        # 紐付け実行
        linked_count = self.upload_repository.link_to_order_item(
            upload_ids=input_dto.upload_ids,
            order_id=order_id,
            order_item_id=order_item_id,
        )

        # マイページからの再入稿時のみステータスを更新
        # （チェックアウト時は支払い成功時にまとめて判定）
        order = self.order_repository.get_by_id(order_id)
        if order and order.status == OrderStatus.REVISION_REQUIRED:
            order.status = OrderStatus.REVIEWING
            self.order_repository.update(order)

        return LinkUploadsOutputDTO(
            linked_count=linked_count,
            message=f'{linked_count}件の入稿データを紐付けました',
        )

    def _to_dto(self, upload: Upload) -> UploadDTO:
        """エンティティをDTOに変換"""
        return UploadDTO(
            id=upload.id,
            file_name=upload.file_name,
            file_url=upload.file_url,
            file_type=upload.file_type,
            file_size=upload.file_size,
            upload_type=upload.upload_type,
            status=upload.status,
            order_id=upload.order_id,
            order_item_id=upload.order_item_id,
            created_at=upload.created_at,
        )
