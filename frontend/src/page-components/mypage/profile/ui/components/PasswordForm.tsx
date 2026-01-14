'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Loader2, Eye, EyeOff } from 'lucide-react';
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
import { useChangePassword } from '@/features/account-domain/user/change-password/lib/use-change-password';

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

type PasswordFormData = z.infer<typeof passwordSchema>;

export function PasswordForm() {
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
