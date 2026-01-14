# FSD における型設計とフォームパターン

AIバイブコーディングで発生した問題点と、Feature-Sliced Design (FSD) における最適解をまとめる。

---

## 目次

1. [発見された問題点](#1-発見された問題点)
2. [FSD の層と責務](#2-fsd-の層と責務)
3. [フォーム型の3つのパターン](#3-フォーム型の3つのパターン)
4. [ビジネス要件からの判断基準](#4-ビジネス要件からの判断基準)
5. [create/edit フォームの設計](#5-createedit-フォームの設計)
6. [実践ガイドライン](#6-実践ガイドライン)

---

## 1. 発見された問題点

### 1.1 型定義の重複と不一致

AIバイブコーディングでは、同じような型が複数の場所に散在していた。

```
❌ 問題のある状態

entities/address/model/types.ts
  └── CreateAddressRequest      ← API用

features/address/create-address/model/types.ts
  └── CreateAddressFormData     ← 内容が同じなのに別定義
```

**何が問題か？**
- 同じ内容の型が2箇所に存在（DRY原則違反）
- 修正時に両方を更新する必要がある
- どちらを使うべきか判断に迷う

### 1.2 一貫性のない設計

同じ「商品フォーム」でも、画面によって設計がバラバラだった。

```typescript
// ProductEditContainer.tsx - 型を使用
const [formData, setFormData] = useState<BasicInfoFormData>({...});

// ProductNewContainer.tsx - 型なしでインライン定義
const [formData, setFormData] = useState({
  id: '',
  name: '',
  base_price: '',  // 型推論に任せている
  ...
});
```

**何が問題か？**
- 同じフォームなのに設計が異なる
- 新規作成と編集でコードの書き方が違う
- チームメンバーが混乱する

### 1.3 feature/model の乱用

すべての feature に model フォルダを作成していた。

```
❌ 不要な model の例

features/auth/login/model/types.ts
  └── LoginFormData { email: string; password: string; }

entities/auth/model/types.ts
  └── LoginRequest { email: string; password: string; }

↑ 完全に同じ内容
```

---

## 2. FSD の層と責務

### 2.1 各層の役割

```
┌─────────────────────────────────────────────────────────┐
│  app          アプリケーション設定、プロバイダー         │
├─────────────────────────────────────────────────────────┤
│  pages        ルーティング、ページコンポーネント         │
├─────────────────────────────────────────────────────────┤
│  widgets      複合UIコンポーネント（Header, Sidebar等）  │
├─────────────────────────────────────────────────────────┤
│  features     ユーザーアクション（CRUD操作）            │
├─────────────────────────────────────────────────────────┤
│  entities     ビジネスエンティティ（User, Product等）    │
├─────────────────────────────────────────────────────────┤
│  shared       共通ユーティリティ、UI部品                │
└─────────────────────────────────────────────────────────┘
```

### 2.2 依存関係のルール

**上の層は下の層にのみ依存できる**

```
✅ OK
features → entities → shared

❌ NG
entities → features（逆方向の依存）
features/A → features/B（同じ層内の依存）
```

---

## 3. フォーム型の3つのパターン

### パターン1: entities の型をそのまま使う

**適用場面**: フォーム入力値 = APIリクエスト値

```typescript
// entities/auth/model/types.ts
interface LoginRequest {
  email: string;
  password: string;
}

// app/(auth)/login/page.tsx
import type { LoginRequest } from '@/entities/account-domain/auth/model/types';

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const handleSubmit = () => {
  const credentials: LoginRequest = { email, password };
  loginMutation.mutate(credentials);
};
```

**このプロジェクトでの実例**:
- `LoginRequest` - ログインフォーム
- `CreateAddressRequest` - 住所作成（確認フィールドなし）
- `UpdateMeRequest` - プロフィール更新

### パターン2: features/slice/model に型を定義

**適用場面**: フォーム入力値 ≠ APIリクエスト値

```typescript
// features/admin-product/create-product/model/types.ts
export interface CreateProductFormData {
  id: string;
  name: string;
  base_price: string;        // ← フォームはstring
  lead_time_days: string;    // ← フォームはstring
  category_id: CategoryId | '';  // ← 未選択状態を表現
  // ...
}

// page-components/admin/products/new/ui/ProductNewContainer.tsx
import {
  type CreateProductFormData,
  createProductFormDataInitial,
} from '@/features/admin-domain/admin-product/create-product/model/types';

const [formData, setFormData] = useState<CreateProductFormData>(
  createProductFormDataInitial
);
```

**このプロジェクトでの実例**:
- `CreateProductFormData` - 商品作成（string→number変換）
- `UpdateAdminFormData` - 管理者更新（password任意）
- `RegisterFormData` - 会員登録（confirmPassword）

### パターン3: widgets 内で zod と自己完結

**適用場面**: 複数画面で再利用するフォームUI

```typescript
// widgets/address/address-form-modal/ui/AddressFormModal.tsx
import { z } from 'zod';

export const addressSchema = z.object({
  name: z.string().min(1, 'お名前を入力してください'),
  postal_code: z.string().min(1, '郵便番号を入力してください'),
  prefecture: z.string().min(1, '都道府県を入力してください'),
  // ...
});

export type AddressFormData = z.infer<typeof addressSchema>;

export function AddressForm({ ... }) {
  const { register, handleSubmit } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });
  // ...
}
```

**このプロジェクトでの実例**:
- `AddressFormModal` - マイページ・チェックアウトで共通
- `ProfileContainer` 内の `profileSchema` - react-hook-form + zod

---

## 4. ビジネス要件からの判断基準

### 4.1 なぜパターンが異なるのか

| ビジネス要件 | 技術的な理由 | 適用パターン |
|-------------|-------------|-------------|
| メールとパスワードでログイン | 入力値をそのままAPIに送信 | パターン1 |
| パスワード確認で入力ミス防止 | confirmPasswordはAPIに不要 | パターン2 |
| 価格を入力して保存 | inputはstring、APIはnumber | パターン2 |
| カテゴリを選択（未選択可） | `''`はUI状態、APIは`undefined` | パターン2 |
| 住所フォームを複数画面で使う | UIとバリデーションをセットで再利用 | パターン3 |

### 4.2 判断フローチャート

```
フォームを実装するとき:

1. フォーム入力値をそのままAPIに渡せる？
   │
   ├─ YES → パターン1: entities の型をそのまま使う
   │         例: ログイン、シンプルな検索
   │
   └─ NO → 「なぜ渡せない？」を確認 → 2へ

2. 何が違う？
   │
   ├─ UI専用フィールド (confirmPassword等)
   │   └─ パターン2: features/slice/model に定義
   │
   ├─ 型変換が必要 (string → number)
   │   └─ パターン2: features/slice/model に定義
   │
   └─ UI状態の表現 (未選択、ステップ管理)
       └─ パターン2: features/slice/model に定義

3. このフォームUIは複数画面で使う？
   │
   ├─ YES → パターン3: widgets に置いて zod と自己完結
   │         例: 住所フォーム、カードフォーム
   │
   └─ NO → パターン2 のまま features に置く
```

### 4.3 具体例で比較

| フォーム | パターン | ビジネス要件 |
|---------|---------|-------------|
| ログイン | 1 | email + password → そのまま認証 |
| 会員登録 | 2 | パスワード確認でミス防止 |
| 商品作成 | 2 | 価格入力→数値保存、カテゴリ未選択許可 |
| 管理者編集 | 2 | パスワード変更は任意 |
| 住所入力 | 3 | マイページとチェックアウトで同じフォーム |
| プロフィール | 3 | 複雑なバリデーションをUIと一体化 |

---

## 5. create/edit フォームの設計

### 5.1 採用パターン: 各スライスに独自の model（重複許容）

```
features/admin-domain/admin-product/
├── create-product/
│   ├── lib/use-create-product.ts
│   └── model/types.ts          ← CreateProductFormData
├── update-product/
│   ├── lib/use-update-product.ts
│   └── model/types.ts          ← BasicInfoFormData（UpdateProductFormData）
└── get-product/
    └── lib/use-admin-product.ts
```

**この設計を選んだ理由**:

1. **FSD原則に従う**: 各スライスが独立している
2. **明確な責務**: create-product は作成のみ、update-product は更新のみ
3. **型の違いを明示**: create には `id` が必要、update には不要など

### 5.2 型定義の実装例

```typescript
// features/admin-product/create-product/model/types.ts
import type { CategoryId } from '@/shared/domain/category/model/types';

/**
 * 商品作成フォームの入力型
 *
 * APIリクエスト（CreateProductRequest）とは異なり、フォーム入力に最適化。
 * - 数値フィールドがstring（inputの値は常にstring）
 * - 空文字を許容（未入力状態の表現）
 */
export interface CreateProductFormData {
  id: string;
  name: string;
  name_ja: string;
  category_id: CategoryId | '';
  base_price: string;
  lead_time_days: string;
  // ...
}

/**
 * 初期値（useStateで使用）
 */
export const createProductFormDataInitial: CreateProductFormData = {
  id: '',
  name: '',
  name_ja: '',
  category_id: '',
  base_price: '',
  lead_time_days: '',
  // ...
};
```

### 5.3 page-components での使用

```typescript
// page-components/admin/products/new/ui/ProductNewContainer.tsx
import {
  type CreateProductFormData,
  createProductFormDataInitial,
} from '@/features/admin-domain/admin-product/create-product/model/types';

export function ProductNewContainer() {
  const [formData, setFormData] = useState<CreateProductFormData>(
    createProductFormDataInitial
  );

  const handleSubmit = () => {
    createProductMutation.mutate({
      id: formData.id,
      name: formData.name,
      base_price: parseInt(formData.base_price, 10),  // string → number
      // ...
    });
  };
  // ...
}
```

### 5.4 create/edit で形が似ている場合

**Q: CreateProductFormData と BasicInfoFormData（update用）がほぼ同じ。共通化しないの？**

**A: 重複を許容する。理由:**

1. **FSDの層の独立性**: 各スライスが他に依存しない
2. **将来の変更に強い**: create と update で要件が分岐しても影響しない
3. **feature直下のmodelは気持ち悪い**: `features/{entity}/model/` はスライスではない

```
❌ 気持ち悪いパターン（採用しない）

features/admin-product/
├── model/              ← スライスじゃないのにここにある
│   └── form-types.ts
├── create-product/     ← スライス
└── update-product/     ← スライス
```

---

## 6. 実践ガイドライン

### 6.1 命名規則

```typescript
// entities - APIの型
interface CreateProductRequest { ... }   // リクエスト
interface CreateProductResponse { ... }  // レスポンス
interface Product { ... }                // エンティティ

// features - フォームの型
interface CreateProductFormData { ... }  // 作成フォーム
interface UpdateProductFormData { ... }  // 更新フォーム（または BasicInfoFormData 等）

// 初期値
const createProductFormDataInitial: CreateProductFormData = { ... };
```

### 6.2 チェックリスト

新しいCRUD機能を実装する前に確認:

- [ ] API型（Request/Response）は `entities/model` に定義したか
- [ ] フォーム入力値 = API送信値 なら entities の型をそのまま使う
- [ ] フォーム入力値 ≠ API送信値 なら `features/slice/model` に型を定義
- [ ] 複数画面で使うフォームUIは `widgets` で zod と自己完結
- [ ] 初期値（xxxInitial）も型と一緒にexport
- [ ] page-components では features から型をimport

### 6.3 ファイル配置の早見表

| ケース | 配置場所 | 例 |
|-------|---------|-----|
| APIリクエスト/レスポンス型 | `entities/{entity}/model/types.ts` | `CreateProductRequest` |
| フォーム入力型（API型と異なる） | `features/{slice}/model/types.ts` | `CreateProductFormData` |
| 再利用するフォームUI + 型 | `widgets/{form}/ui/` 内で zod | `AddressFormData` |
| ページ固有のProps型 | `page-components/.../model/types.ts` | `TabProps` |

---

## まとめ

| 原則 | 説明 |
|------|------|
| **判断基準はビジネス要件** | 「なぜこのフィールドが必要か」から考える |
| **entities = API型** | ドメイン層の関心事 |
| **features = UI型** | UI層の関心事（確認フィールド、string入力等） |
| **widgets = 再利用UI** | 型・バリデーション・UIをセットで |
| **重複許容** | FSD原則に従い、各スライスの独立性を優先 |

---

## 参考リンク

- [Feature-Sliced Design 公式](https://feature-sliced.design/)
- [FSD Examples](https://github.com/feature-sliced/examples)
