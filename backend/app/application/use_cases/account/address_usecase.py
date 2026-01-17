from app.application.schemas.account.address_schemas import (
    AddressDTO,
    CreateAddressInputDTO,
    CreateAddressOutputDTO,
    DeleteAddressOutputDTO,
    GetAddressListOutputDTO,
    GetAddressOutputDTO,
    SetDefaultAddressOutputDTO,
    UpdateAddressInputDTO,
    UpdateAddressOutputDTO,
)
from app.domain.entities.address import Address
from app.domain.exceptions.address import AddressNotFoundError
from app.domain.exceptions.common import OperationFailedError, PermissionDeniedError
from app.domain.repositories.address_repository import IAddressRepository


class AddressUsecase:
    """配送先管理ユースケース"""

    def __init__(self, address_repository: IAddressRepository):
        self.address_repository = address_repository

    def get_address_list(self, user_id: int) -> GetAddressListOutputDTO:
        """配送先一覧を取得"""
        addresses = self.address_repository.get_by_user_id(user_id)

        address_dtos = [self._to_dto(addr) for addr in addresses]

        return GetAddressListOutputDTO(
            addresses=address_dtos,
            total=len(address_dtos),
        )

    def get_address(self, user_id: int, address_id: int) -> GetAddressOutputDTO:
        """配送先詳細を取得"""
        address = self.address_repository.get_by_id(address_id)

        if address is None:
            raise AddressNotFoundError()

        # 他人の配送先へのアクセスを防止
        if address.user_id != user_id:
            raise PermissionDeniedError('この配送先にアクセスする')

        return GetAddressOutputDTO(address=self._to_dto(address))

    def create_address(
        self, user_id: int, input_dto: CreateAddressInputDTO
    ) -> CreateAddressOutputDTO:
        """配送先を追加"""
        # デフォルトに設定する場合、既存のデフォルトをクリア
        if input_dto.is_default:
            self.address_repository.clear_default(user_id)

        address = Address(
            user_id=user_id,
            label=input_dto.label,
            name=input_dto.name,
            postal_code=input_dto.postal_code,
            prefecture=input_dto.prefecture,
            city=input_dto.city,
            address1=input_dto.address1,
            address2=input_dto.address2,
            phone=input_dto.phone,
            is_default=input_dto.is_default,
        )

        created_address = self.address_repository.create(address)

        return CreateAddressOutputDTO(
            address=self._to_dto(created_address),
            message='配送先を追加しました',
        )

    def update_address(
        self, user_id: int, address_id: int, input_dto: UpdateAddressInputDTO
    ) -> UpdateAddressOutputDTO:
        """配送先を更新"""
        address = self.address_repository.get_by_id(address_id)

        if address is None:
            raise AddressNotFoundError()

        # 他人の配送先へのアクセスを防止
        if address.user_id != user_id:
            raise PermissionDeniedError('この配送先を更新する')

        # 更新する値を設定（Noneでない場合のみ更新）
        self._apply_address_updates(address, input_dto)

        updated_address = self.address_repository.update(address)

        return UpdateAddressOutputDTO(
            address=self._to_dto(updated_address),
            message='配送先を更新しました',
        )

    def _apply_address_updates(
        self, address: Address, input_dto: UpdateAddressInputDTO
    ) -> None:
        """入力DTOからアドレスエンティティを更新"""
        fields = [
            'label',
            'name',
            'postal_code',
            'prefecture',
            'city',
            'address1',
            'address2',
            'phone',
        ]
        for field in fields:
            value = getattr(input_dto, field)
            if value is not None:
                setattr(address, field, value)

    def delete_address(self, user_id: int, address_id: int) -> DeleteAddressOutputDTO:
        """配送先を削除"""
        address = self.address_repository.get_by_id(address_id)

        if address is None:
            raise AddressNotFoundError()

        # 他人の配送先へのアクセスを防止
        if address.user_id != user_id:
            raise PermissionDeniedError('この配送先を削除する')

        success = self.address_repository.delete(address_id)

        if not success:
            raise OperationFailedError('配送先の削除')

        return DeleteAddressOutputDTO(message='配送先を削除しました')

    def set_default_address(
        self, user_id: int, address_id: int
    ) -> SetDefaultAddressOutputDTO:
        """デフォルト配送先を設定"""
        address = self.address_repository.get_by_id(address_id)

        if address is None:
            raise AddressNotFoundError()

        # 他人の配送先へのアクセスを防止
        if address.user_id != user_id:
            raise PermissionDeniedError('この配送先をデフォルトに設定する')

        success = self.address_repository.set_default(user_id, address_id)

        if not success:
            raise OperationFailedError('デフォルト配送先の設定')

        # 更新された配送先を取得
        updated_address = self.address_repository.get_by_id(address_id)

        return SetDefaultAddressOutputDTO(
            address=self._to_dto(updated_address),
            message='デフォルト配送先を設定しました',
        )

    def _to_dto(self, address: Address) -> AddressDTO:
        """エンティティをDTOに変換"""
        return AddressDTO(
            id=address.id,
            label=address.label,
            name=address.name,
            postal_code=address.postal_code,
            prefecture=address.prefecture,
            city=address.city,
            address1=address.address1,
            address2=address.address2,
            phone=address.phone,
            is_default=address.is_default,
            created_at=address.created_at,
        )
