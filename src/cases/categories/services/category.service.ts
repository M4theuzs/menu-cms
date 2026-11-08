import { api } from '@/lib/axios';
import type { CategoryDto, CategoryFormDto } from '../dtos/category.dto';

const ENDPOINT = '/categories';

export const CategoryService = {
  async listAll(): Promise<CategoryDto[]> {
    const result = await api.get<CategoryDto[]>(ENDPOINT);
    return result.data;
  },

  async create(dto: CategoryFormDto): Promise<CategoryDto> {
    const result = await api.post<CategoryDto>(ENDPOINT, dto);
    return result.data;
  },

  async update(id: string, dto: CategoryFormDto): Promise<CategoryDto> {
    const result = await api.patch<CategoryDto>(`${ENDPOINT}/${id}`, dto);
    return result.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};
