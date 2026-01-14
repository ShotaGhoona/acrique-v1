'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { KeyRound, Check, X, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { usePasswordResetConfirm } from '@/features/account-domain/auth/password-reset/lib/use-password-reset';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Label } from '@/shared/ui/shadcn/ui/label';

function PasswordResetConfirmContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const resetMutation = usePasswordResetConfirm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (password !== confirmPassword) {
      setPasswordError('パスワードが一致しません');
      return;
    }

    if (password.length < 8) {
      setPasswordError('パスワードは8文字以上で入力してください');
      return;
    }

    if (!token) return;

    resetMutation.mutate({
      token,
      new_password: password,
      confirm_password: confirmPassword,
    });
  };

  if (!token) {
    return (
      <div className='flex min-h-screen items-center justify-center py-24'>
        <div className='w-full max-w-md px-6 text-center'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-border/30'>
            <X className='h-8 w-8 text-foreground' />
          </div>

          <div className='mt-10'>
            <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
              Invalid Link
            </p>
            <h1 className='mt-4 text-3xl font-light'>無効なリンク</h1>
          </div>

          <p className='mt-6 text-sm text-muted-foreground'>
            リセットトークンが見つかりません
          </p>

          <Button asChild size='lg' className='mt-10 rounded-sm px-8'>
            <Link href='/password-reset'>
              パスワードリセットを再申請
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (resetMutation.isSuccess) {
    return (
      <div className='flex min-h-screen items-center justify-center py-24'>
        <div className='w-full max-w-md px-6 text-center'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-border/30'>
            <Check className='h-8 w-8 text-foreground' />
          </div>

          <div className='mt-10'>
            <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
              Password Changed
            </p>
            <h1 className='mt-4 text-3xl font-light'>
              パスワードを変更しました
            </h1>
          </div>

          <p className='mt-6 text-sm text-muted-foreground'>
            新しいパスワードでログインできます
          </p>

          <Button asChild size='lg' className='mt-10 rounded-sm px-8'>
            <Link href='/login'>
              ログインする
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center py-24'>
      <div className='w-full max-w-md px-6'>
        <div className='mb-12 text-center'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-border/30'>
            <KeyRound className='h-8 w-8 text-foreground' />
          </div>
          <p className='mt-10 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            New Password
          </p>
          <h1 className='mt-4 text-3xl font-light'>新しいパスワードを設定</h1>
          <p className='mt-4 text-sm text-muted-foreground'>
            新しいパスワードを入力してください
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label
              htmlFor='password'
              className='text-xs font-medium uppercase tracking-wide'
            >
              New Password
            </Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='8文字以上'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className='h-12 rounded-sm border-border/50 bg-transparent pr-12 placeholder:text-foreground/40 focus:border-foreground'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground'
              >
                {showPassword ? (
                  <EyeOff className='h-5 w-5' />
                ) : (
                  <Eye className='h-5 w-5' />
                )}
              </button>
            </div>
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='confirmPassword'
              className='text-xs font-medium uppercase tracking-wide'
            >
              Confirm Password
            </Label>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='もう一度入力'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className='h-12 rounded-sm border-border/50 bg-transparent pr-12 placeholder:text-foreground/40 focus:border-foreground'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground'
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-5 w-5' />
                ) : (
                  <Eye className='h-5 w-5' />
                )}
              </button>
            </div>
          </div>

          {passwordError && (
            <p className='text-sm text-accent'>{passwordError}</p>
          )}

          {resetMutation.isError && (
            <div className='border border-accent/30 bg-accent/5 p-4 text-sm text-foreground'>
              リンクが無効または期限切れです。再度リセットを申請してください。
            </div>
          )}

          <Button
            type='submit'
            size='lg'
            className='w-full rounded-sm'
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? '変更中...' : 'パスワードを変更'}
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function PasswordResetConfirmPage() {
  return (
    <Suspense fallback={null}>
      <PasswordResetConfirmContent />
    </Suspense>
  );
}
