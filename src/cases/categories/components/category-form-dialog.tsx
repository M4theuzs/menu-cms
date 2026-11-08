import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFeedback } from '@/components/common/feedback';
import type { CategoryDto } from '../dtos/category.dto';
import { useCreateCategory, useUpdateCategory } from '../hooks/use-categories';

interface Props {
  open: boolean;
  category: CategoryDto | null; // null = cadastro novo
  onClose: () => void;
}

export function CategoryFormDialog({ open, category, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent>
        {/* a key reinicia o formulário sempre que muda a categoria editada */}
        <CategoryForm key={category?.id ?? 'new'} category={category} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

function CategoryForm({ category, onClose }: { category: CategoryDto | null; onClose: () => void }) {
  const notify = useFeedback();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [name, setName] = useState(category?.name ?? '');
  const [icon, setIcon] = useState(category?.icon ?? '');
  const [displayOrder, setDisplayOrder] = useState(String(category?.displayOrder ?? 0));
  const [active, setActive] = useState(category?.active ?? true);
  const [error, setError] = useState('');

  const saving = createCategory.isPending || updateCategory.isPending;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    // validação mínima antes de enviar para a API
    if (!name.trim()) return setError('Informe o nome da categoria.');
    if (!icon.trim()) return setError('Informe o ícone da categoria.');
    if (displayOrder === '' || Number.isNaN(Number(displayOrder))) return setError('Informe a ordem de exibição.');
    setError('');

    const dto = { name: name.trim(), icon: icon.trim(), displayOrder: Number(displayOrder), active };
    const options = {
      onSuccess: () => {
        notify('success', category ? 'Categoria atualizada com sucesso.' : 'Categoria cadastrada com sucesso.');
        onClose();
      },
      onError: () => notify('error', 'Erro ao salvar a categoria.'),
    };

    if (category) updateCategory.mutate({ id: category.id, dto }, options);
    else createCategory.mutate(dto, options);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>{category ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
      </DialogHeader>

      <div className="grid gap-2">
        <Label htmlFor="category-name">Nome</Label>
        <Input id="category-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category-icon">Ícone</Label>
        <Input id="category-icon" placeholder="Ex.: 🍔 ou nome do ícone" value={icon} onChange={(e) => setIcon(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category-order">Ordem de exibição</Label>
        <Input id="category-order" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
      </div>
      <Label>
        <Checkbox checked={active} onCheckedChange={(value) => setActive(value === true)} />
        Categoria ativa
      </Label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogFooter>
    </form>
  );
}
