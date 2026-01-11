# ACRIQUE Design System

## 1. デザイン哲学

### ブランドエッセンス
> 「透明な素材を、重厚なインテリアへ昇華させる」

ACRIQUEのデザインは、製品と同様に**透明感**と**重厚感**の両立を目指します。
過度な装飾を排し、余白と質感で高級感を演出します。

### デザインキーワード
- **Luxury** - 高級感、上質さ
- **Minimal** - 必要最小限、無駄のなさ
- **Solid** - 重厚感、確かな存在感
- **Transparency** - 透明感、清潔感

### デザイン原則

#### 1. Less is More（引き算の美学）
- 要素を増やすのではなく、削ぎ落とす
- 余白を恐れない。余白こそが高級感を生む
- 1画面で伝えるメッセージは1つに絞る

#### 2. Quality over Quantity（量より質）
- 画像は高品質なものを大きく使う
- テキストは厳選し、一文一文に重みを持たせる
- アニメーションは控えめに、必要な箇所にのみ

#### 3. Consistent Rhythm（一貫したリズム）
- セクション間の余白を統一する
- グリッドシステムを厳守する
- 色・フォント・サイズの種類を最小限に

---

## 2. カラーパレット

### Primary Colors

| 名前 | 用途 | HSL |
|------|------|-----|
| **Foreground** | テキスト、主要要素 | `0 0% 9%` (ほぼ黒) |
| **Background** | 背景 | `0 0% 100%` (白) |
| **Accent** | アクセント、リンク | `199 89% 48%` (Ice Blue) |

### Secondary Colors

| 名前 | 用途 | 透明度 |
|------|------|--------|
| **Muted** | サブテキスト | `foreground / 60%` |
| **Border** | 境界線 | `foreground / 10%` |
| **Secondary** | 背景のバリエーション | `foreground / 3%` |

### 使用ルール

```
テキスト階層:
- 見出し: foreground (100%)
- 本文: foreground/80
- サブテキスト: foreground/60 (muted-foreground)
- プレースホルダー: foreground/40

背景階層:
- メイン背景: background (白)
- セクション背景: secondary/30
- カード背景: background
- 反転セクション: foreground (黒)
```

---

## 3. タイポグラフィ

### フォントファミリー

```css
/* 和文・欧文共通 */
font-family: 'Noto Sans JP', sans-serif;

/* 将来的な拡張（高級感を増す場合） */
/* 欧文見出し: Didot, 'Times New Roman', serif */
/* 和文見出し: '筑紫明朝', '游明朝', serif */
```

### フォントサイズ

| 用途 | サイズ | Weight | Letter Spacing |
|------|--------|--------|----------------|
| Hero見出し | 4xl-7xl | light (300) | tight (-0.02em) |
| セクション見出し | 3xl-4xl | light (300) | tight |
| カード見出し | lg-xl | medium (500) | wide (0.02em) |
| 本文 | base-lg | normal (400) | normal |
| キャプション | xs-sm | medium (500) | wider (0.05em) |
| ラベル | xs | medium (500) | widest (0.1em) + uppercase |

### テキストスタイルパターン

```tsx
// セクションラベル（PRODUCTS, ABOUT など）
<p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">

// セクション見出し
<h2 className="text-3xl font-light md:text-4xl">

// タグライン（斜体）
<p className="text-sm italic text-accent">

// 本文
<p className="text-base leading-relaxed text-muted-foreground">
```

---

## 4. スペーシング

### セクション間余白

```
py-32 (128px) - 標準的なセクション間
py-24 (96px)  - コンパクトなセクション間
py-16 (64px)  - サブセクション間
```

### コンテナ幅

```
max-w-7xl (1280px) - メインコンテンツ
px-6 lg:px-12     - 左右パディング
```

### グリッドシステム

```
12カラムグリッド使用
gap-8  (32px) - 標準
gap-12 (48px) - ゆったり
gap-16 (64px) - 大きな要素間
```

---

## 5. コンポーネントパターン

### 画像プレースホルダー

```tsx
import { ImagePlaceholder } from '@/shared/ui/placeholder/ImagePlaceholder';

// バリエーション
<ImagePlaceholder aspect="16/9" variant="light" label="商品画像" />
<ImagePlaceholder aspect="1/1" variant="gradient" />
<ImagePlaceholder aspect="3/4" variant="dark" />
```

### ボタン

```tsx
// プライマリ（黒背景）
<Button size="lg" className="px-8">
  商品を見る
  <ArrowRight className="ml-2 h-4 w-4" />
</Button>

// セカンダリ（枠線のみ）
<Button variant="outline" size="lg" className="px-8">
  詳しく見る
</Button>

// ゴースト（背景なし）
<Button variant="ghost" size="icon">
  <Search className="h-4 w-4" />
</Button>
```

### カード

```tsx
// 商品カード
<Link href={href} className="group block">
  <div className="overflow-hidden rounded-sm">
    <ImagePlaceholder className="transition-transform duration-500 group-hover:scale-105" />
  </div>
  <div className="mt-4">
    <h4 className="text-sm font-medium tracking-wide transition-colors group-hover:text-accent">
      {name}
    </h4>
    <p className="mt-1 text-xs text-muted-foreground">{nameJa}</p>
  </div>
</Link>
```

