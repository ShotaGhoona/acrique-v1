# Frontend タスクチェックリスト

ページ × デザイン/API接続 で管理

---

## 凡例

- ⬜ 未着手
- ✅ 完了

**Design**: UIコンポーネント実装
**API**: バックエンド接続

---

# Public（認証不要）

| Design | API | Path | ページ名 |
|--------|-----|------|---------|
| ✅ | ✅ | `/` | トップ |
| ✅ | - | `/about` | About |
| ✅ | ⬜ | `/contact` | お問い合わせ |
| ✅ | ✅ | `/shop` | 店舗向け |
| ✅ | ✅ | `/office` | オフィス向け |
| ✅ | ✅ | `/you` | 個人向け |
| ✅ | ✅ | `/[category]/[id]` | 商品詳細 |
| ✅ | - | `/guide` | ご利用ガイド |
| ✅ | - | `/faq` | FAQ |
| ✅ | - | `/privacy` | プライバシーポリシー |
| ✅ | - | `/terms` | 利用規約 |
| ✅ | - | `/law` | 特商法表記 |
| ✅ | ✅ | `/login` | ログイン |
| ✅ | ✅ | `/register` | 会員登録 |
| ✅ | - | `/register/complete` | 登録完了 |
| ✅ | ✅ | `/verify-email` | メール認証 |
| ✅ | ✅ | `/password-reset` | パスワードリセット依頼 |
| ✅ | ✅ | `/password-reset/confirm` | パスワード再設定 |

---

# Authenticated（認証必要）

| Design | API | Path | ページ名 |
|--------|-----|------|---------|
| ✅ | ✅ | `/mypage` | マイページ |
| ✅ | ✅ | `/mypage/orders` | 注文履歴 |
| ✅ | ✅ | `/mypage/orders/[id]` | 注文詳細 |
| ✅ | ✅ | `/mypage/orders/[id]/upload` | データ入稿 |
| ✅ | ✅ | `/mypage/profile` | プロフィール |
| ✅ | ✅ | `/mypage/addresses` | 配送先管理 |
| ✅ | ✅ | `/cart` | カート |
| ✅ | ✅ | `/checkout` | 購入手続き |
| ✅ | ✅ | `/checkout/upload` | データ入稿 |
| ✅ | ✅ | `/checkout/confirm` | 注文確認・決済 |
| ✅ | ✅ | `/checkout/complete` | 注文完了 |

---

# Admin（管理画面）

| Design | API | Path | ページ名 |
|--------|-----|------|---------|
| ✅ | ✅ | `/admin/login` | 管理者ログイン |
| ✅ | ✅ | `/admin` | ダッシュボード |
| ✅ | ✅ | `/admin/orders` | 注文一覧 |
| ✅ | ✅ | `/admin/orders/[id]` | 注文詳細・編集 |
| ✅ | ✅ | `/admin/products` | 商品一覧 |
| ✅ | ✅ | `/admin/products/new` | 商品追加 |
| ✅ | ✅ | `/admin/products/[id]` | 商品編集 |
| ✅ | ✅ | `/admin/uploads` | 入稿データ一覧 |
| ✅ | ✅ | `/admin/uploads/[id]` | 入稿確認・承認 |
| ✅ | ✅ | `/admin/users` | 顧客一覧 |
| ✅ | ✅ | `/admin/users/[id]` | 顧客詳細 |
| ✅ | ✅ | `/admin/admins` | 管理者一覧 |
| ✅ | ✅ | `/admin/logs` | 操作ログ |
| ✅ | ⬜ | `/admin/settings` | サイト設定 |

---

# 共通コンポーネント

| 状況 | コンポーネント |
|------|---------------|
| ✅ | Header |
| ✅ | Footer |
| ✅ | 認証プロバイダー |
| ✅ | カート状態管理 |
| ✅ | API クライアント設定 |
| ⬜ | エラーハンドリング |
| ⬜ | ローディング状態 |
| ⬜ | ローディングをスケルトンに置き換え |
| ⬜ | トースト通知 |
| ⬜ | モーダル共通 |
| ⬜ | ページネーション |
| ✅ | フォームバリデーション |

