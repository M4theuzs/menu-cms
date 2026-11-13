import { useState } from 'react';
import { FeedbackProvider } from '@/components/common/feedback';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState } from '@/components/common/page-state';
import { CmsLayout } from '@/components/layout/cms-layout';
import type { Section } from '@/components/layout/sidebar';
import { CategoriesPage } from '@/pages/categories-page';
import { GuestChecksPage } from '@/pages/guest-checks-page';
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

        {/* o Kanban (bônus) entra no último dia */}
        {section === 'kanban' && (
          <>
            <PageHeader title="Kanban de pedidos" />
            <EmptyState message="Em construção." />
          </>
        )}
      </CmsLayout>
    </FeedbackProvider>
  );
}

export default App;
