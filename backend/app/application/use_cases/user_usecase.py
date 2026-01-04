from fastapi import HTTPException, status

from app.application.interfaces.security_service import ISecurityService
from app.application.schemas.user_schemas import (
    ChangePasswordInputDTO,
    ChangePasswordOutputDTO,
    GetMeOutputDTO,
    UpdateMeInputDTO,
    UpdateMeOutputDTO,
)
from app.domain.repositories.user_repository import IUserRepository


class UserUsecase:
    """ユーザー管理ユースケース"""

    def __init__(
        self,
        user_repository: IUserRepository,
        security_service: ISecurityService,
    ):
        self.user_repository = user_repository
        self.security_service = security_service

    def get_me(self, user_id: int) -> GetMeOutputDTO:
        """自分の情報を取得"""
        user = self.user_repository.get_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='ユーザーが見つかりません',
            )

        return GetMeOutputDTO(
            id=user.id,
            email=user.email,
            name=user.name,
            name_kana=user.name_kana,
            phone=user.phone,
            company=user.company,
            is_email_verified=user.is_email_verified,
            created_at=user.created_at,
        )

    def update_me(self, user_id: int, input_dto: UpdateMeInputDTO) -> UpdateMeOutputDTO:
        """自分の情報を更新"""
        user = self.user_repository.get_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='ユーザーが見つかりません',
            )

        # 更新する値を設定（Noneでない場合のみ更新）
        if input_dto.name is not None:
            user.name = input_dto.name
        if input_dto.name_kana is not None:
            user.name_kana = input_dto.name_kana
        if input_dto.phone is not None:
            user.phone = input_dto.phone
        if input_dto.company is not None:
            user.company = input_dto.company

        updated_user = self.user_repository.update(user)

        return UpdateMeOutputDTO(
            id=updated_user.id,
            email=updated_user.email,
            name=updated_user.name,
            name_kana=updated_user.name_kana,
            phone=updated_user.phone,
            company=updated_user.company,
            message='プロフィールを更新しました',
        )

    def change_password(
        self, user_id: int, input_dto: ChangePasswordInputDTO
    ) -> ChangePasswordOutputDTO:
        """パスワードを変更"""
        user = self.user_repository.get_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='ユーザーが見つかりません',
            )

        # 現在のパスワードを検証
        if not self.security_service.verify_password(
            input_dto.current_password, user.password_hash
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='現在のパスワードが正しくありません',
            )

        # 新しいパスワードをハッシュ化して更新
        new_password_hash = self.security_service.hash_password(input_dto.new_password)
        success = self.user_repository.update_password(user_id, new_password_hash)

        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail='パスワードの更新に失敗しました',
            )

        return ChangePasswordOutputDTO(message='パスワードを変更しました')
