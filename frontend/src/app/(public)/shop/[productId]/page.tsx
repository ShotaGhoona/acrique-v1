import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductPage } from '@/page-components/product/ProductPage';
import {
  getProductDetail,
  productDetails,
} from '@/entities/product/model/product-data';

interface ProductPageParams {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageParams): Promise<Metadata> {
  const { productId } = await params;
  const product = getProductDetail(productId);

  if (!product) {
    return {
      title: '商品が見つかりません | ACRIQUE',
    };
  }

  return {
    title: `${product.nameJa} | ACRIQUE`,
    description: product.description,
    openGraph: {
      title: `${product.nameJa} - ${product.tagline} | ACRIQUE`,
      description: product.description,
    },
  };
}

export async function generateStaticParams() {
  const shopProducts = Object.values(productDetails).filter(
    (product) => product.categoryId === 'shop',
  );

  return shopProducts.map((product) => ({
    productId: product.id,
  }));
}

export default async function ShopProductPage({ params }: ProductPageParams) {
  const { productId } = await params;
  const product = getProductDetail(productId);

  if (!product || product.categoryId !== 'shop') {
    notFound();
  }

  return <ProductPage product={product} />;
}
