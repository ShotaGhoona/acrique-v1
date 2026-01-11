# 消費者向け入稿機能 フロントエンド実装レポート

## 概要

消費者がロゴ・QRコード・写真等のデータを入稿する機能のフロントエンド実装。
FSD（Feature-Sliced Design）に準拠し、Entity層とFeature層を実装。

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

## 次のステップ

- [ ] Dropzoneコンポーネント（widgets層）
- [ ] チェックアウト入稿UI（page-components層）
- [ ] マイページ入稿UI（page-components層）

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
| Dropzoneコンポーネント | [ ] |
| チェックアウト入稿UI | [ ] |
| マイページ入稿UI | [ ] |