---

# 機能別タスク

## 認証機能

| 状況 | タスク |
|------|--------|
| ✅ | ログインフォーム |
| ✅ | 会員登録フォーム |
| ✅ | メール認証 |
| ✅ | パスワードリセット |
| ✅ | ログアウト処理 |
| ✅ | 認証状態管理 |
| ⬜ | 保護ルート |
| ⬜ | トークンリフレッシュ |

## カート機能

| 状況 | タスク |
|------|--------|
| ✅ | entities/cart |
| ✅ | features/cart/get-cart |
| ✅ | features/cart/add-to-cart |
| ✅ | features/cart/update-cart-item |
| ✅ | features/cart/delete-cart-item |
| ✅ | features/cart/clear-cart |
| ✅ | カート一覧UI |
| ✅ | カート追加ボタン |
| ✅ | 数量変更UI |
| ✅ | 小計計算表示 |

## 決済機能

| 状況 | タスク |
|------|--------|
| ✅ | shared/lib/stripe.ts |
| ✅ | entities/payment |
| ✅ | features/payment/create-payment-intent |
| ✅ | widgets/payment/card-form |
| ✅ | Stripe Elements導入 |
| ✅ | カード入力フォーム |
| ✅ | 決済処理 |
| ✅ | エラーハンドリング |
| ✅ | 購入手続きUI |
| ✅ | 注文確認・決済UI |
| ✅ | 注文完了UI |

## ファイルアップロード

| 状況 | タスク |
|------|--------|
| ✅ | entities/upload |
| ✅ | features/upload/upload-file |
| ✅ | features/upload/get-uploads |
| ✅ | features/upload/delete-upload |
| ✅ | features/upload/link-uploads |
| ✅ | widgets/upload/dropzone |
| ✅ | ドラッグ&ドロップ |
| ✅ | プレビュー表示 |
| ✅ | ファイル形式バリデーション |
| ✅ | アップロード進捗 |
| ✅ | チェックアウト入稿UI |
| ✅ | マイページ入稿UI |

## ユーザー機能

| 状況 | タスク |
|------|--------|
| ✅ | entities/user |
| ✅ | features/user/get-me |
| ✅ | features/user/update-me |
| ✅ | features/user/change-password |
| ✅ | プロフィール編集UI |
| ✅ | パスワード変更UI |

## 配送先機能

| 状況 | タスク |
|------|--------|
| ✅ | entities/address |
| ✅ | features/address/get-addresses |
| ✅ | features/address/create-address |
| ✅ | features/address/update-address |
| ✅ | features/address/delete-address |
| ✅ | features/address/set-default-address |
| ✅ | 配送先一覧UI |
| ✅ | 配送先追加・編集フォーム |

## 注文機能

| 状況 | タスク |
|------|--------|
| ✅ | entities/order |
| ✅ | features/order/get-orders |
| ✅ | features/order/get-order |
| ✅ | features/order/create-order |
| ✅ | features/order/cancel-order |
| ✅ | 注文一覧UI |
| ✅ | 注文詳細UI |
| ✅ | チェックアウトUI |

## Admin入稿管理機能

| 状況 | タスク |
|------|--------|
| ✅ | entities/admin-upload |
| ✅ | features/admin-upload/get-uploads |
| ✅ | features/admin-upload/get-upload |
| ✅ | features/admin-upload/approve-upload |
| ✅ | features/admin-upload/reject-upload |
| ✅ | 入稿一覧UI |
| ✅ | 入稿詳細・承認UI |
| ✅ | マイページ差し戻し理由表示 |

---

# リファクタリング

| 状況 | タスク | 備考 |
|------|--------|------|
| ⬜ | レイアウト関係をlayout.tsxに集約 | 各page.tsx内のレイアウト定義をApp Router の layout.tsx に移動し、page.tsx はコンテンツのみに専念させる |
| ⬜ | page-componentsとwidgetsの構造整理 | FSD設計に準拠した適切な責務分離・ディレクトリ構造の見直し |
| ⬜ | adminのfeatureにtypeを入れてformを整理 |  |
