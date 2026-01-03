import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductPage } from '@/page-components/product/ProductPage';
// TODO: 後で消す - API接続時に置換
import {
  getProductDetail,
  getProductsByCategory,
} from '@/shared/dummy-data/products';

interface ProductPageParams {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageParams): Promise<Metadata> {
  const { productId } = await params;
  // TODO: 後で消す - API接続時に置換
  const product = getProductDetail(productId);

  if (!product) {
    return {
      title: '商品が見つかりません | ACRIQUE',
    };
  }

  return {
    title: `${product.name_ja} | ACRIQUE`,
    description: product.description,
    openGraph: {
      title: `${product.name_ja} - ${product.tagline} | ACRIQUE`,
      description: product.description,
    },
  };
}

export async function generateStaticParams() {
  // TODO: 後で消す - API接続時に置換
  const officeProducts = getProductsByCategory('office');

  return officeProducts.map((product) => ({
    productId: product.id,
  }));
}

export default async function OfficeProductPage({ params }: ProductPageParams) {
  const { productId } = await params;
  // TODO: 後で消す - API接続時に置換
  const product = getProductDetail(productId);

  if (!product || product.category_id !== 'office') {
    notFound();
  }

  return <ProductPage product={product} />;
}
