'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Upload, Info } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import { CheckoutUploadSkeleton } from './skeleton/CheckoutUploadSkeleton';
import { UploadSlotCard } from './components/UploadSlotCard';
import { UploadProgressSidebar } from './components/UploadProgressSidebar';
import { useOrder } from '@/features/checkout-domain/order/get-order/lib/use-order';
import { useUploadFile } from '@/features/checkout-domain/upload/upload-file/lib/use-upload-file';
import { useDeleteUpload } from '@/features/checkout-domain/upload/delete-upload/lib/use-delete-upload';
import type { SlotKey, UploadRequiredItem, InputValue } from '../lib/types';
import {
  createUploadSlots,
  countCompletedSlots,
  groupSlotsByItem,
  getUploadLabel,
  isSlotComplete,
} from '../lib/upload-slot-utils';

export function CheckoutUploadContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { data: orderData, isLoading: isOrderLoading } = useOrder(
    orderId ? Number(orderId) : 0,
  );
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutate: deleteUpload } = useDeleteUpload();

  const [inputValues, setInputValues] = useState<Record<SlotKey, InputValue[]>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const order = orderData?.order;

  const itemsRequiringUpload = useMemo<UploadRequiredItem[]>(() => {
    if (!order) return [];
    return order.items
      .filter((item) => item.upload_requirements !== null)
      .map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product_name: item.product_name,
        product_name_ja: item.product_name_ja,
        upload_requirements: item.upload_requirements,
      }));
  }, [order]);

  const uploadSlots = useMemo(
    () => createUploadSlots(itemsRequiringUpload),
    [itemsRequiringUpload],
  );

  const completedSlotCount = useMemo(
    () => countCompletedSlots(uploadSlots, inputValues),
    [uploadSlots, inputValues],
  );

  const isAllUploadsComplete = completedSlotCount === uploadSlots.length;

  const updateInputValue = useCallback(
    (
      slotKey: SlotKey,
      key: string,
      type: InputValue['type'],
      value: string,
      fileId?: number,
      fileName?: string,
    ) => {
      setInputValues((prev) => {
        const existing = prev[slotKey] ?? [];
        const filtered = existing.filter((v) => v.key !== key);
        return {
          ...prev,
          [slotKey]: [...filtered, { key, type, value, fileId, fileName }],
        };
      });
    },
    [],
  );

  const handleFileUpload = useCallback(
    async (slotKey: SlotKey, inputKey: string, file: File) => {
      const result = await uploadFile({ file });
      updateInputValue(
        slotKey,
        inputKey,
        'file',
        result.upload.file_url,
        result.upload.id,
        result.upload.file_name,
      );
    },
    [uploadFile, updateInputValue],
  );

  const handleFileRemove = useCallback(
    (slotKey: SlotKey, inputKey: string, fileId: number) => {
      deleteUpload(fileId, {
        onSuccess: () => {
          updateInputValue(slotKey, inputKey, 'file', '', undefined, undefined);
        },
      });
    },
    [deleteUpload, updateInputValue],
  );

  const handleProceed = async () => {
    if (!order || !isAllUploadsComplete) return;
    setIsSubmitting(true);

    try {
      router.push(`/checkout/confirm?orderId=${orderId}`);
    } catch {
      router.push(`/checkout/confirm?orderId=${orderId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!orderId) {
    router.push('/checkout');
    return null;
  }

  if (isOrderLoading) {
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

  if (itemsRequiringUpload.length === 0) {
    router.push(`/checkout/confirm?orderId=${orderId}`);
    return null;
  }

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
          入稿が必要な商品のデータを入力してください
        </p>
      </div>

      <div className='grid gap-8 lg:grid-cols-3'>
        {/* Main Content */}
        <div className='space-y-8 lg:col-span-2'>
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
                    {item.quantity}個 × {getUploadLabel(item)}
                  </p>
                </div>
                <Badge variant='secondary' className='flex items-center gap-1'>
                  <Upload className='h-3 w-3' />
                  {slots.filter((s) => isSlotComplete(s, inputValues)).length}/
                  {slots.length}
                </Badge>
              </div>

              <div className='space-y-6'>
                {slots.map((slot) => (
                  <UploadSlotCard
                    key={slot.slotKey}
                    slot={slot}
                    itemQuantity={item.quantity}
                    inputValues={inputValues}
                    onValueChange={updateInputValue}
                    onFileUpload={handleFileUpload}
                    onFileRemove={handleFileRemove}
                  />
                ))}
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
        <UploadProgressSidebar
          groupedByItem={groupedByItem}
          inputValues={inputValues}
          completedSlotCount={completedSlotCount}
          totalSlotCount={uploadSlots.length}
          isAllComplete={isAllUploadsComplete}
          isSubmitting={isSubmitting}
          onProceed={handleProceed}
        />
      </div>
    </div>
  );
}
