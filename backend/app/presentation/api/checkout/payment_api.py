"""決済APIエンドポイント"""

from fastapi import APIRouter, Depends, Header, Request, status

from app.application.schemas.checkout.payment_schemas import (
    CreatePaymentIntentRequest,
    CreatePaymentIntentResponse,
    WebhookResponse,
)
from app.application.use_cases.checkout.payment_usecase import PaymentUsecase
from app.di.checkout.payment import get_payment_usecase
from app.infrastructure.security.security_service_impl import (
    User,
    get_current_user_from_cookie,
)

router = APIRouter(prefix='/payments', tags=['決済'])


@router.post(
    '/intent',
    response_model=CreatePaymentIntentResponse,
    status_code=status.HTTP_200_OK,
    summary='PaymentIntent作成',
    description='注文の金額からPaymentIntentを作成し、client_secretを返却',
)
def create_payment_intent(
    request: CreatePaymentIntentRequest,
    current_user: User = Depends(get_current_user_from_cookie),
    usecase: PaymentUsecase = Depends(get_payment_usecase),
) -> CreatePaymentIntentResponse:
    """PaymentIntentを作成

    - 注文の金額からPaymentIntentを作成
    - client_secretを返却（Frontendで使用）
    """
    output_dto = usecase.create_payment_intent(
        user_id=current_user.id,
        input_dto=request.to_dto(),
    )
    return CreatePaymentIntentResponse.from_dto(output_dto)


@router.post(
    '/webhook',
    response_model=WebhookResponse,
    status_code=status.HTTP_200_OK,
    summary='Stripe Webhook',
    description='Stripeからのイベント通知を受信',
)
async def handle_webhook(
    request: Request,
    stripe_signature: str = Header(..., alias='Stripe-Signature'),
    usecase: PaymentUsecase = Depends(get_payment_usecase),
) -> WebhookResponse:
    """Stripe Webhookを処理

    処理するイベント:
    - payment_intent.succeeded: 決済成功 → 注文ステータスをpaidに更新
    - payment_intent.payment_failed: 決済失敗 → ログ記録
    - charge.refunded: 返金 → ログ記録
    """
    payload = await request.body()
    usecase.handle_webhook(payload, stripe_signature)
    return WebhookResponse(received=True)
