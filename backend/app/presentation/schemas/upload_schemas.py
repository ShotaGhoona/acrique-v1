"""入稿データリクエスト/レスポンススキーマ"""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

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


# === 入稿データレスポンス共通 ===
class UploadResponse(BaseModel):
    """入稿データレスポンス"""

    id: int = Field(..., description='入稿データID')
    file_name: str = Field(..., description='元ファイル名')
    file_url: str = Field(..., description='CloudFront配信URL')
    file_type: str | None = Field(None, description='MIMEタイプ')
    file_size: int | None = Field(None, description='ファイルサイズ（bytes）')
    upload_type: str | None = Field(None, description='アップロード種別')
    status: str = Field(..., description='ステータス')
    order_id: int | None = Field(None, description='注文ID')
    order_item_id: int | None = Field(None, description='注文明細ID')
    created_at: datetime | None = Field(None, description='作成日時')

    @classmethod
    def from_dto(cls, dto: UploadDTO) -> UploadResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === Presigned URL取得 ===
class GetPresignedUrlRequest(BaseModel):
    """Presigned URL取得リクエスト"""

    file_name: str = Field(..., description='ファイル名')
    content_type: str = Field(..., description='MIMEタイプ')
    upload_type: str = Field(..., description='アップロード種別（logo/qr/photo/text）')

    def to_dto(self) -> GetPresignedUrlInputDTO:
        """Request → DTO 変換"""
        return GetPresignedUrlInputDTO(**self.model_dump())


class GetPresignedUrlResponse(BaseModel):
    """Presigned URL取得レスポンス"""

    upload_url: str = Field(..., description='S3へのPUT用署名付きURL')
    file_url: str = Field(..., description='CloudFront配信URL（DB登録用）')
    s3_key: str = Field(..., description='S3オブジェクトキー')
    expires_in: int = Field(..., description='有効期限（秒）')

    @classmethod
    def from_dto(cls, dto: GetPresignedUrlOutputDTO) -> GetPresignedUrlResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === アップロード登録 ===
class CreateUploadRequest(BaseModel):
    """アップロード登録リクエスト"""

    file_name: str = Field(..., description='元ファイル名')
    s3_key: str = Field(..., description='S3オブジェクトキー')
    file_url: str = Field(..., description='CloudFront配信URL')
    file_type: str | None = Field(None, description='MIMEタイプ')
    file_size: int | None = Field(None, description='ファイルサイズ（bytes）')
    upload_type: str | None = Field(None, description='アップロード種別')

    def to_dto(self) -> CreateUploadInputDTO:
        """Request → DTO 変換"""
        return CreateUploadInputDTO(**self.model_dump())


class CreateUploadResponse(BaseModel):
    """アップロード登録レスポンス"""

    id: int = Field(..., description='入稿データID')
    file_name: str = Field(..., description='元ファイル名')
    file_url: str = Field(..., description='CloudFront配信URL')
    upload_type: str | None = Field(None, description='アップロード種別')
    status: str = Field(..., description='ステータス')
    created_at: datetime | None = Field(None, description='作成日時')

    @classmethod
    def from_dto(cls, dto: CreateUploadOutputDTO) -> CreateUploadResponse:
        """DTO → Response 変換"""
        upload = dto.upload
        return cls(
            id=upload.id,
            file_name=upload.file_name,
            file_url=upload.file_url,
            upload_type=upload.upload_type,
            status=upload.status,
            created_at=upload.created_at,
        )


# === 入稿データ一覧 ===
class GetUploadListResponse(BaseModel):
    """入稿データ一覧レスポンス"""

    uploads: list[UploadResponse] = Field(..., description='入稿データ一覧')

    @classmethod
    def from_dto(cls, dto: GetUploadListOutputDTO) -> GetUploadListResponse:
        """DTO → Response 変換"""
        return cls(
            uploads=[UploadResponse.from_dto(upload) for upload in dto.uploads],
        )


# === 入稿データ詳細 ===
class GetUploadResponse(BaseModel):
    """入稿データ詳細レスポンス"""

    upload: UploadResponse = Field(..., description='入稿データ')

    @classmethod
    def from_dto(cls, dto: GetUploadOutputDTO) -> GetUploadResponse:
        """DTO → Response 変換"""
        return cls(upload=UploadResponse.from_dto(dto.upload))


# === 入稿データ削除 ===
class DeleteUploadResponse(BaseModel):
    """入稿データ削除レスポンス"""

    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: DeleteUploadOutputDTO) -> DeleteUploadResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === 注文明細への紐付け ===
class LinkUploadsRequest(BaseModel):
    """注文明細への紐付けリクエスト"""

    upload_ids: list[int] = Field(..., description='紐付ける入稿データIDリスト')

    def to_dto(self) -> LinkUploadsInputDTO:
        """Request → DTO 変換"""
        return LinkUploadsInputDTO(**self.model_dump())


class LinkUploadsResponse(BaseModel):
    """注文明細への紐付けレスポンス"""

    linked_count: int = Field(..., description='紐付けられた件数')
    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: LinkUploadsOutputDTO) -> LinkUploadsResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())
