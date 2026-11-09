import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConfirmDeleteDialog } from '@/components/common/confirm-delete-dialog';
import { useFeedback } from '@/components/common/feedback';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState, ErrorState, LoadingState } from '@/components/common/page-state';
import { useCategories } from '@/cases/categories/hooks/use-categories';
import { ProductFormDialog } from '@/cases/products/components/product-form-dialog';
import type { ProductDto } from '@/cases/products/dtos/product.dto';
import { useDeleteProduct, useProducts } from '@/cases/products/hooks/use-products';
import { formatCurrency } from '@/lib/format';

const ALL = 'all';

export function ProductsPage() {
  const notify = useFeedback();
  const { data: products, isLoading, isError, refetch } = useProducts();
  const { data: categories = [] } = useCategories();
  const deleteProduct = useDeleteProduct();

  const [categoryFilter, setCategoryFilter] = useState(ALL);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductDto | null>(null);
  const [deleting, setDeleting] = useState<ProductDto | null>(null);

  const filterOptions = [
    { value: ALL, label: 'Todas as categorias' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  // filtro por categoria
  const filtered = (products ?? []).filter((p) => categoryFilter === ALL || p.category?.id === categoryFilter);

  function openForm(product: ProductDto | null) {
    setEditing(product);
    setFormOpen(true);
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteProduct.mutate(deleting.id, {
      onSuccess: () => {
        notify('success', 'Produto excluído com sucesso.');
        setDeleting(null);
      },
      onError: () => {
        notify('error', 'Erro ao excluir o produto.');
        setDeleting(null);
      },
    });
  }

  return (
    <div>
      <PageHeader title="Produtos">
        <Button onClick={() => openForm(null)}>
          <Plus /> Novo produto
        </Button>
      </PageHeader>

      <div className="mb-4 w-64">
        <Select items={filterOptions} value={categoryFilter} onValueChange={(value) => setCategoryFilter(String(value))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <LoadingState />}
      {isError && <ErrorState onRetry={refetch} />}
      {products && filtered.length === 0 && <EmptyState message="Nenhum produto encontrado." />}

      {filtered.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Indicadores</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.picture ? (
                    <img src={product.picture} alt={product.name} className="size-12 rounded-md object-cover" />
                  ) : (
                    <div className="size-12 rounded-md bg-muted" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category?.name ?? '-'}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {product.vegetarian && <Badge variant="green">Vegetariano</Badge>}
                    {product.isNew && <Badge variant="blue">Novidade</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon-sm" aria-label="Editar" onClick={() => openForm(product)}>
                    <Pencil />
                  </Button>
                  <Button variant="ghost" size="icon-sm" aria-label="Excluir" onClick={() => setDeleting(product)}>
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ProductFormDialog open={formOpen} product={editing} onClose={() => setFormOpen(false)} />
      <ConfirmDeleteDialog
        open={deleting !== null}
        itemName={deleting?.name ?? ''}
        loading={deleteProduct.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
