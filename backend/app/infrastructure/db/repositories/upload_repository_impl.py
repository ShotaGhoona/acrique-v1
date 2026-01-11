"""入稿データリポジトリの実装"""

from sqlalchemy.orm import Session

from app.domain.entities.upload import Upload
from app.domain.repositories.upload_repository import IUploadRepository
from app.infrastructure.db.models.upload_model import UploadModel


class UploadRepositoryImpl(IUploadRepository):
    """入稿データリポジトリの実装"""

    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, upload_id: int) -> Upload | None:
        """IDで入稿データを取得"""
        upload_model = (
            self.session.query(UploadModel).filter(UploadModel.id == upload_id).first()
        )
        if upload_model is None:
            return None
        return self._to_entity(upload_model)

    def get_by_user_id(
        self,
        user_id: int,
        limit: int = 50,
        offset: int = 0,
    ) -> list[Upload]:
        """ユーザーIDで入稿データ一覧を取得"""
        upload_models = (
            self.session.query(UploadModel)
            .filter(UploadModel.user_id == user_id)
            .order_by(UploadModel.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )
        return [self._to_entity(m) for m in upload_models]

    def get_by_order_id(self, order_id: int) -> list[Upload]:
        """注文IDで入稿データ一覧を取得"""
        upload_models = (
            self.session.query(UploadModel)
            .filter(UploadModel.order_id == order_id)
            .order_by(UploadModel.created_at.desc())
            .all()
        )
        return [self._to_entity(m) for m in upload_models]

    def get_by_order_item_id(self, order_item_id: int) -> list[Upload]:
        """注文明細IDで入稿データ一覧を取得"""
        upload_models = (
            self.session.query(UploadModel)
            .filter(UploadModel.order_item_id == order_item_id)
            .order_by(UploadModel.created_at.desc())
            .all()
        )
        return [self._to_entity(m) for m in upload_models]

    def count_by_user_id(self, user_id: int) -> int:
        """ユーザーの入稿データ数を取得"""
        return (
            self.session.query(UploadModel).filter(UploadModel.user_id == user_id).count()
        )

    def create(self, upload: Upload) -> Upload:
        """入稿データを作成"""
        upload_model = UploadModel(
            user_id=upload.user_id,
            order_id=upload.order_id,
            order_item_id=upload.order_item_id,
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
        )
        self.session.add(upload_model)
        self.session.flush()
        return self._to_entity(upload_model)

    def update(self, upload: Upload) -> Upload:
        """入稿データを更新"""
        upload_model = (
            self.session.query(UploadModel).filter(UploadModel.id == upload.id).first()
        )
        if upload_model is None:
            raise ValueError(f'Upload with id {upload.id} not found')

        upload_model.order_id = upload.order_id
        upload_model.order_item_id = upload.order_item_id
        upload_model.status = upload.status
        upload_model.admin_notes = upload.admin_notes
        upload_model.reviewed_by = upload.reviewed_by
        upload_model.reviewed_at = upload.reviewed_at

        self.session.flush()
        return self._to_entity(upload_model)

    def delete(self, upload_id: int) -> bool:
        """入稿データを削除"""
        upload_model = (
            self.session.query(UploadModel).filter(UploadModel.id == upload_id).first()
        )
        if upload_model is None:
            return False

        self.session.delete(upload_model)
        self.session.flush()
        return True

    def link_to_order_item(
        self,
        upload_ids: list[int],
        order_id: int,
        order_item_id: int,
    ) -> int:
        """入稿データを注文明細に紐付け

        Args:
            upload_ids: 紐付ける入稿データIDのリスト
            order_id: 注文ID
            order_item_id: 注文明細ID

        Returns:
            int: 更新された件数
        """
        if not upload_ids:
            return 0

        updated_count = (
            self.session.query(UploadModel)
            .filter(
                UploadModel.id.in_(upload_ids),
                UploadModel.status == 'pending',
            )
            .update(
                {
                    UploadModel.order_id: order_id,
                    UploadModel.order_item_id: order_item_id,
                    UploadModel.status: 'submitted',
                },
                synchronize_session='fetch',
            )
        )
        self.session.flush()
        return updated_count

    def _to_entity(self, upload_model: UploadModel) -> Upload:
        """DBモデルをエンティティに変換"""
        return Upload(
            id=upload_model.id,
            user_id=upload_model.user_id,
            order_id=upload_model.order_id,
            order_item_id=upload_model.order_item_id,
            file_name=upload_model.file_name,
            s3_key=upload_model.s3_key,
            file_url=upload_model.file_url,
            file_type=upload_model.file_type,
            file_size=upload_model.file_size,
            upload_type=upload_model.upload_type,
            text_content=upload_model.text_content,
            status=upload_model.status,
            admin_notes=upload_model.admin_notes,
            reviewed_by=upload_model.reviewed_by,
            reviewed_at=upload_model.reviewed_at,
            created_at=upload_model.created_at,
        )
