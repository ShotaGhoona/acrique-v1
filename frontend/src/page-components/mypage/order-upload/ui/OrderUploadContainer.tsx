'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  Info,
  AlertCircle,
} from 'lucide-react';
import { MypageLayout } from '@/widgets/layout/mypage-layout/ui/MypageLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';
import { FileDropzone } from '@/widgets/upload/dropzone/ui/FileDropzone';
import { useOrder } from '@/features/order/get-order/lib/use-order';
import { useUploads } from '@/features/upload/get-uploads/lib/use-uploads';
import { useDeleteUpload } from '@/features/upload/delete-upload/lib/use-delete-upload';
import { useLinkUploads } from '@/features/upload/link-uploads/lib/use-link-uploads';
import type { Upload as UploadEntity } from '@/entities/upload/model/types';
import { ORDER_STATUS_LABELS } from '@/shared/domain/order/model/types';
import {
  type UploadType,
  getUploadTypeLabel,
  getUploadDescription,
} from '@/shared/domain/upload/model/types';
import { toast } from 'sonner';

interface OrderUploadPageProps {
  orderId: number;
}

interface UploadedFile {
  id: number;
  file_name: string;
  file_url: string;
  upload_type: string | null;
  status?: string;
  quantity_index?: number;
  admin_notes?: string | null;
}

