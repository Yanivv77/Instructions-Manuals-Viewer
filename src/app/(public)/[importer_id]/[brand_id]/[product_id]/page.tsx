import Image from 'next/image';
import LoadingSpinner from '@/components/Client/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '@/components/Client/ErrorMessage/ErrorMessage';
import styles from '@/app/(public)/page.module.scss';
import { Product, Manual } from '@/types';
import { getProductById, getManualsByProductId } from '@/app/lib/getData';
import '@/styles/globals.scss';
import { Suspense } from 'react';

export default async function ProductPage({
  params,
}: {
  params: { importer_id: string; brand_id: string; product_id: string };
}) {
  
 
  try {
    const [product, manuals] = await Promise.all([
      getProductById(params.product_id),
      getManualsByProductId(params.product_id)
    ]);
   

   
    if (!product) {
      return <p>פרטי המוצר לא נמצאו.</p>;
    }

    return (
      <Suspense fallback={<LoadingSpinner />}>
        <div className={styles.productPage}>
          <h1>{product.name}</h1>
          <h2>מותג: {product.brandName}</h2>
         
          {product.imageUrl && (
            <Image src={product.imageUrl} alt={product.name} width={200} height={200} />
          )}
          <h2>הוראות הפעלה:</h2>
          {manuals.length > 0 ? (
            <ul className={styles.manualsList}>
              {manuals.map((manual) => (
                <button key={manual.id} className={styles.manualItem}>
                  <a 
                    href={manual.manualPdfFile} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.manualLink}
                  >
                    {manual.name || 'הוראות הפעלה'}
                  </a>
                </button>
              ))}
            </ul>
          ) : (
            <p>אין הוראות הפעלה זמינות למוצר זה.</p>
          )}
        </div>
      </Suspense>
    );
  } catch (error) {
    console.error('Error in ProductPage:', error);
    return <ErrorMessage message={(error as Error).message} />;
  }
}