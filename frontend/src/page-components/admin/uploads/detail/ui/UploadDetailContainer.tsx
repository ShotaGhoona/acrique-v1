'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Check,
  X,
  RotateCcw,
  FileText,
  User,
  Package,
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
import {
  getUploadById,
  uploadStatusLabels,
  uploadStatusColors,
} from '../../home/dummy-data/uploads';

interface UploadDetailContainerProps {
  uploadId: string;
}

export function UploadDetailContainer({
  uploadId,
}: UploadDetailContainerProps) {
  const upload = getUploadById(uploadId);
  const [reviewNote, setReviewNote] = useState(upload?.reviewNote || '');

  if (!upload) {
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

  const handleApprove = () => {
    alert('承認しました（未実装）');
    // TODO: API呼び出し
  };

  const handleReject = () => {
    alert('却下しました（未実装）');
    // TODO: API呼び出し
  };

  const handleRequestRevision = () => {
    alert('修正依頼を送信しました（未実装）');
    // TODO: API呼び出し
  };

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
        <Badge variant={uploadStatusColors[upload.status]} className='text-sm'>
          {uploadStatusLabels[upload.status]}
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
                <div className='text-center text-muted-foreground'>
                  <FileText className='mx-auto h-16 w-16' />
                  <p className='mt-2 text-sm'>プレビュー不可</p>
                  <p className='text-xs'>{upload.fileType}</p>
                </div>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <span className='text-sm text-muted-foreground'>
                    ファイル名
                  </span>
                  <p className='font-medium'>{upload.fileName}</p>
                </div>
                <div>
                  <span className='text-sm text-muted-foreground'>
                    ファイルサイズ
                  </span>
                  <p className='font-medium'>{upload.fileSize}</p>
                </div>
                <div>
                  <span className='text-sm text-muted-foreground'>
                    ファイル形式
                  </span>
                  <p className='font-medium'>{upload.fileType}</p>
                </div>
                <div>
                  <span className='text-sm text-muted-foreground'>
                    アップロード日時
                  </span>
                  <p className='font-medium'>{upload.uploadedAt}</p>
                </div>
              </div>

              <div className='mt-4'>
                <Button
                  onClick={() =>
                    alert(`ダウンロード: ${upload.fileName}（未実装）`)
                  }
                >
                  <Download className='mr-2 h-4 w-4' />
                  ファイルをダウンロード
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Review Section */}
          <Card>
            <CardHeader>
              <CardTitle>確認・審査</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='reviewNote'>確認コメント</Label>
                <Textarea
                  id='reviewNote'
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder='確認結果やお客様へのメッセージを入力...'
                  rows={4}
                />
              </div>
              <div className='flex flex-wrap gap-2'>
                <Button
                  onClick={handleApprove}
                  className='bg-green-600 hover:bg-green-700'
                >
                  <Check className='mr-2 h-4 w-4' />
                  承認
                </Button>
                <Button variant='outline' onClick={handleRequestRevision}>
                  <RotateCcw className='mr-2 h-4 w-4' />
                  修正依頼
                </Button>
                <Button variant='destructive' onClick={handleReject}>
                  <X className='mr-2 h-4 w-4' />
                  却下
                </Button>
              </div>
            </CardContent>
          </Card>
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
                  <Link
                    href={`/admin/orders/${upload.orderId}`}
                    className='font-medium text-primary hover:underline'
                  >
                    {upload.orderId}
                  </Link>
                </p>
              </div>
              <div>
                <span className='text-sm text-muted-foreground'>商品名</span>
                <p className='font-medium'>{upload.productName}</p>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader className='flex flex-row items-center gap-2'>
              <User className='h-5 w-5' />
              <CardTitle>顧客情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <span className='text-sm text-muted-foreground'>氏名</span>
                <p className='font-medium'>{upload.customerName}</p>
              </div>
            </CardContent>
          </Card>

          {/* Review History */}
          {upload.reviewNote && (
            <Card>
              <CardHeader>
                <CardTitle>過去の確認結果</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='rounded-md bg-muted p-3 text-sm'>
                  <p className='whitespace-pre-wrap'>{upload.reviewNote}</p>
                  {upload.reviewedAt && (
                    <p className='mt-2 text-xs text-muted-foreground'>
                      {upload.reviewedAt}
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
