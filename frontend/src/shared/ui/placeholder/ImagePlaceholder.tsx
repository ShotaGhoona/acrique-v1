import { cn } from '@/shared/ui/shadcn/lib/utils';

interface ImagePlaceholderProps {
  /** アスペクト比 (例: "16/9", "4/3", "1/1", "3/4") */
  aspect?: string;
  /** カスタムクラス名 */
  className?: string;
  /** ラベルテキスト */
  label?: string;
  /** 背景バリアント */
  variant?: 'light' | 'dark' | 'gradient';
}

export function ImagePlaceholder({
  aspect = '4/3',
  className,
  label,
  variant = 'light',
}: ImagePlaceholderProps) {
  const aspectClass =
    {
      '16/9': 'aspect-video',
      '4/3': 'aspect-[4/3]',
      '3/2': 'aspect-[3/2]',
      '1/1': 'aspect-square',
      '3/4': 'aspect-[3/4]',
      '2/3': 'aspect-[2/3]',
      '9/16': 'aspect-[9/16]',
    }[aspect] || `aspect-[${aspect}]`;

  const variantClass = {
    light: 'bg-secondary/50',
    dark: 'bg-foreground/5',
    gradient: 'bg-gradient-to-br from-secondary/30 to-secondary/70',
  }[variant];

  return (
    <div
      className={cn(
        aspectClass,
        variantClass,
        'flex items-center justify-center overflow-hidden',
        className,
      )}
    >
      <div className='flex flex-col items-center gap-2 text-muted-foreground/40'>
        {/* アクリル風アイコン */}
        <div className='relative'>
          <div className='h-12 w-12 rounded border-2 border-dashed border-current' />
          <div className='absolute inset-1 rounded border border-current opacity-30' />
        </div>
        {label && (
          <span className='text-xs font-medium uppercase tracking-wider'>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
