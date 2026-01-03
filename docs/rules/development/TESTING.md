# テストガイド

## 目次

1. [概要](#概要)
2. [フロントエンド テスト](#フロントエンド-テスト)
3. [バックエンド テスト](#バックエンド-テスト)
4. [インフラ テスト](#インフラ-テスト)
5. [CI/CD でのテスト](#cicd-でのテスト)

---

## 概要

このプロジェクトでは、フロントエンド、バックエンド、インフラで独立したテスト環境を持っています。

| 対象           | フレームワーク      | 言語       |
| -------------- | ------------------- | ---------- |
| フロントエンド | Jest                | TypeScript |
| バックエンド   | pytest              | Python     |
| インフラ       | Jest + CDK assertions | TypeScript |

---

## フロントエンド テスト

### テスト環境

| ツール                        | 用途                 |
| ----------------------------- | -------------------- |
| **Jest**                      | テストフレームワーク |
| **React Testing Library**     | コンポーネントテスト |
| **@testing-library/jest-dom** | DOM アサーション拡張 |

### テストの実行

```bash
cd frontend

# 全テスト実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジ付き実行
npm test -- --coverage

# 特定のファイルのみ実行
npm test -- date.test.ts

# CI向け実行（GitHub Actions）
npm test -- --ci
```

### テストファイルの配置

```
frontend/src/
├── shared/
│   └── utils/
│       └── format/
│           ├── date.ts
│           └── __test__/
│               └── date.test.ts    # ユニットテスト
├── entities/
│   └── [domain]/
│       └── api/
│           └── __tests__/
│               └── [domain]-api.test.ts
└── features/
    └── [feature]/
        └── __tests__/
            └── [feature].test.tsx
```

### ユニットテストの書き方

ユーティリティ関数のテスト例:

```typescript
// shared/utils/format/__test__/date.test.ts
import { formatDate } from "../date";

describe("formatDate", () => {
  it("日付文字列を yy/MM/dd にフォーマット", () => {
    expect(formatDate("2024-03-15")).toBe("24/03/15");
  });

  it('nullの場合は"-"を返す', () => {
    expect(formatDate(null)).toBe("-");
  });

  it('不正な日付の場合は"-"を返す', () => {
    expect(formatDate("invalid-date")).toBe("-");
  });
});
```

### テストの構造（AAA パターン）

```typescript
describe("機能グループ名", () => {
  it("期待される動作を説明", () => {
    // Arrange（準備）
    const input = "2024-03-15";

    // Act（実行）
    const result = formatDate(input);

    // Assert（検証）
    expect(result).toBe("24/03/15");
  });
});
```

### テストすべきケース

- ✅ 正常系（期待される入力）
- ✅ 異常系（null, undefined, 空文字列）
- ✅ エッジケース（境界値）

### Jest 設定

```javascript
// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/shared/(.*)$": "<rootDir>/src/shared/$1",
    // ... 他のパスエイリアス
  },
};

module.exports = createJestConfig(customJestConfig);
```

---

## バックエンド テスト

### テスト環境

| ツール                 | 用途                          |
| ---------------------- | ----------------------------- |
| **pytest**             | テストフレームワーク          |
| **pytest-cov**         | カバレッジ計測                |
| **FastAPI TestClient** | API エンドポイントテスト      |
| **SQLAlchemy**         | DB テスト（SQLite in-memory） |

### テストの実行

```bash
cd backend

# 全テスト実行
pytest

# 詳細出力
pytest -v

# カバレッジ付き実行
pytest --cov=app --cov-report=html

# 特定のファイル/ディレクトリのみ
pytest tests/presentation/
pytest tests/domain/test_user_entity.py

# 特定のテストクラス/メソッド
pytest tests/presentation/test_auth_api.py::TestAuthAPI::test_login_success
```

### テストファイルの配置（Clean Architecture）

```
backend/tests/
├── conftest.py                    # 共通フィクスチャ
├── domain/                        # ドメイン層テスト
│   ├── test_user_entity.py        # エンティティテスト
│   └── test_user_repository_interface.py
├── application/                   # アプリケーション層テスト
│   └── test_auth_usecase.py       # ユースケーステスト
├── infrastructure/                # インフラ層テスト
│   ├── test_user_repository_impl.py  # リポジトリ実装テスト
│   └── test_security_service_impl.py # サービス実装テスト
└── presentation/                  # プレゼンテーション層テスト
    └── test_auth_api.py           # APIエンドポイントテスト
```

### 共通フィクスチャ（conftest.py）

```python
# tests/conftest.py
import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from unittest.mock import MagicMock

@pytest.fixture(scope='session')
def test_db_engine():
    """テスト用DBエンジン（SQLite in-memory または PostgreSQL）"""
    database_url = os.getenv('DATABASE_URL', 'sqlite:///:memory:')
    engine = create_engine(database_url, echo=False)
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope='function')
def db_session(test_db_engine) -> Generator[Session, None, None]:
    """テスト用DBセッション（各テストで独立）"""
    TestingSessionLocal = sessionmaker(
        autocommit=False, autoflush=False, bind=test_db_engine
    )
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        session.close()

@pytest.fixture
def mock_security_service() -> MagicMock:
    """モックSecurityService"""
    return MagicMock(spec=ISecurityService)

@pytest.fixture(scope='module')
def test_client() -> Generator[TestClient, None, None]:
    """FastAPI TestClient"""
    os.environ['ENABLE_AUTH'] = 'false'
    from app.main import app
    with TestClient(app) as client:
        yield client
```

### レイヤー別テストパターン

#### 1. ドメイン層（エンティティ）

```python
# tests/domain/test_user_entity.py
import pytest
from pydantic import ValidationError
from app.domain.entities.user import User

class TestUserEntity:
    def test_create_user_with_all_fields(self):
        """全フィールドを指定してUserを作成"""
        user = User(
            id=1,
            login_id='test_user',
            password='hashed_password',
            email='test@example.com',
            name='Test User',
        )
        assert user.id == 1
        assert user.login_id == 'test_user'

    def test_create_user_without_id_raises_error(self):
        """IDなしでUserを作成するとエラー"""
        with pytest.raises(ValidationError):
            User(login_id='test_user', password='hashed_password')
```

#### 2. アプリケーション層（ユースケース）

```python
# tests/application/test_auth_usecase.py
import pytest
from fastapi import HTTPException
from app.application.use_cases.auth_usecase import AuthUsecase
from app.application.schemas.auth_schemas import LoginInputDTO

class TestAuthUsecase:
    def test_login_success(self, mock_security_service):
        """ログイン成功のテスト"""
        mock_security_service.create_access_token.return_value = 'test_token'
        usecase = AuthUsecase(security_service=mock_security_service)
        input_dto = LoginInputDTO(login_id='admin', password='pass')

        result = usecase.login(input_dto)

        assert result.access_token == 'test_token'
        mock_security_service.create_access_token.assert_called_once()

    def test_login_failure_wrong_credentials(self, mock_security_service):
        """ログイン失敗のテスト"""
        usecase = AuthUsecase(security_service=mock_security_service)
        input_dto = LoginInputDTO(login_id='wrong', password='wrong')

        with pytest.raises(HTTPException) as exc_info:
            usecase.login(input_dto)

        assert exc_info.value.status_code == 401
```

#### 3. インフラ層（リポジトリ実装）

```python
# tests/infrastructure/test_user_repository_impl.py
from app.infrastructure.db.repositories.user_repository_impl import UserRepositoryImpl

class TestUserRepositoryImpl:
    def test_get_by_login_id_existing_user(self, db_session):
        """既存ユーザーをログインIDで取得"""
        # テストデータ作成
        from app.infrastructure.db.models.user_model import UserModel
        user_model = UserModel(login_id='test_user', password='hashed', ...)
        db_session.add(user_model)
        db_session.commit()

        repository = UserRepositoryImpl(session=db_session)
        user = repository.get_by_login_id('test_user')

        assert user is not None
        assert user.login_id == 'test_user'

    def test_get_by_login_id_non_existing_user(self, db_session):
        """存在しないユーザー"""
        repository = UserRepositoryImpl(session=db_session)
        user = repository.get_by_login_id('non_existing')
        assert user is None
```

#### 4. プレゼンテーション層（API エンドポイント）

```python
# tests/presentation/test_auth_api.py
from fastapi import status
from fastapi.testclient import TestClient

class TestAuthAPI:
    def test_login_success(self, test_client: TestClient):
        """ログイン成功のテスト"""
        response = test_client.post(
            '/auth/login',
            json={'login_id': 'admin', 'password': 'pass'}
        )

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert 'access_token' in data
        assert 'access_token' in response.cookies

    def test_login_failure_wrong_credentials(self, test_client: TestClient):
        """ログイン失敗のテスト"""
        response = test_client.post(
            '/auth/login',
            json={'login_id': 'wrong', 'password': 'wrong'}
        )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_missing_field(self, test_client: TestClient):
        """バリデーションエラーのテスト"""
        response = test_client.post(
            '/auth/login',
            json={'password': 'pass'}  # login_id 欠落
        )

        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
```

### テストのベストプラクティス

1. **各テストは独立**: `db_session` は各テストでロールバック
2. **モックの活用**: 依存関係は `MagicMock` で分離
3. **フィクスチャのスコープ**: `session` > `module` > `function`
4. **認証の無効化**: テスト時は `ENABLE_AUTH=false`

---

## インフラ テスト

### テスト環境

| ツール                 | 用途                              |
| ---------------------- | --------------------------------- |
| **Jest**               | テストフレームワーク              |
| **CDK assertions**     | CloudFormation テンプレート検証   |
| **aws-cdk-lib**        | CDK コンストラクト                |

### テストの実行

```bash
cd infra

# 全テスト実行
npx jest

# ウォッチモード
npx jest --watch

# 特定のファイルのみ
npx jest foundation-stack.test.ts

# スナップショット更新
npx jest --updateSnapshot
```

### テストファイルの配置（4層アーキテクチャ）

```
infra/test/
├── test-config.ts                     # テスト用設定
├── construct/                         # レイヤー1: Constructテスト
│   ├── compute/
│   │   ├── bastion-construct.test.ts
│   │   ├── ecr-construct.test.ts
│   │   └── scheduled-task-construct.test.ts
│   ├── networking/
│   │   ├── isolation-nacl-construct.test.ts
│   │   └── isolation-security-group-construct.test.ts
│   └── security/
│       ├── cognito-construct.test.ts
│       └── waf-construct.test.ts
├── resource/                          # レイヤー2: Resourceテスト
│   ├── network-resource.test.ts
│   ├── data-storage-resource.test.ts
│   ├── database-resource.test.ts
│   ├── object-storage-resource.test.ts
│   ├── api-resource.test.ts
│   ├── frontend-resource.test.ts
│   ├── messaging-resource.test.ts
│   └── security-resource.test.ts
└── stack/                             # レイヤー3: Stackテスト
    ├── foundation-stack.test.ts
    ├── data-storage-stack.test.ts
    ├── backend-stack.test.ts
    ├── frontend-stack.test.ts
    ├── security-stack.test.ts
    ├── integration-stack.test.ts
    ├── batch-stack.test.ts
    ├── observability-stack.test.ts
    └── poc-stack.test.ts
```

### テスト用設定（test-config.ts）

```typescript
// test/test-config.ts
import { RemovalPolicy } from 'aws-cdk-lib';
import { EnvironmentConfig } from '../config/environment';

export const testConfig: EnvironmentConfig = {
  envName: 'test',
  account: '123456789012',
  region: 'ap-northeast-1',
  removalPolicy: RemovalPolicy.DESTROY,

  network: {
    cidr: '10.0.0.0/16',
    maxAzs: 2,
    natGateways: 1,
  },

  database: {
    enableRds: true,
    engine: 'postgres',
    // ...
  },

  tags: {
    Environment: 'test',
    Project: 'cdk-template',
  },
};
```

### Stackテストの書き方

```typescript
// test/stack/foundation-stack.test.ts
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { FoundationStack } from '../../lib/stack/foundation/foundation-stack';
import { testConfig } from '../test-config';

describe('FoundationStack', () => {
  let app: cdk.App;
  let stack: FoundationStack;
  let template: Template;

  beforeEach(() => {
    app = new cdk.App();
    stack = new FoundationStack(app, 'TestFoundationStack', testConfig, {
      env: { account: '123456789012', region: 'ap-northeast-1' },
    });
    template = Template.fromStack(stack);
  });

  describe('VPC', () => {
    it('should create a VPC', () => {
      template.resourceCountIs('AWS::EC2::VPC', 1);
    });

    it('should have correct CIDR block', () => {
      template.hasResourceProperties('AWS::EC2::VPC', {
        CidrBlock: '10.0.0.0/16',
      });
    });

    it('should enable DNS support', () => {
      template.hasResourceProperties('AWS::EC2::VPC', {
        EnableDnsHostnames: true,
        EnableDnsSupport: true,
      });
    });
  });

  describe('Subnets', () => {
    it('should create subnets across AZs', () => {
      template.resourceCountIs('AWS::EC2::Subnet', testConfig.network.maxAzs * 2);
    });

    it('should create NAT Gateways', () => {
      template.resourceCountIs('AWS::EC2::NatGateway', testConfig.network.natGateways);
    });
  });

  describe('Outputs', () => {
    it('should export VPC ID', () => {
      const outputs = template.findOutputs('*');
      expect(Object.keys(outputs)).toContain('VpcId');
    });
  });
});
```

### CDK assertions API

| メソッド | 用途 |
|----------|------|
| `template.resourceCountIs()` | リソース数の検証 |
| `template.hasResourceProperties()` | リソースプロパティの検証 |
| `template.hasResource()` | リソース存在の検証 |
| `template.findOutputs()` | Outputsの検索 |
| `template.hasOutput()` | Output存在の検証 |

### テストのベストプラクティス

1. **テスト用設定を分離**: `test-config.ts` で固定値を使用
2. **レイヤー別テスト**: Construct → Resource → Stack の順で検証
3. **リソース数の検証**: `resourceCountIs()` で期待するリソース数を確認
4. **プロパティ検証**: セキュリティ設定など重要なプロパティを検証
5. **スナップショットテスト**: 意図しない変更を検出

---

## CI/CD でのテスト

### フロントエンド CI

```yaml
# .github/workflows/frontend-ci.yml
- run: npm ci
- run: npm run build
- run: npm test -- --ci
```

### バックエンド CI

```yaml
# .github/workflows/backend-ci.yml
- run: pip install -r requirements.txt
- run: pytest --cov=app --cov-report=xml
```

### インフラ CI

```yaml
# .github/workflows/infra-ci.yml
- run: npm ci
- run: npx jest
```

---

## カバレッジ目標

| 対象                        | 目標    |
| --------------------------- | ------- |
| フロントエンド Shared       | 80%以上 |
| バックエンド Domain         | 90%以上 |
| バックエンド Application    | 80%以上 |
| バックエンド Infrastructure | 70%以上 |
| バックエンド Presentation   | 80%以上 |
| インフラ Stack              | 80%以上 |
| インフラ Resource           | 70%以上 |

---

## 参考資料

### フロントエンド

- [Jest 公式](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### バックエンド

- [pytest 公式](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)

### インフラ

- [CDK Testing](https://docs.aws.amazon.com/cdk/v2/guide/testing.html)
- [CDK assertions](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions-readme.html)

---

**最終更新**: 2025-12-23
**バージョン**: 2.1.0
