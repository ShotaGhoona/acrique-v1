'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Search } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Label } from '@/shared/ui/shadcn/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/shadcn/ui/dialog';
import { useCreateAddress } from '@/features/address/create-address/lib/use-create-address';
import { useUpdateAddress } from '@/features/address/update-address/lib/use-update-address';
import type { Address } from '@/entities/address/model/types';
import { Separator } from '@/shared/ui/shadcn/ui/separator';

export const addressSchema = z.object({
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

export type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  defaultValues?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  isLoading: boolean;
  submitLabel: string;
}

interface ZipcloudResponse {
  status: number;
  message: string | null;
  results: {
    zipcode: string;
    prefcode: string;
    address1: string; // 都道府県
    address2: string; // 市区町村
    address3: string; // 町域
  }[] | null;
}

async function searchAddressByPostalCode(postalCode: string): Promise<{
  prefecture: string;
  city: string;
} | null> {
  const cleanedCode = postalCode.replace(/-/g, '');
  if (cleanedCode.length !== 7) return null;

  try {
    const response = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanedCode}`,
    );
    const data: ZipcloudResponse = await response.json();

    if (data.status === 200 && data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        prefecture: result.address1,
        city: result.address2 + result.address3,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function AddressForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel,
}: AddressFormProps) {
  const [isSearching, setIsSearching] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  const postalCode = watch('postal_code');

  const handleSearchPostalCode = async () => {
    if (!postalCode) return;

    setIsSearching(true);
    const result = await searchAddressByPostalCode(postalCode);
    setIsSearching(false);

    if (result) {
      setValue('prefecture', result.prefecture);
      setValue('city', result.city);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='label'>ラベル（任意）</Label>
        <Input id='label' placeholder='自宅、会社など' {...register('label')} />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='name'>
          受取人名 <span className='text-accent'>*</span>
        </Label>
        <Input id='name' placeholder='届け先のお名前' {...register('name')} />
        {errors.name && (
          <p className='text-xs text-destructive'>{errors.name.message}</p>
        )}
      </div>
      <Separator />
      <div className='space-y-2'>
        <Label htmlFor='postal_code'>
          郵便番号 <span className='text-accent'>*</span>
        </Label>
        <div className='flex gap-2'>
          <Input
            id='postal_code'
            placeholder='000-0000'
            className='flex-1'
            {...register('postal_code')}
          />
          <Button
            type='button'
            variant='outline'
            onClick={handleSearchPostalCode}
            disabled={isSearching || !postalCode}
          >
            {isSearching ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Search className='h-4 w-4' />
            )}
            <span className='ml-1'>検索</span>
          </Button>
        </div>
        {errors.postal_code && (
          <p className='text-xs text-destructive'>
            {errors.postal_code.message}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='prefecture'>
          都道府県 <span className='text-accent'>*</span>
        </Label>
        <Input id='prefecture' {...register('prefecture')} />
        {errors.prefecture && (
          <p className='text-xs text-destructive'>
            {errors.prefecture.message}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='city'>
          市区町村 <span className='text-accent'>*</span>
        </Label>
        <Input id='city' {...register('city')} />
        {errors.city && (
          <p className='text-xs text-destructive'>{errors.city.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='address1'>
          番地 <span className='text-accent'>*</span>
        </Label>
        <Input id='address1' {...register('address1')} />
        {errors.address1 && (
          <p className='text-xs text-destructive'>{errors.address1.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='address2'>建物名・部屋番号（任意）</Label>
        <Input id='address2' {...register('address2')} />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='phone'>
          電話番号 <span className='text-accent'>*</span>
        </Label>
        <Input id='phone' type='tel' {...register('phone')} />
        {errors.phone && (
          <p className='text-xs text-destructive'>{errors.phone.message}</p>
        )}
      </div>

      <div className='flex justify-end pt-4'>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
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
  );
}
