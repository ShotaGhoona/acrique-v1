# Admin入稿管理 フロントエンド実装レポート

## 概要

管理者が消費者の入稿データを審査（承認/差し戻し）する機能のフロントエンド実装。
Phase 4（入稿フロー改善）の一部。

---

## 実装済み

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

---

## 未実装（page-components）

| ページ | 状況 |
|--------|------|
| `/admin/uploads` 一覧画面 | ダミーデータ → API接続必要 |
| `/admin/uploads/[id]` 詳細画面 | 承認/差し戻しボタン実装必要 |

---

## 関連ドキュメント

- Backend実装: `47-admin-upload-backend.md`
- 戦略書: `docs/tasks/public/strategy/15-upload-flow-improvement.md`
