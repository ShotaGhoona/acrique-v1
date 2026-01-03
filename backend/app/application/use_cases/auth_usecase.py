import logging
import secrets
from datetime import datetime, timedelta

from fastapi import HTTPException, status

from app.application.interfaces.email_service import IEmailService
from app.application.interfaces.security_service import ISecurityService
from app.application.schemas.auth_schemas import (
    LoginInputDTO,
    LoginOutputDTO,
    LogoutOutputDTO,
    PasswordResetConfirmInputDTO,
    PasswordResetConfirmOutputDTO,
    PasswordResetRequestInputDTO,
    PasswordResetRequestOutputDTO,
    RegisterInputDTO,
    RegisterOutputDTO,
    ResendVerificationInputDTO,
    ResendVerificationOutputDTO,
    StatusOutputDTO,
    VerifyEmailInputDTO,
    VerifyEmailOutputDTO,
)
from app.config import get_settings
from app.domain.entities.user import User
from app.domain.entities.verification_token import TokenType, VerificationToken
from app.domain.repositories.user_repository import IUserRepository
from app.domain.repositories.verification_token_repository import (
    IVerificationTokenRepository,
)

logger = logging.getLogger(__name__)


class AuthUsecase:
    """認証ユースケース"""

    def __init__(
        self,
        security_service: ISecurityService,
        user_repository: IUserRepository,
        token_repository: IVerificationTokenRepository,
        email_service: IEmailService,
    ):
        self.security_service = security_service
        self.user_repository = user_repository
        self.token_repository = token_repository
        self.email_service = email_service
        self.settings = get_settings()

    def register(self, input_dto: RegisterInputDTO) -> RegisterOutputDTO:
        """会員登録"""
        # メールアドレスの重複チェック
        existing_user = self.user_repository.get_by_email(input_dto.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='このメールアドレスは既に登録されています',
            )

        # パスワードをハッシュ化
        password_hash = self.security_service.hash_password(input_dto.password)

        # ユーザー作成
        user = User(
            email=input_dto.email,
            password_hash=password_hash,
            name=input_dto.name,
            name_kana=input_dto.name_kana,
            phone=input_dto.phone,
            company=input_dto.company,
        )
        created_user = self.user_repository.create(user)

        # メール認証トークン生成
        token = self._generate_token()
        verification_token = VerificationToken(
            user_id=created_user.id,
            token=token,
            token_type=TokenType.EMAIL_VERIFICATION,
            expires_at=datetime.utcnow() + timedelta(hours=24),
        )
        self.token_repository.create(verification_token)

        # 認証メール送信
        verification_url = f'{self.settings.frontend_url}/verify-email?token={token}'
        self.email_service.send_verification_email(
            to_email=created_user.email,
            verification_url=verification_url,
        )

        logger.info(f'User registered: {created_user.email}')

        return RegisterOutputDTO(
            user_id=created_user.id,
            email=created_user.email,
            message='会員登録が完了しました。メールをご確認ください。',
        )

    def login(self, input_dto: LoginInputDTO) -> LoginOutputDTO:
        """ログイン"""
        # ユーザー取得
        user = self.user_repository.get_by_email(input_dto.email)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='メールアドレスまたはパスワードが正しくありません',
            )

        # パスワード検証
        if not self.security_service.verify_password(
            input_dto.password, user.password_hash
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='メールアドレスまたはパスワードが正しくありません',
            )

        # メール認証済みかチェック
        if not user.is_email_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail='メールアドレスが認証されていません。認証メールをご確認ください。',
            )

        # アクセストークン生成
        access_token = self.security_service.create_access_token(user_id=user.id)
        logger.info(f'User logged in: {user.email}')

        return LoginOutputDTO(access_token=access_token, user_id=user.id)

    def logout(self) -> LogoutOutputDTO:
        """ログアウト処理（Cookieはエンドポイント側で削除）"""
        logger.info('ログアウト成功')
        return LogoutOutputDTO(message='ログアウトしました')

    def get_auth_status(self, user_id: int) -> StatusOutputDTO:
        """認証状態を取得"""
        user = self.user_repository.get_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='ユーザーが見つかりません',
            )

        return StatusOutputDTO(
            is_authenticated=True,
            user_id=user.id,
            email=user.email,
            name=user.name,
            is_email_verified=user.is_email_verified,
        )

    def verify_email(self, input_dto: VerifyEmailInputDTO) -> VerifyEmailOutputDTO:
        """メール認証"""
        # トークン取得
        token_entity = self.token_repository.get_by_token(
            input_dto.token, TokenType.EMAIL_VERIFICATION
        )
        if token_entity is None or not token_entity.is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='無効または期限切れのトークンです',
            )

        # メール認証完了
        verified_at = datetime.utcnow()
        self.user_repository.verify_email(token_entity.user_id, verified_at)

        # トークンを使用済みにする
        self.token_repository.mark_as_used(token_entity.id, verified_at)

        # ウェルカムメール送信
        user = self.user_repository.get_by_id(token_entity.user_id)
        if user:
            self.email_service.send_welcome_email(user.email, user.name)

        logger.info(f'Email verified for user_id: {token_entity.user_id}')

        return VerifyEmailOutputDTO(
            message='メールアドレスが認証されました',
            verified_at=verified_at,
        )

    def request_password_reset(
        self, input_dto: PasswordResetRequestInputDTO
    ) -> PasswordResetRequestOutputDTO:
        """パスワードリセット依頼"""
        # ユーザー取得（存在しなくても成功として返す = セキュリティ対策）
        user = self.user_repository.get_by_email(input_dto.email)
        if user:
            # 既存のリセットトークンを削除
            self.token_repository.delete_by_user_and_type(
                user.id, TokenType.PASSWORD_RESET
            )

            # 新しいリセットトークン生成
            token = self._generate_token()
            reset_token = VerificationToken(
                user_id=user.id,
                token=token,
                token_type=TokenType.PASSWORD_RESET,
                expires_at=datetime.utcnow() + timedelta(hours=1),
            )
            self.token_repository.create(reset_token)

            # リセットメール送信
            reset_url = f'{self.settings.frontend_url}/password-reset/confirm?token={token}'
            self.email_service.send_password_reset_email(
                to_email=user.email,
                reset_url=reset_url,
            )
            logger.info(f'Password reset requested for: {user.email}')

        return PasswordResetRequestOutputDTO(
            message='パスワードリセットのメールを送信しました',
        )

    def confirm_password_reset(
        self, input_dto: PasswordResetConfirmInputDTO
    ) -> PasswordResetConfirmOutputDTO:
        """パスワードリセット実行"""
        # トークン取得
        token_entity = self.token_repository.get_by_token(
            input_dto.token, TokenType.PASSWORD_RESET
        )
        if token_entity is None or not token_entity.is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='無効または期限切れのトークンです',
            )

        # パスワード更新
        password_hash = self.security_service.hash_password(input_dto.new_password)
        self.user_repository.update_password(token_entity.user_id, password_hash)

        # トークンを使用済みにする
        self.token_repository.mark_as_used(token_entity.id, datetime.utcnow())

        logger.info(f'Password reset completed for user_id: {token_entity.user_id}')

        return PasswordResetConfirmOutputDTO(
            message='パスワードが再設定されました',
        )

    def resend_verification_email(
        self, input_dto: ResendVerificationInputDTO
    ) -> ResendVerificationOutputDTO:
        """メール認証再送信"""
        user = self.user_repository.get_by_email(input_dto.email)
        if user is None:
            # セキュリティ対策: ユーザーが存在しなくても成功として返す
            return ResendVerificationOutputDTO(
                message='認証メールを再送信しました',
            )

        # 既に認証済みの場合
        if user.is_email_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='このメールアドレスは既に認証済みです',
            )

        # 既存のトークンを削除
        self.token_repository.delete_by_user_and_type(
            user.id, TokenType.EMAIL_VERIFICATION
        )

        # 新しいトークン生成
        token = self._generate_token()
        verification_token = VerificationToken(
            user_id=user.id,
            token=token,
            token_type=TokenType.EMAIL_VERIFICATION,
            expires_at=datetime.utcnow() + timedelta(hours=24),
        )
        self.token_repository.create(verification_token)

        # 認証メール送信
        verification_url = f'{self.settings.frontend_url}/verify-email?token={token}'
        self.email_service.send_verification_email(
            to_email=user.email,
            verification_url=verification_url,
        )

        logger.info(f'Verification email resent to: {user.email}')

        return ResendVerificationOutputDTO(
            message='認証メールを再送信しました',
        )

    def _generate_token(self) -> str:
        """セキュアなトークンを生成"""
        return secrets.token_urlsafe(32)
