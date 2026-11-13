import { useState, type DragEvent } from 'react';
import { cn } from 'cn';
import { PageHeader } from '@/components/common/page-header';
import { useFeedback } from '@/components/common/feedback';
import { EmptyState, ErrorState, LoadingState } from '@/components/common/page-state';
import { ORDER_STATUSES, ORDER_STATUS_LABEL, type OrderDto, type OrderStatus } from '@/cases/orders/dtos/order.dto';
import { OrderStatusBadge } from '@/cases/orders/components/order-status-badge';
import { useOrders, useUpdateOrderStatus } from '@/cases/orders/hooks/use-orders';
import { formatDate } from '@/lib/format';

// Kanban com drag and drop nativo do HTML5 (sem biblioteca extra).
// Ao soltar o cartão em outra coluna, o status é gravado na API com useMutation.
export function KanbanPage() {
  const notify = useFeedback();
  const { data: orders, isLoading, isError, refetch } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const [overColumn, setOverColumn] = useState<OrderStatus | null>(null);

  function handleDragStart(event: DragEvent, order: OrderDto) {
    event.dataTransfer.setData('text/plain', order.id);
  }

  function handleDrop(event: DragEvent, status: OrderStatus) {
    event.preventDefault();
    setOverColumn(null);

    const order = orders?.find((o) => o.id === event.dataTransfer.getData('text/plain'));
    if (!order || order.status === status) return;

    updateStatus.mutate(
      { id: order.id, status },
      {
        onSuccess: () => notify('success', `Pedido movido para "${ORDER_STATUS_LABEL[status]}".`),
        onError: () => notify('error', 'Erro ao mover o pedido.'),
      },
    );
  }

  return (
    <div>
      <PageHeader title="Kanban de pedidos" />

      {isLoading && <LoadingState />}
      {isError && <ErrorState onRetry={refetch} />}
      {orders && orders.length === 0 && <EmptyState message="Nenhum pedido registrado." />}

      {orders && orders.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          {ORDER_STATUSES.map((status) => (
            <div
              key={status}
              onDragOver={(event) => {
                event.preventDefault();
                setOverColumn(status);
              }}
              onDragLeave={() => setOverColumn(null)}
              onDrop={(event) => handleDrop(event, status)}
              className={cn('min-h-64 rounded-xl border bg-muted/30 p-3', overColumn === status && 'border-primary bg-muted')}
            >
              <h2 className="mb-3 flex items-center justify-between font-medium">
                {ORDER_STATUS_LABEL[status]}
                <OrderStatusBadge status={status} />
              </h2>

              <div className="grid gap-3">
                {orders
                  .filter((order) => order.status === status)
                  .map((order) => (
                    <div
                      key={order.id}
                      draggable
                      onDragStart={(event) => handleDragStart(event, order)}
                      className="cursor-grab rounded-lg border bg-card p-3 text-sm active:cursor-grabbing"
                    >
                      <p className="font-medium">{order.guestCheck?.spot?.name ?? 'Mesa'}</p>
                      <p className="mb-2 text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                      <ul className="list-inside list-disc">
                        {(order.items ?? []).map((item) => (
                          <li key={item.id}>
                            {item.quantity}x {item.product?.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
