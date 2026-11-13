import { useState } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState, ErrorState, LoadingState } from '@/components/common/page-state';
import { GuestCheckDetailDialog } from '@/cases/guest-checks/components/guest-check-detail-dialog';
import type { GuestCheckDto } from '@/cases/guest-checks/dtos/guest-check.dto';
import { useOpenedGuestChecks } from '@/cases/guest-checks/hooks/use-guest-checks';
import { useOrders } from '@/cases/orders/hooks/use-orders';
import { formatCurrency, formatDate } from '@/lib/format';

export function GuestChecksPage() {
  const guestChecks = useOpenedGuestChecks();
  const orders = useOrders();
  const [selected, setSelected] = useState<GuestCheckDto | null>(null);

  const isLoading = guestChecks.isLoading || orders.isLoading;
  const isError = guestChecks.isError || orders.isError;

  function ordersOf(guestCheckId: string) {
    return (orders.data ?? []).filter((order) => order.guestCheck?.id === guestCheckId);
  }

  // Total acumulado = soma dos totais dos pedidos da comanda
  function totalOf(guestCheckId: string) {
    return ordersOf(guestCheckId).reduce((sum, order) => sum + Number(order.total), 0);
  }

  function retry() {
    guestChecks.refetch();
    orders.refetch();
  }

  return (
    <div>
      <PageHeader title="Comandas em aberto" />

      {isLoading && <LoadingState />}
      {isError && <ErrorState onRetry={retry} />}
      {guestChecks.data && orders.data && guestChecks.data.length === 0 && (
        <EmptyState message="Nenhuma comanda em aberto." />
      )}

      {guestChecks.data && orders.data && guestChecks.data.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mesa</TableHead>
              <TableHead>Abertura</TableHead>
              <TableHead>Total acumulado</TableHead>
              <TableHead className="text-right">Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guestChecks.data.map((guestCheck) => (
              <TableRow key={guestCheck.id}>
                <TableCell className="font-medium">{guestCheck.spot?.name}</TableCell>
                <TableCell>{formatDate(guestCheck.createdAt)}</TableCell>
                <TableCell>{formatCurrency(totalOf(guestCheck.id))}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => setSelected(guestCheck)}>
                    <Eye /> Ver pedidos
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <GuestCheckDetailDialog
        guestCheck={selected}
        orders={selected ? ordersOf(selected.id) : []}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
