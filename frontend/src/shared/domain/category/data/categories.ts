/**
 * カテゴリ固定データ
 * 3種類のカテゴリをハードコーディング
 */

import type { CategoryId, CategoryWithFeatures } from '../model/types';

export const categories: Record<CategoryId, CategoryWithFeatures> = {
  shop: {
    id: 'shop',
    name: 'For Shop',
    nameJa: '店舗向け',
    tagline: '世界観を、置く。',
    taglineEn: 'Place your world.',
    description: '店舗・サロン向けディスプレイアイテム',
    longDescription:
      '美容室、カフェ、ジュエリーショップ、高級飲食店など、世界観を大切にする店舗のために。既製品では表現できない、あなただけの空間演出をアクリルで実現します。',
    href: '/shop',
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
    name: 'For Office',
    nameJa: 'オフィス向け',
    tagline: '信頼を、刻む。',
    taglineEn: 'Engrave your trust.',
    description: 'オフィス・企業向けサイン・記念品',
    longDescription:
      'スタートアップから上場企業まで、ブランディングを重視する企業のために。エントランスサイン、成約記念盾、アワードなど、企業の信頼と実績を形にします。',
    href: '/office',
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
    name: 'For You',
    nameJa: '個人向け',
    tagline: '瞬間を、閉じ込める。',
    taglineEn: 'Capture your moment.',
    description: '個人・ギフト向けコレクションアイテム',
    longDescription:
      '推し活、コレクション、結婚式、出産祝いなど、人生の大切な瞬間を永遠に残すために。紙や木では実現できない、劣化せず美しく輝き続けるアクリルプロダクト。',
    href: '/you',
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

// ヘルパー関数
export function getCategoryById(id: CategoryId): CategoryWithFeatures {
  return categories[id];
}

export function getAllCategories(): CategoryWithFeatures[] {
  return Object.values(categories);
}

export function getCategoryIds(): CategoryId[] {
  return ['shop', 'office', 'you'];
}

export function isValidCategoryId(id: string): id is CategoryId {
  return id === 'shop' || id === 'office' || id === 'you';
}
