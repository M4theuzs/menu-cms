import { useState } from 'react';
import { FeedbackProvider } from '@/components/common/feedback';
import { CmsLayout } from '@/components/layout/cms-layout';
import type { Section } from '@/components/layout/sidebar';
import { CategoriesPage } from '@/pages/categories-page';
import { GuestChecksPage } from '@/pages/guest-checks-page';
import { KanbanPage } from '@/pages/kanban-page';
import { ProductsPage } from '@/pages/products-page';
import { SpotsPage } from '@/pages/spots-page';

function App() {
  const [section, setSection] = useState<Section>('categories');

  return (
    <FeedbackProvider>
      <CmsLayout current={section} onChange={setSection}>
        {section === 'categories' && <CategoriesPage />}
        {section === 'products' && <ProductsPage />}
        {section === 'spots' && <SpotsPage />}
        {section === 'guest-checks' && <GuestChecksPage />}
        {section === 'kanban' && <KanbanPage />}
      </CmsLayout>
    </FeedbackProvider>
  );
}

export default App;
