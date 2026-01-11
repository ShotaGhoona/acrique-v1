"""入稿データDBモデル"""

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func

from app.infrastructure.db.models.base import Base


class UploadModel(Base):
    """入稿データテーブル

    消費者がアップロードしたファイル（ロゴ、QRコード、写真等）の情報を管理する。

    ステータス:
        - pending: 注文前のアップロード（削除可能）
        - submitted: 注文確定後（注文に紐付け済み）
        - reviewing: 審査中
        - approved: 承認済み
        - rejected: 差し戻し
    """

    __tablename__ = 'uploads'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=True, index=True)
    order_item_id = Column(
        Integer, ForeignKey('order_items.id'), nullable=True, index=True
    )
    file_name = Column(String(255), nullable=False)
    s3_key = Column(String(500), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_type = Column(String(100), nullable=True)
    file_size = Column(Integer, nullable=True)
    upload_type = Column(String(50), nullable=True)
    text_content = Column(Text, nullable=True)
    status = Column(String(30), nullable=False, default='pending', index=True)
    admin_notes = Column(Text, nullable=True)
    reviewed_by = Column(Integer, ForeignKey('admins.id'), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
