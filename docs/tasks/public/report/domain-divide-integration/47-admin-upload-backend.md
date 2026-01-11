# Admin入稿管理 バックエンド実装レポート

## 概要

管理者が消費者の入稿データを審査（承認/差し戻し）する機能のバックエンド実装を完了した。
Phase 4（入稿フロー改善）の一部として、注文ステータスとの連動も実装。

---

## 実装したAPI

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | `/api/admin/uploads` | 入稿データ一覧取得（フィルタ・ページネーション対応） |
| GET | `/api/admin/uploads/{id}` | 入稿データ詳細取得 |
| POST | `/api/admin/uploads/{id}/approve` | 入稿データ承認 |
| POST | `/api/admin/uploads/{id}/reject` | 入稿データ差し戻し |

---

## ファイル構成

### 新規作成

| ファイル | 説明 |
|----------|------|
| `app/application/schemas/admin_upload_schemas.py` | Admin用DTO |
| `app/application/use_cases/admin_upload_usecase.py` | Admin入稿管理ユースケース |
| `app/presentation/schemas/admin_upload_schemas.py` | リクエスト/レスポンススキーマ |
| `app/presentation/api/admin_upload_api.py` | APIエンドポイント |
| `app/di/admin_upload.py` | DI設定 |

### 修正

| ファイル | 修正内容 |
|----------|----------|
| `app/domain/repositories/upload_repository.py` | `get_all_paginated`, `count_all_by_filters`メソッド追加 |
| `app/infrastructure/db/repositories/upload_repository_impl.py` | 上記メソッドの実装追加 |
| `app/main.py` | `admin_upload_router`追加 |

---

## 機能詳細

### 1. 一覧取得

**GET** `/api/admin/uploads`

**クエリパラメータ:**

| パラメータ | 型 | 説明 |
|------------|-----|------|
| status | string | ステータスフィルタ（submitted/reviewing/approved/rejected） |
| user_id | int | ユーザーIDフィルタ |
| order_id | int | 注文IDフィルタ |
| date_from | datetime | 開始日 |
| date_to | datetime | 終了日 |
| limit | int | 取得件数（デフォルト20、最大100） |
| offset | int | オフセット |

**レスポンス:**
```json
{
  "uploads": [
    {
      "id": 1,
      "user_id": 23,
      "order_id": 27,
      "order_item_id": 36,
      "quantity_index": 1,
      "file_name": "logo.png",
      "s3_key": "uploads/user-23/xxx.png",
      "file_url": "https://cdn.example.com/uploads/user-23/xxx.png",
      "file_type": "image/png",
      "file_size": 102400,
      "upload_type": "logo",
      "text_content": null,
      "status": "submitted",
      "admin_notes": null,
      "reviewed_by": null,
      "reviewed_at": null,
      "created_at": "2026-01-11T03:44:58Z"
    }
  ],
  "total": 15,
  "limit": 20,
  "offset": 0
}
```

**備考:**
- 注文に紐付いたデータのみ取得（`order_id IS NOT NULL`）
- `created_at` 降順でソート

---

### 2. 詳細取得

**GET** `/api/admin/uploads/{id}`

**レスポンス:**
```json
{
  "upload": {
    "id": 1,
    "user_id": 23,
    "order_id": 27,
    ...
  }
}
```

---

### 3. 承認

**POST** `/api/admin/uploads/{id}/approve`

**リクエスト:**
```json
{
  "admin_notes": "問題なし、承認します"
}
```

**レスポンス:**
```json
{
  "upload": {
    "id": 5,
    "status": "approved",
    "admin_notes": "問題なし、承認します",
    "reviewed_by": 1,
    "reviewed_at": "2026-01-11T15:10:06Z",
    ...
  },
  "message": "入稿データを承認しました",
  "order_status_updated": true
}
```