function getUploadTypeFromProduct(productName: string): UploadType {
  const lowerName = productName.toLowerCase();
  if (lowerName.includes('qr') || lowerName.includes('キューアール')) {
    return 'qr';
  }
  if (
    lowerName.includes('写真') ||
    lowerName.includes('photo') ||
    lowerName.includes('フォト')
  ) {
    return 'photo';
  }
  return 'logo';
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function OrderUploadPage({ orderId }: OrderUploadPageProps) {
  const router = useRouter();
  const {
    data: orderData,
    isLoading: isOrderLoading,
    error,
  } = useOrder(orderId);
  const { data: uploadsData, isLoading: isUploadsLoading } = useUploads();
  const { mutate: deleteUpload } = useDeleteUpload();
  const { mutate: linkUploads, isPending: isLinking } = useLinkUploads();

  const [uploadedFileIds, setUploadedFileIds] = useState<
    Record<number, number[]>
  >({});

  const order = orderData?.order;
  const allUploads = uploadsData?.uploads ?? [];

  const canUpload = order && order.status === 'revision_required';

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
        status: u.status,
      }));
  };

  const getExistingUploadsForItem = (itemId: number): UploadedFile[] => {
    return allUploads
      .filter((u) => u.order_item_id === itemId)
      .map((u) => ({
        id: u.id,
        file_name: u.file_name,
        file_url: u.file_url,
        upload_type: u.upload_type,
        status: u.status,
        quantity_index: u.quantity_index,
        admin_notes: u.admin_notes,
      }));
  };

  const totalNewUploadedCount = useMemo(() => {
    return Object.values(uploadedFileIds).reduce(
      (sum, ids) => sum + ids.length,
      0,
    );
  }, [uploadedFileIds]);

  const handleSubmit = () => {
    if (!order) return;

    const allUploadIds = Object.values(uploadedFileIds).flat();

    if (allUploadIds.length === 0) {
      toast.info('アップロードするファイルがありません');
      return;
    }

    const linkPromises = order.items.map((item) => {
      const itemUploadIds = uploadedFileIds[item.id] ?? [];
      if (itemUploadIds.length === 0) return Promise.resolve();

      // TODO: Phase 4で数量ベースの再入稿に対応
      return new Promise<void>((resolve, reject) => {
        linkUploads(
          {
            orderId: order.id,
            itemId: item.id,
            uploadIds: itemUploadIds,
            quantityIndex: 1,
          },
          { onSuccess: () => resolve(), onError: reject },
        );
      });
    });

    Promise.all(linkPromises)
      .then(() => {
        toast.success('入稿データを送信しました');
        router.push(`/mypage/orders/${orderId}`);
      })
      .catch(() => {
        toast.error('入稿データの送信に失敗しました');
      });
  };

  if (isOrderLoading || isUploadsLoading) {
    return (
      <MypageLayout title='データ入稿' description='読み込み中...'>
        <UploadSkeleton />
      </MypageLayout>
    );
  }

  if (error || !order) {
    return (
      <MypageLayout title='データ入稿' description=''>
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
      </MypageLayout>
    );
  }

  return (
    <MypageLayout
      title='データ入稿'
      description={`注文番号: ${order.order_number}`}
    >
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
                入稿いただいたデータに問題がありました。差し戻しされた項目を確認のうえ、修正したデータを再度アップロードしてください。
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
                <p className='font-medium'>{formatDate(order.created_at)}</p>
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
            {order.items.map((item) => {
              const uploadType = getUploadTypeFromProduct(item.product_name);
              const existingUploads = getExistingUploadsForItem(item.id);

              // quantity_indexごとにuploadを整理
              const uploadsByIndex: Record<number, UploadedFile | undefined> =
                {};
              existingUploads.forEach((u) => {
                const idx = u.quantity_index ?? 1;
                uploadsByIndex[idx] = u;
              });

              // 差し戻しがあるかどうか
              const hasRejected = existingUploads.some(
                (u) => u.status === 'rejected',
              );

              return (
                <Card key={item.id}>
                  <CardHeader>
                    <div className='flex items-start justify-between'>
                      <div>
                        <CardTitle className='text-lg'>
                          {item.product_name_ja || item.product_name}
                        </CardTitle>
                        <p className='mt-1 text-sm text-muted-foreground'>
                          数量: {item.quantity}
                        </p>
                      </div>
                      {!hasRejected && existingUploads.length > 0 && (
                        <Badge
                          variant='outline'
                          className='gap-1 border-green-600 text-green-600'
                        >
                          <CheckCircle className='h-3 w-3' />
                          すべて承認待ち
                        </Badge>
                      )}
                      {hasRejected && (
                        <Badge variant='destructive' className='gap-1'>
                          <AlertCircle className='h-3 w-3' />
                          再入稿が必要
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {/* 数量分のスロットを表示 */}
                    {Array.from({ length: item.quantity }, (_, i) => i + 1).map(
                      (quantityIndex) => {
                        const existingUpload = uploadsByIndex[quantityIndex];
                        const isRejected =
                          existingUpload?.status === 'rejected';
                        const isOk =
                          existingUpload &&
                          existingUpload.status !== 'rejected';
                        const newUploadsForSlot = getUploadedFilesForItem(
                          item.id,
                        ).filter((_, idx) => idx === quantityIndex - 1);

                        return (
                          <div
                            key={quantityIndex}
                            className='rounded-sm border border-border p-4'
                          >
                            <div className='mb-3 flex items-center justify-between'>
                              <p className='text-sm font-medium'>
                                {item.quantity > 1
                                  ? `${quantityIndex}個目`
                                  : '入稿データ'}
                              </p>
                              {isOk && (
                                <Badge
                                  variant='outline'
                                  className='gap-1 border-green-600 text-green-600'
                                >
                                  <CheckCircle className='h-3 w-3' />
                                  OK
                                </Badge>
                              )}
                              {isRejected && (
                                <Badge variant='destructive' className='gap-1'>
                                  <AlertCircle className='h-3 w-3' />
                                  差し戻し
                                </Badge>
                              )}
                            </div>

                            {/* OKの場合：ファイル情報のみ表示 */}
                            {isOk && existingUpload && (
                              <div className='flex items-center gap-3 rounded-sm border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900 dark:bg-green-950/20'>
                                <CheckCircle className='h-5 w-5 text-green-600' />
                                <div>
                                  <p className='text-sm font-medium'>
                                    {existingUpload.file_name}
                                  </p>
                                  <p className='text-xs text-muted-foreground'>
                                    再入稿不要
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* 差し戻しの場合：理由表示 + アップロードエリア */}
                            {isRejected && (
                              <>
                                {existingUpload?.admin_notes && (
                                  <div className='mb-3 rounded-sm border border-destructive/30 bg-destructive/5 p-3'>
                                    <p className='text-xs font-medium text-destructive'>
                                      差し戻し理由:
                                    </p>
                                    <p className='mt-1 text-sm text-muted-foreground'>
                                      {existingUpload.admin_notes}
                                    </p>
                                  </div>
                                )}
                                <FileDropzone
                                  uploadType={uploadType}
                                  label={`${uploadType === 'logo' ? 'ロゴ' : uploadType === 'qr' ? 'QRコード' : '写真'}データ`}
                                  description={getUploadDescription(uploadType)}
                                  onUploadComplete={handleUploadComplete(
                                    item.id,
                                  )}
                                  onFileRemove={handleFileRemove(item.id)}
                                  uploadedFiles={
                                    existingUpload
                                      ? [existingUpload, ...newUploadsForSlot]
                                      : newUploadsForSlot
                                  }
                                />
                              </>
                            )}

                            {/* 未入稿の場合（通常はないはず） */}
                            {!existingUpload && (
                              <FileDropzone
                                uploadType={uploadType}
                                label={`${uploadType === 'logo' ? 'ロゴ' : uploadType === 'qr' ? 'QRコード' : '写真'}データ`}
                                description={getUploadDescription(uploadType)}
                                onUploadComplete={handleUploadComplete(item.id)}
                                onFileRemove={handleFileRemove(item.id)}
                                uploadedFiles={newUploadsForSlot}
                              />
                            )}
                          </div>
                        );
                      },
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {/* Info */}
            <div className='flex items-start gap-3 rounded-sm bg-secondary/30 p-4'>
              <Info className='mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground' />
              <div className='text-sm text-muted-foreground'>
                <p className='font-medium text-foreground'>
                  入稿データについて
                </p>
                <ul className='mt-2 space-y-1'>
                  <li>データの確認後、製作を開始いたします</li>
                  <li>データに問題がある場合は、メールでご連絡いたします</li>
                  <li>
                    追加のデータがある場合は、再度アップロードしてください
                  </li>
                </ul>
              </div>
            </div>

            {/* Submit */}
            <div className='flex items-center justify-between rounded-sm border border-border bg-background p-6'>
              <div>
                <p className='font-medium'>
                  {totalNewUploadedCount > 0
                    ? `${totalNewUploadedCount}件の新しいファイルをアップロード済み`
                    : 'ファイルをアップロードしてください'}
                </p>
                <p className='mt-1 text-sm text-muted-foreground'>
                  すべてのファイルをアップロードしたら送信してください
                </p>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isLinking || totalNewUploadedCount === 0}
                size='lg'
              >
                {isLinking ? (
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

        {/* Show existing uploads if not in upload mode */}
        {!canUpload && (
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>入稿済みデータ</CardTitle>
            </CardHeader>
            <CardContent>
              {order.items.map((item) => {
                const existingUploads = getExistingUploadsForItem(item.id);

                return (
                  <div
                    key={item.id}
                    className='border-b border-border py-4 last:border-0'
                  >
                    <h4 className='font-medium'>
                      {item.product_name_ja || item.product_name}
                    </h4>
                    {existingUploads.length > 0 ? (
                      <ul className='mt-2 space-y-1'>
                        {existingUploads.map((upload) => (
                          <li
                            key={upload.id}
                            className='flex items-center gap-2 text-sm text-muted-foreground'
                          >
                            <CheckCircle className='h-4 w-4 text-green-600' />
                            {upload.file_name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className='mt-2 text-sm text-muted-foreground'>
                        入稿データなし
                      </p>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </MypageLayout>
  );
}

function UploadSkeleton() {
  return (
    <div className='space-y-8'>
      <Skeleton className='h-4 w-32' />
      <Skeleton className='h-24 w-full' />
      <Skeleton className='h-64 w-full' />
      <Skeleton className='h-64 w-full' />
    </div>
  );
}
