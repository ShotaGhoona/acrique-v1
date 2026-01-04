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
| `/mypage` | マイページ | [x] | [x] |
| `/mypage/orders` | 注文履歴 | [x] | [x] |
| `/mypage/orders/[id]` | 注文詳細 | [x] | [x] |
| `/mypage/orders/[id]/upload` | データ入稿 | [ ] | [ ] |
| `/mypage/profile` | プロフィール | [x] | [x] |
| `/mypage/addresses` | 配送先管理 | [x] | [x] |
| `/cart` | カート | [x] | [x] |
| `/checkout` | 購入手続き | [ ] | [ ] |
| `/checkout/upload` | データ入稿 | [ ] | [ ] |
| `/checkout/confirm` | 注文確認 | [ ] | [ ] |
| `/checkout/complete` | 注文完了 | [ ] | [ ] |

---

# Admin（管理画面）

| Path | ページ名 | Design | API |
|------|---------|--------|-----|
| `/admin/login` | 管理者ログイン | [x] | [x] |
| `/admin` | ダッシュボード | [x] | [x] |
| `/admin/orders` | 注文一覧 | [x] | [x] |
| `/admin/orders/[id]` | 注文詳細・編集 | [x] | [x] |
| `/admin/products` | 商品一覧 | [x] | [x] |
| `/admin/products/new` | 商品追加 | [x] | [x] |
| `/admin/products/[id]` | 商品編集 | [x] | [x] |
| `/admin/uploads` | 入稿データ一覧 | [x] | [ ] |
| `/admin/uploads/[id]` | 入稿確認・承認 | [x] | [ ] |
| `/admin/users` | 顧客一覧 | [x] | [x] |
| `/admin/users/[id]` | 顧客詳細 | [x] | [x] |
| `/admin/admins` | 管理者一覧 | [x] | [x] |
| `/admin/logs` | 操作ログ | [x] | [x] |
| `/admin/settings` | サイト設定 | [x] | [ ] |

---

# 共通コンポーネント

| コンポーネント | 状況 |
|---------------|------|
| Header | [x] |
| Footer | [x] |
| 認証プロバイダー | [x] |
| カート状態管理 | [x] |
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
| カート一覧UI | [x] |
| カート追加ボタン | [x] |
| 数量変更UI | [x] |
| 小計計算表示 | [x] |

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
| プロフィール編集UI | [x] |
| パスワード変更UI | [x] |

## 配送先機能

| タスク | 状況 |
|--------|------|
| entities/address | [x] |
| features/address/get-addresses | [x] |
| features/address/create-address | [x] |
| features/address/update-address | [x] |
| features/address/delete-address | [x] |
| features/address/set-default-address | [x] |
| 配送先一覧UI | [x] |
| 配送先追加・編集フォーム | [x] |

## 注文機能

| タスク | 状況 |
|--------|------|
| entities/order | [x] |
| features/order/get-orders | [x] |
| features/order/get-order | [x] |
| features/order/create-order | [x] |
| features/order/cancel-order | [x] |
| 注文一覧UI | [x] |
| 注文詳細UI | [x] |
| チェックアウトUI | [ ] |

---

# リファクタリング

| タスク | 状況 | 備考 |
|--------|------|------|
| レイアウト関係をlayout.tsxに集約 | [ ] | 各page.tsx内のレイアウト定義をApp Router の layout.tsx に移動し、page.tsx はコンテンツのみに専念させる |
| page-componentsとwidgetsの構造整理 | [ ] | FSD設計に準拠した適切な責務分離・ディレクトリ構造の見直し |
| adminのfeatureにtypeを入れてformを整理 | [ ] | |
