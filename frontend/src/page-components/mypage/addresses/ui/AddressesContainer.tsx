'use client';

import { useState, useEffect } from 'react';
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Check,
  Loader2,
  Star,
} from 'lucide-react';
import { useMypageContext } from '@/shared/contexts/MypageContext';
import { Card, CardContent } from '@/shared/ui/shadcn/ui/card';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import { useAddresses } from '@/features/account-domain/address/get-addresses/lib/use-addresses';
import { useDeleteAddress } from '@/features/account-domain/address/delete-address/lib/use-delete-address';
import { useSetDefaultAddress } from '@/features/account-domain/address/set-default-address/lib/use-set-default-address';
import { AddressFormModal } from '@/widgets/adress/address-form-modal/ui/AddressFormModal';
import { AddressesListSkeleton } from './skeleton/AddressesListSkeleton';
import type { Address } from '@/entities/account-domain/address/model/types';

function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting,
  isSettingDefault,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
  isDeleting: boolean;
  isSettingDefault: boolean;
}) {
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

function EmptyState({ onAdd }: { onAdd: () => void }) {
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

export function AddressesPage() {
  const { setPageMeta } = useMypageContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<number | null>(null);

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

  const handleDelete = async (id: number) => {
    if (!confirm('この配送先を削除しますか？')) return;
    setDeletingId(id);
    deleteMutation.mutate(id, {
      onSettled: () => setDeletingId(null),
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
        <div className='rounded-sm border border-destructive/50 bg-destructive/10 p-6 text-center'>
          <p className='text-destructive'>配送先の読み込みに失敗しました</p>
          <Button
            variant='outline'
            size='sm'
            className='mt-4'
            onClick={() => window.location.reload()}
          >
            再読み込み
          </Button>
        </div>
      ) : addresses.length === 0 ? (
        <EmptyState onAdd={handleAdd} />
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
    </div>
  );
}
