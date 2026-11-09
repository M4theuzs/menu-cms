import { useState } from 'react';
import { FeedbackProvider } from '@/components/common/feedback';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState } from '@/components/common/page-state';
import { CmsLayout } from '@/components/layout/cms-layout';
import type { Section } from '@/components/layout/sidebar';
import { CategoriesPage } from '@/pages/categories-page';
import { ProductsPage } from '@/pages/products-page';
import { SpotsPage } from '@/pages/spots-page';

const TITLES: Record<Section, string> = {
  categories: 'Categorias',
  products: 'Produtos',
  spots: 'Mesas',
  'guest-checks': 'Comandas em aberto',
  kanban: 'Kanban de pedidos',
};

function App() {
  const [section, setSection] = useState<Section>('categories');

  return (
    <FeedbackProvider>
      <CmsLayout current={section} onChange={setSection}>
        {section === 'categories' && <CategoriesPage />}
        {section === 'products' && <ProductsPage />}
        {section === 'spots' && <SpotsPage />}

        {/* as outras páginas entram nos próximos dias */}
        {(section === 'guest-checks' || section === 'kanban') && (
          <>
            <PageHeader title={TITLES[section]} />
            <EmptyState message="Em construção." />
          </>
        )}
      </CmsLayout>
    </FeedbackProvider>
  );
}

export default App;
