import type { CategoryDto } from '@/cases/categories/dtos/category.dto';

export interface ProductDto {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  picture?: string;
  vegetarian: boolean;
  isNew: boolean;
  active: boolean;
  category: CategoryDto | null;
}

export interface ProductFormDto {
  name: string;
  description?: string;
  price: number;
  picture?: string;
  vegetarian: boolean;
  isNew: boolean;
  active: boolean;
  categoryId: string | null;
}
