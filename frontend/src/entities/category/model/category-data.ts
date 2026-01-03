import {
  type CategoryId,
  type CategoryWithFeatures,
  getCategoryById,
  getAllCategories as getCategories,
  isValidCategoryId,
} from '@/shared/domain/category';

// 商品一覧用の簡易商品型
export interface Product {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  spec: string;
  price: string;
  href: string;
}

// Re-export
export type { UseCase } from '@/shared/domain/category';

// カテゴリページ用の複合型（カテゴリ + 商品一覧）
export interface CategoryData extends Omit<CategoryWithFeatures, 'name' | 'nameJa'> {
  title: string; // name の別名（UI互換性のため）
  products: Product[];
}

export const categoryData: Record<string, CategoryData> = {
  shop: {
    id: 'shop',
    title: 'For Shop',
    tagline: '世界観を、置く。',
    taglineEn: 'Place your world.',
    description: '店舗・サロン向けディスプレイアイテム',
    longDescription:
      '美容室、カフェ、ジュエリーショップ、高級飲食店など、世界観を大切にする店舗のために。既製品では表現できない、あなただけの空間演出をアクリルで実現します。',
    href: '/shop',
    products: [
      {
        id: 'qr-cube',
        name: 'QR Code Cube',
        nameJa: 'QRコードキューブ',
        description:
          'Instagram、決済用QR、Wi-Fi案内など、あらゆるQRコードを高級感あるキューブに。レジ横やテーブルに置くだけで、店舗の格が上がります。',
        spec: '50mm〜80mm角 / 10mm厚〜ブロック状',
        price: '¥8,800〜',
        href: '/shop/qr-cube',
      },
      {
        id: 'logo-cutout',
        name: 'Logo Cutout Object',
        nameJa: 'ロゴカットアウト',
        description:
          'あなたのブランドロゴをそのままの形で切り出し。受付やレジ横に置けば、一目でブランドが伝わります。',
        spec: '長辺100mm〜200mm / 10mm厚',
        price: '¥12,800〜',
        href: '/shop/logo-cutout',
      },
      {
        id: 'price-tag',
        name: 'Luxury Price Tag',
        nameJa: 'プライスタグ',
        description:
          'ジュエリーや時計など、高級商材にふさわしい重厚なプライスカード。商品の価値をさらに引き立てます。',
        spec: '名刺サイズ〜ハガキサイズ / 10mm厚',
        price: '¥3,800〜',
        href: '/shop/price-tag',
      },
      {
        id: 'menu-stand',
        name: 'Menu Stand',
        nameJa: 'メニュースタンド',
        description:
          'カフェやレストランのテーブルを彩るメニュースタンド。透明感が清潔さと高級感を演出します。',
        spec: 'A6〜A4サイズ / 5mm〜10mm厚',
        price: '¥6,800〜',
        href: '/shop/menu-stand',
      },
      {
        id: 'display-riser',
        name: 'Display Riser',
        nameJa: 'ディスプレイライザー',
        description:
          '商品を美しく見せる階段状のディスプレイ台。化粧品、アクセサリー、フィギュアなど様々な商品に対応。',
        spec: 'カスタムサイズ / 5mm〜15mm厚',
        price: '¥9,800〜',
        href: '/shop/display-riser',
      },
      {
        id: 'sign-holder',
        name: 'Sign Holder',
        nameJa: 'サインホルダー',
        description:
          'OPEN/CLOSED、予約席、撮影OKなど、店舗に必要な各種サインを高級感あるアクリルで。',
        spec: '各種サイズ / 8mm〜10mm厚',
        price: '¥4,800〜',
        href: '/shop/sign-holder',
      },
    ],
    useCases: [
      {
        id: 'beauty-salon',
        title: '美容室・サロン',
        description:
          'ロゴサインやメニュー表示で、お客様を迎える空間を演出。SNS映えする撮影スポットにも。',
        industry: 'Beauty',
      },
      {
        id: 'jewelry-shop',
        title: 'ジュエリーショップ',
        description:
          '高級感あるプライスタグとディスプレイで、商品の価値を最大限に引き出します。',
        industry: 'Retail',
      },
      {
        id: 'cafe-restaurant',
        title: 'カフェ・レストラン',
        description:
          'QRキューブでスマートな決済案内、メニュースタンドで清潔感のあるテーブル演出を。',
        industry: 'Food',
      },
      {
        id: 'boutique',
        title: 'アパレル・ブティック',
        description:
          'ブランドロゴのカットアウトで、店舗の世界観を強く印象づけます。',
        industry: 'Fashion',
      },
    ],
    features: [
      '店舗の世界観を損なわないミニマルデザイン',
      'UV印刷対応で鮮やかなカラー表現',
      '1個からのオーダーで試しやすい',
      '追加注文も同じクオリティで対応',
    ],
  },

  office: {
    id: 'office',
    title: 'For Office',
    tagline: '信頼を、刻む。',
    taglineEn: 'Engrave your trust.',
    description: 'オフィス・企業向けサイン・記念品',
    longDescription:
      'スタートアップから上場企業まで、ブランディングを重視する企業のために。エントランスサイン、成約記念盾、アワードなど、企業の信頼と実績を形にします。',
    href: '/office',
    products: [
      {
        id: 'wall-sign',
        name: 'Floating Wall Sign',
        nameJa: 'フローティングウォールサイン',
        description:
          'エントランスを格上げする浮遊感のある社名サイン。化粧ビスで壁から浮かせることで、高級感と立体感を演出。',
        spec: 'A4〜A2サイズ / 5mm〜10mm厚',
        price: '¥38,000〜',
        href: '/office/wall-sign',
      },
      {
        id: 'tombstones',
        name: 'Deal Tombstones',
        nameJa: '成約記念モニュメント',
        description:
          '上場記念、M&A成立、大型プロジェクト完了など、企業の節目を刻む記念盾。多層構造で立体的なデザインも可能。',
        spec: '自由形状 / 10mm厚〜積層',
        price: '¥28,000〜',
        href: '/office/tombstones',
      },
      {
        id: 'name-plate',
        name: 'Desk Name Plate',
        nameJa: '役員用ネームプレート',
        description:
          '社長室、役員デスクにふさわしい重厚なネームプレート。幾何学的なカッティングでモダンな印象に。',
        spec: '横長 / 15mm〜20mm厚',
        price: '¥18,000〜',
        href: '/office/name-plate',
      },
      {
        id: 'award',
        name: 'Award Trophy',
        nameJa: 'アワードトロフィー',
        description:
          '社内表彰、MVP、永年勤続など、従業員のモチベーションを高める美しいトロフィー。',
        spec: 'カスタムデザイン / 10mm〜20mm厚',
        price: '¥15,000〜',
        href: '/office/award',
      },
      {
        id: 'door-sign',
        name: 'Door Sign',
        nameJa: 'ドアサイン',
        description:
          '会議室、役員室、部署名など、オフィス内のサインを統一感あるデザインで。',
        spec: '各種サイズ / 5mm〜8mm厚',
        price: '¥8,800〜',
        href: '/office/door-sign',
      },
      {
        id: 'reception',
        name: 'Reception Sign',
        nameJa: 'レセプションサイン',
        description:
          '受付カウンターに設置するウェルカムサイン。来客の第一印象を決める重要なアイテム。',
        spec: 'カスタムサイズ / 10mm厚',
        price: '¥22,000〜',
        href: '/office/reception',
      },
    ],
    useCases: [
      {
        id: 'startup',
        title: 'スタートアップ',
        description:
          '成長フェーズに合わせた柔軟なオーダー。資金調達や上場の記念盾で、チームの結束を高めます。',
        industry: 'Tech',
      },
      {
        id: 'law-firm',
        title: '法律事務所・士業',
        description:
          '信頼と実績を示すエントランスサイン。クライアントに安心感を与える重厚なデザイン。',
        industry: 'Professional',
      },
      {
        id: 'financial',
        title: '金融・証券',
        description:
          'M&A成立、IPO、大型案件成約の記念盾。チームの功績を形に残します。',
        industry: 'Finance',
      },
      {
        id: 'design-agency',
        title: 'デザイン事務所',
        description:
          'クリエイティブな空間にふさわしいモダンなサイン。自社の美意識を体現します。',
        industry: 'Creative',
      },
    ],
    features: [
      '企業ブランドに合わせたカスタムデザイン',
      '大型サイン（A2まで）対応',
      '化粧ビス、取付金具も一式ご用意',
      '100個以上の大口注文も柔軟に対応',
    ],
  },

  you: {
    id: 'you',
    title: 'For You',
    tagline: '瞬間を、閉じ込める。',
    taglineEn: 'Capture your moment.',
    description: '個人・ギフト向けコレクションアイテム',
    longDescription:
      '推し活、コレクション、結婚式、出産祝いなど、人生の大切な瞬間を永遠に残すために。紙や木では実現できない、劣化せず美しく輝き続けるアクリルプロダクト。',
    href: '/you',
    products: [
      {
        id: 'card-display',
        name: 'Trading Card Display',
        nameJa: 'トレカディスプレイ',
        description:
          'ポケカ、遊戯王、MTGなど、大切なカードを博物館レベルで展示。UVカットアクリルで日焼けからも守ります。',
        spec: 'スタンダードサイズ対応 / 3層構造（総厚15mm以上）',
        price: '¥12,800〜',
        href: '/you/card-display',
      },
      {
        id: 'wedding-board',
        name: 'Wedding Welcome Board',
        nameJa: 'ウェディングボード',
        description:
          '透け感を活かしたエレガントなウェルカムボード。式の後もインテリアとして飾れます。',
        spec: 'A3〜A2サイズ / 5mm〜10mm厚',
        price: '¥25,000〜',
        href: '/you/wedding-board',
      },
      {
        id: 'baby-print',
        name: 'Baby Hand/Foot Print',
        nameJa: '手形足形アート',
        description:
          '赤ちゃんの手形・足形を実寸大でレーザー彫刻。出産祝い、内祝いに最適な一生の宝物。',
        spec: 'A4サイズ / 10mm厚',
        price: '¥18,000〜',
        href: '/you/baby-print',
      },
      {
        id: 'photo-frame',
        name: 'Acrylic Photo Frame',
        nameJa: 'アクリルフォトフレーム',
        description:
          '写真をアクリルに封入し、永遠に色褪せない思い出に。結婚式、家族写真、ペットの写真に。',
        spec: 'L判〜A4サイズ / 10mm〜20mm厚',
        price: '¥9,800〜',
        href: '/you/photo-frame',
      },
      {
        id: 'acrylic-stand',
        name: 'Acrylic Stand',
        nameJa: 'アクリルスタンド',
        description:
          '推しのイラストや写真をアクリルスタンドに。同人イベント、ファンアート展示に最適。',
        spec: 'カスタムサイズ / 3mm〜5mm厚',
        price: '¥2,800〜',
        href: '/you/acrylic-stand',
      },
      {
        id: 'key-block',
        name: 'Key Block',
        nameJa: 'キーブロック',
        description:
          '車の鍵、家の鍵など、大切な鍵を美しくディスプレイ。新車購入、新居祝いの記念に。',
        spec: '80mm〜100mm角 / 20mm厚',
        price: '¥8,800〜',
        href: '/you/key-block',
      },
    ],
    useCases: [
      {
        id: 'oshi-katsu',
        title: '推し活・コレクション',
        description:
          '大切なトレカやグッズを最高の状態で展示。SNS映えする撮影にも最適です。',
        industry: 'Hobby',
      },
      {
        id: 'wedding',
        title: 'ウェディング',
        description:
          'ウェルカムボードから席札まで、式場を華やかに彩るアクリルアイテム。',
        industry: 'Wedding',
      },
      {
        id: 'baby-gift',
        title: '出産祝い・内祝い',
        description:
          '手形足形アートは、贈る人も贈られる人も感動する特別なギフトです。',
        industry: 'Gift',
      },
      {
        id: 'memorial',
        title: '記念日・メモリアル',
        description:
          '結婚記念日、還暦祝い、ペットの思い出など、大切な瞬間を形に残します。',
        industry: 'Personal',
      },
    ],
    features: [
      '1個からオーダー可能で気軽に試せる',
      'UVカットアクリルで大切なものを守る',
      '写真データからも制作可能',
      'ギフトラッピング対応',
    ],
  },
};

export function getCategoryData(categoryId: string): CategoryData | undefined {
  return categoryData[categoryId];
}

export function getAllCategories(): CategoryData[] {
  return Object.values(categoryData);
}
