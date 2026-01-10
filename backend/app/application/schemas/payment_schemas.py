"""決済スキーマ（DTO）"""

from dataclasses import dataclass

from pydantic import BaseModel, Field


# Application層 DTO
@dataclass
class CreatePaymentIntentInputDTO:
    """PaymentIntent作成入力DTO"""

    order_id: int


@dataclass
class CreatePaymentIntentOutputDTO:
    """PaymentIntent作成出力DTO"""

    client_secret: str
    payment_intent_id: str
    amount: int


# Presentation層 スキーマ
class CreatePaymentIntentRequest(BaseModel):
    """PaymentIntent作成リクエスト"""

    order_id: int = Field(..., description='注文ID')

    def to_dto(self) -> CreatePaymentIntentInputDTO:
        return CreatePaymentIntentInputDTO(order_id=self.order_id)


class CreatePaymentIntentResponse(BaseModel):
    """PaymentIntent作成レスポンス"""

    client_secret: str = Field(..., description='クライアントシークレット')
    payment_intent_id: str = Field(..., description='PaymentIntent ID')
    amount: int = Field(..., description='決済金額')

    @classmethod
    def from_dto(
        cls, dto: CreatePaymentIntentOutputDTO
    ) -> 'CreatePaymentIntentResponse':
        return cls(
            client_secret=dto.client_secret,
            payment_intent_id=dto.payment_intent_id,
            amount=dto.amount,
        )


class WebhookResponse(BaseModel):
    """Webhookレスポンス"""

    received: bool = Field(default=True, description='受信成功')
