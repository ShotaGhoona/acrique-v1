# Users & Addresses Frontend 実装レポート

## 概要

ユーザー情報・配送先管理のフロントエンドEntity層とFeature層を実装。Feature-Sliced Design（FSD）に従い、API連携用のhooksを構築した。

**重要**: 本タスクではEntity層とFeature層のみを実装。Page-Components層（UIコンポーネント）との接続は別タスクで行う。

---

## 実装範囲

| 層 | 実装状況 |
|----|----------|
| entities | 完了 |
| features | 完了 |
| widgets | 未着手 |
| page-components | 未着手 |
| app routes | 未着手 |

---

## アーキテクチャ

### entities/user

**ファイル構成:**

| ファイル | 説明 |
|----------|------|
| `entities/user/model/types.ts` | 型定義 |
| `entities/user/api/user-api.ts` | API呼び出し関数 |
| `entities/user/index.ts` | 公開エクスポート |

**API関数:**

```typescript
getMe(): Promise<GetMeResponse>
updateMe(data: UpdateMeRequest): Promise<UpdateMeResponse>
changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse>
```

**型定義:**

```typescript
interface UserProfile {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  company: string | null;
  created_at: string;
}

interface UpdateMeRequest {
  name?: string;
  phone?: string;
  company?: string;
}

interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}
```

### entities/address

**ファイル構成:**

| ファイル | 説明 |
|----------|------|
| `entities/address/model/types.ts` | 型定義 |
| `entities/address/api/address-api.ts` | API呼び出し関数 |
| `entities/address/index.ts` | 公開エクスポート |

**API関数:**

```typescript
getAddresses(): Promise<GetAddressesResponse>
getAddress(id: number): Promise<GetAddressResponse>
createAddress(data: CreateAddressRequest): Promise<CreateAddressResponse>
updateAddress(id: number, data: UpdateAddressRequest): Promise<UpdateAddressResponse>
deleteAddress(id: number): Promise<void>
setDefaultAddress(id: number): Promise<SetDefaultAddressResponse>
```

**型定義:**

```typescript
interface Address {
  id: number;
  label: string;
  postal_code: string;
  prefecture: string;
  city: string;
  address_line1: string;
  address_line2: string | null;
  recipient_name: string;
  phone: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateAddressRequest {
  label: string;
  postal_code: string;
  prefecture: string;
  city: string;
  address_line1: string;
  address_line2?: string;
  recipient_name: string;
  phone: string;
  is_default?: boolean;
}
```

---

### features/user

| ディレクトリ | 説明 |
|--------------|------|
| `features/user/get-me/` | ユーザー情報取得フック |
| `features/user/update-me/` | ユーザー情報更新フック |
| `features/user/change-password/` | パスワード変更フック |

**フック一覧:**

| フック | 用途 | React Query |
|--------|------|-------------|
| `useGetMe()` | ユーザー情報取得 | useQuery |
| `useUpdateMe()` | ユーザー情報更新 | useMutation |
| `useChangePassword()` | パスワード変更 | useMutation |

**キャッシュキー:**

```typescript
export const USER_QUERY_KEY = ['user', 'me'];
```

### features/address

| ディレクトリ | 説明 |
|--------------|------|
| `features/address/get-addresses/` | 配送先一覧取得フック |
| `features/address/create-address/` | 配送先作成フック |
| `features/address/update-address/` | 配送先更新フック |
| `features/address/delete-address/` | 配送先削除フック |
| `features/address/set-default-address/` | デフォルト配送先設定フック |

**フック一覧:**

| フック | 用途 | React Query |
|--------|------|-------------|
| `useAddresses()` | 配送先一覧取得 | useQuery |
| `useCreateAddress()` | 配送先作成 | useMutation |
| `useUpdateAddress()` | 配送先更新 | useMutation |
| `useDeleteAddress()` | 配送先削除 | useMutation |
| `useSetDefaultAddress()` | デフォルト設定 | useMutation |

**キャッシュキー:**

```typescript
export const ADDRESSES_QUERY_KEY = ['addresses'];
```

---

## 作成ファイル一覧

### entities

```
src/entities/user/
├── model/
│   └── types.ts
├── api/
│   └── user-api.ts
└── index.ts

src/entities/address/
├── model/
│   └── types.ts
├── api/
│   └── address-api.ts
└── index.ts
```

### features

```
src/features/user/
├── get-me/
│   ├── lib/
│   │   └── use-get-me.ts
│   └── index.ts
├── update-me/
│   ├── model/
│   │   └── types.ts
│   ├── lib/
│   │   └── use-update-me.ts
│   └── index.ts
└── change-password/
    ├── model/
    │   └── types.ts
    ├── lib/
    │   └── use-change-password.ts
    └── index.ts

src/features/address/
├── get-addresses/
│   ├── lib/
│   │   └── use-addresses.ts
│   └── index.ts
├── create-address/
│   ├── model/
│   │   └── types.ts
│   ├── lib/
│   │   └── use-create-address.ts
│   └── index.ts
├── update-address/
│   ├── model/
│   │   └── types.ts
│   ├── lib/
│   │   └── use-update-address.ts
│   └── index.ts
├── delete-address/
│   ├── lib/
│   │   └── use-delete-address.ts
│   └── index.ts
└── set-default-address/
    ├── lib/
    │   └── use-set-default-address.ts
    └── index.ts
```

---

## バックエンド連携

| フロントエンド | バックエンドAPI |
|----------------|-----------------|
| `useGetMe()` | `GET /api/users/me` |
| `useUpdateMe()` | `PUT /api/users/me` |
| `useChangePassword()` | `PUT /api/users/me/password` |
| `useAddresses()` | `GET /api/addresses` |
| `useCreateAddress()` | `POST /api/addresses` |
| `useUpdateAddress()` | `PUT /api/addresses/{id}` |
| `useDeleteAddress()` | `DELETE /api/addresses/{id}` |
| `useSetDefaultAddress()` | `PUT /api/addresses/{id}/default` |

---

## React Query設定

| 設定 | 値 |
|------|-----|
| `staleTime` | 5分 (`1000 * 60 * 5`) |
| Mutation成功時 | 関連キャッシュを自動invalidate |

---

## TypeScript検証

```bash
npx tsc --noEmit
# エラーなし
```

---

## 未実装（次のステップ）

本タスクはEntity層・Feature層のみの実装。以下は別タスクで実施する。

### Page-Componentsとの接続

| ページ | パス | 説明 |
|--------|------|------|
| プロフィール | `/mypage/profile` | `useGetMe`, `useUpdateMe`, `useChangePassword`を使用 |
| 配送先管理 | `/mypage/addresses` | `useAddresses`, CRUD hooks を使用 |

### 実装が必要なUI

1. **プロフィール編集フォーム**
   - 名前・電話番号・会社名の編集
   - パスワード変更フォーム

2. **配送先管理画面**
   - 配送先一覧表示
   - 新規追加フォーム
   - 編集フォーム
   - 削除確認モーダル
   - デフォルト設定ボタン

### Widgetsの作成

- `widgets/user/ui/ProfileForm.tsx`
- `widgets/address/ui/AddressList.tsx`
- `widgets/address/ui/AddressForm.tsx`
- `widgets/address/ui/AddressCard.tsx`

---

## 備考

- 認証状態の確認には既存の`features/auth/get-auth-status`を使用
- 配送先は最大10件まで登録可能（バックエンド制限）
- デフォルト配送先設定時は他の配送先のis_defaultがfalseに更新される
