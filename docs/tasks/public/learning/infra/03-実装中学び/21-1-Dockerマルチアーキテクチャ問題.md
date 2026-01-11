# 21-1: Dockerマルチアーキテクチャ問題

## 今回のエラー

```
CannotPullContainerError: image Manifest does not contain
descriptor matching platform 'linux/amd64'
```

**MacでビルドしたイメージがAWSで動かない！**

---

## 原因: CPUアーキテクチャの違い

| 環境 | CPU | アーキテクチャ |
|------|-----|---------------|
| Mac (M1/M2/M3) | Apple Silicon | `linux/arm64` |
| Mac (Intel) | Intel | `linux/amd64` |
| AWS ECS Fargate | Intel | `linux/amd64` |
| AWS Graviton | ARM | `linux/arm64` |

```
Apple Silicon Mac → arm64イメージ → AWS(amd64)で動かない
```

---

## 解決方法

### 方法1: プラットフォーム指定でビルド

```bash
# AMD64（Intel）用にビルド
docker build --platform linux/amd64 -t my-app .
```

### 方法2: マルチプラットフォームビルド

```bash
# 両方のアーキテクチャ用にビルド
docker buildx build --platform linux/amd64,linux/arm64 -t my-app .
```

### 方法3: AWS Graviton を使う（コスト削減）

```typescript
// CDKでARM64を指定
const taskDefinition = new ecs.FargateTaskDefinition(this, 'Task', {
  runtimePlatform: {
    cpuArchitecture: ecs.CpuArchitecture.ARM64,  // ← これ
    operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
  },
});
```

---

## ACRIQUEでの対処

### Step 1: backendフォルダでDockerイメージをビルド＆プッシュ

```bash
# backendフォルダに移動（重要！）
cd /path/to/acrique-v1/backend

# 1. ECRにログイン
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com

# 2. AMD64用にビルド
docker build --platform linux/amd64 -t dev-acrique-v1-backend .

# 3. タグ付け
docker tag dev-acrique-v1-backend:latest \
  <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/dev-acrique-v1-backend:latest

# 4. プッシュ
docker push <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/dev-acrique-v1-backend:latest
```

### Step 2: ECSサービスを再デプロイ

```bash
# どこからでも実行可能
aws ecs update-service \
  --cluster dev-acrique-v1-cluster \
  --service dev-acrique-v1-backend \
  --force-new-deployment
```

### Step 3: CDKで変更がある場合は再デプロイ

```bash
# infraフォルダに移動（重要！）
cd /path/to/acrique-v1/infra

# CDKデプロイ
cdk deploy dev-BackendStack --context env=dev
```

> **注意**: CDKコマンドは必ず`infra`フォルダで実行すること！
> `cdk.json`や`node_modules`がinfraフォルダにあるため。

---

## なぜこれが起きる？

```
Dockerのデフォルト動作:
  ホストマシンのアーキテクチャでビルド

Apple Silicon Mac:
  → デフォルトで arm64
  → AWSで動かない

Intel Mac:
  → デフォルトで amd64
  → AWSでそのまま動く
```

---

## ベストプラクティス

### CI/CDでビルドする（推奨）

```yaml
# GitHub Actions
- name: Build and push
  run: |
    docker build --platform linux/amd64 -t $IMAGE .
    docker push $IMAGE
```

ローカルでビルドせず、GitHub ActionsやCodeBuildでビルドすれば問題なし。

### Dockerfileに明示

```dockerfile
FROM --platform=linux/amd64 python:3.11-slim
```

---

## 確認コマンド

```bash
# イメージのアーキテクチャを確認
docker inspect my-app | grep Architecture
```

```json
"Architecture": "amd64"  ← これならOK
"Architecture": "arm64"  ← AWSで動かない
```

---

## まとめ

| シナリオ | 対処 |
|---------|------|
| M1/M2 Macでローカルビルド | `--platform linux/amd64` |
| CI/CDでビルド | 自動的にamd64（通常） |
| コスト重視 | AWS Graviton (arm64) を使う |

---

## 次のステップ
- [21-2: ECRの使い方](./21-2-ECRの使い方.md)（作成予定）
