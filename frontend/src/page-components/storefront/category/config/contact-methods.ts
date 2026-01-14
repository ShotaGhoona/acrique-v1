import { Mail, Phone, MessageCircle, type LucideIcon } from 'lucide-react';
import { SITE_INFO } from '@/shared/config/site-info';

export interface ContactMethod {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
  href: string;
}

export const contactMethods: ContactMethod[] = [
  {
    icon: Mail,
    title: 'メールで相談',
    description: '24時間受付、翌営業日までにご返信',
    action: 'お問い合わせフォーム',
    href: '/contact',
  },
  {
    icon: Phone,
    title: '電話で相談',
    description: SITE_INFO.businessHours.displayShort,
    action: SITE_INFO.contact.phone,
    href: SITE_INFO.contact.phoneTel,
  },
  {
    icon: MessageCircle,
    title: 'LINEで相談',
    description: 'お気軽にメッセージください',
    action: 'LINE公式アカウント',
    href: SITE_INFO.social.line,
  },
];
