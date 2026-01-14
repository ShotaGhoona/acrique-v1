import { Package, Building2, type LucideIcon } from 'lucide-react';

export interface CTAItem {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  linkText: string;
}

export const ctaItems: CTAItem[] = [
  {
    icon: Package,
    title: '個人のお客様',
    description: '1個からオーダー可能。大切な思い出を形に残しませんか。',
    href: '/you',
    linkText: '商品を見る',
  },
  {
    icon: Building2,
    title: '法人のお客様',
    description: '大口注文、特注デザインのご相談を承っております。',
    href: '/contact',
    linkText: 'お問い合わせ',
  },
];
