"""注文エンティティ"""

from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class OrderStatus(str, Enum):
    """注文ステータス

    ステータス遷移:
        pending → confirmed (入稿不要商品のみ、支払い成功時)
        pending → reviewing (入稿あり、支払い成功時)
        reviewing → confirmed (Admin全承認)
        reviewing → revision_required (Admin差し戻し)
        revision_required → reviewing (ユーザー再入稿)
        confirmed → processing (製作開始)
        processing → shipped (発送)
        shipped → delivered (配達完了)
        pending → cancelled (キャンセル)
    """

    PENDING = 'pending'  # 支払い待ち（注文作成〜支払い完了）
    REVIEWING = 'reviewing'  # 入稿審査中（Admin確認待ち）
    REVISION_REQUIRED = 'revision_required'  # 再入稿待ち（Admin差し戻し後）
    CONFIRMED = 'confirmed'  # 製作待ち（審査完了 or 入稿不要）
    PROCESSING = 'processing'  # 製作中
    SHIPPED = 'shipped'  # 発送済み
    DELIVERED = 'delivered'  # 完了
    CANCELLED = 'cancelled'  # キャンセル


class PaymentMethod(str, Enum):
    """決済方法"""

    STRIPE = 'stripe'
    BANK_TRANSFER = 'bank_transfer'


class OrderItem(BaseModel):
    """注文明細エンティティ"""

    id: int | None = Field(None, description='注文明細ID')
    order_id: int | None = Field(None, description='注文ID')
    product_id: str = Field(..., description='商品ID')
    product_name: str = Field(..., description='商品名（スナップショット）')
    product_name_ja: str | None = Field(None, description='商品名日本語')
    quantity: int = Field(..., ge=1, description='数量')
    unit_price: int = Field(..., ge=0, description='単価')
    options: dict[str, Any] | None = Field(None, description='選択オプション')
    subtotal: int = Field(..., ge=0, description='小計')
    upload_requirements: dict[str, Any] | None = Field(
        None, description='入稿要件（商品からコピー）'
    )

    class Config:
        """Pydantic設定"""

        from_attributes = True

    def calculate_subtotal(self) -> int:
        """小計を計算"""
        return self.unit_price * self.quantity


class Order(BaseModel):
    """注文エンティティ"""

    id: int | None = Field(None, description='注文ID')
    user_id: int = Field(..., description='ユーザーID')
    order_number: str | None = Field(None, description='注文番号')
    status: OrderStatus = Field(default=OrderStatus.PENDING, description='ステータス')
    shipping_address_id: int | None = Field(None, description='配送先ID')
    subtotal: int = Field(0, ge=0, description='小計')
    shipping_fee: int = Field(0, ge=0, description='送料')
    tax: int = Field(0, ge=0, description='消費税')
    total: int = Field(0, ge=0, description='合計')
    payment_method: PaymentMethod | None = Field(None, description='決済方法')
    stripe_payment_intent_id: str | None = Field(
        None, description='Stripe PaymentIntent ID'
    )
    paid_at: datetime | None = Field(None, description='支払日時')
    confirmed_at: datetime | None = Field(None, description='確定日時')
    shipped_at: datetime | None = Field(None, description='発送日時')
    tracking_number: str | None = Field(None, description='追跡番号')
    delivered_at: datetime | None = Field(None, description='配達日時')
    cancelled_at: datetime | None = Field(None, description='キャンセル日時')
    cancel_reason: str | None = Field(None, description='キャンセル理由')
    notes: str | None = Field(None, description='顧客備考')
    admin_notes: str | None = Field(None, description='管理者メモ')
    created_at: datetime | None = Field(None, description='作成日時')
    updated_at: datetime | None = Field(None, description='更新日時')
    items: list[OrderItem] = Field(default_factory=list, description='注文明細')

    class Config:
        """Pydantic設定"""

        from_attributes = True

    def can_cancel(self) -> bool:
        """キャンセル可能かどうか"""
        # pending の状態ならキャンセル可能
        # 支払い後（reviewing以降）はキャンセル不可
        return self.status == OrderStatus.PENDING

    def calculate_totals(self, tax_rate: float = 0.10) -> None:
        """合計金額を計算"""
        self.subtotal = sum(item.subtotal for item in self.items)
        self.tax = int(self.subtotal * tax_rate)
        self.total = self.subtotal + self.tax + self.shipping_fee
