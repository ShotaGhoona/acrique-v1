import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';

export default function RegisterCompletePage() {
  return (
    <div className='flex min-h-screen items-center justify-center py-24'>
      <div className='w-full max-w-md px-6 text-center'>
        <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-border/30'>
          <Mail className='h-8 w-8 text-foreground' />
        </div>

        <div className='mt-10'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground'>
            Registration Complete
          </p>
          <h1 className='mt-4 text-3xl font-light'>
            会員登録ありがとうございます
          </h1>
        </div>

        <div className='mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground'>
          <p>
            ご登録いただいたメールアドレスに
            <br />
            認証メールを送信しました。
          </p>
          <p>
            メール内のリンクをクリックして、
            <br />
            メールアドレスの認証を完了してください。
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
