'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useMypageContext } from '@/shared/contexts/MypageContext';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { ErrorState } from '@/shared/ui/components/error-state/ui/ErrorState';
import { ConfirmDialog } from '@/shared/ui/components/confirm-dialog/ui/ConfirmDialog';
import { useAddresses } from '@/features/account-domain/address/get-addresses/lib/use-addresses';
import { useDeleteAddress } from '@/features/account-domain/address/delete-address/lib/use-delete-address';
import { useSetDefaultAddress } from '@/features/account-domain/address/set-default-address/lib/use-set-default-address';
import { AddressFormModal } from '@/widgets/mypage/address-form-modal/ui/AddressFormModal';
import { AddressesListSkeleton } from './skeleton/AddressesListSkeleton';
import { AddressCard } from './components/AddressCard';
import { AddressesEmptyState } from './components/AddressesEmptyState';
import type { Address } from '@/entities/account-domain/address/model/types';

export function AddressesPage() {
  const { setPageMeta } = useMypageContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const { data, isLoading, error } = useAddresses();
  const deleteMutation = useDeleteAddress();
  const setDefaultMutation = useSetDefaultAddress();

  const addresses = data?.addresses ?? [];

  useEffect(() => {
    setPageMeta({
      title: '配送先管理',
      description: '配送先の追加・編集ができます',
    });
  }, [setPageMeta]);

  const handleAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setPendingDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    setDeletingId(pendingDeleteId);
    deleteMutation.mutate(pendingDeleteId, {
      onSettled: () => {
        setDeletingId(null);
        setPendingDeleteId(null);
      },
    });
  };

  const handleSetDefault = async (id: number) => {
    setSettingDefaultId(id);
    setDefaultMutation.mutate(id, {
      onSettled: () => setSettingDefaultId(null),
    });
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>
          {isLoading ? '読み込み中...' : `${addresses.length}件の配送先`}
        </p>
        {addresses.length > 0 && (
          <Button onClick={handleAdd} size='sm'>
            <Plus className='mr-2 h-4 w-4' />
            追加
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <AddressesListSkeleton />
      ) : error ? (
        <ErrorState
          message='配送先の読み込みに失敗しました'
          onRetry={() => window.location.reload()}
        />
      ) : addresses.length === 0 ? (
        <AddressesEmptyState onAdd={handleAdd} />
      ) : (
        <div className='space-y-4'>
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => handleEdit(address)}
              onDelete={() => handleDelete(address.id)}
              onSetDefault={() => handleSetDefault(address.id)}
              isDeleting={deletingId === address.id}
              isSettingDefault={settingDefaultId === address.id}
            />
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      <AddressFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingAddress={editingAddress}
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title='配送先を削除'
        description='この配送先を削除しますか？この操作は取り消せません。'
        confirmLabel='削除'
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}
