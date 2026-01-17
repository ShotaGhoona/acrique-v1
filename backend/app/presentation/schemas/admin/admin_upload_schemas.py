"""Admin入稿データ管理リクエスト/レスポンススキーマ"""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from app.application.schemas.admin.admin_upload_schemas import (
    AdminUploadDTO,
    ApproveUploadInputDTO,
    ApproveUploadOutputDTO,
    GetAdminUploadOutputDTO,
    GetAdminUploadsOutputDTO,
    RejectUploadInputDTO,
    RejectUploadOutputDTO,
)


# === Admin入稿データレスポンス ===
class AdminUploadResponse(BaseModel):
    """Admin用入稿データレスポンス"""

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

    @classmethod
    def from_dto(cls, dto: AdminUploadDTO) -> AdminUploadResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === 入稿データ一覧 ===
class GetAdminUploadsResponse(BaseModel):
    """Admin入稿データ一覧レスポンス"""

    uploads: list[AdminUploadResponse] = Field(..., description='入稿データ一覧')
    total: int = Field(..., description='総件数')
    limit: int = Field(..., description='取得件数')
    offset: int = Field(..., description='オフセット')

    @classmethod
    def from_dto(cls, dto: GetAdminUploadsOutputDTO) -> GetAdminUploadsResponse:
        """DTO → Response 変換"""
        return cls(
            uploads=[AdminUploadResponse.from_dto(upload) for upload in dto.uploads],
            total=dto.total,
            limit=dto.limit,
            offset=dto.offset,
        )


# === 入稿データ詳細 ===
class GetAdminUploadResponse(BaseModel):
    """Admin入稿データ詳細レスポンス"""

    upload: AdminUploadResponse = Field(..., description='入稿データ')

    @classmethod
    def from_dto(cls, dto: GetAdminUploadOutputDTO) -> GetAdminUploadResponse:
        """DTO → Response 変換"""
        return cls(upload=AdminUploadResponse.from_dto(dto.upload))


# === 承認 ===
class ApproveUploadRequest(BaseModel):
    """入稿データ承認リクエスト"""

    admin_notes: str | None = Field(None, description='管理者メモ')

    def to_dto(self) -> ApproveUploadInputDTO:
        """Request → DTO 変換"""
        return ApproveUploadInputDTO(**self.model_dump())


class ApproveUploadResponse(BaseModel):
    """入稿データ承認レスポンス"""

    upload: AdminUploadResponse = Field(..., description='更新後の入稿データ')
    message: str = Field(..., description='メッセージ')
    order_status_updated: bool = Field(False, description='注文ステータスが更新されたか')

    @classmethod
    def from_dto(cls, dto: ApproveUploadOutputDTO) -> ApproveUploadResponse:
        """DTO → Response 変換"""
        return cls(
            upload=AdminUploadResponse.from_dto(dto.upload),
            message=dto.message,
            order_status_updated=dto.order_status_updated,
        )


# === 差し戻し ===
class RejectUploadRequest(BaseModel):
    """入稿データ差し戻しリクエスト"""

    admin_notes: str = Field(..., min_length=1, description='差し戻し理由（必須）')

    def to_dto(self) -> RejectUploadInputDTO:
        """Request → DTO 変換"""
        return RejectUploadInputDTO(**self.model_dump())


class RejectUploadResponse(BaseModel):
    """入稿データ差し戻しレスポンス"""

    upload: AdminUploadResponse = Field(..., description='更新後の入稿データ')
    message: str = Field(..., description='メッセージ')
    order_status_updated: bool = Field(False, description='注文ステータスが更新されたか')

    @classmethod
    def from_dto(cls, dto: RejectUploadOutputDTO) -> RejectUploadResponse:
        """DTO → Response 変換"""
        return cls(
            upload=AdminUploadResponse.from_dto(dto.upload),
            message=dto.message,
            order_status_updated=dto.order_status_updated,
        )
