'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useLogin, type LoginFormData } from '@/features/auth/login';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Label } from '@/shared/ui/shadcn/ui/label';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className='flex min-h-screen items-center justify-center py-24'>
      <div className='w-full max-w-md px-6'>
        <div className='mb-12 text-center'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            Login
          </p>
          <h1 className='mt-4 text-3xl font-light'>ログイン</h1>
        </div>
        <div className='animate-pulse space-y-6'>
          <div className='h-12 rounded-sm bg-muted' />
          <div className='h-12 rounded-sm bg-muted' />
          <div className='h-12 rounded-sm bg-muted' />
        </div>
      </div>
    </div>
  );
}

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const credentials: LoginFormData = { email, password };
    loginMutation.mutate(credentials);
  };

  return (
    <div className='flex min-h-screen items-center justify-center py-24'>
      <div className='w-full max-w-md px-6'>
        <div className='mb-12 text-center'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            Login
          </p>
          <h1 className='mt-4 text-3xl font-light'>ログイン</h1>
          <p className='mt-4 text-sm text-muted-foreground'>
            アカウントにログインしてください
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label
              htmlFor='email'
              className='text-xs font-medium uppercase tracking-wide'
            >
              Email
            </Label>
            <Input
              id='email'
              type='email'
              placeholder='email@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='h-12 rounded-sm border-border/50 bg-transparent placeholder:text-foreground/40 focus:border-foreground'
            />
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label
                htmlFor='password'
                className='text-xs font-medium uppercase tracking-wide'
              >
                Password
              </Label>
              <Link
                href='/password-reset'
                className='text-xs text-muted-foreground transition-colors hover:text-foreground'
              >
                パスワードをお忘れですか？
              </Link>
            </div>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

          {loginMutation.isError && (
            <div className='border border-accent/30 bg-accent/5 p-4 text-sm text-foreground'>
              ログインに失敗しました。メールアドレスとパスワードを確認してください。
            </div>
          )}

          <Button
            type='submit'
            size='lg'
            className='w-full rounded-sm'
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'ログイン中...' : 'ログイン'}
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </form>

        <div className='mt-12 text-center'>
          <p className='text-sm text-muted-foreground'>
            アカウントをお持ちでないですか？
          </p>
          <Link
            href='/register'
            className='mt-2 inline-block text-sm font-medium tracking-wide text-foreground transition-colors hover:text-accent'
          >
            会員登録はこちら
          </Link>
        </div>
      </div>
    </div>
  );
}
