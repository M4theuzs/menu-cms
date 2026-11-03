import type { ReactNode } from 'react';
import { Sidebar, type Section } from './sidebar';

interface CmsLayoutProps {
  current: Section;
  onChange: (section: Section) => void;
  children: ReactNode;
}

export function CmsLayout({ current, onChange, children }: CmsLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar current={current} onChange={onChange} />
      <main className="flex-1 overflow-x-auto p-6">{children}</main>
    </div>
  );
}
