import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmptyState } from '@/components/common/page-state';
import { OrderCard } from '@/cases/orders/components/order-card';
import type { OrderDto } from '@/cases/orders/dtos/order.dto';
import type { GuestCheckDto } from '../dtos/guest-check.dto';

interface Props {
  guestCheck: GuestCheckDto | null;
  orders: OrderDto[]; // pedidos desta comanda
  onClose: () => void;
}

export function GuestCheckDetailDialog({ guestCheck, orders, onClose }: Props) {
  return (
    <Dialog open={guestCheck !== null} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Comanda - {guestCheck?.spot?.name}</DialogTitle>
          <DialogDescription>Pedidos vinculados a esta comanda.</DialogDescription>
        </DialogHeader>

        {orders.length === 0 ? (
          <EmptyState message="Nenhum pedido nesta comanda." />
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
