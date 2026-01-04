"""注文リポジトリ実装"""

from datetime import datetime

from sqlalchemy.orm import Session, joinedload

from app.domain.entities.order import Order, OrderItem, OrderStatus, PaymentMethod
from app.domain.repositories.order_repository import (
    IOrderItemRepository,
    IOrderRepository,
)
from app.infrastructure.db.models.order_model import OrderItemModel, OrderModel


class OrderRepositoryImpl(IOrderRepository):
    """注文リポジトリの実装"""

    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, order_id: int) -> Order | None:
        """IDで注文を取得（明細含む）"""
        order_model = (
            self.session.query(OrderModel)
            .options(joinedload(OrderModel.items))
            .filter(OrderModel.id == order_id)
            .first()
        )
        if order_model is None:
            return None
        return self._to_entity(order_model)

    def get_by_order_number(self, order_number: str) -> Order | None:
        """注文番号で注文を取得"""
        order_model = (
            self.session.query(OrderModel)
            .options(joinedload(OrderModel.items))
            .filter(OrderModel.order_number == order_number)
            .first()
        )
        if order_model is None:
            return None
        return self._to_entity(order_model)

    def get_by_user_id(
        self,
        user_id: int,
        status: OrderStatus | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[Order]:
        """ユーザーIDで注文一覧を取得"""
        query = (
            self.session.query(OrderModel)
            .options(joinedload(OrderModel.items))
            .filter(OrderModel.user_id == user_id)
        )

        if status is not None:
            query = query.filter(OrderModel.status == status.value)

        order_models = (
            query.order_by(OrderModel.created_at.desc()).limit(limit).offset(offset).all()
        )

        return [self._to_entity(model) for model in order_models]

    def count_by_user_id(
        self,
        user_id: int,
        status: OrderStatus | None = None,
    ) -> int:
        """ユーザーの注文数を取得"""
        query = self.session.query(OrderModel).filter(OrderModel.user_id == user_id)

        if status is not None:
            query = query.filter(OrderModel.status == status.value)

        return query.count()

    def create(self, order: Order) -> Order:
        """注文を作成（明細含む）"""
        order_model = OrderModel(
            user_id=order.user_id,
            order_number=order.order_number,
            status=order.status.value,
            shipping_address_id=order.shipping_address_id,
            subtotal=order.subtotal,
            shipping_fee=order.shipping_fee,
            tax=order.tax,
            total=order.total,
            payment_method=order.payment_method.value if order.payment_method else None,
            stripe_payment_intent_id=order.stripe_payment_intent_id,
            notes=order.notes,
            admin_notes=order.admin_notes,
        )

        self.session.add(order_model)
        self.session.flush()

        # 明細の作成
        for item in order.items:
            item_model = OrderItemModel(
                order_id=order_model.id,
                product_id=item.product_id,
                product_name=item.product_name,
                product_name_ja=item.product_name_ja,
                quantity=item.quantity,
                unit_price=item.unit_price,
                options=item.options,
                subtotal=item.subtotal,
            )
            self.session.add(item_model)

        self.session.flush()

        # リレーションをリフレッシュ
        self.session.refresh(order_model)

        return self._to_entity(order_model)

    def update(self, order: Order) -> Order:
        """注文を更新"""
        order_model = (
            self.session.query(OrderModel).filter(OrderModel.id == order.id).first()
        )
        if order_model is None:
            raise ValueError(f'Order with id {order.id} not found')

        order_model.status = order.status.value
        order_model.shipping_address_id = order.shipping_address_id
        order_model.subtotal = order.subtotal
        order_model.shipping_fee = order.shipping_fee
        order_model.tax = order.tax
        order_model.total = order.total
        order_model.payment_method = (
            order.payment_method.value if order.payment_method else None
        )
        order_model.stripe_payment_intent_id = order.stripe_payment_intent_id
        order_model.paid_at = order.paid_at
        order_model.confirmed_at = order.confirmed_at
        order_model.shipped_at = order.shipped_at
        order_model.tracking_number = order.tracking_number
        order_model.delivered_at = order.delivered_at
        order_model.cancelled_at = order.cancelled_at
        order_model.cancel_reason = order.cancel_reason
        order_model.notes = order.notes
        order_model.admin_notes = order.admin_notes

        self.session.flush()
        return self._to_entity(order_model)

    def generate_order_number(self) -> str:
        """注文番号を生成（ACQ-YYMMDD-XXX形式）"""
        today = datetime.now()
        date_part = today.strftime('%y%m%d')
        prefix = f'ACQ-{date_part}-'

        # 本日の注文数をカウント
        today_start = datetime(today.year, today.month, today.day)
        today_end = datetime(today.year, today.month, today.day, 23, 59, 59)

        count = (
            self.session.query(OrderModel)
            .filter(OrderModel.created_at >= today_start)
            .filter(OrderModel.created_at <= today_end)
            .count()
        )

        return f'{prefix}{count + 1:03d}'

    def _to_entity(self, order_model: OrderModel) -> Order:
        """DBモデルをエンティティに変換"""
        return Order(
            id=order_model.id,
            user_id=order_model.user_id,
            order_number=order_model.order_number,
            status=OrderStatus(order_model.status),
            shipping_address_id=order_model.shipping_address_id,
            subtotal=order_model.subtotal,
            shipping_fee=order_model.shipping_fee,
            tax=order_model.tax,
            total=order_model.total,
            payment_method=(
                PaymentMethod(order_model.payment_method)
                if order_model.payment_method
                else None
            ),
            stripe_payment_intent_id=order_model.stripe_payment_intent_id,
            paid_at=order_model.paid_at,
            confirmed_at=order_model.confirmed_at,
            shipped_at=order_model.shipped_at,
            tracking_number=order_model.tracking_number,
            delivered_at=order_model.delivered_at,
            cancelled_at=order_model.cancelled_at,
            cancel_reason=order_model.cancel_reason,
            notes=order_model.notes,
            admin_notes=order_model.admin_notes,
            created_at=order_model.created_at,
            updated_at=order_model.updated_at,
            items=[self._item_to_entity(item) for item in order_model.items],
        )

    def _item_to_entity(self, item_model: OrderItemModel) -> OrderItem:
        """注文明細DBモデルをエンティティに変換"""
        return OrderItem(
            id=item_model.id,
            order_id=item_model.order_id,
            product_id=item_model.product_id,
            product_name=item_model.product_name,
            product_name_ja=item_model.product_name_ja,
            quantity=item_model.quantity,
            unit_price=item_model.unit_price,
            options=item_model.options,
            subtotal=item_model.subtotal,
        )


class OrderItemRepositoryImpl(IOrderItemRepository):
    """注文明細リポジトリの実装"""

    def __init__(self, session: Session):
        self.session = session

    def get_by_order_id(self, order_id: int) -> list[OrderItem]:
        """注文IDで明細一覧を取得"""
        item_models = (
            self.session.query(OrderItemModel)
            .filter(OrderItemModel.order_id == order_id)
            .all()
        )
        return [self._to_entity(model) for model in item_models]

    def create(self, order_item: OrderItem) -> OrderItem:
        """注文明細を作成"""
        item_model = OrderItemModel(
            order_id=order_item.order_id,
            product_id=order_item.product_id,
            product_name=order_item.product_name,
            product_name_ja=order_item.product_name_ja,
            quantity=order_item.quantity,
            unit_price=order_item.unit_price,
            options=order_item.options,
            subtotal=order_item.subtotal,
        )
        self.session.add(item_model)
        self.session.flush()
        return self._to_entity(item_model)

    def create_many(self, order_items: list[OrderItem]) -> list[OrderItem]:
        """複数の注文明細を一括作成"""
        return [self.create(order_item) for order_item in order_items]

    def _to_entity(self, item_model: OrderItemModel) -> OrderItem:
        """DBモデルをエンティティに変換"""
        return OrderItem(
            id=item_model.id,
            order_id=item_model.order_id,
            product_id=item_model.product_id,
            product_name=item_model.product_name,
            product_name_ja=item_model.product_name_ja,
            quantity=item_model.quantity,
            unit_price=item_model.unit_price,
            options=item_model.options,
            subtotal=item_model.subtotal,
        )
