# 15: CloudFormation - CDKの裏側

## CloudFormationとは？

**AWSリソースをテンプレート（設計図）から自動作成するサービス**

```
あなたが書くもの        AWS内部で起きること
     CDK         →    CloudFormation    →    実際のリソース
  (TypeScript)        (YAML/JSON)           (VPC, RDS, etc.)
```

---

## CDKとの関係

```
CDK = CloudFormationを書きやすくしたもの
```

| 比較 | CloudFormation | CDK |
|------|---------------|-----|
| 記法 | YAML/JSON | TypeScript等 |
| 行数 | 数百〜数千行 | 数十〜数百行 |
| 補完 | なし | あり |
| 再利用 | 難しい | 簡単 |

---

## 実際に見てみよう

CDKデプロイ時に生成されるCloudFormationテンプレート：

```bash
# infraフォルダで実行
cdk synth dev-FoundationStack
```

→ 数百行のYAMLが出力される（これを手書きするのは地獄）

---

## CloudFormationの重要概念

### 1. スタック
- リソースのまとまり
- ACRIQUEでは8つのスタック

### 2. 変更セット（Change Set）
- 「この変更を適用したらどうなるか」のプレビュー
- `cdk diff` で確認できる

### 3. ドリフト検出
- 手動変更を検出する機能
- CDK管理外の変更は危険！

---

## ACRIQUEでの活用

AWSコンソール → CloudFormation で確認できる：
- 各スタックの状態
- 作成されたリソース一覧
- エラー時の詳細ログ

---

## 覚えておくこと

> **CDKを使っていれば、CloudFormationを直接書く必要はない**
> でも「裏で何が起きてるか」を知っておくとデバッグに役立つ

---

## 次のステップ
- [16: CloudFront - CDNの仕組み](./16-CloudFront-CDNの仕組み.md)
