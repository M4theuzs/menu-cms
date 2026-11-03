import { ClipboardList, Columns3, LayoutGrid, Table2, Tags, UtensilsCrossed } from 'lucide-react';
import { cn } from 'cn';

export type Section = 'categories' | 'products' | 'spots' | 'guest-checks' | 'kanban';

const ITEMS = [
  { id: 'categories', label: 'Categorias', icon: Tags },
  { id: 'products', label: 'Produtos', icon: UtensilsCrossed },
  { id: 'spots', label: 'Mesas', icon: Table2 },
  { id: 'guest-checks', label: 'Comandas', icon: ClipboardList },
  { id: 'kanban', label: 'Kanban', icon: Columns3 },
] as const;

interface SidebarProps {
  current: Section;
  onChange: (section: Section) => void;
}

export function Sidebar({ current, onChange }: SidebarProps) {
  return (
    <aside className="flex w-56 shrink-0 flex-col gap-1 border-r p-4">
      <div className="mb-4 flex items-center gap-2 px-2 text-lg font-semibold">
        <LayoutGrid className="size-5" />
        Menu CMS
      </div>
      {ITEMS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            'flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-muted',
            current === id && 'bg-muted font-medium',
          )}
        >
          <Icon className="size-4" />
          {label}
        </button>
      ))}
    </aside>
  );
}
