# Meta広告の手順

Instagram / Facebook に広告を出す具体的な手順を解説する。

---

## 1. Meta広告とは

### 配信先

```mermaid
graph TB
    META[Meta広告マネージャ]
    META --> FB[Facebook<br>フィード・ストーリーズ]
    META --> IG[Instagram<br>フィード・ストーリーズ・リール]
    META --> MSG[Messenger<br>受信箱]
    META --> AN[Audience Network<br>外部アプリ・サイト]
```

**1つの管理画面から4つの配信先に広告を出せる**

### ACRIQUEでの活用

| 配信先 | 用途 |
|--------|------|
| **Instagram** | メイン。ビジュアル訴求に最適 |
| Facebook | サブ。年齢層高めの経営者向け |
| Messenger | 使わない |
| Audience Network | 使わない（品質管理が難しい） |

---

## 2. アカウント構造

### 3層構造

```mermaid
graph TB
    subgraph アカウント
        subgraph キャンペーン1
            AS1[広告セット1]
            AS2[広告セット2]
            AS1 --> AD1[広告A]
            AS1 --> AD2[広告B]
            AS2 --> AD3[広告C]
        end
        subgraph キャンペーン2
            AS3[広告セット3]
            AS3 --> AD4[広告D]
        end
    end

    style AS1 fill:#e3f2fd
    style AS2 fill:#e3f2fd
    style AS3 fill:#e3f2fd
```

### 各層で設定すること

| 層 | 設定項目 | 具体例 |
|----|---------|--------|
| **キャンペーン** | 目的・全体予算 | 「コンバージョン獲得」「月30万円」 |
| **広告セット** | ターゲット・配置・予算・スケジュール | 「30-50歳女性」「Instagram」「日1万円」 |
| **広告** | クリエイティブ・テキスト・リンク | 画像、「1cmの厚みが〜」、ECサイトURL |

### 命名規則の例

```
キャンペーン: CV_ACRIQUE_ブランド認知_2025Q1
広告セット:  30-50歳_女性_興味インテリア
広告:        動画A_1cmの厚み訴求
```

---

## 3. 出稿手順

### 全体フロー

```mermaid
flowchart TD
    A[1. ビジネスマネージャ設定] --> B[2. 広告アカウント作成]
    B --> C[3. Metaピクセル設置]
    C --> D[4. キャンペーン作成]
    D --> E[5. 広告セット作成]
    E --> F[6. 広告作成]
    F --> G[7. 審査]
    G --> H[8. 配信開始]

    style C fill:#fff3e0
    style D fill:#e8f5e9
    style E fill:#e8f5e9
    style F fill:#e8f5e9
```

---

### Step 1: ビジネスマネージャ設定

**やること**: 会社としてのMeta広告アカウントを作る

```
URL: business.facebook.com
```

```mermaid
graph LR
    A[Facebookアカウント] --> B[ビジネスマネージャ作成]
    B --> C[ビジネス情報入力]
    C --> D[メール認証]
```

| 入力項目 | 例 |
|---------|-----|
| ビジネス名 | 株式会社グーナ |
| メールアドレス | ads@ghoona.co.jp |
| ビジネスの住所 | 東京都... |

---

### Step 2: 広告アカウント作成

**やること**: 実際に広告を出す「財布」を作る

```mermaid
graph LR
    A[ビジネスマネージャ] --> B[広告アカウント作成]
    B --> C[支払い方法設定<br>クレジットカード]
    C --> D[通貨設定<br>JPY]
```

| 設定項目 | 推奨 |
|---------|------|
| アカウント名 | ACRIQUE_広告 |
| タイムゾーン | 日本時間 |
| 通貨 | JPY（日本円） |

---

### Step 3: Metaピクセル設置

**やること**: サイト訪問者を追跡するコードを埋め込む

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Site as ECサイト
    participant Meta as Meta広告

    User->>Site: サイト訪問
    Site->>Meta: ピクセル発火（訪問通知）
    User->>Site: 商品をカートに追加
    Site->>Meta: イベント送信（AddToCart）
    User->>Site: 購入完了
    Site->>Meta: イベント送信（Purchase）
    Meta->>Meta: データ蓄積
    Meta->>User: 後日、リターゲティング広告表示
