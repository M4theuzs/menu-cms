import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';
import type { ProductFormDto } from '../dtos/product.dto';

const QUERY_KEY = ['products'];

export function useProducts() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: ProductService.listAll,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: ProductFormDto) => ProductService.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: ProductFormDto }) => ProductService.update(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ProductService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
