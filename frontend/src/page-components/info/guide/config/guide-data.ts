import type { LucideIcon } from 'lucide-react';
import { Package, Upload, CreditCard, Truck, CheckCircle } from 'lucide-react';

export interface GuideStep {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface GuideFAQ {
  question: string;
  answer: string;
}

export const guideSteps: GuideStep[] = [
  {
    number: '01',
    icon: Package,
    title: '商品を選ぶ',
    description:
      'カテゴリーから用途に合った商品をお選びください。サイズやオプションを選択し、カートに追加します。',
  },
  {
    number: '02',
    icon: CreditCard,
    title: 'ご注文・お支払い',
    description:
      'カート内容を確認後、お届け先情報とお支払い方法を入力します。クレジットカードまたは銀行振込がご利用いただけます。',
  },
  {
    number: '03',
    icon: Upload,
    title: 'データ入稿',
    description:
      'ロゴやQRコードなど、製作に必要なデータをアップロードしてください。対応形式はAI、PDF、PNG、JPGです。',
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'データ確認',
    description:
      '弊社スタッフがデータを確認し、製作可能な状態かをチェックします。問題があればご連絡いたします。',
  },
  {
    number: '05',
    icon: Truck,
    title: '製作・発送',
    description:
      'データ確認後、製作に入ります。完成次第、追跡番号をお知らせし、丁寧に梱包してお届けします。',
  },
];

export const guideFAQs: GuideFAQ[] = [
  {
    question: '入稿データの形式は何に対応していますか？',
    answer:
      'AI（Adobe Illustrator）、PDF、PNG、JPG形式に対応しています。ベクターデータ（AI/PDF）の場合、より鮮明な仕上がりになります。',
  },
  {
    question: '納期はどのくらいですか？',
    answer:
      '商品によって異なりますが、データ確認完了後、通常5〜10営業日でお届けします。お急ぎの場合はお問い合わせください。',
  },
  {
    question: '大量注文の場合、割引はありますか？',
    answer:
      'はい、まとまった数量でのご注文は別途ご相談を承っております。お問い合わせフォームからご連絡ください。',
  },
  {
    question: '返品・交換はできますか？',
    answer:
      'オーダーメイド製品のため、お客様都合での返品・交換は承っておりません。不良品の場合は到着後7日以内にご連絡ください。',
  },
];
