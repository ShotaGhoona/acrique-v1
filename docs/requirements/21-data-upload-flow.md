# データ入稿フロー 要件定義

## 概要

商品によっては、ロゴ・QRコード・写真等のデータ入稿が必要。
**入稿必要商品は、支払い前に入稿を完了させる必要がある。**

---

## 1. 入稿要否の判定

```mermaid
flowchart TD
    START[チェックアウト開始] --> CHECK{注文内に<br>requires_upload=true<br>の商品がある?}
    CHECK -->|No| NO_UPLOAD[入稿不要]
    CHECK -->|Yes| NEED_UPLOAD[入稿必要]

    NO_UPLOAD --> SKIP_UPLOAD[入稿画面スキップ]
    SKIP_UPLOAD --> PAYMENT[支払い画面へ]

    NEED_UPLOAD --> SHOW_UPLOAD[入稿画面表示]
    SHOW_UPLOAD --> COMPLETE{全数量分<br>入稿完了?}
    COMPLETE -->|Yes| PAYMENT
    COMPLETE -->|No| BLOCK[支払いに進めない]
```

---

## 2. 入稿画面での表示ロジック

```mermaid
flowchart TD
    START[入稿画面] --> LOOP[注文内の各商品をループ]

    LOOP --> CHECK{requires_upload<br>=true?}
    CHECK -->|No| SKIP[この商品はスキップ]
    CHECK -->|Yes| QTY{quantity > 1?}

    QTY -->|No| SINGLE[入稿エリア1つ表示]
    QTY -->|Yes| MULTI[数量分の入稿エリア表示<br>例: 3個なら3つ]

    SKIP --> NEXT[次の商品へ]
    SINGLE --> NEXT
    MULTI --> NEXT

    NEXT --> DONE{全商品<br>処理完了?}
    DONE -->|No| LOOP
    DONE -->|Yes| RENDER[画面レンダリング完了]
```

### 表示例

```
注文内容:
- 商品A（入稿必要）× 2個
- 商品B（入稿不要）× 1個
- 商品C（入稿必要）× 1個

入稿画面の表示:
┌─────────────────────────────┐
│ 商品A                        │
│ ├─ 1個目: [Dropzone]        │
│ └─ 2個目: [Dropzone]        │
├─────────────────────────────┤
│ 商品C                        │
│ └─ [Dropzone]               │
└─────────────────────────────┘
※商品Bは表示されない
```

---

## 3. チェックアウトフロー

```mermaid
flowchart TD
    START[チェックアウト開始] --> CREATE[注文作成<br>status: pending]
    CREATE --> HAS_UPLOAD{入稿必要な<br>商品がある?}

    HAS_UPLOAD -->|No| CONFIRM[確認画面へ]
    HAS_UPLOAD -->|Yes| UPLOAD_PAGE[入稿画面へ]

    UPLOAD_PAGE --> DO_UPLOAD[ファイルアップロード]
    DO_UPLOAD --> ALL_DONE{全数量分<br>入稿完了?}
    ALL_DONE -->|No| DO_UPLOAD
    ALL_DONE -->|Yes| PREVIEW[3Dプレビュー（今後実装）]
    PREVIEW --> CONFIRM

    CONFIRM --> PAYMENT[支払い処理]
    PAYMENT --> PAY_SUCCESS{支払い成功?}

    PAY_SUCCESS -->|No| PAY_FAIL[支払い失敗]
    PAY_SUCCESS -->|Yes| DETERMINE_STATUS[ステータス決定]

    DETERMINE_STATUS --> STATUS_CHECK{入稿必要な<br>商品がある?}
    STATUS_CHECK -->|Yes| REVIEWING[status: reviewing]
    STATUS_CHECK -->|No| CONFIRMED[status: confirmed]
```

**ポイント:**
- 入稿必要商品がある場合、全数量分の入稿が完了しないと支払いに進めない
- 支払い完了時点で入稿は完了している前提

---

## 4. マイページ再入稿フロー（差し戻し時のみ）

