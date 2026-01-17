'use client';

import { useState, useMemo } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/shadcn/ui/sheet';
import { ProductPage } from '@/widgets/storefront/product-page/ui/ProductPage';
import type { ProductDetail } from '@/entities/catalog-domain/product/model/types';
import type { AdminProductDetail } from '@/entities/admin-domain/admin-product/model/types';
import type { CategoryId } from '@/shared/domain/category/model/types';

interface ProductPreviewSheetProps {
  product: AdminProductDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// AdminProductDetail を ProductDetail に変換
function toProductDetail(admin: AdminProductDetail): ProductDetail {
  return {
    id: admin.id,
    category_id: admin.category_id as CategoryId,
    name: admin.name,
    name_ja: admin.name_ja ?? '',
    slug: admin.slug,
    tagline: admin.tagline,
    description: admin.description,
    long_description: admin.long_description,
    base_price: admin.base_price,
    price_note: admin.price_note,
    lead_time_days: admin.lead_time_days,
    lead_time_note: admin.lead_time_note,
    master_id: admin.master_id,
    production_type: admin.production_type,
    upload_requirements: admin.upload_requirements,
    is_featured: admin.is_featured,
    images: admin.images,
    options: admin.options.map((opt) => ({
      id: opt.id ?? 0,
      name: opt.name,
      is_required: opt.is_required,
      sort_order: opt.sort_order,
      values: opt.values.map((val) => ({
        id: val.id ?? 0,
        label: val.label,
        price_diff: val.price_diff,
        description: val.description,
        sort_order: val.sort_order,
      })),
    })),
    specs: admin.specs.map((spec) => ({
      id: spec.id ?? 0,
      label: spec.label,
      value: spec.value,
      sort_order: spec.sort_order,
    })),
    features: admin.features.map((feat) => ({
      id: feat.id ?? 0,
      title: feat.title,
      description: feat.description,
      sort_order: feat.sort_order,
    })),
    faqs: admin.faqs.map((faq) => ({
      id: faq.id ?? 0,
      question: faq.question,
      answer: faq.answer,
      sort_order: faq.sort_order,
    })),
    created_at: admin.created_at,
    updated_at: admin.updated_at,
  };
}

export function ProductPreviewSheet({
  product,
  open,
  onOpenChange,
}: ProductPreviewSheetProps) {
  const productDetail = useMemo(() => toProductDetail(product), [product]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        className='w-full overflow-y-auto p-0 sm:max-w-2xl lg:max-w-4xl'
      >
        <SheetHeader className='sticky top-0 z-10 border-b bg-background px-6 py-4'>
          <SheetTitle>プレビュー</SheetTitle>
        </SheetHeader>
        <div className='min-h-screen bg-background'>
          <ProductPage product={productDetail} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
