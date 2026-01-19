'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  Info,
  AlertCircle,
} from 'lucide-react';
import { useMypageContext } from '@/shared/contexts/MypageContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { OrderUploadSkeleton } from './skeleton/OrderUploadSkeleton';
import { UploadItemCard } from './components/UploadItemCard';
import { useOrder } from '@/features/checkout-domain/order/get-order/lib/use-order';
import { useUploadFile } from '@/features/checkout-domain/upload/upload-file/lib/use-upload-file';
import { useDeleteUpload } from '@/features/checkout-domain/upload/delete-upload/lib/use-delete-upload';
import { ORDER_STATUS_LABELS } from '@/shared/domain/order/model/types';
import { formatDate } from '@/shared/utils/format/date';
import { toast } from 'sonner';
import type { InputValue } from '@/widgets/purchase/requirements-input/ui/RequirementsInputWidget';

interface OrderUploadPageProps {
  orderId: number;
}

type SlotKey = `${number}-${number}`;

export function OrderUploadPage({ orderId }: OrderUploadPageProps) {
  const { setPageMeta } = useMypageContext();
  const router = useRouter();
  const {
    data: orderData,
    isLoading: isOrderLoading,
    error,
  } = useOrder(orderId);
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutate: deleteUpload } = useDeleteUpload();

  // スロットごと、入力キーごとの値を管理
  const [inputValues, setInputValues] = useState<
    Record<SlotKey, Record<string, InputValue>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const order = orderData?.order;
  const canUpload = order && order.status === 'revision_required';

  useEffect(() => {
    if (order) {
      setPageMeta({
        title: 'データ入稿',
        description: `注文番号: ${order.order_number}`,
      });
    } else if (isOrderLoading) {
      setPageMeta({
        title: 'データ入稿',
        description: '読み込み中...',
      });
    } else {
      setPageMeta({
        title: 'データ入稿',
        description: '',
      });
    }
  }, [order, isOrderLoading, setPageMeta]);

  // 入力値の更新
  const handleValueChange = useCallback(
    (
      slotKey: SlotKey,
      inputKey: string,
      value: string,
      fileId?: number,
      fileName?: string,
    ) => {
      setInputValues((prev) => ({
        ...prev,
        [slotKey]: {
          ...prev[slotKey],
          [inputKey]: {
            key: inputKey,
            type: fileId ? 'file' : 'text',
            value,
            fileId,
            fileName,
          } as InputValue,
        },
      }));
    },
    [],
  );

  // ファイルアップロード
  const handleFileUpload = useCallback(
    async (slotKey: SlotKey, inputKey: string, file: File) => {
      const result = await uploadFile({ file });
      handleValueChange(
        slotKey,
        inputKey,
        result.upload.file_url,
        result.upload.id,
        result.upload.file_name,
      );
    },
    [uploadFile, handleValueChange],
  );

  // ファイル削除
  const handleFileRemove = useCallback(
    (slotKey: SlotKey, inputKey: string, fileId: number) => {
      deleteUpload(fileId, {
        onSuccess: () => {
          handleValueChange(slotKey, inputKey, '', undefined, undefined);
        },
      });
    },
    [deleteUpload, handleValueChange],
  );

  // 入稿可能な商品
  const itemsRequiringUpload = useMemo(() => {
    if (!order) return [];
    return order.items.filter((item) => item.upload_requirements !== null);
  }, [order]);

  // 完了状態の確認
  const isAllComplete = useMemo(() => {
    return itemsRequiringUpload.every((item) => {
      const inputs = item.upload_requirements?.inputs ?? [];
      return Array.from({ length: item.quantity }, (_, i) => i + 1).every(
        (quantityIndex) => {
          const slotKey = `${item.id}-${quantityIndex}` as SlotKey;
          const slotValues = inputValues[slotKey] ?? {};
          return inputs.every((input) => {
            if (!input.required) return true;
            const value = slotValues[input.key];
            if (!value) return false;
            if (input.type === 'file') {
              return !!value.fileId;
            }
            return value.value && value.value.trim() !== '';
          });
        },
      );
    });
  }, [itemsRequiringUpload, inputValues]);

  const handleSubmit = async () => {
    if (!order || !isAllComplete) return;
    setIsSubmitting(true);

    try {
      // TODO: 入力値をバックエンドに送信する処理
      toast.success('入稿データを送信しました');
      router.push(`/mypage/orders/${orderId}`);
    } catch {
      toast.error('入稿データの送信に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOrderLoading) {
    return <OrderUploadSkeleton />;
  }

  if (error || !order) {
    return (
      <div className='rounded-sm border border-destructive/50 bg-destructive/10 p-8 text-center'>
        <AlertCircle className='mx-auto h-10 w-10 text-destructive' />
        <h3 className='mt-4 font-medium'>注文が見つかりません</h3>
        <p className='mt-2 text-sm text-muted-foreground'>
          注文情報を取得できませんでした
        </p>
        <Button asChild variant='outline' className='mt-6'>
          <Link href='/mypage/orders'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            注文履歴に戻る
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Back Link */}
      <Link
        href={`/mypage/orders/${orderId}`}
        className='inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
      >
        <ArrowLeft className='h-4 w-4' />
        注文詳細に戻る
      </Link>

      {/* Revision Required Alert */}
      {canUpload && (
        <div className='flex items-start gap-3 rounded-sm border-2 border-destructive bg-destructive/10 p-4'>
          <AlertCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-destructive' />
          <div className='text-sm'>
            <p className='font-medium text-destructive'>再入稿が必要です</p>
            <p className='mt-1 text-muted-foreground'>
              入稿いただいたデータに問題がありました。修正したデータを再度入力してください。
            </p>
          </div>
        </div>
      )}

      {/* Status Alert */}
      {!canUpload && (
        <div className='flex items-start gap-3 rounded-sm border border-border bg-secondary/30 p-4'>
          <Info className='mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground' />
          <div className='text-sm'>
            <p className='font-medium'>入稿を受け付けていません</p>
            <p className='mt-1 text-muted-foreground'>
              現在の注文ステータス（{ORDER_STATUS_LABELS[order.status]}
              ）では、入稿を受け付けておりません。
            </p>
          </div>
        </div>
      )}

      {/* Order Info */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-muted-foreground'>注文日</p>
              <p className='font-medium'>
                {formatDate(order.created_at, 'long')}
              </p>
            </div>
            <Badge variant={canUpload ? 'default' : 'secondary'}>
              {ORDER_STATUS_LABELS[order.status]}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Upload Sections */}
      {canUpload && (
        <>
          {itemsRequiringUpload.map((item) => (
            <UploadItemCard
              key={item.id}
              item={item}
              inputValues={inputValues}
              onValueChange={handleValueChange}
              onFileUpload={handleFileUpload}
              onFileRemove={handleFileRemove}
            />
          ))}

          {/* Info */}
          <div className='flex items-start gap-3 rounded-sm bg-secondary/30 p-4'>
            <Info className='mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground' />
            <div className='text-sm text-muted-foreground'>
              <p className='font-medium text-foreground'>入稿データについて</p>
              <ul className='mt-2 space-y-1'>
                <li>データの確認後、製作を開始いたします</li>
                <li>データに問題がある場合は、メールでご連絡いたします</li>
              </ul>
            </div>
          </div>

          {/* Submit */}
          <div className='flex items-center justify-between rounded-sm border border-border bg-background p-6'>
            <div>
              <p className='font-medium'>
                {isAllComplete
                  ? 'すべての入力が完了しました'
                  : '必要な情報を入力してください'}
              </p>
              <p className='mt-1 text-sm text-muted-foreground'>
                すべての入力を完了したら送信してください
              </p>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !isAllComplete}
              size='lg'
            >
              {isSubmitting ? (
                '送信中...'
              ) : (
                <>
                  <Upload className='mr-2 h-4 w-4' />
                  入稿データを送信
                </>
              )}
            </Button>
          </div>
        </>
      )}

      {/* Show message if not in upload mode */}
      {!canUpload && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>入稿状況</CardTitle>
          </CardHeader>
          <CardContent>
            {itemsRequiringUpload.map((item) => (
              <div
                key={item.id}
                className='border-b border-border py-4 last:border-0'
              >
                <h4 className='font-medium'>
                  {item.product_name_ja || item.product_name}
                </h4>
                <p className='mt-2 flex items-center gap-2 text-sm text-muted-foreground'>
                  <CheckCircle className='h-4 w-4 text-green-600' />
                  入稿済み
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
