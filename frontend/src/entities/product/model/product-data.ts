export interface ProductOption {
  id: string;
  name: string;
  values: {
    id: string;
    label: string;
    price?: string;
    description?: string;
  }[];
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductFeature {
  title: string;
  description: string;
}

export interface ProductDetail {
  id: string;
  categoryId: string;
  name: string;
  nameJa: string;
  tagline: string;
  description: string;
  longDescription: string;
  basePrice: string;
  priceNote: string;
  leadTime: string;
  specs: ProductSpec[];
  features: ProductFeature[];
  options: ProductOption[];
  faqs: ProductFAQ[];
  relatedProducts: string[];
}

// 商品詳細データ
export const productDetails: Record<string, ProductDetail> = {
  // For Shop
  'qr-cube': {
    id: 'qr-cube',
    categoryId: 'shop',
    name: 'QR Code Cube',
    nameJa: 'QRコードキューブ',
    tagline: 'あなたのQRを、アートに。',
    description:
      'Instagram、決済用QR、Wi-Fi案内など、あらゆるQRコードを高級感あるキューブに。',
    longDescription: `
      店舗のレジ横やテーブルに置くだけで、空間の格が上がる。
      QRコードという機能的なものを、インテリアとして昇華させたプロダクトです。

      裏面からのUV印刷により、QRコードは透明なアクリル越しに美しく見え、
      側面の鏡面仕上げが高級感を演出します。

      Instagram、PayPay・楽天ペイなどの決済QR、Wi-Fiパスワード、
      Google口コミへの誘導など、様々な用途にお使いいただけます。
    `,
    basePrice: '¥8,800',
    priceNote: 'サイズ・オプションにより変動',
    leadTime: '5営業日〜',
    specs: [
      { label: 'サイズ', value: '50mm / 60mm / 80mm 角' },
      { label: '厚み', value: '10mm / 15mm / 20mm（ブロック状）' },
      { label: '素材', value: 'アクリル（透明）' },
      { label: '印刷', value: 'UV印刷（裏面）' },
      { label: '仕上げ', value: '側面鏡面仕上げ' },
      { label: '付属品', value: '滑り止めシート' },
    ],
    features: [
      {
        title: '高級感のある佇まい',
        description:
          '10mm以上の厚みが生み出す重厚感。店舗の雰囲気を損なわず、むしろ格上げします。',
      },
      {
        title: 'スキャンしやすい設計',
        description:
          '適度な角度で自立し、お客様がスマホをかざしやすい高さを実現。',
      },
      {
        title: '長期間使える耐久性',
        description:
          'UV印刷は色褪せに強く、アクリル素材は割れにくい。長くお使いいただけます。',
      },
      {
        title: 'お手入れ簡単',
        description: '柔らかい布で拭くだけ。水洗いも可能で、清潔に保てます。',
      },
    ],
    options: [
      {
        id: 'size',
        name: 'サイズ',
        values: [
          {
            id: '50mm',
            label: '50mm角',
            price: '¥8,800',
            description: 'コンパクト',
          },
          {
            id: '60mm',
            label: '60mm角',
            price: '¥10,800',
            description: '標準サイズ',
          },
          {
            id: '80mm',
            label: '80mm角',
            price: '¥14,800',
            description: '存在感あり',
          },
        ],
      },
      {
        id: 'thickness',
        name: '厚み',
        values: [
          { id: '10mm', label: '10mm', description: 'スタンダード' },
          {
            id: '15mm',
            label: '15mm',
            price: '+¥2,000',
            description: 'おすすめ',
          },
          {
            id: '20mm',
            label: '20mm',
            price: '+¥4,000',
            description: 'ブロック状',
          },
        ],
      },
      {
        id: 'finish',
        name: '仕上げ',
        values: [
          { id: 'mirror', label: '鏡面仕上げ', description: '高級感' },
          {
            id: 'matte',
            label: 'マット仕上げ',
            price: '+¥1,000',
            description: '落ち着いた印象',
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'QRコードのデータはどのように入稿すればよいですか？',
        answer:
          'QRコードの画像データ（PNG/JPG）をお送りいただくか、リンク先URLをお知らせください。当方でQRコードを生成することも可能です。',
      },
      {
        question: '複数のQRコードを1つのキューブに入れられますか？',
        answer:
          '1面につき1つのQRコードとなります。複数面への印刷は別途ご相談ください。',
      },
      {
        question: '屋外でも使用できますか？',
        answer:
          '基本的に屋内使用を想定しています。直射日光や雨風にさらされる環境では、劣化が早まる可能性があります。',
      },
      {
        question: '追加注文は可能ですか？',
        answer:
          'はい、同じデザインでの追加注文を承っております。データは1年間保管しておりますので、お気軽にご連絡ください。',
      },
    ],
    relatedProducts: ['logo-cutout', 'price-tag', 'menu-stand'],
  },

  // For Office - Wall Sign
  'wall-sign': {
    id: 'wall-sign',
    categoryId: 'office',
    name: 'Floating Wall Sign',
    nameJa: 'フローティングウォールサイン',
    tagline: 'エントランスを、格上げする。',
    description:
      'エントランスを格上げする浮遊感のある社名サイン。化粧ビスで壁から浮かせることで、高級感と立体感を演出。',
    longDescription: `
      企業の顔となるエントランスサイン。
      壁から15mm〜30mm浮かせて設置することで、影が生まれ、立体感と高級感を演出します。

      透明アクリルに社名やロゴを配置することで、
      壁の素材感を活かしながら、ブランドを主張できます。

      付属の化粧ビス（ステンレス/真鍮から選択可）で、
      施工業者様でも簡単に設置いただけます。
    `,
    basePrice: '¥38,000',
    priceNote: 'A4サイズ・10mm厚の場合',
    leadTime: '7営業日〜',
    specs: [
      { label: 'サイズ', value: 'A4 / A3 / A2 / カスタム' },
      { label: '厚み', value: '5mm / 8mm / 10mm' },
      { label: '素材', value: 'アクリル（透明/乳白/黒）' },
      { label: '印刷/加工', value: 'UV印刷 / レーザー彫刻 / カッティング' },
      { label: '付属品', value: '化粧ビス一式 / 取付説明書' },
      { label: '浮かせ幅', value: '15mm / 20mm / 30mm' },
    ],
    features: [
      {
        title: '浮遊感のあるデザイン',
        description:
          '壁から浮かせることで影が生まれ、立体感と奥行きを演出。来訪者に印象的な第一印象を。',
      },
      {
        title: '壁素材を活かす透明感',
        description:
          'コンクリート、木、タイルなど、壁の素材感を活かしながらブランドを主張できます。',
      },
      {
        title: '選べる仕上げ',
        description:
          'UV印刷、レーザー彫刻、カッティングから、ブランドイメージに合った加工方法をお選びいただけます。',
      },
      {
        title: '設置も安心',
        description:
          '化粧ビス一式と詳細な取付説明書が付属。施工業者様への指示もスムーズです。',
      },
    ],
    options: [
      {
        id: 'size',
        name: 'サイズ',
        values: [
          { id: 'a4', label: 'A4 (210×297mm)', price: '¥38,000' },
          { id: 'a3', label: 'A3 (297×420mm)', price: '¥52,000' },
          { id: 'a2', label: 'A2 (420×594mm)', price: '¥78,000' },
          {
            id: 'custom',
            label: 'カスタムサイズ',
            description: '別途お見積もり',
          },
        ],
      },
      {
        id: 'material',
        name: '素材',
        values: [
          { id: 'clear', label: '透明アクリル', description: '壁が透ける' },
          {
            id: 'milky',
            label: '乳白アクリル',
            price: '+¥3,000',
            description: '柔らかい印象',
          },
          {
            id: 'black',
            label: '黒アクリル',
            price: '+¥3,000',
            description: 'シャープな印象',
          },
        ],
      },
      {
        id: 'process',
        name: '加工方法',
        values: [
          { id: 'uv', label: 'UV印刷', description: 'フルカラー対応' },
          { id: 'engrave', label: 'レーザー彫刻', description: '高級感' },
          { id: 'cutout', label: 'カッティング', description: 'ロゴ形状' },
        ],
      },
      {
        id: 'bolt',
        name: '化粧ビス',
        values: [
          { id: 'stainless', label: 'ステンレス', description: 'シルバー' },
          {
            id: 'brass',
            label: '真鍮',
            price: '+¥2,000',
            description: 'ゴールド',
          },
          {
            id: 'black',
            label: 'ブラック',
            price: '+¥1,000',
            description: 'マットブラック',
          },
        ],
      },
    ],
    faqs: [
      {
        question: '取り付け工事は依頼できますか？',
        answer:
          '申し訳ございませんが、取り付け工事は承っておりません。お近くの施工業者様へご依頼ください。詳細な取付説明書をお付けしておりますので、スムーズに設置いただけます。',
      },
      {
        question: 'ロゴデータはどのような形式で入稿すればよいですか？',
        answer:
          'AI（Illustrator）、EPS、PDF、SVGなどのベクターデータが最適です。JPG/PNGの場合は、解像度300dpi以上の高解像度データをご用意ください。',
      },
      {
        question: '屋外に設置できますか？',
        answer:
          '屋外対応オプション（+¥10,000〜）をご用意しております。UV耐性加工と防水処理を施します。ただし、直射日光が当たる場所での長期使用は推奨しておりません。',
      },
      {
        question: '複数枚の注文で割引はありますか？',
        answer:
          'はい、3枚以上のご注文で10%OFF、10枚以上で15%OFFとなります。複数拠点への設置などでご活用ください。',
      },
    ],
    relatedProducts: ['tombstones', 'door-sign', 'reception'],
  },

  // For You - Card Display
  'card-display': {
    id: 'card-display',
    categoryId: 'you',
    name: 'Trading Card Display',
    nameJa: 'トレカディスプレイ',
    tagline: '大切な1枚を、博物館レベルで。',
    description:
      'ポケカ、遊戯王、MTGなど、大切なカードを博物館レベルで展示。UVカットアクリルで日焼けからも守ります。',
    longDescription: `
      高額カード、思い出のカード、推しのカード。
      大切な1枚を、最高の状態で展示・保管するためのディスプレイケースです。

      3層構造のアクリルがカードを完全に包み込み、
      ホコリ、傷、そしてUVカットアクリルにより日焼けからも守ります。

      カード枠には繊細なレーザー彫刻で装飾を施し、
      まるで美術館の展示のような佇まいを実現しました。

      SNS映えする撮影にも最適。自慢のコレクションを、最高の形で披露してください。
    `,
    basePrice: '¥12,800',
    priceNote: 'スタンダードサイズ・UVカット仕様',
    leadTime: '5営業日〜',
    specs: [
      {
        label: '対応カードサイズ',
        value: 'スタンダード (63×88mm) / 日本サイズ (59×86mm)',
      },
      { label: '外寸', value: '約 100×130×15mm' },
      { label: '素材', value: 'アクリル（UVカット99%）' },
      { label: '構造', value: '3層構造（前面・中間・背面）' },
      { label: '総厚', value: '15mm以上' },
      { label: '付属品', value: 'スタンド / マイクロファイバークロス' },
    ],
    features: [
      {
        title: 'UVカット99%',
        description:
          '紫外線を99%カットし、大切なカードを日焼けから守ります。窓際に飾っても安心。',
      },
      {
        title: '3層構造で完全保護',
        description:
          'カードを3枚のアクリルで挟み込み、ホコリや傷から完全に保護します。',
      },
      {
        title: '美しい装飾彫刻',
        description:
          'カード枠にレーザー彫刻で繊細な装飾を施し、高級感を演出します。',
      },
      {
        title: 'スタンド付属',
        description:
          '縦置き・横置き両対応のスタンドが付属。デスクや棚に美しくディスプレイできます。',
      },
    ],
    options: [
      {
        id: 'card-size',
        name: 'カードサイズ',
        values: [
          {
            id: 'standard',
            label: 'スタンダード (63×88mm)',
            description: 'ポケカ・MTGなど',
          },
          {
            id: 'japanese',
            label: '日本サイズ (59×86mm)',
            description: '遊戯王など',
          },
          {
            id: 'oversized',
            label: 'オーバーサイズ',
            price: '+¥3,000',
            description: '大型カード',
          },
        ],
      },
      {
        id: 'uv-cut',
        name: 'UVカット',
        values: [
          { id: 'uv99', label: 'UVカット99%', description: '標準仕様' },
          {
            id: 'uv70',
            label: 'UVカット70%',
            price: '-¥2,000',
            description: 'コスト重視',
          },
        ],
      },
      {
        id: 'frame-design',
        name: 'フレームデザイン',
        values: [
          { id: 'classic', label: 'クラシック', description: '上品な装飾' },
          { id: 'minimal', label: 'ミニマル', description: 'シンプル' },
          {
            id: 'custom',
            label: 'カスタム',
            price: '+¥5,000',
            description: 'オリジナルデザイン',
          },
        ],
      },
      {
        id: 'stand',
        name: 'スタンド',
        values: [
          { id: 'clear', label: '透明', description: '標準付属' },
          { id: 'black', label: 'ブラック', price: '+¥500' },
          {
            id: 'wood',
            label: 'ウッド調',
            price: '+¥1,500',
            description: '高級感',
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'スリーブに入れたままでも入りますか？',
        answer:
          'インナースリーブ装着状態での収納を想定しています。厚手のスリーブやマグネットホルダーに入れた状態では入りませんのでご注意ください。',
      },
      {
        question: 'PSA鑑定済みカードは入りますか？',
        answer:
          'PSAケースサイズ対応のディスプレイも別途ご用意しております。お問い合わせください。',
      },
      {
        question: '複数枚セットでの割引はありますか？',
        answer:
          '3個以上のご注文で10%OFF、5個以上で15%OFF、10個以上で20%OFFとなります。コレクション展示にご活用ください。',
      },
      {
        question: 'カードの出し入れは簡単ですか？',
        answer:
          '3層構造の中間層を取り外してカードを交換できます。頻繁な入れ替えにも対応しています。',
      },
    ],
    relatedProducts: ['acrylic-stand', 'photo-frame', 'key-block'],
  },
};

// 商品詳細を取得
export function getProductDetail(productId: string): ProductDetail | undefined {
  return productDetails[productId];
}

// カテゴリ内の商品一覧を取得
export function getProductsByCategory(categoryId: string): ProductDetail[] {
  return Object.values(productDetails).filter(
    (product) => product.categoryId === categoryId,
  );
}

// 関連商品を取得
export function getRelatedProducts(productId: string): ProductDetail[] {
  const product = productDetails[productId];
  if (!product) return [];

  return product.relatedProducts
    .map((id) => productDetails[id])
    .filter((p): p is ProductDetail => p !== undefined);
}