```mermaid
flowchart TD
    START[マイページ注文詳細] --> CHECK_STATUS{注文ステータス}

    CHECK_STATUS -->|revision_required| CAN_UPLOAD[再入稿ボタン表示]
    CHECK_STATUS -->|その他| NO_UPLOAD[再入稿ボタン非表示]

    CAN_UPLOAD --> UPLOAD_PAGE[再入稿画面へ]

    UPLOAD_PAGE --> SHOW_STATUS[各入稿スロットの状態表示]
    SHOW_STATUS --> SLOT_STATUS{スロットの状態}

    SLOT_STATUS -->|approved| APPROVED[ファイル表示<br>承認済み・変更不可]
    SLOT_STATUS -->|rejected| REJECTED[ファイル表示<br>差し戻し理由表示<br>再入稿可能]

    REJECTED --> DO_UPLOAD[ファイル再アップロード]
    DO_UPLOAD --> UPDATE_STATUS[注文ステータス更新]
    UPDATE_STATUS --> TO_REVIEWING[status: reviewing]
```

**ポイント:**
- マイページでの入稿は**差し戻し時のみ**発生
- 通常フローではチェックアウト時に入稿完了

---

## 5. Admin審査フロー

```mermaid
flowchart TD
    START[Admin: 入稿確認画面] --> LIST[注文の全入稿データ表示]
    LIST --> REVIEW[各入稿を審査]

    REVIEW --> ACTION{審査アクション}
    ACTION -->|承認| APPROVE[upload.status: approved]
    ACTION -->|差し戻し| REJECT[upload.status: rejected<br>理由入力必須]

    APPROVE --> CHECK_ALL{全入稿の状態}
    REJECT --> CHECK_ALL

    CHECK_ALL --> RESULT{判定}
    RESULT -->|全てapproved| ORDER_CONFIRMED[注文status: confirmed<br>製作開始可能]
    RESULT -->|1つでもrejected| ORDER_REVISION[注文status: revision_required<br>ユーザーに通知]
    RESULT -->|審査中のものあり| ORDER_REVIEWING[注文status: reviewing<br>継続審査]
```

---

## 6. 注文ステータス遷移図

```mermaid
stateDiagram-v2
    [*] --> pending: 注文作成（支払い前）

    pending --> confirmed: 支払い成功（入稿不要）
    pending --> reviewing: 支払い成功（入稿あり）

    reviewing --> confirmed: Admin全承認
    reviewing --> revision_required: Admin差し戻し

    revision_required --> reviewing: ユーザー再入稿

    confirmed --> processing: 製作開始
    processing --> shipped: 発送
    shipped --> delivered: 配達完了

    pending --> cancelled: キャンセル
```

### ステータス一覧

| ステータス | 意味 |
|-----------|------|
| `pending` | 支払い待ち（注文作成〜支払い完了） |
| `reviewing` | 入稿審査中（Admin確認待ち） |
| `revision_required` | 再入稿待ち（Admin差し戻し後） |
| `confirmed` | 製作待ち（審査完了 or 入稿不要） |
| `processing` | 製作中 |
| `shipped` | 発送済み |
| `delivered` | 完了 |
| `cancelled` | キャンセル |

---

## 7. 入稿データステータス遷移図

```mermaid
stateDiagram-v2
    [*] --> pending: アップロード完了

    pending --> submitted: 注文に紐付け
    pending --> [*]: 削除（紐付け前のみ）

    submitted --> reviewing: Admin審査開始
    reviewing --> approved: 承認
    reviewing --> rejected: 差し戻し

    rejected --> submitted: 再入稿

    approved --> [*]: 完了
```

---

## 8. エッジケース

### 8.1 Admin審査で一部差し戻し

```mermaid
flowchart LR
    A[3件の入稿<br>審査中] --> B{Admin審査}
    B -->|2件承認<br>1件差し戻し| C[注文status: revision_required]
    C --> D[ユーザーに通知<br>差し戻し理由表示]
    D --> E[差し戻し分を再入稿]
    E --> F[status: reviewing]
    F --> G[Admin再審査]
    G -->|全承認| H[status: confirmed]
```

---

## 9. DBスキーマ要件

