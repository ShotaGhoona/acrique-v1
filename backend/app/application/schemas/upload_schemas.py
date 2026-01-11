"""入稿データスキーマ"""

from datetime import datetime

from pydantic import BaseModel, Field


# === 入稿データDTO ===
class UploadDTO(BaseModel):
    """入稿データDTO"""

    id: int = Field(..., description='入稿データID')
    file_name: str = Field(..., description='元ファイル名')
    file_url: str = Field(..., description='CloudFront配信URL')
    file_type: str | None = Field(None, description='MIMEタイプ')
    file_size: int | None = Field(None, description='ファイルサイズ（bytes）')
    upload_type: str | None = Field(None, description='アップロード種別')
    status: str = Field(..., description='ステータス')
    admin_notes: str | None = Field(None, description='管理者メモ（差し戻し理由等）')
    order_id: int | None = Field(None, description='注文ID')
    order_item_id: int | None = Field(None, description='注文明細ID')
    quantity_index: int = Field(1, description='何個目の入稿か（1始まり）')
    created_at: datetime | None = Field(None, description='作成日時')


# === Presigned URL取得 ===
class GetPresignedUrlInputDTO(BaseModel):
    """Presigned URL取得入力DTO"""

    file_name: str = Field(..., description='ファイル名')
    content_type: str = Field(..., description='MIMEタイプ')
    upload_type: str = Field(..., description='アップロード種別（logo/qr/photo/text）')


class GetPresignedUrlOutputDTO(BaseModel):
    """Presigned URL取得出力DTO"""

    upload_url: str = Field(..., description='S3へのPUT用署名付きURL')
    file_url: str = Field(..., description='CloudFront配信URL（DB登録用）')
    s3_key: str = Field(..., description='S3オブジェクトキー')
    expires_in: int = Field(..., description='有効期限（秒）')


# === アップロード登録 ===
class CreateUploadInputDTO(BaseModel):
    """アップロード登録入力DTO"""

    file_name: str = Field(..., description='元ファイル名')
    s3_key: str = Field(..., description='S3オブジェクトキー')
    file_url: str = Field(..., description='CloudFront配信URL')
    file_type: str | None = Field(None, description='MIMEタイプ')
    file_size: int | None = Field(None, description='ファイルサイズ（bytes）')
    upload_type: str | None = Field(None, description='アップロード種別')


class CreateUploadOutputDTO(BaseModel):
    """アップロード登録出力DTO"""

    upload: UploadDTO = Field(..., description='作成された入稿データ')


# === 入稿データ一覧 ===
class GetUploadListOutputDTO(BaseModel):
    """入稿データ一覧出力DTO"""

    uploads: list[UploadDTO] = Field(..., description='入稿データ一覧')
    total: int = Field(..., description='総件数')


# === 入稿データ詳細 ===
class GetUploadOutputDTO(BaseModel):
    """入稿データ詳細出力DTO"""

    upload: UploadDTO = Field(..., description='入稿データ')


# === 入稿データ削除 ===
class DeleteUploadOutputDTO(BaseModel):
    """入稿データ削除出力DTO"""

    message: str = Field(..., description='メッセージ')


# === 注文明細への紐付け ===
class LinkUploadsInputDTO(BaseModel):
    """注文明細への紐付け入力DTO"""

    upload_ids: list[int] = Field(..., description='紐付ける入稿データIDリスト')
    quantity_index: int = Field(1, ge=1, description='何個目の入稿か（1始まり）')


class LinkUploadsOutputDTO(BaseModel):
    """注文明細への紐付け出力DTO"""

    linked_count: int = Field(..., description='紐付けられた件数')
    message: str = Field(..., description='メッセージ')
