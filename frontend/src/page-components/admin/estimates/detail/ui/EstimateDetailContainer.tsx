'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Building, User, Package, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn/ui/card';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Label } from '@/shared/ui/shadcn/ui/label';
import { Textarea } from '@/shared/ui/shadcn/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/ui/select';
import { AdminLayout } from '@/widgets/admin-layout/ui/AdminLayout';
import {
  getEstimateById,
  estimateStatusLabels,
  estimateStatusColors,
  type EstimateStatus,
} from '../../dummy-data/estimates';

interface EstimateDetailContainerProps {
  estimateId: string;
}

export function EstimateDetailContainer({ estimateId }: EstimateDetailContainerProps) {
  const estimate = getEstimateById(estimateId);

  const [quotedAmount, setQuotedAmount] = useState(estimate?.quotedAmount?.toString() || '');
  const [validDays, setValidDays] = useState('14');
  const [note, setNote] = useState('');

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  if (!estimate) {
    return (
      <AdminLayout title="見積もり詳細">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">見積もりが見つかりません</p>
          <Link href="/admin/estimates" className="mt-4">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              一覧に戻る
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const handleSubmitQuote = () => {
    alert(`見積金額 ¥${quotedAmount} を送信（未実装）`);
    // TODO: API呼び出し
  };

  return (
    <AdminLayout title={`見積もり詳細: ${estimate.id}`}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/estimates">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Button>
        </Link>
        <Badge variant={estimateStatusColors[estimate.status]} className="text-sm">
          {estimateStatusLabels[estimate.status]}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Request Details */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Package className="h-5 w-5" />
              <CardTitle>依頼内容</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <span className="text-sm text-muted-foreground">商品種別</span>
                  <p className="font-medium">{estimate.productType}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">数量</span>
                  <p className="font-medium">{estimate.quantity}個</p>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">仕様・要望</span>
                <p className="mt-1 whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">
                  {estimate.specifications}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quote Response */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>見積回答</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="quotedAmount">見積金額（税抜）</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      ¥
                    </span>
                    <Input
                      id="quotedAmount"
                      type="number"
                      value={quotedAmount}
                      onChange={(e) => setQuotedAmount(e.target.value)}
                      className="pl-8"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validDays">有効期限</Label>
                  <Select value={validDays} onValueChange={setValidDays}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7日間</SelectItem>
                      <SelectItem value="14">14日間</SelectItem>
                      <SelectItem value="30">30日間</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">備考・コメント</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="お客様へのメッセージを入力..."
                  rows={4}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSubmitQuote} disabled={!quotedAmount}>
                  <Send className="mr-2 h-4 w-4" />
                  見積を送信
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Building className="h-5 w-5" />
              <CardTitle>会社情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">会社名</span>
                <p className="font-medium">{estimate.companyName}</p>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>担当者情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">氏名</span>
                <p className="font-medium">{estimate.customerName}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">メールアドレス</span>
                <p className="font-medium">{estimate.customerEmail}</p>
              </div>
            </CardContent>
          </Card>

          {/* Status Info */}
          <Card>
            <CardHeader>
              <CardTitle>ステータス情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">現在の見積金額</span>
                <span className="font-medium">{formatCurrency(estimate.quotedAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">依頼日</span>
                <span>{estimate.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">最終更新</span>
                <span>{estimate.updatedAt}</span>
              </div>
              {estimate.expiresAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">有効期限</span>
                  <span>{estimate.expiresAt}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Change */}
          <Card>
            <CardHeader>
              <CardTitle>ステータス変更</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                defaultValue={estimate.status}
                onValueChange={(value) =>
                  alert(`ステータスを「${estimateStatusLabels[value as EstimateStatus]}」に変更（未実装）`)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(estimateStatusLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
