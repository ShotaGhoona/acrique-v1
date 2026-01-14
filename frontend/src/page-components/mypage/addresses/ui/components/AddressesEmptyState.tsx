import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';

interface AddressesEmptyStateProps {
  onAdd: () => void;
}

export function AddressesEmptyState({ onAdd }: AddressesEmptyStateProps) {
  return (
    <div className='rounded-sm border border-dashed border-border py-16 text-center'>
      <MapPin className='mx-auto h-12 w-12 text-muted-foreground/50' />
      <h3 className='mt-4 font-medium'>配送先が登録されていません</h3>
      <p className='mt-2 text-sm text-muted-foreground'>
        配送先を追加すると、注文時にすばやく選択できます
      </p>
      <Button onClick={onAdd} className='mt-6'>
        <Plus className='mr-2 h-4 w-4' />
        配送先を追加
      </Button>
    </div>
  );
}
