import { OrderDetailPage } from '@/page-components/mypage/OrderDetailPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailRoute({ params }: PageProps) {
  const { id } = await params;
  const orderId = parseInt(id, 10);

  if (isNaN(orderId)) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <p className='text-muted-foreground'>無効な注文IDです</p>
      </div>
    );
  }

  return <OrderDetailPage orderId={orderId} />;
}
