'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Plus, Pencil, Trash2, Check, Loader2, Star } from 'lucide-react';
import { MypageLayout } from '@/widgets/mypage/ui/MypageLayout';
import { Card, CardContent } from '@/shared/ui/shadcn/ui/card';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Label } from '@/shared/ui/shadcn/ui/label';
import { Badge } from '@/shared/ui/shadcn/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/shadcn/ui/dialog';
import { useAddresses } from '@/features/address/get-addresses';
import { useCreateAddress } from '@/features/address/create-address';
import { useUpdateAddress } from '@/features/address/update-address';
import { useDeleteAddress } from '@/features/address/delete-address';
import { useSetDefaultAddress } from '@/features/address/set-default-address';
import type { Address } from '@/entities/address';

const addressSchema = z.object({
  label: z.string().optional(),
  name: z.string().min(1, 'お名前を入力してください'),
  postal_code: z.string().min(1, '郵便番号を入力してください'),
  prefecture: z.string().min(1, '都道府県を入力してください'),
  city: z.string().min(1, '市区町村を入力してください'),
  address1: z.string().min(1, '番地を入力してください'),
  address2: z.string().optional(),
  phone: z.string().min(1, '電話番号を入力してください'),
  is_default: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  defaultValues?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  isLoading: boolean;
  submitLabel: string;
}

function AddressForm({ defaultValues, onSubmit, isLoading, submitLabel }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: '',
      name: '',
      postal_code: '',
      prefecture: '',
      city: '',
      address1: '',
      address2: '',
      phone: '',
      is_default: false,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="label">ラベル（任意）</Label>
        <Input id="label" placeholder="自宅、会社など" {...register('label')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">
          お名前 <span className="text-accent">*</span>
        </Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="postal_code">
            郵便番号 <span className="text-accent">*</span>
          </Label>
          <Input id="postal_code" placeholder="000-0000" {...register('postal_code')} />
          {errors.postal_code && (
            <p className="text-xs text-destructive">{errors.postal_code.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="prefecture">
            都道府県 <span className="text-accent">*</span>
          </Label>
          <Input id="prefecture" {...register('prefecture')} />
          {errors.prefecture && (
            <p className="text-xs text-destructive">{errors.prefecture.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">
          市区町村 <span className="text-accent">*</span>
        </Label>
        <Input id="city" {...register('city')} />
        {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address1">
          番地 <span className="text-accent">*</span>
        </Label>
        <Input id="address1" {...register('address1')} />
        {errors.address1 && <p className="text-xs text-destructive">{errors.address1.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address2">建物名・部屋番号（任意）</Label>
        <Input id="address2" {...register('address2')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">
          電話番号 <span className="text-accent">*</span>
        </Label>
        <Input id="phone" type="tel" {...register('phone')} />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}

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
    <Card className="transition-colors hover:border-foreground/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {address.label && (
                <span className="text-sm font-medium">{address.label}</span>
              )}
              {address.is_default && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="mr-1 h-3 w-3" />
                  デフォルト
                </Badge>
              )}
            </div>
            <p className="mt-2 font-medium">{address.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              〒{address.postal_code}
            </p>
            <p className="text-sm text-muted-foreground">
              {address.prefecture}
              {address.city}
              {address.address1}
              {address.address2 && ` ${address.address2}`}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              TEL: {address.phone}
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            {!address.is_default && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSetDefault}
                disabled={isSettingDefault}
                className="text-muted-foreground hover:text-foreground"
              >
                {isSettingDefault ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <span className="ml-1 hidden sm:inline">デフォルトに設定</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="text-muted-foreground hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              disabled={isDeleting}
              className="text-muted-foreground hover:text-destructive"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
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
    <div className="rounded-sm border border-dashed border-border py-16 text-center">
      <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 font-medium">配送先が登録されていません</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        配送先を追加すると、注文時にすばやく選択できます
      </p>
      <Button onClick={onAdd} className="mt-6">
        <Plus className="mr-2 h-4 w-4" />
        配送先を追加
      </Button>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-36 animate-pulse rounded-sm bg-secondary/50" />
      ))}
    </div>
  );
}

export function AddressesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<number | null>(null);

  const { data, isLoading, error } = useAddresses();
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const deleteMutation = useDeleteAddress();
  const setDefaultMutation = useSetDefaultAddress();

  const addresses = data?.addresses ?? [];

  const handleAdd = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
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

  const handleSubmit = async (formData: AddressFormData) => {
    if (editingAddress) {
      updateMutation.mutate(
        { id: editingAddress.id, data: formData },
        {
          onSuccess: () => setIsDialogOpen(false),
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setIsDialogOpen(false),
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <MypageLayout title="配送先管理" description="配送先の追加・編集ができます">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isLoading ? '読み込み中...' : `${addresses.length}件の配送先`}
          </p>
          {addresses.length > 0 && (
            <Button onClick={handleAdd} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              追加
            </Button>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="rounded-sm border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="text-destructive">配送先の読み込みに失敗しました</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              再読み込み
            </Button>
          </div>
        ) : addresses.length === 0 ? (
          <EmptyState onAdd={handleAdd} />
        ) : (
          <div className="space-y-4">
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

        {/* Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
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
                editingAddress
                  ? {
                      label: editingAddress.label ?? '',
                      name: editingAddress.name,
                      postal_code: editingAddress.postal_code,
                      prefecture: editingAddress.prefecture,
                      city: editingAddress.city,
                      address1: editingAddress.address1,
                      address2: editingAddress.address2 ?? '',
                      phone: editingAddress.phone,
                    }
                  : undefined
              }
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
              submitLabel={editingAddress ? '変更を保存' : '追加する'}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MypageLayout>
  );
}
