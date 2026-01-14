import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Upload,
  Users,
  Shield,
  ScrollText,
  Settings,
} from 'lucide-react';

export const menuItems = [
  {
    label: 'ダッシュボード',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: '注文管理',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    label: '商品管理',
    href: '/admin/products',
    icon: Package,
  },
  {
    label: '入稿データ管理',
    href: '/admin/uploads',
    icon: Upload,
  },
  {
    label: '顧客管理',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: '管理者一覧',
    href: '/admin/admins',
    icon: Shield,
  },
  {
    label: '操作ログ',
    href: '/admin/logs',
    icon: ScrollText,
  },
  {
    label: 'サイト設定',
    href: '/admin/settings',
    icon: Settings,
  },
];
