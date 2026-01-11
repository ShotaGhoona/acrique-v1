# 19: API Gateway - APIの入り口

## API Gatewayとは？

**APIの入り口を管理するサービス**

```
クライアント → API Gateway → Lambda / ECS / etc.
                   ↓
            ・認証チェック
            ・レート制限
            ・リクエスト変換
            ・ログ記録
```

---

## ACRIQUEでの構成比較

### 今の構成（ALB）
```
ユーザー → ALB → ECS（NestJS）
            ↓
         ロードバランシング
         ヘルスチェック
```

### API Gateway構成（別パターン）
```
ユーザー → API Gateway → Lambda
              ↓
           認証・制限
           キャッシュ
```

---

## ALB vs API Gateway

| 比較 | ALB | API Gateway |
|------|-----|-------------|
| 用途 | コンテナへの振り分け | API管理 |
| 認証 | 別途実装が必要 | Cognito連携が簡単 |
| 料金 | 時間課金 | リクエスト課金 |
| WebSocket | △ | ◎ |
| 向いてる | ECS/EC2 | Lambda |

---

## API Gatewayの種類

### 1. REST API
- フル機能版
- リクエスト/レスポンス変換
- 料金: やや高め

### 2. HTTP API
- シンプル版（2019年〜）
- 最低限の機能
- 料金: REST APIの約70%オフ

### 3. WebSocket API
- 双方向通信用
- チャット、リアルタイム更新

---

## 主な機能

| 機能 | 説明 |
|------|------|
| 認証 | API Key、IAM、Cognito、Lambda Authorizer |
| スロットリング | リクエスト数制限（DDoS対策） |
| キャッシュ | レスポンスを保存して高速化 |
| CORS | クロスオリジン設定 |
| ステージ | dev / staging / prod |

---

## ACRIQUEで使うなら？

```typescript
// CDKでの定義例
const api = new apigateway.RestApi(this, 'AcriqueApi', {
  restApiName: 'acrique-api',
});

// Cognito認証を追加
const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
  this, 'Authorizer', { cognitoUserPools: [userPool] }
);

// /products エンドポイント
api.root.addResource('products').addMethod('GET',
  new apigateway.LambdaIntegration(productLambda),
  { authorizer }
);
```

---

## いつ使うべき？

| シナリオ | 選択 |
|---------|------|
| ECS + 常時起動API | ALB |
| Lambda + イベント駆動 | API Gateway |
| 認証を簡単に実装したい | API Gateway |
| WebSocket必要 | API Gateway |
| コスト最小化（小規模） | API Gateway |
| コスト最小化（大規模） | ALB |

---

## 次のステップ
- [21: AWSサービス全体マップ](./21-AWSサービス全体マップ.md)