### セクションヘッダー

```tsx
// 中央揃え
<div className="mb-20 text-center">
  <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
    Products
  </p>
  <h2 className="mt-6 text-3xl font-light md:text-4xl">
    あらゆるシーンに、アクリルの可能性を
  </h2>
  <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
    説明文...
  </p>
</div>

// 左揃え + リンク
<div className="flex items-end justify-between">
  <div>
    <p className="text-xs ...">Gallery</p>
    <h2 className="mt-6 text-3xl ...">導入事例</h2>
  </div>
  <Link href="/gallery" className="...">
    すべて見る <ArrowRight />
  </Link>
</div>
```

---

## 6. レイアウトパターン

### Hero セクション
```
- 最小高さ: min-h-[90vh]
- 2カラム: テキスト(左) + 画像(右)
- 信頼バッジ: 数値を強調（1cm / A2 / 1個〜）
- スクロールインジケーター: 画面下部中央
```

### コンテンツセクション
```
- 交互レイアウト: 画像とテキストを左右交互に
- sticky サイドバー: カテゴリ情報を固定
- グリッド: 2-3-4カラムのレスポンシブ
```

### 反転セクション
```
- 背景: bg-foreground
- テキスト: text-background
- アクセント: そのまま使用可
- 使用場面: Brand Story, CTA
```

---

## 7. インタラクション

### ホバーエフェクト

```css
/* 画像ズーム */
.group-hover:scale-105 transition-transform duration-500

/* テキスト色変化 */
.transition-colors .group-hover:text-accent

/* 下線アニメーション */
.absolute .h-px .w-0 .group-hover:w-full .transition-all

/* 矢印移動 */
.group-hover:translate-x-1 .transition-transform
```

### トランジション

```
duration-200  - UIフィードバック（ボタン、リンク）
duration-300  - 小さな要素（オーバーレイ、バッジ）
duration-500  - 大きな要素（画像、カード）
duration-700  - 印象的な動き（ギャラリー）
```

---

## 8. レスポンシブ設計

### ブレークポイント

```
sm: 640px   - モバイル横向き
md: 768px   - タブレット
lg: 1024px  - デスクトップ
xl: 1280px  - ワイドデスクトップ
```

### 基本方針

```
- モバイルファースト
- グリッド: 1col → 2col → 3-4col
- フォント: text-4xl → md:text-5xl → lg:text-6xl
- 余白: py-16 → py-24 → py-32
- ナビ: ハンバーガーメニュー → フルナビ (lg:)
```

---

## 9. アクセシビリティ

### 必須対応

```
- 画像: alt属性を必ず設定
- リンク: aria-label（アイコンのみの場合）
- コントラスト比: 4.5:1以上
- フォーカス: 視認可能なフォーカスリング
- セマンティクス: 適切なHTML要素を使用
```

### シート/モーダル

```tsx
<SheetTitle className="sr-only">メニュー</SheetTitle>
```

---

## 10. ファイル構造

### FSD (Feature-Sliced Design) 準拠

```
src/
├── app/                    # Next.js App Router（薄く保つ）
├── page-components/        # ページコンポーネント
│   └── home/
│       └── HomePage.tsx
├── widgets/                # 独立したUIブロック
│   ├── header/
│   ├── footer/
│   └── home/
│       └── ui/
│           ├── HeroSection.tsx
│           ├── BrandStorySection.tsx
│           └── ...
├── features/               # ビジネスロジック
├── entities/               # ドメインエンティティ
└── shared/                 # 共通ユーティリティ
    └── ui/
        ├── placeholder/
        │   └── ImagePlaceholder.tsx
        └── shadcn/
```

### 命名規則

```
- コンポーネント: PascalCase (HeroSection.tsx)
- ファイル: コンポーネント名と一致
- CSS: Tailwind CSS のみ使用
- index.ts: 禁止（直接インポート）
```

---

## 11. 禁止事項

1. **index.ts によるバレルエクスポート禁止**
2. **インラインスタイル禁止**（Tailwind使用）
3. **絵文字の使用禁止**（明示的に要求されない限り）
4. **過度なアニメーション禁止**
5. **原色の直接使用禁止**（パレット外の色）
6. **異なるフォントの混在禁止**

---

## 12. チェックリスト

### 新しいセクション作成時

- [ ] セクションラベル（英語・大文字・トラッキング広め）
- [ ] 見出し（font-light・大きめ）
- [ ] 適切な余白（py-32 推奨）
- [ ] max-w-7xl コンテナ
- [ ] レスポンシブ対応
- [ ] ホバーエフェクト
- [ ] アクセシビリティ

### 新しいページ作成時

- [ ] page-components に配置
- [ ] app/ は薄く（インポートのみ）
- [ ] セクション分割
- [ ] Header/Footer は layout で提供
- [ ] メタデータ設定
