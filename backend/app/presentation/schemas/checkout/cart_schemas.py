"""カートリクエスト/レスポンススキーマ"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field

from app.application.schemas.checkout.cart_schemas import (
    AddToCartInputDTO,
    AddToCartOutputDTO,
    CartItemDTO,
    ClearCartOutputDTO,
    DeleteCartItemOutputDTO,
    GetCartOutputDTO,
    UpdateCartItemInputDTO,
    UpdateCartItemOutputDTO,
)


# === カートアイテムレスポンス共通 ===
class CartItemResponse(BaseModel):
    """カートアイテムレスポンス"""

    id: int = Field(..., description='カートアイテムID')
    product_id: str = Field(..., description='商品ID')
    product_name: str | None = Field(None, description='商品名')
    product_name_ja: str | None = Field(None, description='商品名（日本語）')
    product_image_url: str | None = Field(None, description='商品画像URL')
    base_price: int = Field(..., description='商品基本価格')
    quantity: int = Field(..., description='数量')
    options: dict[str, Any] | None = Field(None, description='選択オプション')
    subtotal: int = Field(..., description='小計')
    created_at: datetime | None = Field(None, description='作成日時')
    updated_at: datetime | None = Field(None, description='更新日時')

    @classmethod
    def from_dto(cls, dto: CartItemDTO) -> CartItemResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === カート取得 ===
class GetCartResponse(BaseModel):
    """カート取得レスポンス"""

    items: list[CartItemResponse] = Field(..., description='カートアイテム一覧')
    item_count: int = Field(..., description='アイテム数')
    total_quantity: int = Field(..., description='合計数量')
    subtotal: int = Field(..., description='小計（税抜）')
    tax: int = Field(..., description='消費税')
    total: int = Field(..., description='合計（税込）')

    @classmethod
    def from_dto(cls, dto: GetCartOutputDTO) -> GetCartResponse:
        """DTO → Response 変換"""
        return cls(
            items=[CartItemResponse.from_dto(item) for item in dto.items],
            item_count=dto.item_count,
            total_quantity=dto.total_quantity,
            subtotal=dto.subtotal,
            tax=dto.tax,
            total=dto.total,
        )


# === カート追加 ===
class AddToCartRequest(BaseModel):
    """カート追加リクエスト"""

    product_id: str = Field(..., description='商品ID')
    quantity: int = Field(1, ge=1, description='数量')
    options: dict[str, Any] | None = Field(None, description='選択オプション')

    def to_dto(self) -> AddToCartInputDTO:
        """Request → DTO 変換"""
        return AddToCartInputDTO(**self.model_dump())


class AddToCartResponse(BaseModel):
    """カート追加レスポンス"""

    item: CartItemResponse = Field(..., description='追加されたカートアイテム')
    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: AddToCartOutputDTO) -> AddToCartResponse:
        """DTO → Response 変換"""
        return cls(
            item=CartItemResponse.from_dto(dto.item),
            message=dto.message,
        )


# === カートアイテム更新 ===
class UpdateCartItemRequest(BaseModel):
    """カートアイテム更新リクエスト"""

    quantity: int | None = Field(None, ge=1, description='数量')
    options: dict[str, Any] | None = Field(None, description='選択オプション')

    def to_dto(self) -> UpdateCartItemInputDTO:
        """Request → DTO 変換"""
        return UpdateCartItemInputDTO(**self.model_dump())


class UpdateCartItemResponse(BaseModel):
    """カートアイテム更新レスポンス"""

    item: CartItemResponse = Field(..., description='更新されたカートアイテム')
    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: UpdateCartItemOutputDTO) -> UpdateCartItemResponse:
        """DTO → Response 変換"""
        return cls(
            item=CartItemResponse.from_dto(dto.item),
            message=dto.message,
        )


# === カートアイテム削除 ===
class DeleteCartItemResponse(BaseModel):
    """カートアイテム削除レスポンス"""

    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: DeleteCartItemOutputDTO) -> DeleteCartItemResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())


# === カート全削除 ===
class ClearCartResponse(BaseModel):
    """カート全削除レスポンス"""

    deleted_count: int = Field(..., description='削除件数')
    message: str = Field(..., description='メッセージ')

    @classmethod
    def from_dto(cls, dto: ClearCartOutputDTO) -> ClearCartResponse:
        """DTO → Response 変換"""
        return cls(**dto.model_dump())
