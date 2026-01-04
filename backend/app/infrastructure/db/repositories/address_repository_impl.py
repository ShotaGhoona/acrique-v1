from sqlalchemy.orm import Session

from app.domain.entities.address import Address
from app.domain.repositories.address_repository import IAddressRepository
from app.infrastructure.db.models.address_model import AddressModel


class AddressRepositoryImpl(IAddressRepository):
    """配送先リポジトリの実装"""

    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, address_id: int) -> Address | None:
        """IDで配送先を取得"""
        address_model = (
            self.session.query(AddressModel).filter(AddressModel.id == address_id).first()
        )
        if address_model is None:
            return None
        return self._to_entity(address_model)

    def get_by_user_id(self, user_id: int) -> list[Address]:
        """ユーザーIDで配送先一覧を取得"""
        address_models = (
            self.session.query(AddressModel)
            .filter(AddressModel.user_id == user_id)
            .order_by(AddressModel.is_default.desc(), AddressModel.created_at.desc())
            .all()
        )
        return [self._to_entity(model) for model in address_models]

    def get_default_by_user_id(self, user_id: int) -> Address | None:
        """ユーザーのデフォルト配送先を取得"""
        address_model = (
            self.session.query(AddressModel)
            .filter(AddressModel.user_id == user_id, AddressModel.is_default == True)
            .first()
        )
        if address_model is None:
            return None
        return self._to_entity(address_model)

    def create(self, address: Address) -> Address:
        """配送先を作成"""
        address_model = AddressModel(
            user_id=address.user_id,
            label=address.label,
            name=address.name,
            postal_code=address.postal_code,
            prefecture=address.prefecture,
            city=address.city,
            address1=address.address1,
            address2=address.address2,
            phone=address.phone,
            is_default=address.is_default,
        )
        self.session.add(address_model)
        self.session.flush()
        return self._to_entity(address_model)

    def update(self, address: Address) -> Address:
        """配送先を更新"""
        address_model = (
            self.session.query(AddressModel).filter(AddressModel.id == address.id).first()
        )
        if address_model is None:
            raise ValueError(f'Address with id {address.id} not found')

        address_model.label = address.label
        address_model.name = address.name
        address_model.postal_code = address.postal_code
        address_model.prefecture = address.prefecture
        address_model.city = address.city
        address_model.address1 = address.address1
        address_model.address2 = address.address2
        address_model.phone = address.phone
        address_model.is_default = address.is_default

        self.session.flush()
        return self._to_entity(address_model)

    def delete(self, address_id: int) -> bool:
        """配送先を削除"""
        address_model = (
            self.session.query(AddressModel).filter(AddressModel.id == address_id).first()
        )
        if address_model is None:
            return False

        self.session.delete(address_model)
        self.session.flush()
        return True

    def set_default(self, user_id: int, address_id: int) -> bool:
        """デフォルト配送先を設定"""
        # まず全ての配送先のデフォルトをクリア
        self.clear_default(user_id)

        # 指定された配送先をデフォルトに設定
        address_model = (
            self.session.query(AddressModel)
            .filter(AddressModel.id == address_id, AddressModel.user_id == user_id)
            .first()
        )
        if address_model is None:
            return False

        address_model.is_default = True
        self.session.flush()
        return True

    def clear_default(self, user_id: int) -> bool:
        """ユーザーのデフォルト配送先をクリア"""
        self.session.query(AddressModel).filter(
            AddressModel.user_id == user_id, AddressModel.is_default == True
        ).update({'is_default': False})
        self.session.flush()
        return True

    def _to_entity(self, address_model: AddressModel) -> Address:
        """DBモデルをエンティティに変換"""
        return Address(
            id=address_model.id,
            user_id=address_model.user_id,
            label=address_model.label,
            name=address_model.name,
            postal_code=address_model.postal_code,
            prefecture=address_model.prefecture,
            city=address_model.city,
            address1=address_model.address1,
            address2=address_model.address2,
            phone=address_model.phone,
            is_default=address_model.is_default,
            created_at=address_model.created_at,
        )
