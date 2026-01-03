import type { Metadata } from 'next';

/**
 * 環境に応じたメタデータを生成
 */
export function generateMetadata(): Metadata {
  const environment = process.env.NODE_ENV;

  if (environment === 'development') {
    return {
      title: 'DEV - ACRIQUE',
      description: '極上のアクリルを、1個から。',
      robots: 'noindex, nofollow',
    };
  }

  if (environment === 'test') {
    return {
      title: 'TEST - ACRIQUE',
      description: 'test environment',
      robots: 'noindex',
    };
  }

  return {
    title: 'ACRIQUE - 極上のアクリルを、1個から。',
    description:
      '1cmの厚み、A2サイズ対応、精密なレーザーカット技術を駆使したハイエンドなアクリルプロダクト。店舗什器からオフィス看板、個人ギフトまで、1個からオーダー可能。',
    robots: 'index, follow',
    keywords: [
      'アクリル',
      'オーダーメイド',
      'レーザーカット',
      '店舗什器',
      '看板',
      'ギフト',
      '1個から',
    ],
    openGraph: {
      title: 'ACRIQUE - 極上のアクリルを、1個から。',
      description:
        '1cmの厚み、A2サイズ対応、精密なレーザーカット技術を駆使したハイエンドなアクリルプロダクト。',
      locale: 'ja_JP',
      type: 'website',
    },
  };
}

/**
 * 公開ページ用のメタデータを生成（アイコン付き）
 */
export function generatePublicMetadata(): Metadata {
  const baseMetadata = generateMetadata();

  return {
    ...baseMetadata,
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-icon.png',
    },
  };
}

/**
 * 認証済みユーザー用のメタデータを生成（アイコン付き）
 */
export function generateAuthenticatedMetadata(): Metadata {
  const baseMetadata = generateMetadata();

  return {
    ...baseMetadata,
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-icon.png',
    },
  };
}
