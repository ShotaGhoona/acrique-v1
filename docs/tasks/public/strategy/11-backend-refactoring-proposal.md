# バックエンド リファクタリング提案書

## 概要

本提案書では、現在のバックエンドのディレクトリ構造とコードを分析し、`docs/rules/architecture/BACKEND.md`で定義されているオニオンアーキテクチャの原則に沿ったリファクタリング方針を提示します。

---

## 現状分析

### 現在のディレクトリ構造

```
backend/app/
├── domain/
│   ├── entities/           # user, product, order, address, cart_item, verification_token
│   └── repositories/       # 各エンティティのリポジトリインターフェース
├── application/
│   ├── interfaces/         # email_service, security_service, unit_of_work
│   ├── schemas/            # DTO (InputDTO, OutputDTO)
│   └── use_cases/          # auth, user, product, address, cart, order
├── infrastructure/
│   ├── db/
│   │   ├── models/         # ORMモデル
│   │   ├── repositories/   # リポジトリ実装
│   │   ├── seeds/          # シードデータ
│   │   ├── session.py
│   │   └── unit_of_work.py
│   ├── email/              # ResendEmailService
│   ├── logging/            # ロギング設定
│   └── security/           # SecurityServiceImpl
├── presentation/
│   ├── api/                # APIエンドポイント
│   └── schemas/            # Request/Responseスキーマ
├── di/                     # 機能別DI（auth, user, product, etc.）
├── logs/                   # ログファイル
├── config.py
└── main.py
```

---

## 検出された問題点

### 問題1: オニオンアーキテクチャ違反 - HTTPException の使用

**該当ファイル**: `app/application/use_cases/auth_usecase.py`

**問題の詳細**:
Application層のユースケースで`fastapi.HTTPException`を直接使用している。

```python
# auth_usecase.py:5-6
from fastapi import HTTPException, status

# auth_usecase.py:57-60
raise HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail='このメールアドレスは既に登録されています',
)
```

**アーキテクチャルールの引用**:
> ❌ Application 層で Infrastructure 層（DB モデルなど）を直接 import しない
> Presentation層: 例外処理してHTTPエラーに変換

FastAPIはPresentation層の関心事であり、Application層が直接依存すべきではない。

**影響範囲**:
- `auth_usecase.py` - 複数箇所
- 他のユースケースも同様の可能性あり

---

### 問題2: スキーマの二重管理と冗長な変換

**該当ファイル**:
- `app/application/schemas/auth_schemas.py`
- `app/presentation/schemas/auth_schemas.py`

**問題の詳細**:
Application層のDTOとPresentation層のRequest/Responseがほぼ同一の構造を持ち、API層で冗長な変換が発生している。

```python
# auth_api.py:45-58
def register(request: RegisterRequest, ...):
    # Request → InputDTO 変換
    input_dto = RegisterInputDTO(
        email=request.email,
        password=request.password,
        ...
    )
    output_dto = auth_usecase.register(input_dto)

    # OutputDTO → Response 変換
    return RegisterResponse(
        user_id=output_dto.user_id,
        email=output_dto.email,
        message=output_dto.message,
    )
```

**アーキテクチャルールの引用**:
> Application 層と Presentation 層で共有される場合もあり

現状の二重定義は保守性を下げている。

---

### 問題3: Value Objects の未使用

**問題の詳細**:
アーキテクチャドキュメントでは `domain/value_objects/` の使用が推奨されているが、現状では存在しない。

**アーキテクチャルールの引用**:
> Value Object（値オブジェクト）: 不変性が重要な値、ビジネスルールをカプセル化

**具体例**:
- Email（メールアドレスのバリデーション）
- Password（パスワードポリシー）
- Money（金額計算ルール）

---

### 問題4: DIモジュールの重複

**該当ファイル**: `app/di/auth.py`, `app/di/user.py`, etc.

**問題の詳細**:
各DIモジュールで`get_db()`が重複定義されている可能性。

