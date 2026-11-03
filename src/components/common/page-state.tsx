import { Loader2 } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export function LoadingState() {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      Carregando...
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <Alert variant="destructive" className="flex items-center justify-between gap-3">
      <span>Não foi possível carregar os dados. Verifique se a API está no ar.</span>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </Alert>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <div className="rounded-xl border border-dashed py-12 text-center text-muted-foreground">{message}</div>;
}
