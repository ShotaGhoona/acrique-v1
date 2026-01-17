"""Admin入稿データ管理スキーマ"""

from datetime import datetime

from pydantic import BaseModel, Field


# === Admin入稿データDTO ===
class AdminUploadDTO(BaseModel):
    """Admin用入稿データDTO（admin_notes, reviewed_by, reviewed_at含む）"""

    id: int = Field(..., description='入稿データID')
    user_id: int = Field(..., description='ユーザーID')
    order_id: int | None = Field(None, description='注文ID')
    order_item_id: int | None = Field(None, description='注文明細ID')
    quantity_index: int = Field(1, description='何個目の入稿か（1始まり）')
    file_name: str = Field(..., description='元ファイル名')
    s3_key: str = Field(..., description='S3オブジェクトキー')
    file_url: str = Field(..., description='CloudFront配信URL')
    file_type: str | None = Field(None, description='MIMEタイプ')
    file_size: int | None = Field(None, description='ファイルサイズ（bytes）')
    upload_type: str | None = Field(None, description='アップロード種別')
    text_content: str | None = Field(None, description='テキスト入稿の場合の内容')
    status: str = Field(..., description='ステータス')
    admin_notes: str | None = Field(None, description='管理者メモ（差し戻し理由等）')
    reviewed_by: int | None = Field(None, description='審査担当管理者ID')
    reviewed_at: datetime | None = Field(None, description='審査日時')
    created_at: datetime | None = Field(None, description='作成日時')


# === 入稿データ一覧取得 ===
class GetAdminUploadsInputDTO(BaseModel):
    """Admin入稿データ一覧取得入力DTO"""

    status: str | None = Field(None, description='ステータスフィルタ')
    user_id: int | None = Field(None, description='ユーザーIDフィルタ')
    order_id: int | None = Field(None, description='注文IDフィルタ')
    date_from: datetime | None = Field(None, description='開始日')
    date_to: datetime | None = Field(None, description='終了日')
    limit: int = Field(20, ge=1, le=100, description='取得件数')
    offset: int = Field(0, ge=0, description='オフセット')


class GetAdminUploadsOutputDTO(BaseModel):
    """Admin入稿データ一覧取得出力DTO"""

    uploads: list[AdminUploadDTO] = Field(..., description='入稿データ一覧')
    total: int = Field(..., description='総件数')
    limit: int = Field(..., description='取得件数')
    offset: int = Field(..., description='オフセット')


# === 入稿データ詳細取得 ===
class GetAdminUploadOutputDTO(BaseModel):
    """Admin入稿データ詳細取得出力DTO"""

    upload: AdminUploadDTO = Field(..., description='入稿データ')


# === 承認 ===
class ApproveUploadInputDTO(BaseModel):
    """入稿データ承認入力DTO"""

    admin_notes: str | None = Field(None, description='管理者メモ')


class ApproveUploadOutputDTO(BaseModel):
    """入稿データ承認出力DTO"""

    upload: AdminUploadDTO = Field(..., description='更新後の入稿データ')
    message: str = Field(..., description='メッセージ')
    order_status_updated: bool = Field(False, description='注文ステータスが更新されたか')


# === 差し戻し ===
class RejectUploadInputDTO(BaseModel):
    """入稿データ差し戻し入力DTO"""

    admin_notes: str = Field(..., min_length=1, description='差し戻し理由（必須）')


class RejectUploadOutputDTO(BaseModel):
    """入稿データ差し戻し出力DTO"""

    upload: AdminUploadDTO = Field(..., description='更新後の入稿データ')
    message: str = Field(..., description='メッセージ')
    order_status_updated: bool = Field(False, description='注文ステータスが更新されたか')