```

#### 標準イベント一覧

| イベント名 | 発火タイミング | 用途 |
|-----------|--------------|------|
| `PageView` | ページ閲覧 | 訪問者数計測 |
| `ViewContent` | 商品詳細閲覧 | 興味度計測 |
| `AddToCart` | カート追加 | 購入意欲の高いユーザー特定 |
| `InitiateCheckout` | 決済開始 | カート放棄の検知 |
| `Purchase` | 購入完了 | **コンバージョン計測**（最重要） |

#### 設置方法

```html
<!-- Metaピクセル基本コード（<head>内に設置） -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

```javascript
// 購入完了時（サンクスページで発火）
fbq('track', 'Purchase', {
  value: 30000,        // 購入金額
  currency: 'JPY'
});
```

---

### Step 4: キャンペーン作成

**やること**: 広告の「目的」を決める

```mermaid
graph TD
    Q{何を達成したい？}
    Q -->|ブランドを知ってほしい| A[認知度]
    Q -->|サイトに来てほしい| B[トラフィック]
    Q -->|購入してほしい| C[コンバージョン]
    Q -->|アプリをDLしてほしい| D[アプリ]

    C --> C1[ACRIQUEはこれ]
    style C1 fill:#c8e6c9
```

#### 管理画面での操作

```
広告マネージャ → [+作成] → キャンペーン目的を選択
```

| 選択肢 | 説明 | ACRIQUE |
|--------|------|---------|
| 認知度 | 多くの人に見せる | △ 初期は使う |
| トラフィック | サイト訪問を増やす | △ |
| エンゲージメント | いいね・コメントを増やす | × |
| リード | 問い合わせを増やす | △ BtoB用 |
| アプリの宣伝 | アプリDL | × |
| **売上** | 購入を増やす | **◎ メイン** |

#### 予算設定

```mermaid
graph LR
    A{予算タイプ}
    A -->|キャンペーン予算| B[全広告セットで自動配分<br>推奨]
    A -->|広告セット予算| C[各広告セットに個別設定]
```

| 設定 | 推奨値（初期） |
|------|--------------|
| 1日の予算 | 3,000〜10,000円 |
| 通算予算 | 月10〜30万円 |

---

### Step 5: 広告セット作成

**やること**: 「誰に」「いつ」「どこで」見せるか決める

#### ターゲティング設定

```mermaid
graph TB
    subgraph コアオーディエンス
        A1[地域: 日本]
        A2[年齢: 25-54歳]
        A3[性別: 全て]
        A4[興味関心: インテリア、デザイン]
    end

    subgraph カスタムオーディエンス
        B1[サイト訪問者]
        B2[購入者]
        B3[カート放棄者]
    end

    subgraph 類似オーディエンス
        C1[購入者に似た人]
    end
```

#### ACRIQUEのターゲット例

| ターゲット名 | 設定内容 |
|-------------|---------|
| **店舗オーナー** | 興味: 小売、店舗経営、ビジネス |
| **推し活層** | 興味: アイドル、アニメ、コレクション |
| **インテリア好き** | 興味: インテリアデザイン、北欧家具 |
| **リターゲティング** | 過去30日のサイト訪問者 |

#### 配置設定

```mermaid
graph TB
    A{配置選択}
    A -->|Advantage+配置| B[Meta が自動で最適化<br>推奨]
    A -->|手動配置| C[自分で選ぶ]

    C --> C1[Instagram フィード]
    C --> C2[Instagram ストーリーズ]
    C --> C3[Instagram リール]
    C --> C4[Facebook フィード]
```

| 配置 | 特徴 | ACRIQUE向き |
|------|------|------------|
| Instagramフィード | じっくり見てもらえる | ◎ |
| Instagramストーリーズ | 全画面で没入感 | ◎ |
| Instagramリール | 動画で訴求 | ◎ |
| Facebookフィード | 年齢層高め | ○ |

---

### Step 6: 広告作成

**やること**: 実際に表示する画像・動画・テキストを設定

#### クリエイティブの種類

```mermaid
graph LR
    subgraph フォーマット
        A[シングル画像]
        B[シングル動画]
        C[カルーセル<br>複数画像スワイプ]
        D[コレクション<br>カタログ形式]
    end

    B --> B1[ACRIQUEに最適<br>厚みの質感を動画で]
    style B1 fill:#c8e6c9
```

