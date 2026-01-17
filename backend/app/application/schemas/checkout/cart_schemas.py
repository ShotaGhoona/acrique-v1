"""カートスキーマ（DTO）"""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


# === カートアイテムDTO ===
class CartItemDTO(BaseModel):
    """カートアイテムDTO"""

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


# === カート取得 ===
class GetCartOutputDTO(BaseModel):
    """カート取得出力DTO"""

    items: list[CartItemDTO] = Field(..., description='カートアイテム一覧')
    item_count: int = Field(..., description='アイテム数')
    total_quantity: int = Field(..., description='合計数量')
    subtotal: int = Field(..., description='小計（税抜）')
    tax: int = Field(..., description='消費税')
    total: int = Field(..., description='合計（税込）')


# === カート追加 ===
class AddToCartInputDTO(BaseModel):
    """カート追加入力DTO"""

    product_id: str = Field(..., description='商品ID')
    quantity: int = Field(1, ge=1, description='数量')
    options: dict[str, Any] | None = Field(None, description='選択オプション')


class AddToCartOutputDTO(BaseModel):
    """カート追加出力DTO"""

    item: CartItemDTO = Field(..., description='追加されたカートアイテム')
    message: str = Field(..., description='メッセージ')


# === カートアイテム更新 ===
class UpdateCartItemInputDTO(BaseModel):
    """カートアイテム更新入力DTO"""

    quantity: int | None = Field(None, ge=1, description='数量')
    options: dict[str, Any] | None = Field(None, description='選択オプション')


class UpdateCartItemOutputDTO(BaseModel):
    """カートアイテム更新出力DTO"""

    item: CartItemDTO = Field(..., description='更新されたカートアイテム')
    message: str = Field(..., description='メッセージ')


# === カートアイテム削除 ===
class DeleteCartItemOutputDTO(BaseModel):
    """カートアイテム削除出力DTO"""

    message: str = Field(..., description='メッセージ')


# === カート全削除 ===
class ClearCartOutputDTO(BaseModel):
    """カート全削除出力DTO"""

    deleted_count: int = Field(..., description='削除件数')
    message: str = Field(..., description='メッセージ')
