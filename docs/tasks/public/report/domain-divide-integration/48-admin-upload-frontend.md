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

### entities/upload

| ファイル | 変更内容 |
|----------|----------|
| `model/types.ts` | `Upload`型に`admin_notes`追加 |

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

### page-components/mypage

| ファイル | 状況 |
|----------|------|
| `order-detail/ui/OrderDetailContainer.tsx` | `useUploads`でrejected一覧取得、`admin_notes`表示 |
| `order-upload/ui/OrderUploadContainer.tsx` | `admin_notes`（差し戻し理由）表示 |

---

## バックエンド変更

| ファイル | 変更内容 |
|----------|----------|
| `app/application/schemas/upload_schemas.py` | `UploadDTO`に`admin_notes`追加 |
| `app/presentation/schemas/upload_schemas.py` | `UploadResponse`に`admin_notes`追加 |
| `app/application/use_cases/upload_usecase.py` | `_to_dto`で`admin_notes`をマッピング |

これにより、ユーザー向けの`GET /api/uploads`が`admin_notes`を返すようになった。

---

## 関連ドキュメント

- Backend実装: `47-admin-upload-backend.md`
- 戦略書: `docs/tasks/public/strategy/15-upload-flow-improvement.md`
