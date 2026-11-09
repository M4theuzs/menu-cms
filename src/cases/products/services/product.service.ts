import { api } from '@/lib/axios';
import type { ProductDto, ProductFormDto } from '../dtos/product.dto';

const ENDPOINT = '/products';

export const ProductService = {
  async listAll(): Promise<ProductDto[]> {
    const result = await api.get<ProductDto[]>(ENDPOINT);
    return result.data;
  },

  async create(dto: ProductFormDto): Promise<ProductDto> {
    const result = await api.post<ProductDto>(ENDPOINT, dto);
    return result.data;
  },

  async update(id: string, dto: ProductFormDto): Promise<ProductDto> {
    const result = await api.patch<ProductDto>(`${ENDPOINT}/${id}`, dto);
    return result.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};
