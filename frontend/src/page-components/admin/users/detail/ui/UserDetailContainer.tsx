'use client';

import Link from 'next/link';
import { ArrowLeft, User, Building, Phone, Mail, ShoppingCart, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn/ui/card';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/ui/select';
import { AdminLayout } from '@/widgets/admin-layout/ui/AdminLayout';
import {
  getUserById,
  userStatusLabels,
  userStatusColors,
  type UserStatus,
} from '../../dummy-data/users';

interface UserDetailContainerProps {
  userId: string;
}

export function UserDetailContainer({ userId }: UserDetailContainerProps) {
  const user = getUserById(userId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  if (!user) {
    return (
      <AdminLayout title="顧客詳細">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">顧客が見つかりません</p>
          <Link href="/admin/users" className="mt-4">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              一覧に戻る
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`顧客詳細: ${user.name}`}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Button>
        </Link>
        <Badge variant={userStatusColors[user.status]} className="text-sm">
          {userStatusLabels[user.status]}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">氏名</span>
                    <p className="font-medium">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">メールアドレス</span>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">電話番号</span>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">会社名</span>
                    <p className="font-medium">{user.companyName || '-'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <CardTitle>注文履歴</CardTitle>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/orders?user=${user.id}`}>すべて見る</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center text-muted-foreground">
                注文履歴の表示（未実装）
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <CardTitle>購入統計</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">総注文数</span>
                <span className="text-2xl font-bold">{user.totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">累計購入額</span>
                <span className="text-2xl font-bold">{formatCurrency(user.totalSpent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">平均注文額</span>
                <span className="font-medium">
                  {user.totalOrders > 0
                    ? formatCurrency(user.totalSpent / user.totalOrders)
                    : '-'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>アカウント情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">登録日</span>
                <span>{user.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">最終ログイン</span>
                <span>{user.lastLoginAt}</span>
              </div>
            </CardContent>
          </Card>

          {/* Status Change */}
          <Card>
            <CardHeader>
              <CardTitle>ステータス変更</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                defaultValue={user.status}
                onValueChange={(value) =>
                  alert(`ステータスを「${userStatusLabels[value as UserStatus]}」に変更（未実装）`)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(userStatusLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="w-full" onClick={() => alert('ステータスを更新（未実装）')}>
                更新
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>アクション</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => alert(`パスワードリセットメール送信: ${user.email}（未実装）`)}
              >
                パスワードリセット
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => alert(`メール送信: ${user.email}（未実装）`)}
              >
                メール送信
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
