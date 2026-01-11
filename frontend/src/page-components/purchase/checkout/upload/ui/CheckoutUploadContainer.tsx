'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Upload, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';
import { FileDropzone } from '@/widgets/upload/dropzone/ui/FileDropzone';
import { useOrder } from '@/features/order/get-order/lib/use-order';
import { useUploads } from '@/features/upload/get-uploads/lib/use-uploads';
import { useDeleteUpload } from '@/features/upload/delete-upload/lib/use-delete-upload';
import { useLinkUploads } from '@/features/upload/link-uploads/lib/use-link-uploads';
import type { Upload as UploadEntity, UploadType } from '@/entities/upload/model/types';

interface UploadedFile {
  id: number;
  file_name: string;
  file_url: string;
  upload_type: string | null;
}

function getUploadTypeFromProduct(productName: string): UploadType {
  const lowerName = productName.toLowerCase();
  if (lowerName.includes('qr') || lowerName.includes('キューアール')) {
    return 'qr';
  }
  if (lowerName.includes('写真') || lowerName.includes('photo') || lowerName.includes('フォト')) {
    return 'photo';
  }
  return 'logo';
}

function getUploadDescription(uploadType: UploadType): string {
  switch (uploadType) {
    case 'logo':
      return 'ロゴデータをアップロードしてください。AI, EPS, PDF, SVG, PNG形式に対応しています。';
    case 'qr':
      return 'QRコードの元となるURLまたは画像をアップロードしてください。';
    case 'photo':
      return '写真をアップロードしてください。300dpi以上の高解像度画像を推奨します。';
    default:
      return 'ファイルをアップロードしてください。';
  }
}

