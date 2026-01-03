'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, X, Loader2, ArrowRight } from 'lucide-react';
import { useVerifyEmail } from '@/features/auth/verify-email/lib/use-verify-email';
import { Button } from '@/shared/ui/shadcn/ui/button';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const verifyMutation = useVerifyEmail();

  useEffect(() => {
    if (token && !verifyMutation.isSuccess && !verifyMutation.isError) {
      verifyMutation.mutate(token);
    }
  }, [token]);

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
            認証トークンが見つかりません
          </p>

          <Button asChild size='lg' className='mt-10 rounded-sm px-8'>
            <Link href='/login'>
              ログインページへ
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (verifyMutation.isPending) {
    return (
      <div className='flex min-h-screen items-center justify-center py-24'>
        <div className='w-full max-w-md px-6 text-center'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-foreground' />
          </div>

          <div className='mt-10'>
            <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
              Verifying
            </p>
            <h1 className='mt-4 text-3xl font-light'>認証中...</h1>
          </div>

          <p className='mt-6 text-sm text-muted-foreground'>
            メールアドレスを確認しています
          </p>
        </div>
      </div>
    );
  }

  if (verifyMutation.isError) {
    return (
      <div className='flex min-h-screen items-center justify-center py-24'>
        <div className='w-full max-w-md px-6 text-center'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-border/30'>
            <X className='h-8 w-8 text-foreground' />
          </div>

          <div className='mt-10'>
            <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
              Verification Failed
            </p>
            <h1 className='mt-4 text-3xl font-light'>認証に失敗しました</h1>
          </div>

          <p className='mt-6 text-sm text-muted-foreground'>
            リンクが無効または期限切れです
          </p>

          <div className='mt-10 border-t border-border/30 pt-10'>
            <p className='text-xs text-muted-foreground'>
              認証メールの再送信をお試しください
            </p>
          </div>

          <Button asChild size='lg' className='mt-10 rounded-sm px-8'>
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
      <div className='w-full max-w-md px-6 text-center'>
        <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-border/30'>
          <Check className='h-8 w-8 text-foreground' />
        </div>

        <div className='mt-10'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            Verified
          </p>
          <h1 className='mt-4 text-3xl font-light'>認証完了</h1>
        </div>

        <p className='mt-6 text-sm text-muted-foreground'>
          メールアドレスの認証が完了しました
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
