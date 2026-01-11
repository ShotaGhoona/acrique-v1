'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, MapPin, CreditCard, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/shadcn/ui/radio-group';
import { Label } from '@/shared/ui/shadcn/ui/label';
import { Skeleton } from '@/shared/ui/shadcn/ui/skeleton';
import { useCart } from '@/features/cart/get-cart/lib/use-cart';
import { useAddresses } from '@/features/address/get-addresses/lib/use-addresses';
import { useCreateOrder } from '@/features/order/create-order/lib/use-create-order';
import { AddressFormModal } from '@/widgets/adress/address-form-modal/ui/AddressFormModal';
import type { Address } from '@/entities/address/model/types';
import type { PaymentMethod } from '@/entities/order/model/types';

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

function formatAddress(address: Address): string {
  return `${address.postal_code} ${address.prefecture}${address.city}${address.address1}${address.address2 ? ` ${address.address2}` : ''}`;
}

export function CheckoutContainer() {
  const router = useRouter();
  const { data: cart, isLoading: isCartLoading } = useCart();
  const { data: addressData, isLoading: isAddressLoading } = useAddresses();
  const createOrderMutation = useCreateOrder();

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const addresses = useMemo(
    () => addressData?.addresses ?? [],
    [addressData?.addresses],
  );
  const items = cart?.items ?? [];
  const isEmpty = items.length === 0;

  // Set default address if available
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((a) => a.is_default);
      if (defaultAddress) {
        setSelectedAddressId(String(defaultAddress.id));
      } else {
        setSelectedAddressId(String(addresses[0].id));
      }
    }
  }, [addresses, selectedAddressId]);

  const handleSubmit = async () => {
    if (!selectedAddressId) {
      return;
    }

    createOrderMutation.mutate(
      {
        shipping_address_id: Number(selectedAddressId),
        payment_method: paymentMethod,
      },
      {
        onSuccess: (data) => {
          // 入稿が必要な商品があるかチェック
          const hasUploadRequired = data.order.items.some(
            (item) => item.requires_upload,
          );

          if (hasUploadRequired) {
            // 入稿が必要な場合は入稿画面へ
            router.push(`/checkout/upload?orderId=${data.order.id}`);
          } else {
            // 入稿不要の場合は確認画面へ直接遷移
            router.push(`/checkout/confirm?orderId=${data.order.id}`);
          }
        },
      },
    );
  };

  if (isCartLoading || isAddressLoading) {
    return <CheckoutSkeleton />;
  }

  if (isEmpty) {
    return (
      <div className='mx-auto max-w-7xl px-6 py-12 lg:px-12'>
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <p className='text-lg'>カートに商品がありません</p>
          <Button asChild className='mt-6'>
            <Link href='/shop'>商品を探す</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-7xl px-6 py-12 lg:px-12'>
      {/* Breadcrumb */}
      <nav className='mb-8 flex items-center gap-2 text-xs text-muted-foreground'>
        <Link href='/' className='transition-colors hover:text-foreground'>
          Home
        </Link>
        <ChevronRight className='h-3 w-3' />
        <Link href='/cart' className='transition-colors hover:text-foreground'>
          カート
        </Link>
        <ChevronRight className='h-3 w-3' />
        <span className='text-foreground'>購入手続き</span>
      </nav>

      {/* Page Header */}
      <h1 className='mb-8 text-2xl font-light tracking-tight md:text-3xl'>
        購入手続き
      </h1>

      <div className='grid gap-8 lg:grid-cols-3'>
        {/* Main Content */}
        <div className='space-y-8 lg:col-span-2'>
          {/* Shipping Address */}
          <section className='rounded-sm border border-border bg-background p-6'>
            <div className='mb-4 flex items-center gap-2'>
              <MapPin className='h-5 w-5' />
              <h2 className='text-lg font-medium'>配送先</h2>
            </div>

            {addresses.length === 0 ? (
              <div className='py-4 text-center'>
                <p className='text-sm text-muted-foreground'>
                  配送先が登録されていません
                </p>
                <Button
                  variant='outline'
                  className='mt-4'
                  onClick={() => setIsAddressModalOpen(true)}
                >
                  <Plus className='mr-2 h-4 w-4' />
                  配送先を追加
                </Button>
              </div>
            ) : (
              <RadioGroup
                value={selectedAddressId}
                onValueChange={setSelectedAddressId}
                className='space-y-3'
              >
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className='flex items-start space-x-3 rounded-sm border border-border p-4'
                  >
                    <RadioGroupItem
                      value={String(address.id)}
                      id={`address-${address.id}`}
                    />
                    <Label
                      htmlFor={`address-${address.id}`}
                      className='flex-1 cursor-pointer'
                    >
                      <div className='flex items-center gap-2'>
                        <span className='font-medium'>{address.name}</span>
                        {address.label && (
                          <span className='rounded-sm bg-secondary px-2 py-0.5 text-xs'>
                            {address.label}
                          </span>
                        )}
                        {address.is_default && (
                          <span className='rounded-sm bg-foreground px-2 py-0.5 text-xs text-background'>
                            デフォルト
                          </span>
                        )}
                      </div>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        {formatAddress(address)}
                      </p>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        {address.phone}
                      </p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {addresses.length > 0 && (
              <div className='mt-4 flex items-center justify-between'>
                <Link
                  href='/mypage/addresses'
                  className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                >
                  配送先を管理する
                </Link>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setIsAddressModalOpen(true)}
                >
                  <Plus className='mr-1 h-4 w-4' />
                  新しい配送先を追加
                </Button>
              </div>
            )}
          </section>

          {/* Address Form Modal */}
          <AddressFormModal
            open={isAddressModalOpen}
            onOpenChange={setIsAddressModalOpen}
            onSuccess={(newAddress) => {
              setSelectedAddressId(String(newAddress.id));
            }}
          />

          {/* Payment Method */}
          <section className='rounded-sm border border-border bg-background p-6'>
            <div className='mb-4 flex items-center gap-2'>
              <CreditCard className='h-5 w-5' />
              <h2 className='text-lg font-medium'>お支払い方法</h2>
            </div>

            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as PaymentMethod)
              }
              className='space-y-3'
            >
              <div className='flex items-center space-x-3 rounded-sm border border-border p-4'>
                <RadioGroupItem value='stripe' id='payment-stripe' />
                <Label htmlFor='payment-stripe' className='cursor-pointer'>
                  <span className='font-medium'>クレジットカード</span>
                  <p className='text-sm text-muted-foreground'>
                    Visa, Mastercard, American Express, JCB
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </section>
        </div>

        {/* Order Summary */}
        <div className='lg:sticky lg:top-24 lg:self-start'>
          <div className='rounded-sm border border-border bg-background p-6'>
            <h2 className='text-lg font-medium'>ご注文内容</h2>

            <div className='mt-6 space-y-4'>
              {/* Items */}
              {items.map((item) => (
                <div key={item.id} className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>
                    {item.product_name_ja || item.product_name} ×{' '}
                    {item.quantity}
                  </span>
                  <span>{formatPrice(item.subtotal)}</span>
                </div>
              ))}

              <div className='border-t border-border pt-4'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>小計</span>
                  <span>{formatPrice(cart?.subtotal ?? 0)}</span>
                </div>
                <div className='mt-2 flex justify-between text-sm'>
                  <span className='text-muted-foreground'>消費税</span>
                  <span>{formatPrice(cart?.tax ?? 0)}</span>
                </div>
                <div className='mt-2 flex justify-between text-sm'>
                  <span className='text-muted-foreground'>送料</span>
                  <span className='text-xs text-muted-foreground'>
                    注文確定時に計算
                  </span>
                </div>
              </div>

              <div className='border-t border-border pt-4'>
                <div className='flex justify-between'>
                  <span className='font-medium'>合計（税込）</span>
                  <span className='text-xl font-light'>
                    {formatPrice(cart?.total ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className='mt-6'>
              <Button
                onClick={handleSubmit}
                disabled={
                  !selectedAddressId ||
                  addresses.length === 0 ||
                  createOrderMutation.isPending
                }
                className='w-full'
                size='lg'
              >
                {createOrderMutation.isPending
                  ? '処理中...'
                  : '注文内容を確認する'}
              </Button>
            </div>

            <p className='mt-4 text-xs text-muted-foreground'>
              次の画面でお支払い情報を入力します
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div className='mx-auto max-w-7xl px-6 py-12 lg:px-12'>
      <Skeleton className='mb-8 h-4 w-48' />
      <Skeleton className='mb-8 h-8 w-32' />
      <div className='grid gap-8 lg:grid-cols-3'>
        <div className='space-y-8 lg:col-span-2'>
          <Skeleton className='h-64 w-full' />
          <Skeleton className='h-32 w-full' />
        </div>
        <Skeleton className='h-96 w-full' />
      </div>
    </div>
  );
}
