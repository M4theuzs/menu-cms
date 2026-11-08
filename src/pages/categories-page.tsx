import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConfirmDeleteDialog } from '@/components/common/confirm-delete-dialog';
import { useFeedback } from '@/components/common/feedback';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState, ErrorState, LoadingState } from '@/components/common/page-state';
import { CategoryFormDialog } from '@/cases/categories/components/category-form-dialog';
import type { CategoryDto } from '@/cases/categories/dtos/category.dto';
import { useCategories, useDeleteCategory } from '@/cases/categories/hooks/use-categories';

export function CategoriesPage() {
  const notify = useFeedback();
  const { data: categories, isLoading, isError, refetch } = useCategories();
  const deleteCategory = useDeleteCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryDto | null>(null);
  const [deleting, setDeleting] = useState<CategoryDto | null>(null);

  function openForm(category: CategoryDto | null) {
    setEditing(category);
    setFormOpen(true);
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteCategory.mutate(deleting.id, {
      onSuccess: () => {
        notify('success', 'Categoria excluída com sucesso.');
        setDeleting(null);
      },
      onError: () => {
        notify('error', 'Erro ao excluir a categoria.');
        setDeleting(null);
      },
    });
  }

  return (
    <div>
      <PageHeader title="Categorias">
        <Button onClick={() => openForm(null)}>
          <Plus /> Nova categoria
        </Button>
      </PageHeader>

      {isLoading && <LoadingState />}
      {isError && <ErrorState onRetry={refetch} />}
      {categories && categories.length === 0 && <EmptyState message="Nenhuma categoria cadastrada." />}

      {categories && categories.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Ícone</TableHead>
              <TableHead>Ordem</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...categories]
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.icon}</TableCell>
                  <TableCell>{category.displayOrder}</TableCell>
                  <TableCell>
                    <Badge variant={category.active ? 'green' : 'gray'}>{category.active ? 'Ativa' : 'Inativa'}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-sm" aria-label="Editar" onClick={() => openForm(category)}>
                      <Pencil />
                    </Button>
                    <Button variant="ghost" size="icon-sm" aria-label="Excluir" onClick={() => setDeleting(category)}>
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}

      <CategoryFormDialog open={formOpen} category={editing} onClose={() => setFormOpen(false)} />
      <ConfirmDeleteDialog
        open={deleting !== null}
        itemName={deleting?.name ?? ''}
        loading={deleteCategory.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