export function CheckoutUploadContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { data: orderData, isLoading: isOrderLoading } = useOrder(
    orderId ? Number(orderId) : 0,
  );
  const { data: uploadsData, isLoading: isUploadsLoading } = useUploads();
  const { mutate: deleteUpload } = useDeleteUpload();
  const { mutate: linkUploads, isPending: isLinking } = useLinkUploads();

  const [uploadedFileIds, setUploadedFileIds] = useState<Record<number, number[]>>({});

  const order = orderData?.order;
  const allUploads = uploadsData?.uploads ?? [];

  const handleUploadComplete = (itemId: number) => (upload: UploadEntity) => {
    setUploadedFileIds((prev) => ({
      ...prev,
      [itemId]: [...(prev[itemId] ?? []), upload.id],
    }));
  };

  const handleFileRemove = (itemId: number) => (uploadId: number) => {
    deleteUpload(uploadId, {
      onSuccess: () => {
        setUploadedFileIds((prev) => ({
          ...prev,
          [itemId]: (prev[itemId] ?? []).filter((id) => id !== uploadId),
        }));
      },
    });
  };

  const getUploadedFilesForItem = (itemId: number): UploadedFile[] => {
    const ids = uploadedFileIds[itemId] ?? [];
    return allUploads
      .filter((u) => ids.includes(u.id))
      .map((u) => ({
        id: u.id,
        file_name: u.file_name,
        file_url: u.file_url,
        upload_type: u.upload_type,
      }));
  };

  const totalUploadedCount = useMemo(() => {
    return Object.values(uploadedFileIds).reduce((sum, ids) => sum + ids.length, 0);
  }, [uploadedFileIds]);

  const handleProceed = () => {
    if (!order) return;

    const allUploadIds = Object.values(uploadedFileIds).flat();

    if (allUploadIds.length === 0) {
      router.push(`/checkout/confirm?orderId=${orderId}`);
      return;
    }

    const linkPromises = order.items.map((item) => {
      const itemUploadIds = uploadedFileIds[item.id] ?? [];
      if (itemUploadIds.length === 0) return Promise.resolve();

      return new Promise<void>((resolve, reject) => {
        linkUploads(
          { orderId: order.id, itemId: item.id, uploadIds: itemUploadIds },
          { onSuccess: () => resolve(), onError: reject },
        );
      });
    });

    Promise.all(linkPromises)
      .then(() => {
        router.push(`/checkout/confirm?orderId=${orderId}`);
      })
      .catch(() => {
        // Continue anyway
        router.push(`/checkout/confirm?orderId=${orderId}`);
      });
  };

  const handleSkip = () => {
    router.push(`/checkout/confirm?orderId=${orderId}`);
  };

  if (!orderId) {
    router.push('/checkout');
    return null;
  }

  if (isOrderLoading || isUploadsLoading) {
    return <UploadSkeleton />;
  }

  if (!order) {
    return (
      <div className='mx-auto max-w-7xl px-6 py-12 lg:px-12'>
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <p className='text-lg'>注文が見つかりません</p>
          <Button asChild className='mt-6'>
            <Link href='/checkout'>購入手続きに戻る</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-7xl px-6 py-12 lg:px-12'>
      {/* Breadcrumb */}
      <nav className='mb-8 flex items-center gap-2 text-xs text-muted-foreground'>
        <Link href='/' className='transition-colors hover:text-foreground'>
          Home
        </Link>
        <ChevronRight className='h-3 w-3' />
        <Link href='/cart' className='transition-colors hover:text-foreground'>
          カート
        </Link>
        <ChevronRight className='h-3 w-3' />
        <Link href='/checkout' className='transition-colors hover:text-foreground'>
          購入手続き
        </Link>
        <ChevronRight className='h-3 w-3' />
        <span className='text-foreground'>データ入稿</span>
      </nav>

      {/* Page Header */}
      <div className='mb-8'>
        <h1 className='text-2xl font-light tracking-tight md:text-3xl'>データ入稿</h1>
        <p className='mt-2 text-muted-foreground'>
          商品に使用するデータをアップロードしてください
        </p>
      </div>

      <div className='grid gap-8 lg:grid-cols-3'>
        {/* Main Content */}
        <div className='space-y-8 lg:col-span-2'>
          {/* Upload Sections for Each Item */}
          {order.items.map((item) => {
            const uploadType = getUploadTypeFromProduct(item.product_name);
            const uploadedFiles = getUploadedFilesForItem(item.id);

            return (
              <section
                key={item.id}
                className='rounded-sm border border-border bg-background p-6'
              >
                <div className='mb-6 flex items-start justify-between'>
                  <div>
                    <h2 className='text-lg font-medium'>
                      {item.product_name_ja || item.product_name}
                    </h2>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      数量: {item.quantity}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Upload className='h-5 w-5 text-muted-foreground' />
                  </div>
                </div>

                <FileDropzone
                  uploadType={uploadType}
                  label={`${uploadType === 'logo' ? 'ロゴ' : uploadType === 'qr' ? 'QRコード' : '写真'}データ`}
                  description={getUploadDescription(uploadType)}
                  onUploadComplete={handleUploadComplete(item.id)}
                  onFileRemove={handleFileRemove(item.id)}
                  uploadedFiles={uploadedFiles}
                />
              </section>
            );
          })}

          {/* Info Section */}
          <div className='flex items-start gap-3 rounded-sm bg-secondary/30 p-4'>
            <Info className='mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground' />
            <div className='text-sm text-muted-foreground'>
              <p className='font-medium text-foreground'>入稿データについて</p>
              <ul className='mt-2 space-y-1'>
                <li>入稿は注文後でも可能です</li>
                <li>データの確認後、製作を開始いたします</li>
                <li>データに問題がある場合は、メールでご連絡いたします</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className='lg:sticky lg:top-24 lg:self-start'>
          <div className='rounded-sm border border-border bg-background p-6'>
            <h3 className='font-medium'>入稿状況</h3>

            <div className='mt-4 space-y-3'>
              {order.items.map((item) => {
                const uploadedFiles = getUploadedFilesForItem(item.id);
                const hasUpload = uploadedFiles.length > 0;

                return (
                  <div
                    key={item.id}
                    className='flex items-center justify-between text-sm'
                  >
                    <span className='text-muted-foreground'>
                      {item.product_name_ja || item.product_name}
                    </span>
                    <span
                      className={hasUpload ? 'text-green-600' : 'text-muted-foreground'}
                    >
                      {hasUpload ? `${uploadedFiles.length}件` : '未入稿'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className='mt-6 border-t border-border pt-6'>
              <p className='text-sm text-muted-foreground'>
                合計 {totalUploadedCount} 件のファイルをアップロード済み
              </p>
            </div>

            <div className='mt-6 space-y-3'>
              <Button
                onClick={handleProceed}
                disabled={isLinking}
                className='w-full'
                size='lg'
              >
                {isLinking ? (
                  '処理中...'
                ) : (
                  <>
                    注文内容を確認する
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </>
                )}
              </Button>

              {totalUploadedCount === 0 && (
                <Button
                  variant='ghost'
                  onClick={handleSkip}
                  className='w-full text-muted-foreground'
                >
                  入稿をスキップして進む
                </Button>
              )}
            </div>

            <p className='mt-4 text-xs text-muted-foreground'>
              入稿は注文完了後、マイページからも可能です
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadSkeleton() {
  return (
    <div className='mx-auto max-w-7xl px-6 py-12 lg:px-12'>
      <Skeleton className='mb-8 h-4 w-64' />
      <Skeleton className='mb-2 h-8 w-32' />
      <Skeleton className='mb-8 h-4 w-48' />
      <div className='grid gap-8 lg:grid-cols-3'>
        <div className='space-y-8 lg:col-span-2'>
          <Skeleton className='h-64 w-full' />
          <Skeleton className='h-64 w-full' />
        </div>
        <Skeleton className='h-80 w-full' />
      </div>
    </div>
  );
}
