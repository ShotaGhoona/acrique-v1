'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Upload,
  Users,
  Shield,
  ScrollText,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/shared/ui/shadcn/lib/utils';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { ScrollArea } from '@/shared/ui/shadcn/ui/scroll-area';

const menuItems = [
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

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className='flex h-screen w-64 flex-col border-r bg-card'>
      {/* Logo */}
      <div className='flex h-16 items-center border-b px-6'>
        <Link href='/admin' className='flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground'>
            <Shield className='h-5 w-5' />
          </div>
          <span className='text-lg font-semibold tracking-tight'>ACRIQUE</span>
          <span className='rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground'>
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className='flex-1 px-3 py-4'>
        <nav className='flex flex-col gap-1'>
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  isActive(item.href) && 'bg-secondary',
                )}
              >
                <item.icon className='h-4 w-4' />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className='border-t p-3'>
        <Button
          variant='ghost'
          className='w-full justify-start gap-3 text-muted-foreground hover:text-foreground'
          onClick={() => alert('ログアウト（未実装）')}
        >
          <LogOut className='h-4 w-4' />
          ログアウト
        </Button>
      </div>
    </aside>
  );
}
