"""Admin入稿データ管理ユースケース"""

from datetime import datetime

from app.application.schemas.admin_upload_schemas import (
    AdminUploadDTO,
    ApproveUploadInputDTO,
    ApproveUploadOutputDTO,
    GetAdminUploadOutputDTO,
    GetAdminUploadsInputDTO,
    GetAdminUploadsOutputDTO,
    RejectUploadInputDTO,
    RejectUploadOutputDTO,
)
from app.domain.entities.order import OrderStatus
from app.domain.entities.upload import Upload
from app.domain.exceptions.upload import UploadNotFoundError
from app.domain.repositories.order_repository import IOrderRepository
from app.domain.repositories.upload_repository import IUploadRepository


class AdminUploadUsecase:
    """Admin入稿データ管理ユースケース"""

    def __init__(
        self,
        upload_repository: IUploadRepository,
        order_repository: IOrderRepository,
    ):
        self.upload_repository = upload_repository
        self.order_repository = order_repository

    def get_uploads(self, input_dto: GetAdminUploadsInputDTO) -> GetAdminUploadsOutputDTO:
        """入稿データ一覧を取得"""
        uploads = self.upload_repository.get_all_paginated(
            status=input_dto.status,
            user_id=input_dto.user_id,
            order_id=input_dto.order_id,
            date_from=input_dto.date_from,
            date_to=input_dto.date_to,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )
        total = self.upload_repository.count_all_by_filters(
            status=input_dto.status,
            user_id=input_dto.user_id,
            order_id=input_dto.order_id,
            date_from=input_dto.date_from,
            date_to=input_dto.date_to,
        )

        return GetAdminUploadsOutputDTO(
            uploads=[self._to_dto(upload) for upload in uploads],
            total=total,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )

    def get_upload(self, upload_id: int) -> GetAdminUploadOutputDTO:
        """入稿データ詳細を取得"""
        upload = self.upload_repository.get_by_id(upload_id)
        if upload is None:
            raise UploadNotFoundError()

        return GetAdminUploadOutputDTO(upload=self._to_dto(upload))

    def approve_upload(
        self,
        admin_id: int,
        upload_id: int,
        input_dto: ApproveUploadInputDTO,
    ) -> ApproveUploadOutputDTO:
        """入稿データを承認"""
        upload = self.upload_repository.get_by_id(upload_id)
        if upload is None:
            raise UploadNotFoundError()

        # ステータス更新
        upload.status = 'approved'
        upload.admin_notes = input_dto.admin_notes
        upload.reviewed_by = admin_id
        upload.reviewed_at = datetime.now()

        updated_upload = self.upload_repository.update(upload)

        # 注文ステータスの連動更新をチェック
        order_status_updated = False
        if updated_upload.order_id:
            order_status_updated = self._check_and_update_order_status(
                updated_upload.order_id
            )

        return ApproveUploadOutputDTO(
            upload=self._to_dto(updated_upload),
            message='入稿データを承認しました',
            order_status_updated=order_status_updated,
        )

    def reject_upload(
        self,
        admin_id: int,
        upload_id: int,
        input_dto: RejectUploadInputDTO,
    ) -> RejectUploadOutputDTO:
        """入稿データを差し戻し"""
        upload = self.upload_repository.get_by_id(upload_id)
        if upload is None:
            raise UploadNotFoundError()

        # ステータス更新
        upload.status = 'rejected'
        upload.admin_notes = input_dto.admin_notes
        upload.reviewed_by = admin_id
        upload.reviewed_at = datetime.now()

        updated_upload = self.upload_repository.update(upload)

        # 注文ステータスを revision_required に更新
        order_status_updated = False
        if updated_upload.order_id:
            order = self.order_repository.get_by_id(updated_upload.order_id)
            if order and order.status == OrderStatus.REVIEWING:
                order.status = OrderStatus.REVISION_REQUIRED
                self.order_repository.update(order)
                order_status_updated = True

        return RejectUploadOutputDTO(
            upload=self._to_dto(updated_upload),
            message='入稿データを差し戻しました',
            order_status_updated=order_status_updated,
        )

    def _check_and_update_order_status(self, order_id: int) -> bool:
        """全入稿が承認されたら注文ステータスを confirmed に更新

        Returns:
            bool: 注文ステータスが更新されたかどうか
        """
        order = self.order_repository.get_by_id(order_id)
        if order is None:
            return False

        # reviewing 以外の場合は更新しない
        if order.status != OrderStatus.REVIEWING:
            return False

        # 注文に紐づく全入稿データを取得
        uploads = self.upload_repository.get_by_order_id(order_id)
        if not uploads:
            return False

        # 全て approved かチェック
        all_approved = all(upload.status == 'approved' for upload in uploads)
        if not all_approved:
            return False

        # 全て承認済みなら confirmed に更新
        order.status = OrderStatus.CONFIRMED
        order.confirmed_at = datetime.now()
        self.order_repository.update(order)

        return True

    def _to_dto(self, upload: Upload) -> AdminUploadDTO:
        """UploadエンティティをDTOに変換"""
        return AdminUploadDTO(
            id=upload.id,
            user_id=upload.user_id,
            order_id=upload.order_id,
            order_item_id=upload.order_item_id,
            quantity_index=upload.quantity_index,
            file_name=upload.file_name,
            s3_key=upload.s3_key,
            file_url=upload.file_url,
            file_type=upload.file_type,
            file_size=upload.file_size,
            upload_type=upload.upload_type,
            text_content=upload.text_content,
            status=upload.status,
            admin_notes=upload.admin_notes,
            reviewed_by=upload.reviewed_by,
            reviewed_at=upload.reviewed_at,
            created_at=upload.created_at,
        )
