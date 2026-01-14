import { Package, MapPin, User } from 'lucide-react';

export const menuItems = [
  {
    href: '/mypage',
    label: '概要',
    icon: User,
    exact: true,
  },
  {
    href: '/mypage/orders',
    label: '注文履歴',
    icon: Package,
  },
  {
    href: '/mypage/addresses',
    label: '配送先管理',
    icon: MapPin,
  },
  {
    href: '/mypage/profile',
    label: 'アカウント設定',
    icon: User,
  },
];
