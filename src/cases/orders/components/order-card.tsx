import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/format';
import type { OrderDto } from '../dtos/order.dto';
import { OrderStatusBadge } from './order-status-badge';
import { OrderStatusSelect } from './order-status-select';

// Pedido com seus itens, total, badge e select de status
export function OrderCard({ order }: { order: OrderDto }) {
  return (
    <div className="grid gap-3 rounded-xl border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</span>
          <OrderStatusBadge status={order.status} />
        </div>
        <OrderStatusSelect order={order} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Qtd.</TableHead>
            <TableHead>Preço unit.</TableHead>
            <TableHead>Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(order.items ?? []).map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.product?.name ?? '-'}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{formatCurrency(item.price)}</TableCell>
              <TableCell>{formatCurrency(Number(item.price) * item.quantity)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className="text-right font-medium">Total do pedido: {formatCurrency(order.total)}</p>
    </div>
  );
}
