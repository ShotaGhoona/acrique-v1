import type { Metadata } from 'next';
import { OrderUploadPage } from '@/page-components/mypage/order-upload/ui/OrderUploadContainer';

export const metadata: Metadata = {
  title: 'データ入稿 | ACRIQUE',
  description: '注文のデータ入稿',
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MypageOrderUploadPage({ params }: PageProps) {
  const resolvedParams = await params;
  const orderId = Number(resolvedParams.id);

  if (isNaN(orderId)) {
    return (
      <div className='mx-auto max-w-7xl px-6 py-12 lg:px-12'>
        <p>無効な注文IDです</p>
      </div>
    );
  }

  return <OrderUploadPage orderId={orderId} />;
}
