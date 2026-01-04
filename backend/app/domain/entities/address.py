from datetime import datetime

from pydantic import BaseModel, Field


class Address(BaseModel):
    """配送先エンティティ"""

    id: int | None = Field(None, description='配送先ID')
    user_id: int = Field(..., description='ユーザーID')
    label: str | None = Field(None, description='ラベル（自宅/会社等）')
    name: str = Field(..., description='宛名')
    postal_code: str = Field(..., description='郵便番号')
    prefecture: str = Field(..., description='都道府県')
    city: str = Field(..., description='市区町村')
    address1: str = Field(..., description='住所1（町名・番地）')
    address2: str | None = Field(None, description='住所2（建物名・部屋番号）')
    phone: str = Field(..., description='電話番号')
    is_default: bool = Field(False, description='デフォルト配送先かどうか')
    created_at: datetime | None = Field(None, description='作成日時')

    class Config:
        """Pydantic設定"""

        from_attributes = True

    @property
    def full_address(self) -> str:
        """完全な住所を取得"""
        base = f'{self.prefecture}{self.city}{self.address1}'
        if self.address2:
            base += f' {self.address2}'
        return base
