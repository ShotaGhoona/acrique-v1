"""カートアイテムエンティティ"""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class CartItem(BaseModel):
    """カートアイテムエンティティ"""

    id: int | None = Field(None, description='カートアイテムID')
    user_id: int = Field(..., description='ユーザーID')
    product_id: str = Field(..., description='商品ID')
    quantity: int = Field(..., ge=1, description='数量')
    options: dict[str, Any] | None = Field(None, description='選択オプション')
    created_at: datetime | None = Field(None, description='作成日時')
    updated_at: datetime | None = Field(None, description='更新日時')

    class Config:
        """Pydantic設定"""

        from_attributes = True

    def calculate_subtotal(self, base_price: int) -> int:
        """小計を計算（オプション価格差分を含む）"""
        price = base_price

        # オプションの価格差分を加算
        if self.options:
            for option_value in self.options.values():
                if isinstance(option_value, dict) and 'price_diff' in option_value:
                    price += option_value.get('price_diff', 0)

        return price * self.quantity
