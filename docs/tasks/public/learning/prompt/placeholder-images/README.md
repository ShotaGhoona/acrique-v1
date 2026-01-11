# 画像生成プロンプト作成ガイド

## 概要
このディレクトリには、ACRIQUEサイトで使用する画像生成用のプロンプトを管理します。

---

## プロンプト作成手順

### 1. 使用箇所の特定
```bash
# ImagePlaceholderを使用している箇所を検索
grep -r "ImagePlaceholder" frontend/src/
```

### 2. コンテキストの確認
対象のコンポーネントを読み、以下を把握する：
- **アスペクト比**: 16/9, 4/3, 4/5, 21/9 など
- **背景色**: 明るいセクション or 暗いセクション
- **オーバーレイ**: 文字が重なるか、透過処理があるか
- **周辺要素**: キャッチコピー、バッジ、キャプションなど

### 3. ブランドガイドラインの参照
必ず以下を確認：
- `docs/requirements/01-product-concept.md` - プロダクトコンセプト
- `docs/rules/design/design-system.md` - デザインシステム

**ACRIQUEのキーワード:**
- Luxury / Minimal / Solid / Transparency
- 透明感と重厚感の両立
- 1cm厚アクリル、レーザーカット、光の屈折

---

## プロンプト構成要素

### 必須項目

| 項目 | 説明 | 例 |
|------|------|-----|
| **Subject** | 被写体 | "thick crystal-clear acrylic block" |
| **Camera Angle** | カメラ位置 | "shot from 45-degree angle", "eye-level", "overhead view" |
| **Framing** | 構図・フレーミング | "close-up", "medium shot", "wide establishing shot" |
| **Lighting** | 照明の種類と方向 | "soft side lighting from left", "dramatic backlight" |
| **Background** | 背景 | "pure white seamless background", "dark gradient" |
| **Mood/Atmosphere** | 雰囲気 | "minimalist", "industrial", "ethereal" |
| **Technical** | 技術的指示 | "shallow depth of field", "high contrast" |

### 推奨項目

| 項目 | 説明 | 例 |
|------|------|-----|
| **Color Palette** | 色調指定 | "cool blue tones", "neutral grayscale" |
| **Composition Rule** | 構図ルール | "rule of thirds", "centered symmetrical" |
| **Reference Style** | 参考スタイル | "Apple product photography style" |
| **Negative Prompt** | 避けるもの | "no text, no logos, no people" |

---

## プロンプトテンプレート

```markdown
# [ページ名] - [画像の役割]

## 使用場所
- **ファイル**: `frontend/src/...`
- **用途**: 〇〇セクションの△△
- **アスペクト比**: X/Y
- **備考**: オーバーレイ有無、キャプション有無など

---

## 画像の意図
[この画像が伝えるべきメッセージ、ブランドとの関連性を2-3文で]

---

## 構図・イメージ詳細

### 被写体 (Subject)
- メイン: [主要な被写体]
- サブ: [背景や補助的要素]

### カメラ設定
- **アングル**: [正面 / 45度 / 俯瞰 / ローアングル など]
- **距離**: [クローズアップ / ミディアム / ワイド]
- **被写界深度**: [浅い(ボケ) / 深い(パンフォーカス)]

### 照明
- **種類**: [自然光 / スタジオ照明 / 環境光]
- **方向**: [サイドライト / バックライト / トップライト]
- **質感**: [ソフト / ハード / ドラマチック]

### 色調・雰囲気
- **色温度**: [暖色 / 寒色 / ニュートラル]
- **コントラスト**: [高 / 中 / 低]
- **全体の印象**: [ミニマル / インダストリアル / エレガント など]

---

## プロンプト

```
[英語プロンプト]
```

---

## ネガティブプロンプト（避けるもの）
- [テキスト、ロゴ、人物 など]

---

## 参考イメージ
- [参考となる写真スタイルやブランドの例]
```

---

## 命名規則

```
[番号]-[ページ]-[セクション]-[内容].md

例:
01-about-hero-background.md
02-about-craft-laser-cutter.md
03-home-hero-main-visual.md
```

---

## 生成後のファイル配置

```
frontend/public/IMG/[ページ名]/[内容]-v[バージョン].png

例:
frontend/public/IMG/about-page/hero-background-v1.png
frontend/public/IMG/about-page/hero-background-v2.png  # 改善版
```

---

## Tips

1. **一貫性を保つ**: 同じページ内の画像は統一感のある色調・スタイルで
2. **オーバーレイを考慮**: 文字が重なる場合は、その部分にシンプルな領域を確保
3. **アスペクト比厳守**: 指定比率に合わせた構図を意識
4. **具体的に書く**: 「美しい」ではなく「光が透過して虹色に屈折している」
5. **参考画像を添える**: 可能であれば参考URLやスタイル名を記載
