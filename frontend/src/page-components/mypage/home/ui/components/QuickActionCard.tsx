import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/shadcn/ui/card';

interface QuickActionCardProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

export function QuickActionCard({
  href,
  icon: Icon,
  title,
  description,
}: QuickActionCardProps) {
  return (
    <Link href={href} className='group block'>
      <Card className='h-full transition-colors hover:border-foreground/30'>
        <CardContent className='flex items-start gap-4 p-6'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary'>
            <Icon className='h-5 w-5 text-foreground/70' />
          </div>
          <div className='flex-1'>
            <h3 className='font-medium transition-colors group-hover:text-accent'>
              {title}
            </h3>
            <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
          </div>
          <ArrowRight className='h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1' />
        </CardContent>
      </Card>
    </Link>
  );
}
