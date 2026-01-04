'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Loader2, Eye, EyeOff } from 'lucide-react';
import { MypageLayout } from '@/widgets/layout/mypage-layout/ui/MypageLayout';
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
import { useGetMe } from '@/features/user/get-me';
import { useUpdateMe } from '@/features/user/update-me';
import { useChangePassword } from '@/features/user/change-password';

const profileSchema = z.object({
  name: z.string().min(1, 'お名前を入力してください'),
  name_kana: z.string().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, '現在のパスワードを入力してください'),
    new_password: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください')
      .regex(/[A-Za-z]/, '英字を含めてください')
      .regex(/[0-9]/, '数字を含めてください'),
    confirm_password: z.string().min(1, '確認用パスワードを入力してください'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'パスワードが一致しません',
    path: ['confirm_password'],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

function ProfileForm() {
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
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='space-y-4'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='space-y-2'>
                <div className='h-4 w-20 animate-pulse rounded bg-secondary/50' />
                <div className='h-10 animate-pulse rounded bg-secondary/50' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
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

function PasswordForm() {
  const changePasswordMutation = useChangePassword();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    changePasswordMutation.mutate(
      {
        current_password: data.current_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          reset();
          setTimeout(() => setShowSuccess(false), 3000);
        },
      },
    );
  };

  const togglePassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>パスワード変更</CardTitle>
        <CardDescription>
          セキュリティのため定期的な変更をおすすめします
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='current_password'>現在のパスワード</Label>
            <div className='relative'>
              <Input
                id='current_password'
                type={showPasswords.current ? 'text' : 'password'}
                {...register('current_password')}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='absolute right-0 top-0 h-full px-3'
                onClick={() => togglePassword('current')}
              >
                {showPasswords.current ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </Button>
            </div>
            {errors.current_password && (
              <p className='text-xs text-destructive'>
                {errors.current_password.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='new_password'>新しいパスワード</Label>
            <div className='relative'>
              <Input
                id='new_password'
                type={showPasswords.new ? 'text' : 'password'}
                {...register('new_password')}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='absolute right-0 top-0 h-full px-3'
                onClick={() => togglePassword('new')}
              >
                {showPasswords.new ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </Button>
            </div>
            {errors.new_password && (
              <p className='text-xs text-destructive'>
                {errors.new_password.message}
              </p>
            )}
            <p className='text-xs text-muted-foreground'>
              8文字以上、英字と数字を含めてください
            </p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirm_password'>新しいパスワード（確認）</Label>
            <div className='relative'>
              <Input
                id='confirm_password'
                type={showPasswords.confirm ? 'text' : 'password'}
                {...register('confirm_password')}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='absolute right-0 top-0 h-full px-3'
                onClick={() => togglePassword('confirm')}
              >
                {showPasswords.confirm ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </Button>
            </div>
            {errors.confirm_password && (
              <p className='text-xs text-destructive'>
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          <div className='flex items-center justify-end gap-4'>
            {showSuccess && (
              <span className='flex items-center gap-1 text-sm text-green-600'>
                <Check className='h-4 w-4' />
                パスワードを変更しました
              </span>
            )}
            <Button type='submit' disabled={changePasswordMutation.isPending}>
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  変更中...
                </>
              ) : (
                'パスワードを変更'
              )}
            </Button>
          </div>

          {changePasswordMutation.isError && (
            <p className='text-sm text-destructive'>
              パスワードの変更に失敗しました。現在のパスワードをご確認ください。
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export function ProfilePage() {
  return (
    <MypageLayout
      title='アカウント設定'
      description='プロフィールやパスワードを変更できます'
    >
      <div className='space-y-8'>
        <ProfileForm />
        <PasswordForm />
      </div>
    </MypageLayout>
  );
}
