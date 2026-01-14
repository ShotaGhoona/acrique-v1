import { Pencil, Trash2, Check, Loader2, Star } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/shadcn/ui/card';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import type { Address } from '@/entities/account-domain/address/model/types';

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
  isDeleting: boolean;
  isSettingDefault: boolean;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting,
  isSettingDefault,
}: AddressCardProps) {
  return (
    <Card className='transition-colors hover:border-foreground/20'>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between gap-4'>
          <div className='min-w-0 flex-1'>
            <div className='flex items-center gap-2'>
              {address.label && (
                <span className='text-sm font-medium'>{address.label}</span>
              )}
              {address.is_default && (
                <Badge variant='secondary' className='text-xs'>
                  <Star className='mr-1 h-3 w-3' />
                  デフォルト
                </Badge>
              )}
            </div>
            <p className='mt-2 font-medium'>{address.name}</p>
            <p className='mt-1 text-sm text-muted-foreground'>
              〒{address.postal_code}
            </p>
            <p className='text-sm text-muted-foreground'>
              {address.prefecture}
              {address.city}
              {address.address1}
              {address.address2 && ` ${address.address2}`}
            </p>
            <p className='mt-1 text-sm text-muted-foreground'>
              TEL: {address.phone}
            </p>
          </div>

          <div className='flex shrink-0 gap-2'>
            {!address.is_default && (
              <Button
                variant='ghost'
                size='sm'
                onClick={onSetDefault}
                disabled={isSettingDefault}
                className='text-muted-foreground hover:text-foreground'
              >
                {isSettingDefault ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Check className='h-4 w-4' />
                )}
                <span className='ml-1 hidden sm:inline'>デフォルトに設定</span>
              </Button>
            )}
            <Button
              variant='ghost'
              size='icon'
              onClick={onEdit}
              className='text-muted-foreground hover:text-foreground'
            >
              <Pencil className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={onDelete}
              disabled={isDeleting}
              className='text-muted-foreground hover:text-destructive'
            >
              {isDeleting ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Trash2 className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