**処理内容:**
1. `upload.status` を `approved` に更新
2. `admin_notes`, `reviewed_by`, `reviewed_at` を設定
3. 同一注文の全入稿が `approved` の場合、`order.status` を `confirmed` に更新

---

### 4. 差し戻し

**POST** `/api/admin/uploads/{id}/reject`

**リクエスト:**
```json
{
  "admin_notes": "画像が不鮮明です。高解像度の画像を再入稿してください。"
}
```

**レスポンス:**
```json
{
  "upload": {
    "id": 6,
    "status": "rejected",
    "admin_notes": "画像が不鮮明です。高解像度の画像を再入稿してください。",
    "reviewed_by": 1,
    "reviewed_at": "2026-01-11T15:10:28Z",
    ...
  },
  "message": "入稿データを差し戻しました",
  "order_status_updated": true
}
```

**処理内容:**
1. `upload.status` を `rejected` に更新
2. `admin_notes`（差し戻し理由・必須）, `reviewed_by`, `reviewed_at` を設定
3. `order.status` が `reviewing` の場合、`revision_required` に更新

---

## 注文ステータス連動

### 承認時

```
全入稿が approved → order.status = confirmed + confirmed_at 設定
```

### 差し戻し時

```
1つでも rejected → order.status = revision_required
```

### ステータス遷移図

```
order.status:
  reviewing → confirmed (全承認時)
  reviewing → revision_required (差し戻し時)
  revision_required → reviewing (ユーザー再入稿時)

upload.status:
  submitted → approved (承認)
  submitted → rejected (差し戻し)
  rejected → submitted (再入稿)
```

---

## テスト結果

| Endpoint | Method | Status | 結果 |
|----------|--------|--------|------|
| `/api/admin/uploads` | GET | 200 | 成功（一覧取得・フィルタ・ページネーション） |
| `/api/admin/uploads?status=submitted&limit=3` | GET | 200 | 成功（フィルタ付き） |
| `/api/admin/uploads/{id}` | GET | 200 | 成功（詳細取得） |
| `/api/admin/uploads/{id}/approve` | POST | 200 | 成功（承認 + order→confirmed） |
| `/api/admin/uploads/{id}/reject` | POST | 200 | 成功（差し戻し + order→revision_required） |

### テストで確認した注文ステータス変更

| 操作 | order_id | Before | After |
|------|----------|--------|-------|
| 承認（upload_id=5） | 30 | reviewing | confirmed |
| 差し戻し（upload_id=6） | 31 | reviewing | revision_required |

---

## セキュリティ

- Admin認証必須（Cookie認証）
- `get_current_admin_from_cookie` で認証チェック
- 審査時に `reviewed_by` に管理者IDを記録

---

## 次のステップ

1. **Frontend実装**
   - Admin入稿一覧画面（`/admin/uploads`）のAPI接続
   - Admin入稿詳細画面（`/admin/uploads/{id}`）の承認/差し戻しボタン実装
   - マイページ再入稿画面での `admin_notes`（差し戻し理由）表示

2. **通知機能**（将来実装）
   - 差し戻し時のメール通知
   - 全承認時の製作開始通知

---

## チェックリスト

| タスク | 状況 |
|--------|------|
| Admin用DTO（Application層） | [x] |
| Admin入稿管理ユースケース | [x] |
| リポジトリ拡張（get_all_paginated, count_all_by_filters） | [x] |
| リクエスト/レスポンススキーマ（Presentation層） | [x] |
| APIエンドポイント | [x] |
| DI設定 | [x] |
| main.py修正（ルーター登録） | [x] |
| Lintチェック | [x] |
| APIテスト | [x] |

---

## 関連ドキュメント

- 実装戦略書: `docs/tasks/public/strategy/15-upload-flow-improvement.md`
- 要件定義: `docs/requirements/21-data-upload-flow.md`
- 消費者向け入稿Backend: `docs/tasks/public/report/domain-divide-integration/45-upload-backend.md`
