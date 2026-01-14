import { Store, Building2, Heart, type LucideIcon } from 'lucide-react';

export interface TargetValue {
  icon: LucideIcon;
  target: string;
  title: string;
  description: string;
  products: string[];
}

export const targetValues: TargetValue[] = [
  {
    icon: Store,
    target: 'For Shop',
    title: 'ブランドを、可視化する。',
    description:
      '店舗の世界観を高めるQRスタンド、メニュー、ディスプレイ。お客様の五感に訴える「透明な重厚感」をお届けします。',
    products: ['QRコードキューブ', 'メニュースタンド', 'ディスプレイライザー'],
  },
  {
    icon: Building2,
    target: 'For Office',
    title: '空間の格を、上げる。',
    description:
      'エントランスサイン、表彰盾、ネームプレート。企業の品格を体現する、妥協のないオフィスプロダクト。',
    products: ['ウォールサイン', 'アワードトロフィー', 'ドアサイン'],
  },
  {
    icon: Heart,
    target: 'For You',
    title: '想いを、永遠に。',
    description:
      '結婚式、出産祝い、推し活。大切な瞬間を透明のなかに閉じ込める、あなただけの一品。',
    products: ['トレカディスプレイ', 'ウェディングボード', 'フォトフレーム'],
  },
];
