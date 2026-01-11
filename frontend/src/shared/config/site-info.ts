/**
 * サイト全体で使用する運用情報
 * 連絡先・会社情報などを一元管理
 *
 * TODO: 本番運用時に実際の値に置き換えてください
 */
export const SITE_INFO = {
  // 会社情報
  company: {
    name: '株式会社ACRIQUE',
    nameShort: 'ACRIQUE',
    representative: '代表取締役 山田 太郎',
    representativeName: '山田 太郎',
  },

  // 連絡先
  contact: {
    phone: '03-1234-5678',
    phoneDisplay: '03-1234-5678（平日10:00〜18:00）',
    phoneTel: 'tel:03-1234-5678',
    email: 'info@acrique.com',
    privacyEmail: 'privacy@acrique.com',
  },

  // 住所
  address: {
    postalCode: '150-0001',
    full: '〒150-0001 東京都渋谷区神宮前1-2-3 ACRIQUEビル 5F',
    short: '〒150-0001 東京都渋谷区神宮前1-2-3',
  },

  // 営業時間
  businessHours: {
    display: '平日 10:00 - 18:00',
    displayShort: '平日 10:00-18:00',
    note: '土日祝日休業',
  },

  // 対応時間
  responseTime: {
    days: 2,
    text: '2営業日以内',
    emailNote: '2営業日以内に返信いたします',
  },

  // ウェブサイト
  website: {
    url: 'https://acrique.jp',
  },

  // SNS
  social: {
    instagram: 'https://instagram.com/acrique', // TODO: 実際のアカウントURLに変更
    instagramHandle: '@acrique', // TODO: 実際のハンドルに変更
    line: 'https://line.me/ti/p/xxxxx', // TODO: 実際のLINE公式アカウントURLに変更
  },

  // 配送
  shipping: {
    fee: 1000,
    feeDisplay: '全国一律1,000円（税込）',
    freeThreshold: 30000,
    freeThresholdNote: '※30,000円以上のご注文で送料無料',
  },
} as const;

// 型のエクスポート
export type SiteInfo = typeof SITE_INFO;
