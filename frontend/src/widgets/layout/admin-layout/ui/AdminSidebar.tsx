'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
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
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { cn } from '@/shared/ui/shadcn/lib/utils';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { ScrollArea } from '@/shared/ui/shadcn/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/shadcn/ui/tooltip';
import { useAdminLogout } from '@/features/admin-domain/admin-auth/logout/lib/use-admin-logout';

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

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logoutMutation = useAdminLogout();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push('/admin/login');
      },
    });
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'flex h-screen flex-col border-r bg-card transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        {/* Logo & Toggle */}
        <div className='flex h-14 items-center justify-between border-b px-3'>
          {collapsed ? (
            <Button
              variant='ghost'
              size='icon'
              onClick={onToggle}
              className='mx-auto h-8 w-8'
            >
              <PanelLeft className='h-4 w-4' />
            </Button>
          ) : (
            <>
              <Link href='/admin' className='flex items-center'>
                <Image
                  src='/SVG/logo.svg'
                  alt='ACRIQUE'
                  width={100}
                  height={26}
                  className='h-6 w-auto'
                />
              </Link>
              <Button
                variant='ghost'
                size='icon'
                onClick={onToggle}
                className='h-8 w-8 shrink-0'
              >
                <PanelLeftClose className='h-4 w-4' />
              </Button>
            </>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className='flex-1 px-2 py-4'>
          <nav className='flex flex-col gap-1'>
            {menuItems.map((item) => {
              const button = (
                <Button
                  variant={isActive(item.href) ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full gap-3',
                    collapsed ? 'justify-center px-2' : 'justify-start',
                    isActive(item.href) && 'bg-secondary',
                  )}
                >
                  <item.icon className='h-4 w-4 shrink-0' />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link href={item.href}>{button}</Link>
                    </TooltipTrigger>
                    <TooltipContent side='right'>{item.label}</TooltipContent>
                  </Tooltip>
                );
              }

              return (
                <Link key={item.href} href={item.href}>
                  {button}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className='border-t p-2'>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='w-full text-muted-foreground hover:text-foreground'
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='right'>ログアウト</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant='ghost'
              className='w-full justify-start gap-3 text-muted-foreground hover:text-foreground'
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className='h-4 w-4' />
              {logoutMutation.isPending ? 'ログアウト中...' : 'ログアウト'}
            </Button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
