import { Suspense } from 'react';
import Link from 'next/link';
import Card from '@/components/Client/Card/Card';
import LoadingSpinner from '@/components/Client/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '@/components/Client/ErrorMessage/ErrorMessage';
import { getBrands, preloadBrands } from '@/app/lib/getData';
import '@/styles/globals.scss';

import styles from '@/app/(public)/page.module.scss';

import { Brand } from '@/types';

export function generateMetadata({ params }: { params: { importer_id: string } }) {

  preloadBrands(params.importer_id);
  return { title: 'Brands' };
}

export default async function BrandsPage({ params }: { params: { importer_id: string } }) {
  let brands: Brand[];


  try {
    brands = await getBrands(params.importer_id);

  } catch (error) {
    return <ErrorMessage message={(error as Error).message} />;
  }

  if (brands.length === 0) {
    return <p>No brands found for this importer.</p>;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <h1 className="center">מותגים</h1>
      <div className={styles.Grid}>
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/${params.importer_id}/${brand.id}`} 
            className={styles.Link}
          >
            <Card name={brand.name} imageUrl={brand.logoUrl || ''} />
          </Link>
        ))}
      </div>
    </Suspense>
  );
}