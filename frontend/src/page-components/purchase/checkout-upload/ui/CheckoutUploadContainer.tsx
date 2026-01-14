'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  Upload,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { CheckoutUploadSkeleton } from './skeleton/CheckoutUploadSkeleton';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import { FileDropzone } from '@/widgets/purchase/dropzone/ui/FileDropzone';
import { useOrder } from '@/features/checkout-domain/order/get-order/lib/use-order';
import { useUploads } from '@/features/checkout-domain/upload/get-uploads/lib/use-uploads';
import { useDeleteUpload } from '@/features/checkout-domain/upload/delete-upload/lib/use-delete-upload';
import { useLinkUploads } from '@/features/checkout-domain/upload/link-uploads/lib/use-link-uploads';
import type { Upload as UploadEntity } from '@/entities/checkout-domain/upload/model/types';
import {
  getUploadTypeLabel,
  getUploadDescription,
} from '@/shared/domain/upload/model/types';
import type { SlotKey } from '../lib/types';
import {
  mapUploadType,
  createUploadSlots,
  countCompletedSlots,
  getUploadedFilesForSlot,
  groupSlotsByItem,
} from '../lib/upload-slot-utils';

export function CheckoutUploadContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { data: orderData, isLoading: isOrderLoading } = useOrder(
    orderId ? Number(orderId) : 0,
  );
  const { data: uploadsData, isLoading: isUploadsLoading } = useUploads();
  const { mutate: deleteUpload } = useDeleteUpload();
  const { mutateAsync: linkUploadsAsync, isPending: isLinking } =
    useLinkUploads();

  // スロットごとのアップロードIDを管理
  const [uploadedFileIds, setUploadedFileIds] = useState<
    Record<SlotKey, number[]>
  >({});

  const order = orderData?.order;
  const allUploads = uploadsData?.uploads ?? [];

  // 入稿が必要な商品のみをフィルタ
  const itemsRequiringUpload = useMemo(() => {
    if (!order) return [];
    return order.items.filter((item) => item.requires_upload);
  }, [order]);

  // 全スロットを生成（商品 × 数量）
  const uploadSlots = useMemo(
    () => createUploadSlots(itemsRequiringUpload),
    [itemsRequiringUpload],
  );

  // 入稿完了しているスロット数
  const completedSlotCount = useMemo(
    () => countCompletedSlots(uploadSlots, uploadedFileIds),
    [uploadSlots, uploadedFileIds],
  );

  // 全スロット入稿完了しているか
  const isAllUploadsComplete = completedSlotCount === uploadSlots.length;

  const handleUploadComplete = useCallback(
    (slotKey: SlotKey) => (upload: UploadEntity) => {
      setUploadedFileIds((prev) => ({
        ...prev,
        [slotKey]: [...(prev[slotKey] ?? []), upload.id],
      }));
    },
    [],
  );

  const handleFileRemove = useCallback(
    (slotKey: SlotKey) => (uploadId: number) => {
      deleteUpload(uploadId, {
        onSuccess: () => {
          setUploadedFileIds((prev) => ({
            ...prev,
            [slotKey]: (prev[slotKey] ?? []).filter((id) => id !== uploadId),
          }));
        },
      });
    },
    [deleteUpload],
  );

  const handleProceed = async () => {
    if (!order || !isAllUploadsComplete) return;

    try {
      // 各スロットのアップロードを紐付け
      for (const slot of uploadSlots) {
        const slotUploadIds = uploadedFileIds[slot.slotKey] ?? [];
        if (slotUploadIds.length === 0) continue;

        await linkUploadsAsync({
          orderId: order.id,
          itemId: slot.itemId,
          uploadIds: slotUploadIds,
          quantityIndex: slot.quantityIndex,
        });
      }

      router.push(`/checkout/confirm?orderId=${orderId}`);
    } catch {
      // エラーが発生しても確認画面へ遷移（サーバー側で後から修正可能）
      router.push(`/checkout/confirm?orderId=${orderId}`);
    }
  };

  if (!orderId) {
    router.push('/checkout');
    return null;
  }

  if (isOrderLoading || isUploadsLoading) {
    return <CheckoutUploadSkeleton />;
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

  // 入稿が必要な商品がない場合（通常はCheckoutContainerでスキップされる）
  if (itemsRequiringUpload.length === 0) {
    router.push(`/checkout/confirm?orderId=${orderId}`);
    return null;
  }

  // 商品ごとにグループ化して表示
  const groupedByItem = groupSlotsByItem(itemsRequiringUpload, uploadSlots);

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
        <Link
          href='/checkout'
          className='transition-colors hover:text-foreground'
        >
          購入手続き
        </Link>
        <ChevronRight className='h-3 w-3' />
        <span className='text-foreground'>データ入稿</span>
      </nav>

      {/* Page Header */}
      <div className='mb-8'>
        <h1 className='text-2xl font-light tracking-tight md:text-3xl'>
          データ入稿
        </h1>
        <p className='mt-2 text-muted-foreground'>
          入稿が必要な商品のデータをアップロードしてください
        </p>
      </div>

      <div className='grid gap-8 lg:grid-cols-3'>
        {/* Main Content */}
        <div className='space-y-8 lg:col-span-2'>
          {/* 商品ごとにセクション表示 */}
          {groupedByItem.map(({ item, slots }) => (
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
                    {item.quantity}個 ×{' '}
                    {getUploadTypeLabel(mapUploadType(item.upload_type))}
                    データ
                  </p>
                </div>
                <Badge variant='secondary' className='flex items-center gap-1'>
                  <Upload className='h-3 w-3' />
                  {
                    slots.filter(
                      (s) => (uploadedFileIds[s.slotKey]?.length ?? 0) > 0,
                    ).length
                  }
                  /{slots.length}
                </Badge>
              </div>

              {/* 数量分のスロットを表示 */}
              <div className='space-y-6'>
                {slots.map((slot) => {
                  const uploadedFiles = getUploadedFilesForSlot(
                    slot.slotKey,
                    uploadedFileIds,
                    allUploads,
                  );
                  const isSlotComplete = uploadedFiles.length > 0;

                  return (
                    <div
                      key={slot.slotKey}
                      className={`rounded-sm border p-4 ${
                        isSlotComplete
                          ? 'border-green-200 bg-green-50/50'
                          : 'border-border'
                      }`}
                    >
                      <div className='mb-3 flex items-center justify-between'>
                        <span className='font-medium'>
                          {item.quantity > 1
                            ? `${slot.quantityIndex}個目`
                            : '入稿データ'}
                        </span>
                        {isSlotComplete ? (
                          <span className='flex items-center gap-1 text-sm text-green-600'>
                            <CheckCircle2 className='h-4 w-4' />
                            入稿済み
                          </span>
                        ) : (
                          <span className='flex items-center gap-1 text-sm text-muted-foreground'>
                            <AlertCircle className='h-4 w-4' />
                            未入稿
                          </span>
                        )}
                      </div>
                      <FileDropzone
                        uploadType={slot.uploadType}
                        label={`${getUploadTypeLabel(slot.uploadType)}データ`}
                        description={getUploadDescription(slot.uploadType)}
                        onUploadComplete={handleUploadComplete(slot.slotKey)}
                        onFileRemove={handleFileRemove(slot.slotKey)}
                        uploadedFiles={uploadedFiles}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {/* Info Section */}
          <div className='flex items-start gap-3 rounded-sm bg-secondary/30 p-4'>
            <Info className='mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground' />
            <div className='text-sm text-muted-foreground'>
              <p className='font-medium text-foreground'>入稿データについて</p>
              <ul className='mt-2 space-y-1'>
                <li>すべての入稿が完了するまで次の画面に進めません</li>
                <li>データの確認後、製作を開始いたします</li>
                <li>
                  データに問題がある場合は、マイページから再入稿いただきます
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className='lg:sticky lg:top-24 lg:self-start'>
          <div className='rounded-sm border border-border bg-background p-6'>
            <h3 className='font-medium'>入稿状況</h3>

            <div className='mt-4 space-y-3'>
              {groupedByItem.map(({ item, slots }) => {
                const completedCount = slots.filter(
                  (s) => (uploadedFileIds[s.slotKey]?.length ?? 0) > 0,
                ).length;
                const isComplete = completedCount === slots.length;

                return (
                  <div
                    key={item.id}
                    className='flex items-center justify-between text-sm'
                  >
                    <span className='text-muted-foreground'>
                      {item.product_name_ja || item.product_name}
                    </span>
                    <span
                      className={
                        isComplete ? 'text-green-600' : 'text-amber-600'
                      }
                    >
                      {completedCount}/{slots.length}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className='mt-6 border-t border-border pt-6'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>入稿進捗</span>
                <span
                  className={`text-lg font-medium ${
                    isAllUploadsComplete ? 'text-green-600' : 'text-foreground'
                  }`}
                >
                  {completedSlotCount}/{uploadSlots.length}
                </span>
              </div>
              {!isAllUploadsComplete && (
                <p className='mt-2 text-xs text-amber-600'>
                  すべての入稿を完了してください
                </p>
              )}
            </div>

            <div className='mt-6'>
              <Button
                onClick={handleProceed}
                disabled={!isAllUploadsComplete || isLinking}
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
            </div>

            {!isAllUploadsComplete && (
              <p className='mt-4 text-center text-xs text-muted-foreground'>
                残り {uploadSlots.length - completedSlotCount}{' '}
                件の入稿が必要です
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
