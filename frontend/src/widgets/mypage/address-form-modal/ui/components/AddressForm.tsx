'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { Input } from '@/shared/ui/shadcn/ui/input';
import { Label } from '@/shared/ui/shadcn/ui/label';
import { Separator } from '@/shared/ui/shadcn/ui/separator';
import {
  addressSchema,
  searchAddressByPostalCode,
  type AddressFormData,
} from '../../lib/address-schema';

interface AddressFormProps {
  defaultValues?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  isLoading: boolean;
  submitLabel: string;
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