#### 入力項目

| 項目 | 説明 | ACRIQUE例 |
|------|------|----------|
| メディア | 画像 or 動画 | 1cmアクリルの動画 |
| メインテキスト | 投稿本文 | 「プロが選ぶ、1cmの存在感。」 |
| 見出し | 太字タイトル | 高級アクリル専門店 ACRIQUE |
| 説明 | 補足テキスト | 店舗什器からコレクションケースまで |
| CTA | ボタン文言 | 「詳しくはこちら」「購入する」 |
| リンク先URL | 遷移先 | https://acrique.jp/products/xxx |

#### クリエイティブの推奨サイズ

| 配置 | アスペクト比 | サイズ |
|------|------------|--------|
| フィード | 1:1 | 1080×1080px |
| ストーリーズ/リール | 9:16 | 1080×1920px |
| 動画の長さ | - | 15秒以内推奨 |

---

### Step 7-8: 審査と配信開始

```mermaid
sequenceDiagram
    participant You as あなた
    participant Meta as Meta
    participant User as ユーザー

    You->>Meta: 広告を公開
    Meta->>Meta: 自動審査（通常24時間以内）
    alt 審査OK
        Meta->>User: 広告配信開始
    else 審査NG
        Meta->>You: 却下通知（理由付き）
        You->>You: 修正して再申請
    end
```

#### よくある審査落ちの理由

| 理由 | 対策 |
|------|------|
| テキストが画像の20%以上 | 文字を減らす |
| 誇大広告（「絶対」「100%」） | 表現を控えめに |
| ビフォーアフター | 使用しない |
| 個人を特定する表現 | 「あなたは〇〇ですか？」を避ける |

---

## 4. 運用中の確認ポイント

### 管理画面で見る指標

```mermaid
graph TB
    subgraph 毎日チェック
        A1[インプレッション]
        A2[クリック数]
        A3[CTR]
        A4[CPC]
    end

    subgraph 週次チェック
        B1[コンバージョン数]
        B2[CPA]
        B3[ROAS]
    end

    subgraph 月次チェック
        C1[フリークエンシー<br>同じ人に何回見せたか]
        C2[オーディエンス消耗]
    end
```

### 改善アクション

| 状況 | 原因 | アクション |
|------|------|-----------|
| CTR低い（1%未満） | クリエイティブが弱い | 画像/動画を変更 |
| CPC高い（200円以上） | 競合が多い/ターゲット狭い | ターゲット拡大 |
| CVR低い（0.5%未満） | LP（着地ページ）が弱い | LP改善 |
| CPA高い | 上記全て | 総合的に見直し |
| フリークエンシー高い（5以上） | 同じ人に見せすぎ | オーディエンス変更 |

---

## 5. ACRIQUEの広告設定例

### キャンペーン構成案

```mermaid
graph TB
    subgraph キャンペーン: CV_ACRIQUE_2025Q1
        subgraph 広告セット1: 店舗オーナー
            AD1[動画: 店舗什器事例]
            AD2[画像: ビフォーアフター風]
        end
        subgraph 広告セット2: 推し活層
            AD3[動画: コレクションケース]
            AD4[カルーセル: 商品一覧]
        end
        subgraph 広告セット3: リターゲティング
            AD5[動画: 限定オファー]
        end
    end
```

### 初期設定の数値目標

| 指標 | 目標値 |
|------|--------|
| 日予算 | 5,000円 |
| CTR | 1%以上 |
| CPC | 100円以下 |
| CVR | 1%以上 |
| CPA | 10,000円以下 |

---

## 6. まとめ

### 出稿チェックリスト

- [ ] ビジネスマネージャ設定済み
- [ ] 広告アカウント作成済み
- [ ] Metaピクセル設置済み
- [ ] コンバージョンイベント設定済み（Purchase）
- [ ] キャンペーン目的 = 売上
- [ ] ターゲット設定済み
- [ ] クリエイティブ準備済み（画像/動画）
- [ ] 審査通過
- [ ] 配信開始

### 次のステップ

- [01-広告の基礎](./01-広告の基礎.md) - 基本概念に戻る
- [03-Google広告の手順](./03-Google広告の手順.md) - 検索広告の出し方
