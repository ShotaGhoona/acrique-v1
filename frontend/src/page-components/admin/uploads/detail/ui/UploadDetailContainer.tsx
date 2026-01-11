'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  Check,
  X,
  FileText,
  Package,
  Loader2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import { Label } from '@/shared/ui/shadcn/ui/label';
import { Textarea } from '@/shared/ui/shadcn/ui/textarea';
import { AdminLayout } from '@/widgets/layout/admin-layout/ui/AdminLayout';
import { useAdminUpload } from '@/features/admin-upload/get-upload/lib/use-admin-upload';
import { useApproveUpload } from '@/features/admin-upload/approve-upload/lib/use-approve-upload';
import { useRejectUpload } from '@/features/admin-upload/reject-upload/lib/use-reject-upload';
import {
  UPLOAD_STATUS_LABELS,
  UPLOAD_STATUS_COLORS,
} from '@/shared/domain/upload/model/types';

interface UploadDetailContainerProps {
  uploadId: string;
}

function formatFileSize(bytes: number | null): string {
  if (bytes === null) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function UploadDetailContainer({
  uploadId,
}: UploadDetailContainerProps) {
  const router = useRouter();
  const uploadIdNum = parseInt(uploadId, 10);
  const { data, isLoading, error } = useAdminUpload(uploadIdNum);
  const approveUpload = useApproveUpload();
  const rejectUpload = useRejectUpload();

  const [adminNotes, setAdminNotes] = useState('');

  const upload = data?.upload;

  const handleApprove = async () => {
    if (!upload) return;
    try {
      await approveUpload.mutateAsync({
        uploadId: upload.id,
        data: { admin_notes: adminNotes || undefined },
      });
      router.push('/admin/uploads');
    } catch {
      alert('承認に失敗しました');
    }
  };

  const handleReject = async () => {
    if (!upload) return;
    if (!adminNotes.trim()) {
      alert('差し戻し理由を入力してください');
      return;
    }
    try {
      await rejectUpload.mutateAsync({
        uploadId: upload.id,
        data: { admin_notes: adminNotes },
      });
      router.push('/admin/uploads');
    } catch {
      alert('差し戻しに失敗しました');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title='入稿データ詳細'>
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      </AdminLayout>
    );
  }

  if (error || !upload) {
    return (
      <AdminLayout title='入稿データ詳細'>
        <div className='flex flex-col items-center justify-center py-12'>
          <p className='text-muted-foreground'>入稿データが見つかりません</p>
          <Link href='/admin/uploads' className='mt-4'>
            <Button variant='outline'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              一覧に戻る
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const isPending =
    upload.status === 'submitted' || upload.status === 'reviewing';
  const isProcessing = approveUpload.isPending || rejectUpload.isPending;

  return (
    <AdminLayout title={`入稿データ詳細: ${upload.id}`}>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <Link href='/admin/uploads'>
          <Button variant='outline' size='sm'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            一覧に戻る
          </Button>
        </Link>
        <Badge
          variant={UPLOAD_STATUS_COLORS[upload.status]}
          className='text-sm'
        >
          {UPLOAD_STATUS_LABELS[upload.status]}
        </Badge>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Main Content */}
        <div className='space-y-6 lg:col-span-2'>
          {/* File Preview */}
          <Card>
            <CardHeader className='flex flex-row items-center gap-2'>
              <FileText className='h-5 w-5' />
              <CardTitle>ファイル情報</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Preview Area */}
              <div className='mb-4 flex aspect-video items-center justify-center rounded-lg bg-muted'>
                {upload.file_type?.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={upload.file_url}
                    alt={upload.file_name}
                    className='max-h-full max-w-full object-contain'
                  />
                ) : (
                  <div className='text-center text-muted-foreground'>
                    <FileText className='mx-auto h-16 w-16' />
                    <p className='mt-2 text-sm'>プレビュー不可</p>
                    <p className='text-xs'>{upload.file_type ?? '-'}</p>
                  </div>
                )}
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <span className='text-sm text-muted-foreground'>
                    ファイル名
                  </span>
                  <p className='font-medium'>{upload.file_name}</p>
                </div>
                <div>
                  <span className='text-sm text-muted-foreground'>
                    ファイルサイズ
                  </span>
                  <p className='font-medium'>
                    {formatFileSize(upload.file_size)}
                  </p>
                </div>
                <div>
                  <span className='text-sm text-muted-foreground'>
                    ファイル形式
                  </span>
                  <p className='font-medium'>{upload.file_type ?? '-'}</p>
                </div>
                <div>
                  <span className='text-sm text-muted-foreground'>
                    アップロード日時
                  </span>
                  <p className='font-medium'>{formatDate(upload.created_at)}</p>
                </div>
              </div>

              <div className='mt-4'>
                <Button asChild>
                  <a
                    href={upload.file_url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Download className='mr-2 h-4 w-4' />
                    ファイルをダウンロード
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Review Section */}
          {isPending && (
            <Card>
              <CardHeader>
                <CardTitle>確認・審査</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='adminNotes'>確認コメント</Label>
                  <Textarea
                    id='adminNotes'
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder='確認結果やお客様へのメッセージを入力...（差し戻しの場合は必須）'
                    rows={4}
                  />
                </div>
                <div className='flex flex-wrap gap-2'>
                  <Button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className='bg-green-600 hover:bg-green-700'
                  >
                    {approveUpload.isPending ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <Check className='mr-2 h-4 w-4' />
                    )}
                    承認
                  </Button>
                  <Button
                    variant='destructive'
                    onClick={handleReject}
                    disabled={isProcessing}
                  >
                    {rejectUpload.isPending ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <X className='mr-2 h-4 w-4' />
                    )}
                    差し戻し
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Order Info */}
          <Card>
            <CardHeader className='flex flex-row items-center gap-2'>
              <Package className='h-5 w-5' />
              <CardTitle>注文情報</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div>
                <span className='text-sm text-muted-foreground'>注文ID</span>
                <p>
                  {upload.order_id ? (
                    <Link
                      href={`/admin/orders/${upload.order_id}`}
                      className='font-medium text-primary hover:underline'
                    >
                      {upload.order_id}
                    </Link>
                  ) : (
                    <span className='font-medium'>-</span>
                  )}
                </p>
              </div>
              {upload.order_item_id && (
                <div>
                  <span className='text-sm text-muted-foreground'>
                    注文明細ID
                  </span>
                  <p className='font-medium'>{upload.order_item_id}</p>
                </div>
              )}
              <div>
                <span className='text-sm text-muted-foreground'>
                  数量インデックス
                </span>
                <p className='font-medium'>{upload.quantity_index + 1}</p>
              </div>
            </CardContent>
          </Card>

          {/* Review History */}
          {upload.admin_notes && (
            <Card>
              <CardHeader>
                <CardTitle>過去の確認結果</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='rounded-md bg-muted p-3 text-sm'>
                  <p className='whitespace-pre-wrap'>{upload.admin_notes}</p>
                  {upload.reviewed_at && (
                    <p className='mt-2 text-xs text-muted-foreground'>
                      {formatDate(upload.reviewed_at)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