```python
# di/auth.py:16-26
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
```

**改善案**:
共通の`get_db()`を一箇所で定義し、各DIモジュールで再利用する。

---

### 問題5: ログディレクトリの配置

**問題の詳細**:
`app/logs/` がアプリケーションコード内に配置されている。

**改善案**:
`backend/logs/` に移動し、`.gitignore` に追加する。

---

## リファクタリング提案

### 提案1: ドメイン例外の導入（優先度: 高）

**目的**: Application層からHTTPException依存を除去

**実装内容**:

1. ドメイン例外クラスの作成

```
domain/
└── exceptions/
    ├── __init__.py
    ├── base.py              # DomainException基底クラス
    ├── auth_exceptions.py   # AuthenticationError, EmailAlreadyExistsError
    └── validation_exceptions.py  # ValidationError
```

2. 例外定義例

```python
# domain/exceptions/base.py
class DomainException(Exception):
    """ドメイン例外の基底クラス"""
    def __init__(self, message: str, code: str = "DOMAIN_ERROR"):
        self.message = message
        self.code = code
        super().__init__(message)

# domain/exceptions/auth_exceptions.py
class EmailAlreadyExistsError(DomainException):
    def __init__(self):
        super().__init__(
            message="このメールアドレスは既に登録されています",
            code="EMAIL_ALREADY_EXISTS"
        )

class InvalidCredentialsError(DomainException):
    def __init__(self):
        super().__init__(
            message="メールアドレスまたはパスワードが正しくありません",
            code="INVALID_CREDENTIALS"
        )
```

3. ユースケースでドメイン例外を使用

```python
# application/use_cases/auth_usecase.py
from app.domain.exceptions.auth_exceptions import EmailAlreadyExistsError

def register(self, input_dto: RegisterInputDTO) -> RegisterOutputDTO:
    existing_user = self.user_repository.get_by_email(input_dto.email)
    if existing_user:
        raise EmailAlreadyExistsError()  # HTTPExceptionではない
```

4. Presentation層で例外ハンドラーを設定

```python
# presentation/exception_handlers.py
from fastapi import Request
from fastapi.responses import JSONResponse
from app.domain.exceptions.base import DomainException
from app.domain.exceptions.auth_exceptions import (
    EmailAlreadyExistsError,
    InvalidCredentialsError,
)

EXCEPTION_STATUS_MAP = {
    EmailAlreadyExistsError: 400,
    InvalidCredentialsError: 401,
    # 他の例外マッピング
}

async def domain_exception_handler(request: Request, exc: DomainException):
    status_code = EXCEPTION_STATUS_MAP.get(type(exc), 400)
    return JSONResponse(
        status_code=status_code,
        content={"detail": exc.message, "code": exc.code}
    )
```

5. main.pyで例外ハンドラーを登録

```python
# main.py
from app.domain.exceptions.base import DomainException
from app.presentation.exception_handlers import domain_exception_handler

app.add_exception_handler(DomainException, domain_exception_handler)
```

---

### 提案2: スキーマの整理（優先度: 中）

**目的**: 二重管理の解消と変換コードの削減

**選択肢A: Application層のDTOをPresentation層で直接使用**

```python
# presentation/api/auth_api.py
from app.application.schemas.auth_schemas import RegisterInputDTO, RegisterOutputDTO

@router.post('/register', response_model=RegisterOutputDTO)
def register(
    request: RegisterInputDTO,  # DTOを直接使用
    auth_usecase: AuthUsecase = Depends(get_auth_usecase),
) -> RegisterOutputDTO:
    return auth_usecase.register(request)
```

**選択肢B: Presentation層のスキーマに変換メソッドを追加**

```python
# presentation/schemas/auth_schemas.py
class RegisterRequest(BaseModel):
    ...

    def to_dto(self) -> RegisterInputDTO:
        return RegisterInputDTO(**self.model_dump())

class RegisterResponse(BaseModel):
    ...

    @classmethod
    def from_dto(cls, dto: RegisterOutputDTO) -> "RegisterResponse":
        return cls(**dto.model_dump())
```

