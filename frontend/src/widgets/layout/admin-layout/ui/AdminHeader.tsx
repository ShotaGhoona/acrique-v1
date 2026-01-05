'use client';

import { Search } from 'lucide-react';
import { Input } from '@/shared/ui/shadcn/ui/input';

interface AdminHeaderProps {
  title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className='flex h-14 items-center justify-between border-b bg-card px-6'>
      {/* Page Title */}
      <h1 className='text-lg font-semibold tracking-tight'>{title}</h1>

      {/* Search */}
      <div className='relative hidden md:block'>
        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input placeholder='検索...' className='w-64 pl-9' />
      </div>
    </header>
  );
}
