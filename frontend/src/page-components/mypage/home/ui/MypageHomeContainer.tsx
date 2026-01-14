'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  MapPin,
  User,
  ArrowRight,
  Clock,
  Truck,
  CheckCircle,
} from 'lucide-react';
import { useMypageContext } from '@/shared/contexts/MypageContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import { useGetMe } from '@/features/account-domain/user/get-me/lib/use-get-me';
import { useOrders } from '@/features/checkout-domain/order/get-orders/lib/use-orders';
import { useAddresses } from '@/features/account-domain/address/get-addresses/lib/use-addresses';
import {
  OrderStatusSummarySkeleton,
  RecentOrdersSkeleton,
  AccountInfoSkeleton,
} from './skeleton/MypageHomeSkeleton';
import type {
  Order,
  OrderStatus,
} from '@/entities/checkout-domain/order/model/types';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VARIANTS,
  PROCESSING_STATUSES,
} from '@/shared/domain/order/model/types';

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

function QuickActionCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className='group block'>
      <Card className='h-full transition-colors hover:border-foreground/30'>
        <CardContent className='flex items-start gap-4 p-6'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary'>
            <Icon className='h-5 w-5 text-foreground/70' />
          </div>
          <div className='flex-1'>
            <h3 className='font-medium transition-colors group-hover:text-accent'>
              {title}
            </h3>
            <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
          </div>
          <ArrowRight className='h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1' />
        </CardContent>
      </Card>
    </Link>
  );
}

function RecentOrderItem({ order }: { order: Order }) {
  return (
    <Link
      href={`/mypage/orders/${order.id}`}
      className='group flex items-center justify-between border-b border-border py-4 last:border-0'
    >
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-3'>
          <span className='text-sm font-medium'>{order.order_number}</span>
          <Badge variant={ORDER_STATUS_VARIANTS[order.status]}>
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
        </div>
        <p className='mt-1 text-sm text-muted-foreground'>
          {formatDate(order.created_at)}
        </p>
      </div>
      <div className='flex items-center gap-4'>
        <span className='text-sm font-medium'>{formatPrice(order.total)}</span>
        <ArrowRight className='h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1' />
      </div>
    </Link>
  );
}

function OrderStatusSummary({ orders }: { orders: Order[] }) {
  const processing = orders.filter((o) =>
    PROCESSING_STATUSES.includes(o.status),
  ).length;
  const shipped = orders.filter((o) => o.status === 'shipped').length;
  const completed = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div className='grid grid-cols-3 gap-4'>
      <div className='rounded-sm border border-border p-4 text-center'>
        <Clock className='mx-auto h-5 w-5 text-muted-foreground' />
        <p className='mt-2 text-2xl font-light'>{processing}</p>
        <p className='text-xs text-muted-foreground'>処理中</p>
      </div>
      <div className='rounded-sm border border-border p-4 text-center'>
        <Truck className='mx-auto h-5 w-5 text-muted-foreground' />
        <p className='mt-2 text-2xl font-light'>{shipped}</p>
        <p className='text-xs text-muted-foreground'>配送中</p>
      </div>
      <div className='rounded-sm border border-border p-4 text-center'>
        <CheckCircle className='mx-auto h-5 w-5 text-muted-foreground' />
        <p className='mt-2 text-2xl font-light'>{completed}</p>
        <p className='text-xs text-muted-foreground'>完了</p>
      </div>
    </div>
  );
}

export function MypageDashboard() {
  const { setPageMeta } = useMypageContext();
  const { data: user, isLoading: userLoading } = useGetMe();
  const { data: ordersData, isLoading: ordersLoading } = useOrders({
    limit: 5,
  });
  const { data: addressesData, isLoading: addressesLoading } = useAddresses();

  const orders = ordersData?.orders ?? [];
  const addresses = addressesData?.addresses ?? [];
  const recentOrders = orders.slice(0, 3);

  useEffect(() => {
    setPageMeta({
      title: user?.name ? `${user.name}さん` : 'マイページ',
      description: 'ご注文状況の確認やアカウント情報の管理ができます',
    });
  }, [user?.name, setPageMeta]);

  return (
    <div className='space-y-8'>
      {/* Order Status Summary */}
      <section>
        <h2 className='mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground'>
          注文状況
        </h2>
        {ordersLoading ? (
          <OrderStatusSummarySkeleton />
        ) : (
          <OrderStatusSummary orders={orders} />
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className='mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground'>
          クイックアクセス
        </h2>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <QuickActionCard
            href='/mypage/orders'
            icon={Package}
            title='注文履歴'
            description={`${orders.length}件の注文`}
          />
          <QuickActionCard
            href='/mypage/addresses'
            icon={MapPin}
            title='配送先管理'
            description={`${addresses.length}件の配送先`}
          />
          <QuickActionCard
            href='/mypage/profile'
            icon={User}
            title='アカウント設定'
            description='プロフィール・パスワード変更'
          />
        </div>
      </section>

      {/* Recent Orders */}
      <section>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-sm font-medium uppercase tracking-wider text-muted-foreground'>
            最近の注文
          </h2>
          {orders.length > 0 && (
            <Link
              href='/mypage/orders'
              className='flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground'
            >
              すべて見る
              <ArrowRight className='h-3 w-3' />
            </Link>
          )}
        </div>

        <Card>
          <CardContent className='p-0'>
            {ordersLoading ? (
              <RecentOrdersSkeleton />
            ) : recentOrders.length > 0 ? (
              <div className='px-6'>
                {recentOrders.map((order) => (
                  <RecentOrderItem key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className='py-12 text-center'>
                <Package className='mx-auto h-10 w-10 text-muted-foreground/50' />
                <p className='mt-4 text-muted-foreground'>
                  注文履歴がありません
                </p>
                <Link
                  href='/'
                  className='mt-4 inline-flex items-center gap-1 text-sm text-accent transition-colors hover:underline'
                >
                  商品を探す
                  <ArrowRight className='h-3 w-3' />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Account Info */}
      <section>
        <h2 className='mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground'>
          アカウント情報
        </h2>
        <Card>
          <CardContent className='p-6'>
            {userLoading ? (
              <AccountInfoSkeleton />
            ) : (
              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <p className='text-xs text-muted-foreground'>お名前</p>
                  <p className='mt-1 font-medium'>{user?.name || '未設定'}</p>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    メールアドレス
                  </p>
                  <p className='mt-1 font-medium'>{user?.email}</p>
                </div>
                {user?.company && (
                  <div>
                    <p className='text-xs text-muted-foreground'>会社名</p>
                    <p className='mt-1 font-medium'>{user.company}</p>
                  </div>
                )}
                {user?.phone && (
                  <div>
                    <p className='text-xs text-muted-foreground'>電話番号</p>
                    <p className='mt-1 font-medium'>{user.phone}</p>
                  </div>
                )}
              </div>
            )}
            <div className='mt-6 border-t border-border pt-4'>
              <Link
                href='/mypage/profile'
                className='flex items-center gap-1 text-sm text-accent transition-colors hover:underline'
              >
                プロフィールを編集
                <ArrowRight className='h-3 w-3' />
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
