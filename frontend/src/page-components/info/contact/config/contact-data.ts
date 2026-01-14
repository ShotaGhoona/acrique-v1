import type { LucideIcon } from 'lucide-react';
import { MapPin, Clock, Mail, Building2 } from 'lucide-react';
import { SITE_INFO } from '@/shared/config/site-info';

export interface ContactInfoItem {
  icon: LucideIcon;
  title: string;
  content: string;
  note: string | null;
}

export const contactInfoItems: ContactInfoItem[] = [
  {
    icon: Building2,
    title: '運営会社',
    content: SITE_INFO.company.nameShort,
    note: null,
  },
  {
    icon: MapPin,
    title: '所在地',
    content: SITE_INFO.address.full,
    note: null,
  },
  {
    icon: Mail,
    title: 'メール',
    content: SITE_INFO.contact.email,
    note: SITE_INFO.responseTime.emailNote,
  },
  {
    icon: Clock,
    title: '営業時間',
    content: SITE_INFO.businessHours.display,
    note: SITE_INFO.businessHours.note,
  },
];
