from fastapi import HTTPException, status

from app.application.schemas.address_schemas import (
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
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='配送先が見つかりません',
            )

        # 他人の配送先へのアクセスを防止
        if address.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail='この配送先にアクセスする権限がありません',
            )

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
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='配送先が見つかりません',
            )

        # 他人の配送先へのアクセスを防止
        if address.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail='この配送先を更新する権限がありません',
            )

        # 更新する値を設定（Noneでない場合のみ更新）
        if input_dto.label is not None:
            address.label = input_dto.label
        if input_dto.name is not None:
            address.name = input_dto.name
        if input_dto.postal_code is not None:
            address.postal_code = input_dto.postal_code
        if input_dto.prefecture is not None:
            address.prefecture = input_dto.prefecture
        if input_dto.city is not None:
            address.city = input_dto.city
        if input_dto.address1 is not None:
            address.address1 = input_dto.address1
        if input_dto.address2 is not None:
            address.address2 = input_dto.address2
        if input_dto.phone is not None:
            address.phone = input_dto.phone

        updated_address = self.address_repository.update(address)

        return UpdateAddressOutputDTO(
            address=self._to_dto(updated_address),
            message='配送先を更新しました',
        )

    def delete_address(self, user_id: int, address_id: int) -> DeleteAddressOutputDTO:
        """配送先を削除"""
        address = self.address_repository.get_by_id(address_id)

        if address is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='配送先が見つかりません',
            )

        # 他人の配送先へのアクセスを防止
        if address.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail='この配送先を削除する権限がありません',
            )

        success = self.address_repository.delete(address_id)

        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail='配送先の削除に失敗しました',
            )

        return DeleteAddressOutputDTO(message='配送先を削除しました')

    def set_default_address(
        self, user_id: int, address_id: int
    ) -> SetDefaultAddressOutputDTO:
        """デフォルト配送先を設定"""
        address = self.address_repository.get_by_id(address_id)

        if address is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='配送先が見つかりません',
            )

        # 他人の配送先へのアクセスを防止
        if address.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail='この配送先をデフォルトに設定する権限がありません',
            )

        success = self.address_repository.set_default(user_id, address_id)

        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail='デフォルト配送先の設定に失敗しました',
            )

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