**推奨**: 選択肢A（シンプルで保守性が高い）

ただし、Presentation層固有のフィールド（例: OpenAPI用のdescription）が必要な場合は選択肢Bを検討。

---

### 提案3: Value Objectsの導入（優先度: 低）

**目的**: ビジネスルールのカプセル化

**実装内容**:

```
domain/
└── value_objects/
    ├── __init__.py
    ├── email.py
    ├── password.py
    └── phone.py
```

```python
# domain/value_objects/email.py
import re
from pydantic import BaseModel, field_validator

class Email(BaseModel):
    value: str

    model_config = {"frozen": True}

    @field_validator('value')
    @classmethod
    def validate_email(cls, v: str) -> str:
        pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if not re.match(pattern, v):
            raise ValueError('無効なメールアドレス形式です')
        return v.lower()
```

---

### 提案4: DIモジュールの整理（優先度: 中）

**目的**: 重複コードの削減と一元管理

**実装内容**:

```
di/
├── __init__.py          # get_db() を定義
├── dependencies.py      # 共通依存関係
├── auth.py
├── user.py
└── ...
```

```python
# di/__init__.py
from collections.abc import Generator
from sqlalchemy.orm import Session
from app.infrastructure.db.session import SessionLocal

def get_db() -> Generator[Session, None, None]:
    """DBセッションを取得（共通）"""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

# di/auth.py
from app.di import get_db  # 共通のget_dbをインポート
```

---

### 提案5: ログディレクトリの移動（優先度: 低）

```
backend/
├── app/
├── logs/              # ここに移動
│   └── app.log
└── ...
```

`.gitignore`に追加:
```
backend/logs/
```

---

## 改善後のディレクトリ構造

```
backend/app/
├── domain/
│   ├── entities/
│   ├── repositories/
│   ├── value_objects/     # 新規追加
│   │   ├── email.py
│   │   └── password.py
│   └── exceptions/        # 新規追加
│       ├── base.py
│       └── auth_exceptions.py
├── application/
│   ├── interfaces/
│   ├── schemas/           # DTOのみ（Presentation層と統合検討）
│   └── use_cases/
├── infrastructure/
│   ├── db/
│   ├── email/
│   ├── logging/
│   └── security/
├── presentation/
│   ├── api/
│   ├── schemas/           # 必要に応じて維持
│   └── exception_handlers.py  # 新規追加
├── di/
│   ├── __init__.py        # 共通get_db()
│   └── ...
├── config.py
└── main.py
```

---

## 実装優先順位

| 優先度 | 提案 | 理由 | 状態 |
|--------|------|------|------|
| 高 | ドメイン例外の導入 | オニオンアーキテクチャ違反の解消 | **完了** (2026-01-04) |
| 中 | DIモジュールの整理 | コードの重複削減 | **完了** (2026-01-04) |
| 中 | スキーマの整理 | 保守性の向上 | 未着手 |
| 低 | Value Objectsの導入 | 今後の拡張性向上 | 未着手 |
| 低 | ログディレクトリの移動 | 軽微な構造改善 | 未着手 |

---

## 作業見積もり

### 提案1: ドメイン例外の導入
- domain/exceptions/ の作成
- 各ユースケースのHTTPException置換
- exception_handlers.pyの作成
- main.pyへの登録
- テストの更新

### 提案2: スキーマの整理
- 現状のスキーマ使用箇所の調査
- 統合方針の決定
- コード修正
- テストの更新

### 提案3-5: 軽微な改善
- 順次対応可能

---

## 参考資料

- `docs/rules/architecture/BACKEND.md` - オニオンアーキテクチャの原則
- `docs/rules/development/BACKEND.md` - 開発ガイド
- `backend/scripts/check_onion_architecture.py` - アーキテクチャ検証スクリプト
