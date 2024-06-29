import { Suspense } from 'react';
import Link from 'next/link';
import Card from '@/components/Client/Card/Card';
import LoadingSpinner from '@/components/Client/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '@/components/Client/ErrorMessage/ErrorMessage';
import { getProducts, preloadProducts } from '@/app/lib/getData';
import '@/styles/globals.scss';

import styles from '@/app/(public)/page.module.scss';

import { Product } from '@/types';

export function generateMetadata({ params }: { params: { brand_id: string; importer_id: string } }) {
  preloadProducts(params.brand_id);
  return { title: 'Products' };
}

export default async function ProductsPage({ params }: { params: { brand_id: string; importer_id: string } }) {
  let products: Product[];

  try {
    products = await getProducts(params.brand_id);
  } catch (error) {
    return <ErrorMessage message={(error as Error).message} />;
  }

  if (products.length === 0) {
    return <p>No products found for this brand.</p>;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <h1 className="center">מוצרים</h1>
      <div className={styles.Grid}>
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/${params.importer_id}/${params.brand_id}/${product.id}`}
            className={styles.Link}
          >
            <Card name={product.name} imageUrl={product.imageUrl || ''} />
          </Link>
        ))}
      </div>
    </Suspense>
  );
}