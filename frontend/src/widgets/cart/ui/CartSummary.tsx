'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/ui/button';

interface CartSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
  isLoading?: boolean;
}

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

export function CartSummary({
  subtotal,
  tax,
  total,
  itemCount,
  isLoading = false,
}: CartSummaryProps) {
  return (
    <div className="rounded-sm border border-border bg-background p-6">
      <h2 className="text-lg font-medium">ご注文内容</h2>

      <div className="mt-6 space-y-4">
        {/* Item Count */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">商品点数</span>
          <span>{itemCount}点</span>
        </div>

        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">小計</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">消費税</span>
          <span>{formatPrice(tax)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">送料</span>
          <span className="text-xs text-muted-foreground">購入手続きで計算</span>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-4">
          <div className="flex justify-between">
            <span className="font-medium">合計（税込）</span>
            <span className="text-xl font-light">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-6">
        <Button
          asChild
          className="w-full"
          size="lg"
          disabled={isLoading || itemCount === 0}
        >
          <Link href="/checkout">
            購入手続きへ
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Notes */}
      <div className="mt-4 space-y-2 text-xs text-muted-foreground">
        <p>※ 送料は購入手続き時に計算されます</p>
        <p>※ ¥10,000以上のご注文で送料無料</p>
      </div>
    </div>
  );
}
