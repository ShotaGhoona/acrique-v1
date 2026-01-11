"""入稿データエンティティ"""

from datetime import datetime

from pydantic import BaseModel, Field


class Upload(BaseModel):
    """入稿データエンティティ

    消費者がアップロードしたロゴ、QRコード、写真等のデータを表す。
    """

    id: int | None = Field(None, description='入稿データID')
    user_id: int = Field(..., description='ユーザーID')
    order_id: int | None = Field(None, description='注文ID（注文確定後に紐付け）')
    order_item_id: int | None = Field(None, description='注文明細ID')
    file_name: str = Field(..., description='元ファイル名')
    s3_key: str = Field(..., description='S3オブジェクトキー')
    file_url: str = Field(..., description='CloudFront配信URL')
    file_type: str | None = Field(None, description='MIMEタイプ')
    file_size: int | None = Field(None, description='ファイルサイズ（bytes）')
    upload_type: str | None = Field(
        None, description='アップロード種別（logo/qr/photo/text）'
    )
    text_content: str | None = Field(None, description='テキスト入稿の場合の内容')
    status: str = Field('pending', description='ステータス')
    admin_notes: str | None = Field(None, description='管理者メモ')
    reviewed_by: int | None = Field(None, description='審査担当管理者ID')
    reviewed_at: datetime | None = Field(None, description='審査日時')
    created_at: datetime | None = Field(None, description='作成日時')

    class Config:
        """Pydantic設定"""

        from_attributes = True

    @property
    def is_pending(self) -> bool:
        """未紐付け（削除可能）かどうか"""
        return self.status == 'pending'

    @property
    def is_deletable(self) -> bool:
        """削除可能かどうか（pendingの場合のみ）"""
        return self.status == 'pending'