### uploads テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | INT | PK |
| user_id | INT | FK → users |
| order_id | INT | FK → orders（紐付け後） |
| order_item_id | INT | FK → order_items（紐付け後） |
| quantity_index | INT | 何個目の入稿か（1始まり） |
| file_name | VARCHAR | ファイル名 |
| s3_key | VARCHAR | S3キー |
| file_url | VARCHAR | ファイルURL |
| file_type | VARCHAR | MIMEタイプ |
| file_size | INT | ファイルサイズ |
| upload_type | VARCHAR | logo / qr / photo / text |
| text_content | TEXT | テキスト入稿の場合 |
| status | VARCHAR | pending / submitted / reviewing / approved / rejected |
| admin_notes | TEXT | 差し戻し理由など |
| reviewed_by | INT | FK → admins |
| reviewed_at | TIMESTAMP | 審査日時 |
| created_at | TIMESTAMP | 作成日時 |

---

## 10. API要件

### 支払い成功時のステータス決定

```python
def determine_status_after_payment(order) -> OrderStatus:
    """支払い成功後のステータスを決定"""
    has_upload_required = any(
        get_product(item.product_id).requires_upload
        for item in order.items
    )

    if not has_upload_required:
        return OrderStatus.CONFIRMED  # 入稿不要 → 製作待ち

    # 入稿必要商品がある場合、支払い前に入稿完了済みなので
    return OrderStatus.REVIEWING  # 審査待ち
```

---

## 11. フロントエンド要件

### 入稿画面の状態管理

```typescript
interface UploadSlot {
  orderItemId: number;
  quantityIndex: number;  // 1, 2, 3...
  productName: string;
  uploadType: 'logo' | 'qr' | 'photo' | 'text';
  status: 'empty' | 'pending' | 'submitted' | 'approved' | 'rejected';
  upload?: Upload;  // 入稿済みの場合
}

// 表示用のスロット配列を生成
function generateUploadSlots(order: Order): UploadSlot[] {
  const slots: UploadSlot[] = [];

  for (const item of order.items) {
    if (!item.requires_upload) continue;

    for (let i = 1; i <= item.quantity; i++) {
      slots.push({
        orderItemId: item.id,
        quantityIndex: i,
        productName: item.product_name_ja || item.product_name,
        uploadType: getUploadType(item.product_name),
        status: 'empty',
        upload: findUpload(item.id, i),
      });
    }
  }

  return slots;
}
```

### チェックアウト時のバリデーション

```typescript
function canProceedToPayment(order: Order, uploads: Upload[]): boolean {
  for (const item of order.items) {
    if (!item.requires_upload) continue;

    // 各数量に対応する入稿があるかチェック
    for (let i = 1; i <= item.quantity; i++) {
      const hasUpload = uploads.some(
        u => u.orderItemId === item.id && u.quantityIndex === i
      );
      if (!hasUpload) return false;
    }
  }
  return true;
}
```

---

## 12. 通知要件

| イベント | 通知先 | 通知方法 |
|----------|--------|----------|
| 支払い完了（入稿あり） | Admin | メール / 管理画面通知 |
| 差し戻し | ユーザー | メール |
| 全承認 → 製作開始 | ユーザー | メール |

---

## 13. まとめ: 判定フローチャート

```mermaid
flowchart TD
    START[注文処理開始] --> Q1{入稿必要な商品<br>がある?}

    Q1 -->|No| A1[入稿画面スキップ]
    A1 --> A2[支払い成功後<br>→ confirmed]

    Q1 -->|Yes| B1[入稿画面表示]
    B1 --> B2[全数量分入稿完了<br>必須]
    B2 --> B3[3Dプレビュー]
    B3 --> B4[支払い]
    B4 --> B5[支払い成功後<br>→ reviewing]

    B5 --> ADMIN[Admin審査]

    ADMIN --> Q2{審査結果}
    Q2 -->|全承認| C1[→ confirmed<br>製作開始]
    Q2 -->|一部差し戻し| D1[→ revision_required<br>再入稿待ち]
    D1 --> D2[ユーザー再入稿]
    D2 --> D3[→ reviewing]
    D3 --> ADMIN
```
