export type OrderStatus = 'NEW' | 'PREPARING' | 'READY' | 'DELIVERED';

export interface OrderItemDto {
  id: string;
  quantity: number;
  price: number | string;
  product?: { id: string; name: string };
}

export interface OrderDto {
  id: string;
  createdAt: string;
  total: number | string;
  status: OrderStatus;
  items?: OrderItemDto[];
  guestCheck?: { id: string; spot?: { id: string; name: string } };
}

// Rótulos e cores (variantes do Badge) de cada status
export const ORDER_STATUSES: OrderStatus[] = ['NEW', 'PREPARING', 'READY', 'DELIVERED'];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  NEW: 'Novo',
  PREPARING: 'Em preparo',
  READY: 'Pronto',
  DELIVERED: 'Entregue',
};

export const ORDER_STATUS_VARIANT: Record<OrderStatus, 'blue' | 'amber' | 'green' | 'gray'> = {
  NEW: 'blue',
  PREPARING: 'amber',
  READY: 'green',
  DELIVERED: 'gray',
};
