"""顧客管理ユースケース"""

from app.application.schemas.admin_user_schemas import (
    CustomerDetailDTO,
    CustomerDTO,
    GetCustomerOrdersInputDTO,
    GetCustomerOutputDTO,
    GetCustomersInputDTO,
    GetCustomersOutputDTO,
)
from app.application.schemas.order_schemas import GetOrdersOutputDTO, OrderDTO
from app.domain.entities.order import Order
from app.domain.entities.user import User
from app.domain.exceptions.user import UserNotFoundError
from app.domain.repositories.order_repository import IOrderRepository
from app.domain.repositories.user_repository import IUserRepository


class AdminUserUsecase:
    """顧客管理ユースケース"""

    def __init__(
        self,
        user_repository: IUserRepository,
        order_repository: IOrderRepository,
    ) -> None:
        self.user_repository = user_repository
        self.order_repository = order_repository

    def get_customers(self, input_dto: GetCustomersInputDTO) -> GetCustomersOutputDTO:
        """顧客一覧を取得

        Args:
            input_dto: 顧客一覧取得入力DTO

        Returns:
            顧客一覧取得出力DTO
        """
        users = self.user_repository.get_all(
            search=input_dto.search,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )
        total = self.user_repository.count_all(search=input_dto.search)

        return GetCustomersOutputDTO(
            customers=[self._to_customer_dto(u) for u in users],
            total=total,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )

    def get_customer(self, user_id: int) -> GetCustomerOutputDTO:
        """顧客詳細を取得

        Args:
            user_id: ユーザーID

        Returns:
            顧客詳細取得出力DTO

        Raises:
            UserNotFoundError: ユーザーが見つからない
        """
        user = self.user_repository.get_by_id(user_id)
        if user is None:
            raise UserNotFoundError()

        order_count = self.order_repository.count_by_user_id(user_id)
        total_spent = self.order_repository.get_total_spent_by_user_id(user_id)

        return GetCustomerOutputDTO(
            customer=CustomerDetailDTO(
                id=user.id,
                email=user.email,
                name=user.name,
                name_kana=user.name_kana,
                phone=user.phone,
                company=user.company,
                is_email_verified=user.is_email_verified,
                stripe_customer_id=user.stripe_customer_id,
                order_count=order_count,
                total_spent=total_spent,
                created_at=user.created_at,
                updated_at=user.updated_at,
            )
        )

    def get_customer_orders(
        self,
        user_id: int,
        input_dto: GetCustomerOrdersInputDTO,
    ) -> GetOrdersOutputDTO:
        """顧客の注文履歴を取得

        Args:
            user_id: ユーザーID
            input_dto: 注文履歴取得入力DTO

        Returns:
            注文一覧取得出力DTO

        Raises:
            UserNotFoundError: ユーザーが見つからない
        """
        user = self.user_repository.get_by_id(user_id)
        if user is None:
            raise UserNotFoundError()

        orders = self.order_repository.get_by_user_id(
            user_id=user_id,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )
        total = self.order_repository.count_by_user_id(user_id)

        return GetOrdersOutputDTO(
            orders=[self._to_order_dto(o) for o in orders],
            total=total,
            limit=input_dto.limit,
            offset=input_dto.offset,
        )

    def _to_customer_dto(self, user: User) -> CustomerDTO:
        """UserエンティティをCustomerDTOに変換"""
        return CustomerDTO(
            id=user.id,
            email=user.email,
            name=user.name,
            name_kana=user.name_kana,
            phone=user.phone,
            company=user.company,
            is_email_verified=user.is_email_verified,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )

    def _to_order_dto(self, order: Order) -> OrderDTO:
        """OrderエンティティをOrderDTOに変換"""
        return OrderDTO(
            id=order.id,
            order_number=order.order_number,
            status=order.status,
            subtotal=order.subtotal,
            shipping_fee=order.shipping_fee,
            tax=order.tax,
            total=order.total,
            payment_method=order.payment_method,
            paid_at=order.paid_at,
            shipped_at=order.shipped_at,
            tracking_number=order.tracking_number,
            delivered_at=order.delivered_at,
            cancelled_at=order.cancelled_at,
            notes=order.notes,
            created_at=order.created_at,
        )
