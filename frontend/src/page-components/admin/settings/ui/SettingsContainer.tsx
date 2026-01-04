'use client';

import { useState } from 'react';
import {
  Save,
  Globe,
  Mail,
  CreditCard,
  Bell,
  Shield,
  Palette,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Label } from '@/shared/ui/shadcn/ui/label';
import { Textarea } from '@/shared/ui/shadcn/ui/textarea';
import { Switch } from '@/shared/ui/shadcn/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui/shadcn/ui/tabs';
import { AdminLayout } from '@/widgets/layout/admin-layout/ui/AdminLayout';

export function SettingsContainer() {
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'ACRIQUE',
    siteDescription: 'オーダーメイドアクリル製品の専門店',
    contactEmail: 'info@acrique.com',
    phoneNumber: '03-1234-5678',
    address: '東京都渋谷区xxx-xxx',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderNotification: true,
    uploadNotification: true,
    lowStockAlert: true,
  });

  const handleSave = () => {
    alert('設定を保存しました（未実装）');
    // TODO: API呼び出し
  };

  return (
    <AdminLayout title='サイト設定'>
      <Tabs defaultValue='general' className='space-y-6'>
        <TabsList>
          <TabsTrigger value='general' className='gap-2'>
            <Globe className='h-4 w-4' />
            基本設定
          </TabsTrigger>
          <TabsTrigger value='notifications' className='gap-2'>
            <Bell className='h-4 w-4' />
            通知設定
          </TabsTrigger>
          <TabsTrigger value='payment' className='gap-2'>
            <CreditCard className='h-4 w-4' />
            決済設定
          </TabsTrigger>
          <TabsTrigger value='email' className='gap-2'>
            <Mail className='h-4 w-4' />
            メール設定
          </TabsTrigger>
          <TabsTrigger value='security' className='gap-2'>
            <Shield className='h-4 w-4' />
            セキュリティ
          </TabsTrigger>
          <TabsTrigger value='appearance' className='gap-2'>
            <Palette className='h-4 w-4' />
            外観
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value='general'>
          <Card>
            <CardHeader>
              <CardTitle>基本設定</CardTitle>
              <CardDescription>サイトの基本情報を設定します。</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='siteName'>サイト名</Label>
                  <Input
                    id='siteName'
                    value={siteSettings.siteName}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        siteName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='contactEmail'>問い合わせメール</Label>
                  <Input
                    id='contactEmail'
                    type='email'
                    value={siteSettings.contactEmail}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        contactEmail: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='siteDescription'>サイト説明</Label>
                <Textarea
                  id='siteDescription'
                  value={siteSettings.siteDescription}
                  onChange={(e) =>
                    setSiteSettings({
                      ...siteSettings,
                      siteDescription: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='phoneNumber'>電話番号</Label>
                  <Input
                    id='phoneNumber'
                    value={siteSettings.phoneNumber}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='address'>住所</Label>
                  <Input
                    id='address'
                    value={siteSettings.address}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className='flex justify-end'>
                <Button onClick={handleSave}>
                  <Save className='mr-2 h-4 w-4' />
                  保存
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value='notifications'>
          <Card>
            <CardHeader>
              <CardTitle>通知設定</CardTitle>
              <CardDescription>
                管理者への通知設定を管理します。
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>新規注文通知</Label>
                  <p className='text-sm text-muted-foreground'>
                    新しい注文があった際にメール通知を受け取ります。
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.orderNotification}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      orderNotification: checked,
                    })
                  }
                />
              </div>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>入稿データ通知</Label>
                  <p className='text-sm text-muted-foreground'>
                    新しい入稿データがアップロードされた際に通知を受け取ります。
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.uploadNotification}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      uploadNotification: checked,
                    })
                  }
                />
              </div>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>在庫アラート</Label>
                  <p className='text-sm text-muted-foreground'>
                    在庫が少なくなった際にアラートを受け取ります。
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.lowStockAlert}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      lowStockAlert: checked,
                    })
                  }
                />
              </div>
              <div className='flex justify-end'>
                <Button onClick={handleSave}>
                  <Save className='mr-2 h-4 w-4' />
                  保存
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value='payment'>
          <Card>
            <CardHeader>
              <CardTitle>決済設定</CardTitle>
              <CardDescription>決済に関する設定を管理します。</CardDescription>
            </CardHeader>
            <CardContent className='py-8 text-center text-muted-foreground'>
              決済設定（未実装）
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value='email'>
          <Card>
            <CardHeader>
              <CardTitle>メール設定</CardTitle>
              <CardDescription>
                メール送信に関する設定を管理します。
              </CardDescription>
            </CardHeader>
            <CardContent className='py-8 text-center text-muted-foreground'>
              メール設定（未実装）
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value='security'>
          <Card>
            <CardHeader>
              <CardTitle>セキュリティ設定</CardTitle>
              <CardDescription>
                セキュリティに関する設定を管理します。
              </CardDescription>
            </CardHeader>
            <CardContent className='py-8 text-center text-muted-foreground'>
              セキュリティ設定（未実装）
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value='appearance'>
          <Card>
            <CardHeader>
              <CardTitle>外観設定</CardTitle>
              <CardDescription>
                サイトの外観に関する設定を管理します。
              </CardDescription>
            </CardHeader>
            <CardContent className='py-8 text-center text-muted-foreground'>
              外観設定（未実装）
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
