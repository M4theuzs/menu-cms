import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConfirmDeleteDialog } from '@/components/common/confirm-delete-dialog';
import { useFeedback } from '@/components/common/feedback';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState, ErrorState, LoadingState } from '@/components/common/page-state';
import { SpotFormDialog } from '@/cases/spots/components/spot-form-dialog';
import type { SpotDto } from '@/cases/spots/dtos/spot.dto';
import { useDeleteSpot, useSpots } from '@/cases/spots/hooks/use-spots';

export function SpotsPage() {
  const notify = useFeedback();
  const { data: spots, isLoading, isError, refetch } = useSpots();
  const deleteSpot = useDeleteSpot();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SpotDto | null>(null);
  const [deleting, setDeleting] = useState<SpotDto | null>(null);

  function openForm(spot: SpotDto | null) {
    setEditing(spot);
    setFormOpen(true);
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteSpot.mutate(deleting.id, {
      onSuccess: () => {
        notify('success', 'Mesa excluída com sucesso.');
        setDeleting(null);
      },
      onError: () => {
        notify('error', 'Erro ao excluir a mesa.');
        setDeleting(null);
      },
    });
  }

  return (
    <div>
      <PageHeader title="Mesas">
        <Button onClick={() => openForm(null)}>
          <Plus /> Nova mesa
        </Button>
      </PageHeader>

      {isLoading && <LoadingState />}
      {isError && <ErrorState onRetry={refetch} />}
      {spots && spots.length === 0 && <EmptyState message="Nenhuma mesa cadastrada." />}

      {spots && spots.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spots.map((spot) => (
              <TableRow key={spot.id}>
                <TableCell className="font-medium">{spot.name}</TableCell>
                <TableCell>
                  <Badge variant={spot.active ? 'green' : 'gray'}>{spot.active ? 'Ativa' : 'Inativa'}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon-sm" aria-label="Editar" onClick={() => openForm(spot)}>
                    <Pencil />
                  </Button>
                  <Button variant="ghost" size="icon-sm" aria-label="Excluir" onClick={() => setDeleting(spot)}>
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <SpotFormDialog open={formOpen} spot={editing} onClose={() => setFormOpen(false)} />
      <ConfirmDeleteDialog
        open={deleting !== null}
        itemName={deleting?.name ?? ''}
        loading={deleteSpot.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
