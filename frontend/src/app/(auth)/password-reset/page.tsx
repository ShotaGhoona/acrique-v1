'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import { usePasswordResetRequest } from '@/features/account-domain/auth/password-reset/lib/use-password-reset';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Label } from '@/shared/ui/shadcn/ui/label';

export default function PasswordResetPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const resetMutation = usePasswordResetRequest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
      },
    );
  };

  if (submitted) {
    return (
      <div className='flex min-h-screen items-center justify-center py-24'>
        <div className='w-full max-w-md px-6 text-center'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-border/30'>
            <Mail className='h-8 w-8 text-foreground' />
          </div>

          <div className='mt-10'>
            <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
              Email Sent
            </p>
            <h1 className='mt-4 text-3xl font-light'>メールを送信しました</h1>
          </div>

          <div className='mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground'>
            <p>
              パスワードリセット用のメールを送信しました。
              <br />
              メール内のリンクからパスワードを再設定してください。
            </p>
          </div>

          <div className='mt-10 border-t border-border/30 pt-10'>
            <p className='text-xs text-muted-foreground'>
              メールが届かない場合は、迷惑メールフォルダをご確認ください。
            </p>
          </div>

          <Button
            asChild
            variant='outline'
            size='lg'
            className='mt-10 rounded-sm px-8'
          >
            <Link href='/login'>
              ログインページへ
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
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            Password Reset
          </p>
          <h1 className='mt-4 text-3xl font-light'>
            パスワードをお忘れですか？
          </h1>
          <p className='mt-4 text-sm leading-relaxed text-muted-foreground'>
            登録したメールアドレスを入力してください。
            <br />
            パスワードリセット用のメールをお送りします。
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

          <Button
            type='submit'
            size='lg'
            className='w-full rounded-sm'
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? '送信中...' : 'リセットメールを送信'}
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </form>

        <div className='mt-12 text-center'>
          <Link
            href='/login'
            className='inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
          >
            <ArrowLeft className='h-4 w-4' />
            ログインに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
