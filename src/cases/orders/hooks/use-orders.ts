import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderService } from '../services/order.service';
import type { OrderStatus } from '../dtos/order.dto';

const QUERY_KEY = ['orders'];

export function useOrders() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: OrderService.listAll,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      OrderService.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
