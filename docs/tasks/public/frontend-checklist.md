# Frontend タスクチェックリスト

ページ × デザイン/API接続 で管理

---

## 凡例

- [ ] 未着手
- [x] 完了

**Design**: UIコンポーネント実装
**API**: バックエンド接続

---

# Public（認証不要）

| Path | ページ名 | Design | API |
|------|---------|--------|-----|
| `/` | トップ | [x] | [x] |
| `/about` | About | [x] | - |
| `/contact` | お問い合わせ | [x] | [ ] |
| `/shop` | 店舗向け | [x] | [x] |
| `/office` | オフィス向け | [x] | [x] |
| `/you` | 個人向け | [x] | [x] |
| `/[category]/[id]` | 商品詳細 | [x] | [x] |
| `/guide` | ご利用ガイド | [x] | - |
| `/faq` | FAQ | [x] | - |
| `/privacy` | プライバシーポリシー | [x] | - |
| `/terms` | 利用規約 | [x] | - |
| `/law` | 特商法表記 | [x] | - |
| `/login` | ログイン | [x] | [x] |
| `/register` | 会員登録 | [x] | [x] |
| `/register/complete` | 登録完了 | [x] | - |
| `/verify-email` | メール認証 | [x] | [x] |
| `/password-reset` | パスワードリセット依頼 | [x] | [x] |
| `/password-reset/confirm` | パスワード再設定 | [x] | [x] |

---

# Authenticated（認証必要）

| Path | ページ名 | Design | API |
|------|---------|--------|-----|
| `/mypage` | マイページ | [x] | [ ] |
| `/mypage/orders` | 注文履歴 | [ ] | [ ] |
| `/mypage/orders/[id]` | 注文詳細 | [ ] | [ ] |
| `/mypage/orders/[id]/upload` | データ入稿 | [ ] | [ ] |
| `/mypage/profile` | プロフィール | [ ] | [ ] |
| `/mypage/addresses` | 配送先管理 | [ ] | [ ] |
| `/cart` | カート | [ ] | [ ] |
| `/checkout` | 購入手続き | [ ] | [ ] |
| `/checkout/upload` | データ入稿 | [ ] | [ ] |
| `/checkout/confirm` | 注文確認 | [ ] | [ ] |
| `/checkout/complete` | 注文完了 | [ ] | [ ] |
| `/estimate` | 見積もり一覧 | [ ] | [ ] |
| `/estimate/[id]` | 見積もり詳細 | [ ] | [ ] |
| `/estimate/request` | 見積もり依頼 | [ ] | [ ] |

---

# Admin（管理画面）

| Path | ページ名 | Design | API |
|------|---------|--------|-----|
| `/admin/login` | 管理者ログイン | [x] | [ ] |
| `/admin` | ダッシュボード | [x] | [ ] |
| `/admin/orders` | 注文一覧 | [x] | [ ] |
| `/admin/orders/[id]` | 注文詳細・編集 | [x] | [ ] |
| `/admin/products` | 商品一覧 | [x] | [x] |
| `/admin/products/new` | 商品追加 | [x] | [ ] |
| `/admin/products/[id]` | 商品編集 | [x] | [x] |
| `/admin/estimates` | 見積もり一覧 | [x] | [ ] |
| `/admin/estimates/[id]` | 見積もり詳細・回答 | [x] | [ ] |
| `/admin/uploads` | 入稿データ一覧 | [x] | [ ] |
| `/admin/uploads/[id]` | 入稿確認・承認 | [x] | [ ] |
| `/admin/users` | 顧客一覧 | [x] | [ ] |
| `/admin/users/[id]` | 顧客詳細 | [x] | [ ] |
| `/admin/admins` | 管理者一覧 | [x] | [ ] |
| `/admin/logs` | 操作ログ | [x] | [ ] |
| `/admin/settings` | サイト設定 | [x] | [ ] |

---

# 共通コンポーネント

| コンポーネント | 状況 |
|---------------|------|
| Header | [x] |
| Footer | [x] |
| 認証プロバイダー | [x] |
| カート状態管理 | [ ] |
| API クライアント設定 | [x] |
| エラーハンドリング | [ ] |
| ローディング状態 | [ ] |
| ローディングをスケルトンに置き換え | [ ] |
| トースト通知 | [ ] |
| モーダル共通 | [ ] |
| ページネーション | [ ] |
| フォームバリデーション | [x] |

---

# 機能別タスク

## 認証機能

| タスク | 状況 |
|--------|------|
| ログインフォーム | [x] |
| 会員登録フォーム | [x] |
| メール認証 | [x] |
| パスワードリセット | [x] |
| ログアウト処理 | [x] |
| 認証状態管理 | [x] |
| 保護ルート | [ ] |
| トークンリフレッシュ | [ ] |

## カート機能

| タスク | 状況 |
|--------|------|
| entities/cart | [x] |
| features/cart/get-cart | [x] |
| features/cart/add-to-cart | [x] |
| features/cart/update-cart-item | [x] |
| features/cart/delete-cart-item | [x] |
| features/cart/clear-cart | [x] |
| カート一覧UI | [ ] |
| カート追加ボタン | [ ] |
| 数量変更UI | [ ] |
| 小計計算表示 | [ ] |
| ローカルストレージ同期 | [ ] |

## 決済機能

| タスク | 状況 |
|--------|------|
| Stripe Elements導入 | [ ] |
| カード入力フォーム | [ ] |
| 決済処理 | [ ] |
| エラーハンドリング | [ ] |

## ファイルアップロード

| タスク | 状況 |
|--------|------|
| ドラッグ&ドロップ | [ ] |
| プレビュー表示 | [ ] |
| ファイル形式バリデーション | [ ] |
| アップロード進捗 | [ ] |

## ユーザー機能

| タスク | 状況 |
|--------|------|
| entities/user | [x] |
| features/user/get-me | [x] |
| features/user/update-me | [x] |
| features/user/change-password | [x] |
| プロフィール編集UI | [ ] |
| パスワード変更UI | [ ] |

## 配送先機能

| タスク | 状況 |
|--------|------|
| entities/address | [x] |
| features/address/get-addresses | [x] |
| features/address/create-address | [x] |
| features/address/update-address | [x] |
| features/address/delete-address | [x] |
| features/address/set-default-address | [x] |
| 配送先一覧UI | [ ] |
| 配送先追加・編集フォーム | [ ] |

## 注文機能

| タスク | 状況 |
|--------|------|
| entities/order | [x] |
| features/order/get-orders | [x] |
| features/order/get-order | [x] |
| features/order/create-order | [x] |
| features/order/cancel-order | [x] |
| 注文一覧UI | [ ] |
| 注文詳細UI | [ ] |
| チェックアウトUI | [ ] |
