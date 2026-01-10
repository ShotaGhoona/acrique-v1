import httpClient from '@/shared/api/client/http-client';
import {
  GetAdminProductsRequest,
  GetAdminProductsResponse,
  GetAdminProductResponse,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  DeleteProductResponse,
  GetPresignedUrlRequest,
  GetPresignedUrlResponse,
  AddProductImageRequest,
  AddProductImageResponse,
  UpdateProductImageRequest,
  UpdateProductImageResponse,
  DeleteProductImageResponse,
  UpdateProductOptionsRequest,
  UpdateProductOptionsResponse,
  UpdateProductSpecsRequest,
  UpdateProductSpecsResponse,
  UpdateProductFeaturesRequest,
  UpdateProductFeaturesResponse,
  UpdateProductFaqsRequest,
  UpdateProductFaqsResponse,
} from '../model/types';

/**
 * 管理者商品管理API
 */
export const adminProductApi = {
  /**
   * 商品一覧取得
   */
  async getProducts(params?: GetAdminProductsRequest): Promise<GetAdminProductsResponse> {
    const response = await httpClient.get<GetAdminProductsResponse>(
      '/api/admin/products',
      { params },
    );
    return response.data;
  },

  /**
   * 商品詳細取得
   */
  async getProduct(productId: string): Promise<GetAdminProductResponse> {
    const response = await httpClient.get<GetAdminProductResponse>(
      `/api/admin/products/${productId}`,
    );
    return response.data;
  },

  /**
   * 商品作成
   */
  async createProduct(data: CreateProductRequest): Promise<CreateProductResponse> {
    const response = await httpClient.post<CreateProductResponse>(
      '/api/admin/products',
      data,
    );
    return response.data;
  },

  /**
   * 商品更新
   */
  async updateProduct(
    productId: string,
    data: UpdateProductRequest,
  ): Promise<UpdateProductResponse> {
    const response = await httpClient.put<UpdateProductResponse>(
      `/api/admin/products/${productId}`,
      data,
    );
    return response.data;
  },

  /**
   * 商品削除
   */
  async deleteProduct(productId: string): Promise<DeleteProductResponse> {
    const response = await httpClient.delete<DeleteProductResponse>(
      `/api/admin/products/${productId}`,
    );
    return response.data;
  },

  /**
   * Presigned URL取得
   */
  async getPresignedUrl(
    productId: string,
    data: GetPresignedUrlRequest,
  ): Promise<GetPresignedUrlResponse> {
    const response = await httpClient.post<GetPresignedUrlResponse>(
      `/api/admin/products/${productId}/images/presigned`,
      data,
    );
    return response.data;
  },

  /**
   * 画像追加
   */
  async addImage(
    productId: string,
    data: AddProductImageRequest,
  ): Promise<AddProductImageResponse> {
    const response = await httpClient.post<AddProductImageResponse>(
      `/api/admin/products/${productId}/images`,
      data,
    );
    return response.data;
  },

  /**
   * 画像更新
   */
  async updateImage(
    productId: string,
    imageId: number,
    data: UpdateProductImageRequest,
  ): Promise<UpdateProductImageResponse> {
    const response = await httpClient.put<UpdateProductImageResponse>(
      `/api/admin/products/${productId}/images/${imageId}`,
      data,
    );
    return response.data;
  },

  /**
   * 画像削除
   */
  async deleteImage(
    productId: string,
    imageId: number,
  ): Promise<DeleteProductImageResponse> {
    const response = await httpClient.delete<DeleteProductImageResponse>(
      `/api/admin/products/${productId}/images/${imageId}`,
    );
    return response.data;
  },

  /**
   * オプション更新
   */
  async updateOptions(
    productId: string,
    data: UpdateProductOptionsRequest,
  ): Promise<UpdateProductOptionsResponse> {
    const response = await httpClient.put<UpdateProductOptionsResponse>(
      `/api/admin/products/${productId}/options`,
      data,
    );
    return response.data;
  },

  /**
   * スペック更新
   */
  async updateSpecs(
    productId: string,
    data: UpdateProductSpecsRequest,
  ): Promise<UpdateProductSpecsResponse> {
    const response = await httpClient.put<UpdateProductSpecsResponse>(
      `/api/admin/products/${productId}/specs`,
      data,
    );
    return response.data;
  },

  /**
   * 特長更新
   */
  async updateFeatures(
    productId: string,
    data: UpdateProductFeaturesRequest,
  ): Promise<UpdateProductFeaturesResponse> {
    const response = await httpClient.put<UpdateProductFeaturesResponse>(
      `/api/admin/products/${productId}/features`,
      data,
    );
    return response.data;
  },

  /**
   * FAQ更新
   */
  async updateFaqs(
    productId: string,
    data: UpdateProductFaqsRequest,
  ): Promise<UpdateProductFaqsResponse> {
    const response = await httpClient.put<UpdateProductFaqsResponse>(
      `/api/admin/products/${productId}/faqs`,
      data,
    );
    return response.data;
  },
};
