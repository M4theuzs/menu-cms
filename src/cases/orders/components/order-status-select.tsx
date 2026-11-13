import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFeedback } from '@/components/common/feedback';
import { ORDER_STATUSES, ORDER_STATUS_LABEL, type OrderDto, type OrderStatus } from '../dtos/order.dto';
import { useUpdateOrderStatus } from '../hooks/use-orders';

const options = ORDER_STATUSES.map((status) => ({ value: status, label: ORDER_STATUS_LABEL[status] }));

// Select para trocar o status do pedido (transições livres)
export function OrderStatusSelect({ order }: { order: OrderDto }) {
  const notify = useFeedback();
  const updateStatus = useUpdateOrderStatus();

  function handleChange(value: string | null) {
    if (!value || value === order.status) return;
    updateStatus.mutate(
      { id: order.id, status: value as OrderStatus },
      {
        onSuccess: () => notify('success', 'Status do pedido atualizado.'),
        onError: () => notify('error', 'Erro ao atualizar o status do pedido.'),
      },
    );
  }

  return (
    <Select items={options} value={order.status} onValueChange={handleChange} disabled={updateStatus.isPending}>
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
