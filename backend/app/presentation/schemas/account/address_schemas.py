"""配送先リクエスト/レスポンススキーマ"""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from app.application.schemas.account.address_schemas import (
    AddressDTO,
    CreateAddressInputDTO,
    CreateAddressOutputDTO,
    DeleteAddressOutputDTO,
    GetAddressListOutputDTO,
    GetAddressOutputDTO,
    SetDefaultAddressOutputDTO,
    UpdateAddressInputDTO,
    UpdateAddressOutputDTO,
)


# === 配送先レスポンス共通 ===
class AddressResponse(BaseModel):
    """配送先レスポンス"""

    id: int = Field(..., description='配送先ID')
    label: str | None = Field(None, description='ラベル（自宅/会社等）')
    name: str = Field(..., description='宛名')
    postal_code: str = Field(..., description='郵便番号')
    prefecture: str = Field(..., description='都道府県')
    city: str = Field(..., description='市区町村')
    address1: str = Field(..., description='住所1（町名・番地）')
    address2: str | None = Field(None, description='住所2（建物名・部屋番号）')
    phone: str = Field(..., description='電話番号')
    is_default: bool = Field(..., description='デフォルト配送先かどうか')
    created_at: datetime | None = Field(None, description='作成日時')

    @classmethod
    def from_dto(cls, dto: AddressDTO) -> AddressResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === 配送先一覧 ===
class GetAddressListResponse(BaseModel):
    """配送先一覧レスポンス"""

    addresses: list[AddressResponse] = Field(..., description='配送先一覧')
    total: int = Field(..., description='総件数')

    @classmethod
    def from_dto(cls, dto: GetAddressListOutputDTO) -> GetAddressListResponse:
        """DTO → Response 変換"""
        return cls(
            addresses=[AddressResponse.from_dto(addr) for addr in dto.addresses],
            total=dto.total,
        )


# === 配送先追加 ===
class CreateAddressRequest(BaseModel):
    """配送先追加リクエスト"""

    label: str | None = Field(None, description='ラベル（自宅/会社等）')
    name: str = Field(..., description='宛名')
    postal_code: str = Field(..., description='郵便番号')
    prefecture: str = Field(..., description='都道府県')
    city: str = Field(..., description='市区町村')
    address1: str = Field(..., description='住所1（町名・番地）')
    address2: str | None = Field(None, description='住所2（建物名・部屋番号）')
    phone: str = Field(..., description='電話番号')
    is_default: bool = Field(False, description='デフォルト配送先に設定するか')

    def to_dto(self) -> CreateAddressInputDTO:
        """Request → DTO 変換"""
        return CreateAddressInputDTO(**self.model_dump())


class CreateAddressResponse(BaseModel):
    """配送先追加レスポンス"""

    address: AddressResponse = Field(..., description='作成された配送先')
    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: CreateAddressOutputDTO) -> CreateAddressResponse:
        """DTO → Response 変換"""
        return cls(
            address=AddressResponse.from_dto(dto.address),
            message=dto.message,
        )


# === 配送先詳細 ===
class GetAddressResponse(BaseModel):
    """配送先詳細レスポンス"""

    address: AddressResponse = Field(..., description='配送先')

    @classmethod
    def from_dto(cls, dto: GetAddressOutputDTO) -> GetAddressResponse:
        """DTO → Response 変換"""
        return cls(address=AddressResponse.from_dto(dto.address))


# === 配送先更新 ===
class UpdateAddressRequest(BaseModel):
    """配送先更新リクエスト"""

    label: str | None = Field(None, description='ラベル（自宅/会社等）')
    name: str | None = Field(None, description='宛名')
    postal_code: str | None = Field(None, description='郵便番号')
    prefecture: str | None = Field(None, description='都道府県')
    city: str | None = Field(None, description='市区町村')
    address1: str | None = Field(None, description='住所1（町名・番地）')
    address2: str | None = Field(None, description='住所2（建物名・部屋番号）')
    phone: str | None = Field(None, description='電話番号')

    def to_dto(self) -> UpdateAddressInputDTO:
        """Request → DTO 変換"""
        return UpdateAddressInputDTO(**self.model_dump())


class UpdateAddressResponse(BaseModel):
    """配送先更新レスポンス"""

    address: AddressResponse = Field(..., description='更新された配送先')
    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: UpdateAddressOutputDTO) -> UpdateAddressResponse:
        """DTO → Response 変換"""
        return cls(
            address=AddressResponse.from_dto(dto.address),
            message=dto.message,
        )


# === 配送先削除 ===
class DeleteAddressResponse(BaseModel):
    """配送先削除レスポンス"""

    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: DeleteAddressOutputDTO) -> DeleteAddressResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === デフォルト設定 ===
class SetDefaultAddressResponse(BaseModel):
    """デフォルト配送先設定レスポンス"""

    address: AddressResponse = Field(..., description='デフォルトに設定された配送先')
    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: SetDefaultAddressOutputDTO) -> SetDefaultAddressResponse:
        """DTO → Response 変換"""
        return cls(
            address=AddressResponse.from_dto(dto.address),
            message=dto.message,
        )
