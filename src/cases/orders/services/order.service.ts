import { api } from '@/lib/axios';
import type { OrderDto, OrderStatus } from '../dtos/order.dto';

const ENDPOINT = '/orders';

export const OrderService = {
  async listAll(): Promise<OrderDto[]> {
    const result = await api.get<OrderDto[]>(ENDPOINT);
    return result.data;
  },

  async updateStatus(id: string, status: OrderStatus): Promise<OrderDto> {
    const result = await api.patch<OrderDto>(`${ENDPOINT}/${id}/status`, { status });
    return result.data;
  },
};
