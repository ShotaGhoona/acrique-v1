# 消費者向け入稿機能 フロントエンド実装レポート

## 概要

消費者がロゴ・QRコード・写真等のデータを入稿する機能のフロントエンド実装。
FSD（Feature-Sliced Design）に準拠し、Entity層、Feature層、Widgets層、Page-components層を実装。

---

## 実装したファイル

### Entity層

| ファイル | 説明 |
|----------|------|
| `src/entities/upload/model/types.ts` | 型定義 |
| `src/entities/upload/api/upload-api.ts` | API関数 |

### Feature層

| ファイル | 説明 |
|----------|------|
| `src/features/upload/get-uploads/lib/use-uploads.ts` | 一覧取得フック |
| `src/features/upload/upload-file/lib/use-upload-file.ts` | ファイルアップロードフック |
| `src/features/upload/delete-upload/lib/use-delete-upload.ts` | 削除フック |
| `src/features/upload/link-uploads/lib/use-link-uploads.ts` | 注文明細紐付けフック |

### Widgets層

| ファイル | 説明 |
|----------|------|
| `src/widgets/upload/dropzone/ui/FileDropzone.tsx` | ドラッグ＆ドロップ対応ファイルアップロードコンポーネント |

### Page-components層

| ファイル | 説明 |
|----------|------|
| `src/page-components/purchase/checkout/upload/ui/CheckoutUploadContainer.tsx` | チェックアウト入稿UI |
| `src/page-components/mypage/order-upload/ui/OrderUploadContainer.tsx` | マイページ入稿UI |

### App層（ルーティング）

| ファイル | 説明 |
|----------|------|
| `src/app/(purchase)/checkout/upload/page.tsx` | チェックアウト入稿ページ |
| `src/app/(mypage)/mypage/orders/[id]/upload/page.tsx` | マイページ入稿ページ |

---

## 型定義

### UploadStatus

```typescript
type UploadStatus = 'pending' | 'submitted' | 'reviewing' | 'approved' | 'rejected';
```

### UploadType

```typescript
type UploadType = 'logo' | 'qr' | 'photo' | 'text';
```

### Upload

```typescript
interface Upload {
  id: number;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  upload_type: string | null;
  status: UploadStatus;
  order_id: number | null;
  order_item_id: number | null;
  created_at: string | null;
}
```

---

## コンポーネント

### FileDropzone

ドラッグ＆ドロップ対応のファイルアップロードコンポーネント。

```tsx
import { FileDropzone } from '@/widgets/upload/dropzone/ui/FileDropzone';

<FileDropzone
  uploadType="logo"
  label="ロゴデータ"
  description="AI, EPS, PDF, SVG, PNG形式に対応"
  onUploadComplete={(upload) => console.log('Uploaded:', upload)}
  onFileRemove={(uploadId) => console.log('Removed:', uploadId)}
  uploadedFiles={[]}
/>
```

#### Props

| Prop | 型 | 説明 |
|------|-----|------|
| `uploadType` | `UploadType` | アップロード種別（logo, qr, photo, text） |
| `label` | `string` | ラベル表示 |
| `description` | `string` | 説明文 |
| `onUploadComplete` | `(upload: Upload) => void` | アップロード完了時のコールバック |
| `onFileRemove` | `(uploadId: number) => void` | ファイル削除時のコールバック |
| `uploadedFiles` | `UploadedFile[]` | アップロード済みファイル一覧 |
| `maxSize` | `number` | 最大ファイルサイズ（デフォルト: 10MB） |
| `accept` | `string` | 許可するファイル形式 |

---

## 画面フロー

### チェックアウト時の入稿フロー

```
/checkout（配送先・支払い方法選択）
    ↓
/checkout/upload（データ入稿）← 新規追加
    ↓
/checkout/confirm（注文確認・決済）
    ↓
/checkout/complete（注文完了）
```

### マイページからの入稿フロー

```
/mypage/orders（注文一覧）
    ↓
/mypage/orders/[id]（注文詳細）
    ↓ 「データを入稿する」ボタン
/mypage/orders/[id]/upload（データ入稿）← 新規追加
```

---

## フック使用例

### ファイルアップロード

```tsx
import { useUploadFile } from '@/features/upload/upload-file/lib/use-upload-file';

function UploadForm() {
  const { mutateAsync: uploadFile, isPending } = useUploadFile();

  const handleUpload = async (file: File) => {
    const result = await uploadFile({ file, uploadType: 'logo' });
    console.log('Uploaded:', result.upload);
  };

  return (
    <input
      type="file"
      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      disabled={isPending}
    />
  );
}
```

### 一覧取得

```tsx
import { useUploads } from '@/features/upload/get-uploads/lib/use-uploads';

function UploadList() {
  const { data, isLoading } = useUploads();

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {data?.uploads.map((upload) => (
        <li key={upload.id}>{upload.file_name}</li>
      ))}
    </ul>
  );
}
```

### 削除

```tsx
import { useDeleteUpload } from '@/features/upload/delete-upload/lib/use-delete-upload';

function DeleteButton({ uploadId }: { uploadId: number }) {
  const { mutate: deleteUpload, isPending } = useDeleteUpload();

  return (
    <button onClick={() => deleteUpload(uploadId)} disabled={isPending}>
      削除
    </button>
  );
}
```

### 注文明細への紐付け

```tsx
import { useLinkUploads } from '@/features/upload/link-uploads/lib/use-link-uploads';

function LinkUploadsButton() {
  const { mutate: linkUploads } = useLinkUploads();

  const handleLink = () => {
    linkUploads({
      orderId: 1,
      itemId: 1,
      uploadIds: [1, 2],
    });
  };

  return <button onClick={handleLink}>入稿データを紐付け</button>;
}
```

---

## アップロードフロー

```
1. useUploadFile.mutateAsync({ file, uploadType })
   │
   ├─→ POST /api/uploads/presigned  （Presigned URL取得）
   │
   ├─→ PUT {upload_url}             （S3へ直接アップロード）
   │
   └─→ POST /api/uploads            （DB登録）
```

---

## 変更したファイル

| ファイル | 変更内容 |
|----------|----------|
| `src/page-components/purchase/checkout/home/ui/CheckoutContainer.tsx` | 注文作成後の遷移先を `/checkout/upload` に変更 |
| `src/page-components/mypage/order-detail/ui/OrderDetailContainer.tsx` | 「データを入稿する」ボタンを追加 |

---

## チェックリスト

| タスク | 状況 |
|--------|------|
| 型定義 | [x] |
| API関数 | [x] |
| useUploads | [x] |
| useUploadFile | [x] |
| useDeleteUpload | [x] |
| useLinkUploads | [x] |
| Dropzoneコンポーネント | [x] |
| チェックアウト入稿UI | [x] |
| マイページ入稿UI | [x] |
| フロー接続 | [x] |

---

## 備考

- DESIGN.mdに準拠したデザイン実装
- レスポンシブ対応済み
- ビルド確認済み（`npm run build` 成功）
