# 16: CloudFront - CDNの仕組み

## CDN（Content Delivery Network）とは？

**世界中にコンテンツをキャッシュして高速配信するネットワーク**

```
従来: ユーザー → 東京サーバー → コンテンツ取得（遠いと遅い）

CDN: ユーザー → 最寄りのエッジ → キャッシュから即座に返す
              （大阪、福岡、NY、ロンドン...）
```

---

## CloudFrontとは？

**AWSが提供するCDNサービス**

### 主な用途
1. **静的ファイル配信** - 画像、CSS、JS
2. **動画ストリーミング** - Netflix的な配信
3. **API高速化** - バックエンドの前段に置く

---

## ACRIQUEでの使い方（将来）

```
現在:
  ユーザー → Amplify → Next.js

将来（本番環境）:
  ユーザー → CloudFront → Amplify → Next.js
           ↓
         S3（商品画像）
```

**メリット**:
- 商品画像が爆速で表示される
- サーバー負荷が下がる
- DDoS対策になる

---

## 料金の仕組み

| 項目 | 課金 |
|------|------|
| データ転送 | GB単位 |
| リクエスト数 | 10,000リクエスト単位 |
| SSL証明書 | 無料（ACM連携） |

**ポイント**: 小規模なら月数ドル程度

---

## CloudFront vs 他のCDN

| CDN | 特徴 |
|-----|------|
| CloudFront | AWS連携が楽、S3との相性◎ |
| Cloudflare | 無料枠が太い、DNS機能も |
| Vercel Edge | Next.js特化、Vercel使うなら自動 |
| Fastly | 高機能、大企業向け |

---

## Amplifyとの関係

**実はAmplifyは内部でCloudFrontを使っている！**

```
Amplify Hosting = S3 + CloudFront + CI/CD
```

だから今回のACRIQUEも、裏ではCloudFrontが動いてる。

---

## 次のステップ
- [17: Route53 - DNSの仕組み](./17-Route53-DNSの仕組み.md)
