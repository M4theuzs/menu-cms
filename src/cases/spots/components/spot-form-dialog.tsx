import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFeedback } from '@/components/common/feedback';
import type { SpotDto } from '../dtos/spot.dto';
import { useCreateSpot, useUpdateSpot } from '../hooks/use-spots';

interface Props {
  open: boolean;
  spot: SpotDto | null; // null = cadastro novo
  onClose: () => void;
}

export function SpotFormDialog({ open, spot, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent>
        <SpotForm key={spot?.id ?? 'new'} spot={spot} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

function SpotForm({ spot, onClose }: { spot: SpotDto | null; onClose: () => void }) {
  const notify = useFeedback();
  const createSpot = useCreateSpot();
  const updateSpot = useUpdateSpot();

  const [name, setName] = useState(spot?.name ?? '');
  const [active, setActive] = useState(spot?.active ?? true);
  const [error, setError] = useState('');

  const saving = createSpot.isPending || updateSpot.isPending;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!name.trim()) return setError('Informe o nome da mesa.');
    setError('');

    const dto = { name: name.trim(), active };
    const options = {
      onSuccess: () => {
        notify('success', spot ? 'Mesa atualizada com sucesso.' : 'Mesa cadastrada com sucesso.');
        onClose();
      },
      onError: () => notify('error', 'Erro ao salvar a mesa.'),
    };

    if (spot) updateSpot.mutate({ id: spot.id, dto }, options);
    else createSpot.mutate(dto, options);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>{spot ? 'Editar mesa' : 'Nova mesa'}</DialogTitle>
      </DialogHeader>

      <div className="grid gap-2">
        <Label htmlFor="spot-name">Nome</Label>
        <Input id="spot-name" placeholder="Ex.: Mesa 01" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <Label>
        <Checkbox checked={active} onCheckedChange={(value) => setActive(value === true)} />
        Mesa ativa
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
