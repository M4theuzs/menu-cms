import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFeedback } from '@/components/common/feedback';
import { useCategories } from '@/cases/categories/hooks/use-categories';
import type { ProductDto } from '../dtos/product.dto';
import { useCreateProduct, useUpdateProduct } from '../hooks/use-products';

const NO_CATEGORY = 'none';

interface Props {
  open: boolean;
  product: ProductDto | null; // null = cadastro novo
  onClose: () => void;
}

export function ProductFormDialog({ open, product, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent>
        <ProductForm key={product?.id ?? 'new'} product={product} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

function ProductForm({ product, onClose }: { product: ProductDto | null; onClose: () => void }) {
  const notify = useFeedback();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { data: categories = [] } = useCategories(); // select alimentado pela API

  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [picture, setPicture] = useState(product?.picture ?? '');
  const [categoryId, setCategoryId] = useState(product?.category?.id ?? NO_CATEGORY);
  const [vegetarian, setVegetarian] = useState(product?.vegetarian ?? false);
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [active, setActive] = useState(product?.active ?? true);
  const [error, setError] = useState('');

  const saving = createProduct.isPending || updateProduct.isPending;

  // Categorias inativas não aparecem, exceto a que já está vinculada ao produto
  const options = [
    { value: NO_CATEGORY, label: 'Sem categoria' },
    ...categories
      .filter((c) => c.active || c.id === product?.category?.id)
      .map((c) => ({ value: c.id, label: c.name })),
  ];

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!name.trim()) return setError('Informe o nome do produto.');
    if (!(Number(price) > 0)) return setError('O preço deve ser maior que zero.');
    setError('');

    const dto = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      picture: picture.trim(),
      vegetarian,
      isNew,
      active,
      categoryId: categoryId === NO_CATEGORY ? null : categoryId,
    };
    const callbacks = {
      onSuccess: () => {
        notify('success', product ? 'Produto atualizado com sucesso.' : 'Produto cadastrado com sucesso.');
        onClose();
      },
      onError: () => notify('error', 'Erro ao salvar o produto.'),
    };

    if (product) updateProduct.mutate({ id: product.id, dto }, callbacks);
    else createProduct.mutate(dto, callbacks);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>{product ? 'Editar produto' : 'Novo produto'}</DialogTitle>
      </DialogHeader>

      <div className="grid gap-2">
        <Label htmlFor="product-name">Nome</Label>
        <Input id="product-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="product-description">Descrição</Label>
        <Textarea id="product-description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="product-price">Preço (R$)</Label>
          <Input id="product-price" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Categoria</Label>
          <Select items={options} value={categoryId} onValueChange={(value) => setCategoryId(String(value))}>
            <SelectTrigger>
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
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="product-picture">URL da imagem</Label>
        <Input id="product-picture" placeholder="https://..." value={picture} onChange={(e) => setPicture(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-4">
        <Label>
          <Checkbox checked={vegetarian} onCheckedChange={(value) => setVegetarian(value === true)} />
          Vegetariano
        </Label>
        <Label>
          <Checkbox checked={isNew} onCheckedChange={(value) => setIsNew(value === true)} />
          Novidade
        </Label>
        <Label>
          <Checkbox checked={active} onCheckedChange={(value) => setActive(value === true)} />
          Ativo
        </Label>
      </div>

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
