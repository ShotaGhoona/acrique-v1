# Admin入稿管理 フロントエンド実装レポート

## 概要

管理者が消費者の入稿データを審査（承認/差し戻し）する機能のフロントエンド実装。
Phase 4（入稿フロー改善）の一部。

---

## 実装済み

### shared/domain/upload

| ファイル | 追加内容 |
|----------|----------|
| `model/types.ts` | `UploadStatus`型、`UPLOAD_STATUS_LABELS`、`UPLOAD_STATUS_COLORS` |

### entities/admin-upload

| ファイル | 説明 |
|----------|------|
| `model/types.ts` | Admin入稿データの型定義 |
| `api/admin-upload-api.ts` | API呼び出し関数 |

### features/admin-upload

| ディレクトリ | フック | 説明 |
|-------------|--------|------|
| `get-uploads/` | `useAdminUploads` | 一覧取得 |
| `get-upload/` | `useAdminUpload` | 詳細取得 |
| `approve-upload/` | `useApproveUpload` | 承認 |
| `reject-upload/` | `useRejectUpload` | 差し戻し |

### shared/api/query-keys.ts

追加したキー:
- `ADMIN_UPLOADS_QUERY_KEY`
- `ADMIN_UPLOAD_QUERY_KEY`

### page-components/admin/uploads

| ファイル | 状況 |
|----------|------|
| `home/ui/UploadsHomeContainer.tsx` | API接続完了（`useAdminUploads`使用） |
| `detail/ui/UploadDetailContainer.tsx` | API接続完了（承認/差し戻し実装済み） |

**削除したファイル:**
- `home/dummy-data/uploads.ts` - ダミーデータ削除

---

## 未実装（マイページ再入稿画面）

以下のページでは、差し戻し理由（`admin_notes`）の表示が未実装:

| ページ | 状況 |
|--------|------|
| `mypage/order-detail/ui/OrderDetailContainer.tsx` | ダミーの差し戻し項目表示中 |
| `mypage/order-upload/ui/OrderUploadContainer.tsx` | ダミーの差し戻し理由表示中 |

### 必要な変更

**バックエンド:**
- `UploadDTO`に`admin_notes`を追加
- `UploadResponse`に`admin_notes`を追加

**フロントエンド:**
- `entities/upload/model/types.ts`の`Upload`型に`admin_notes`を追加
- `OrderDetailContainer`でrejectedのuploadを`useUploads`から取得して表示
- `OrderUploadContainer`で`admin_notes`を表示

---

## 関連ドキュメント

- Backend実装: `47-admin-upload-backend.md`
- 戦略書: `docs/tasks/public/strategy/15-upload-flow-improvement.md`
