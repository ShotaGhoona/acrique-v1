# 17: Route 53 - DNSの仕組み

## DNSとは？

**ドメイン名をIPアドレスに変換する電話帳**

```
acrique.com  →  DNS  →  54.238.xx.xx
 (名前)              (実際の住所)
```

ブラウザは「acrique.com」を知らない。IPアドレスが必要。

---

## Route 53とは？

**AWSのDNSサービス**

名前の由来: DNSのポート番号が「53」

### 主な機能
1. **ドメイン登録** - acrique.comを買える
2. **DNSホスティング** - 名前解決
3. **ヘルスチェック** - サーバー死活監視
4. **ルーティング** - 地域別に振り分け

---

## ACRIQUEでの活用（将来）

### 今（開発環境）
```
https://xxx.amplifyapp.com  ← AWSが発行したURL
```

### 本番環境
```
https://acrique.com  ← 独自ドメイン
      ↓
   Route 53
      ↓
   CloudFront / ALB
```

---

## ドメイン取得の流れ

```
1. Route 53でドメイン検索
   → acrique.com が空いてるか確認

2. 購入（年間$12〜$50程度）
   → .com, .jp, .io など

3. ホストゾーン作成
   → DNSレコードを管理する場所

4. レコード設定
   → A, CNAME, MX など
```

---

## 重要なDNSレコード

| レコード | 用途 | 例 |
|---------|------|-----|
| A | ドメイン→IPv4 | acrique.com → 54.238.xx.xx |
| AAAA | ドメイン→IPv6 | acrique.com → 2001:db8::1 |
| CNAME | 別名 | www.acrique.com → acrique.com |
| MX | メール | @ → mail.acrique.com |
| TXT | 認証用 | ドメイン所有確認など |

---

## 料金

| 項目 | 料金 |
|------|------|
| ホストゾーン | $0.50/月 |
| クエリ | 100万クエリで$0.40 |
| ドメイン | $12〜50/年（TLDによる） |

**ポイント**: 非常に安い

---

## 他のDNSサービス

| サービス | 特徴 |
|---------|------|
| Route 53 | AWS連携◎、SLA 100% |
| Cloudflare DNS | 無料、高速 |
| Google Cloud DNS | GCP連携 |
| お名前.com | 日本語、初心者向け |

---

## 次のステップ
- [18: Lambda - サーバーレスの世界](./18-Lambda-サーバーレスの世界.md)
