'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, MapPin, User, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/shared/ui/shadcn/lib/utils';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { useLogout } from '@/features/account-domain/auth/logout/lib/use-logout';
import { useMypageContext } from '@/shared/contexts/MypageContext';

const menuItems = [
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

export function MypageInnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const logoutMutation = useLogout();
  const { pageMeta } = useMypageContext();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Header */}
      <section className='border-b border-border bg-secondary/30 py-16 lg:py-20'>
        <div className='mx-auto max-w-7xl px-6 lg:px-12'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            My Page
          </p>
          <h1 className='mt-4 text-3xl font-light tracking-tight md:text-4xl'>
            {pageMeta.title}
          </h1>
          {pageMeta.description && (
            <p className='mt-3 text-muted-foreground'>{pageMeta.description}</p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className='mx-auto max-w-7xl px-6 py-12 lg:px-12 lg:py-16'>
        <div className='grid gap-12 lg:grid-cols-4 lg:gap-16'>
          {/* Sidebar Navigation */}
          <aside className='lg:col-span-1'>
            <nav className='sticky top-24 space-y-1'>
              {menuItems.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-sm px-4 py-3 text-sm transition-colors',
                      active
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                    )}
                  >
                    <item.icon className='h-4 w-4' />
                    <span>{item.label}</span>
                    {active && <ChevronRight className='ml-auto h-4 w-4' />}
                  </Link>
                );
              })}

              {/* Logout */}
              <div className='pt-6'>
                <Button
                  variant='ghost'
                  className='w-full justify-start gap-3 text-muted-foreground hover:text-foreground'
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className='h-4 w-4' />
                  {logoutMutation.isPending ? 'ログアウト中...' : 'ログアウト'}
                </Button>
              </div>
            </nav>
          </aside>

          {/* Page Content */}
          <main className='lg:col-span-3'>{children}</main>
        </div>
      </div>
    </div>
  );
}
