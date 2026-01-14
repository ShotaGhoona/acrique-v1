# page-components リファクタリング手順書

## 概要

page-componentsの各Containerファイルをリファクタリングし、単一責任の原則（SRP）に沿った構造に整理する手順書です。

---

## 1. コンポーネント分離

### 対象
- Containerファイル内に定義された小さなUIコンポーネント
- 再利用可能なカード、リストアイテム、空状態表示など

### 手順

1. **Containerファイルを確認**
   - ファイル内に `function XxxCard()` や `function XxxItem()` などの内部コンポーネントがないか確認

2. **ui/components/ に分離**
   ```
   page-components/xxx/
   ├── ui/
   │   ├── XxxContainer.tsx      # メインのContainer
   │   ├── components/           # 分離したコンポーネント
   │   │   ├── XxxCard.tsx
   │   │   ├── XxxEmptyState.tsx
   │   │   └── XxxItem.tsx
   │   └── skeleton/             # スケルトン（既存）
   │       └── XxxSkeleton.tsx
   └── config/                   # 設定・定数（後述）
   ```

3. **コンポーネントを新ファイルに移動**
   - 必要なimportを追加
   - propsの型定義を追加（interface）
   - exportする

4. **Containerを更新**
   - 分離したコンポーネントをimport
   - 内部定義を削除

### 分離の判断基準

| 分離する | 分離しない |
|----------|------------|
| 独立したUIパーツ（Card, Item, EmptyState） | Containerのローカルstate依存が強いもの |
| 10行以上のJSX | 3-5行の単純なラッパー |
| 他で再利用の可能性があるもの | 完全にContainer固有のもの |

---

## 2. 設定・定数の分離

### 対象
- フィルターオプション
- ステータスアイコンマッピング
- 固定の配列・オブジェクト

### 手順

1. **config/ ディレクトリを作成**

2. **定数を移動**
   ```typescript
   // config/filter-options.ts
   export const filterOptions = [
     { value: 'all', label: 'すべて' },
     { value: 'active', label: '有効' },
   ];
   ```

3. **Containerからimport**
   ```typescript
   import { filterOptions } from '../config/filter-options';
   ```

---

## 3. フォーマット関数の共通化

### 共通関数の場所
```
shared/utils/format/
├── date.ts    # formatDate
└── price.ts   # formatPrice
```

### 使用可能なフォーマット

**日付（formatDate）**
```typescript
import { formatDate } from '@/shared/utils/format/date';

formatDate(date, 'short')        // 24/01/15
formatDate(date, 'full')         // 2024/01/15
formatDate(date, 'long')         // 2024年1月15日
formatDate(date, 'longWithTime') // 2024年1月15日 14:30
formatDate(date, 'yearMonth')    // 2024年1月
```

**価格（formatPrice）**
```typescript
import { formatPrice } from '@/shared/utils/format/price';

formatPrice(1000) // ¥1,000
```

### 手順

1. **ローカル定義を探す**
   ```typescript
   // これを探す
   function formatDate(...) { ... }
   function formatPrice(...) { ... }
   ```

2. **共通関数に置き換え**
   ```typescript
   // Before
   function formatDate(dateString: string | null): string {
     if (!dateString) return '-';
     return new Date(dateString).toLocaleDateString('ja-JP', {...});
   }

   // After
   import { formatDate } from '@/shared/utils/format/date';
   // 使用時: formatDate(order.created_at, 'long')
   ```

3. **フォーマットを選択**
   - 時刻あり → `'longWithTime'`
   - 時刻なし → `'long'`
   - 短縮形 → `'short'` or `'full'`

---

## 4. ErrorState の適用

### 共通コンポーネントの場所
```
shared/ui/components/error-state/ui/ErrorState.tsx
```

### 使い方
```typescript
import { ErrorState } from '@/shared/ui/components/error-state/ui/ErrorState';

// Before
{error && (
  <div className='rounded-sm border border-destructive/50 bg-destructive/10 p-6 text-center'>
    <p className='text-destructive'>読み込みに失敗しました</p>
    <Button variant='outline' onClick={() => window.location.reload()}>
      再読み込み
    </Button>
  </div>
)}

// After
{error && (
  <ErrorState
    message='読み込みに失敗しました'
    onRetry={() => window.location.reload()}
  />
)}
```

### Props
| Prop | 型 | 必須 | 説明 |
|------|-----|------|------|
| message | string | - | エラーメッセージ（デフォルト: 'データの読み込みに失敗しました'） |
| onRetry | () => void | - | 再試行ボタンのハンドラ（なければボタン非表示） |
| retryLabel | string | - | 再試行ボタンのラベル（デフォルト: '再読み込み'） |

### 適用しないケース
- 「見つからない」系のエラー（戻るリンク付きなど特殊なUI）
- カスタムのアクションが必要な場合

---

## 5. ConfirmDialog の適用

### 共通コンポーネントの場所
```
shared/ui/components/confirm-dialog/ui/ConfirmDialog.tsx
```

### 使い方
```typescript
import { ConfirmDialog } from '@/shared/ui/components/confirm-dialog/ui/ConfirmDialog';

// State追加
const [confirmOpen, setConfirmOpen] = useState(false);
const [pendingId, setPendingId] = useState<number | null>(null);

// Before
const handleDelete = (id: number) => {
  if (!confirm('削除しますか？')) return;
  deleteMutation.mutate(id);
};

// After
const handleDelete = (id: number) => {
  setPendingId(id);
  setConfirmOpen(true);
};

const confirmDelete = () => {
  if (!pendingId) return;
  deleteMutation.mutate(pendingId, {
    onSettled: () => setPendingId(null),
  });
};

// JSX
<ConfirmDialog
  open={confirmOpen}
  onOpenChange={setConfirmOpen}
  title='削除の確認'
  description='この項目を削除しますか？この操作は取り消せません。'
  confirmLabel='削除'
  destructive
  onConfirm={confirmDelete}
/>
```

### Props
| Prop | 型 | 必須 | 説明 |
|------|-----|------|------|
| open | boolean | ✓ | 開閉状態 |
| onOpenChange | (open: boolean) => void | ✓ | 開閉ハンドラ |
| title | string | ✓ | ダイアログタイトル |
| description | string | - | 説明文 |
| confirmLabel | string | - | 確認ボタンラベル（デフォルト: '確認'） |
| cancelLabel | string | - | キャンセルボタンラベル（デフォルト: 'キャンセル'） |
| destructive | boolean | - | 危険なアクション（赤いボタン） |
| onConfirm | () => void | ✓ | 確認時のハンドラ |

---

## 6. チェックリスト

### 各ページのリファクタリング時に確認

- [ ] Containerに内部コンポーネントがあれば `ui/components/` に分離
- [ ] 定数・設定があれば `config/` に分離
- [ ] `function formatDate` があれば共通関数に置き換え
- [ ] `function formatPrice` があれば共通関数に置き換え
- [ ] エラー表示があれば `ErrorState` に置き換え
- [ ] `confirm()` があれば `ConfirmDialog` に置き換え
- [ ] ビルドが通ることを確認

---

## 7. 適用対象ページ一覧

| ドメイン | ページ | 状態 |
|----------|--------|------|
| **mypage** | home, addresses, orders-home, order-detail, order-upload, profile | ✅ 完了 |
| **storefront** | product, cart, etc. | 未着手 |
| **purchase** | checkout, confirm, complete, upload | 未着手 |
| **admin** | dashboard, products, orders, users, uploads, settings | 未着手 |
| **info** | contact, faq, guide, terms, privacy, law | 未着手 |
| **auth** | login, register, password-reset, verify-email | 未着手 |
