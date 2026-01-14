import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';

interface ErrorStateProps {
  /** エラーメッセージ */
  message?: string;
  /** 再試行ボタンのクリックハンドラ */
  onRetry?: () => void;
  /** 再試行ボタンのテキスト */
  retryLabel?: string;
}

export function ErrorState({
  message = 'データの読み込みに失敗しました',
  onRetry,
  retryLabel = '再読み込み',
}: ErrorStateProps) {
  return (
    <div className='rounded-sm border border-destructive/50 bg-destructive/10 p-6 text-center'>
      <AlertCircle className='mx-auto h-10 w-10 text-destructive' />
      <p className='mt-4 text-destructive'>{message}</p>
      {onRetry && (
        <Button variant='outline' size='sm' className='mt-4' onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
