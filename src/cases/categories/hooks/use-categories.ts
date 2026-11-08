import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CategoryService } from '../services/category.service';
import type { CategoryFormDto } from '../dtos/category.dto';

const QUERY_KEY = ['categories'];

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: CategoryService.listAll,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CategoryFormDto) => CategoryService.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: CategoryFormDto }) => CategoryService.update(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CategoryService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
