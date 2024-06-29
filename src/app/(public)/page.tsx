import { Suspense } from 'react';
import Link from 'next/link';
import Card from '@/components/Client/Card/Card';
import LoadingSpinner from '@/components/Client/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '@/components/Client/ErrorMessage/ErrorMessage';
import { getImporters, preloadImporters } from '@/app/lib/getData';
import styles from './page.module.scss';
import '@/styles/globals.scss';

import { Importer } from '@/types';

export function generateMetadata() {
  preloadImporters();
  return { title: 'Importers' };
}

export default async function Home() {
  let importers: Importer[];

  try {
    importers = await getImporters();
  } catch (error) {
    return <ErrorMessage message={(error as Error).message} />;
  }

  if (importers.length === 0) {
    return <p>No importers found.</p>;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <h1 className="center">יבאונים</h1>

      <div className={styles.Grid}>
        {importers.map((importer: Importer) => (
          <Link
            key={importer.id}
            href={`/${importer.id}`} 
            className={styles.Link}
          >
            <Card name={importer.name} imageUrl={importer.logoUrl || ''} />
          </Link>
        ))}
      </div>
    </Suspense>
  );
}