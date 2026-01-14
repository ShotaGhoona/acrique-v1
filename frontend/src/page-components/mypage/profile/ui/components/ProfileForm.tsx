'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/ui/shadcn/ui/card';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Label } from '@/shared/ui/shadcn/ui/label';
import { Separator } from '@/shared/ui/shadcn/ui/separator';
import { useGetMe } from '@/features/account-domain/user/get-me/lib/use-get-me';
import { useUpdateMe } from '@/features/account-domain/user/update-me/lib/use-update-me';
import { ProfileFormSkeleton } from '../skeleton/ProfileFormSkeleton';

const profileSchema = z.object({
  name: z.string().min(1, 'お名前を入力してください'),
  name_kana: z.string().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { data: user, isLoading } = useGetMe();
  const updateMutation = useUpdateMe();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name ?? '',
      name_kana: user?.name_kana ?? '',
      phone: user?.phone ?? '',
      company: user?.company ?? '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        setShowSuccess(true);
        reset(data);
        setTimeout(() => setShowSuccess(false), 3000);
      },
    });
  };

  if (isLoading) {
    return <ProfileFormSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>プロフィール</CardTitle>
        <CardDescription>アカウント情報を編集できます</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid gap-6 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='name'>
                お名前 <span className='text-accent'>*</span>
              </Label>
              <Input id='name' {...register('name')} />
              {errors.name && (
                <p className='text-xs text-destructive'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='name_kana'>お名前（フリガナ）</Label>
              <Input id='name_kana' {...register('name_kana')} />
            </div>
          </div>

          <div className='grid gap-6 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='phone'>電話番号</Label>
              <Input id='phone' type='tel' {...register('phone')} />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='company'>会社名</Label>
              <Input id='company' {...register('company')} />
            </div>
          </div>

          <Separator />

          <div className='space-y-2'>
            <Label>メールアドレス</Label>
            <Input
              value={user?.email ?? ''}
              disabled
              className='bg-secondary/30'
            />
            <p className='text-xs text-muted-foreground'>
              メールアドレスの変更はサポートまでお問い合わせください
            </p>
          </div>

          <div className='flex items-center justify-end gap-4'>
            {showSuccess && (
              <span className='flex items-center gap-1 text-sm text-green-600'>
                <Check className='h-4 w-4' />
                保存しました
              </span>
            )}
            <Button
              type='submit'
              disabled={!isDirty || updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  保存中...
                </>
              ) : (
                '変更を保存'
              )}
            </Button>
          </div>

          {updateMutation.isError && (
            <p className='text-sm text-destructive'>
              保存に失敗しました。もう一度お試しください。
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
