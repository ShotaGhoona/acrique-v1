'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/shadcn/ui/dialog';
import { useCreateAddress } from '@/features/account-domain/address/create-address/lib/use-create-address';
import { useUpdateAddress } from '@/features/account-domain/address/update-address/lib/use-update-address';
import type { Address } from '@/entities/account-domain/address/model/types';
import { AddressForm } from './components/AddressForm';
import { addressToFormData, type AddressFormData } from '../lib/address-schema';

// Re-export for external use
export {
  addressSchema,
  addressToFormData,
  type AddressFormData,
} from '../lib/address-schema';
export { AddressForm } from './components/AddressForm';

interface AddressFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingAddress?: Address | null;
  onSuccess?: (address: Address) => void;
}

export function AddressFormModal({
  open,
  onOpenChange,
  editingAddress,
  onSuccess,
}: AddressFormModalProps) {
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (formData: AddressFormData) => {
    if (editingAddress) {
      updateMutation.mutate(
        { id: editingAddress.id, data: formData },
        {
          onSuccess: (data) => {
            onOpenChange(false);
            onSuccess?.(data.address);
          },
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: (data) => {
          onOpenChange(false);
          onSuccess?.(data.address);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {editingAddress ? '配送先を編集' : '配送先を追加'}
          </DialogTitle>
          <DialogDescription>
            {editingAddress
              ? '配送先情報を編集できます'
              : '新しい配送先を登録します'}
          </DialogDescription>
        </DialogHeader>
        <AddressForm
          defaultValues={
            editingAddress ? addressToFormData(editingAddress) : undefined
          }
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          submitLabel={editingAddress ? '変更を保存' : '追加する'}
        />
      </DialogContent>
    </Dialog>
  );
}
