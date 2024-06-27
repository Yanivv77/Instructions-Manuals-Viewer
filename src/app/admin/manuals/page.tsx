'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout';
import GenericForm from '@/components/Admin/GenericForm/GenericForm';
import { manualsAPI } from '@/firebase/collections/manuals';
import { importersAPI } from '@/firebase/collections/importers';
import { brandsAPI } from '@/firebase/collections/brands';
import { productsAPI } from '@/firebase/collections/products';
import { Manual, Importer, Brand, Product, FormField } from '@/types';
import styles from '../form.module.scss';

const manualFields: FormField<Omit<Manual, 'id'>>[] = [
  {
    name: 'name',
    label: 'שם מדריך',
    type: 'text',
    placeholder: 'הכנס שם מדריך',
    required: true,
  },
  {
    name: 'manualPdfFile',
    label: 'קובץ PDF',
    type: 'pdfUpload',
    required: true,
  },
];

const ManualsPage: React.FC = () => {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [importers, setImporters] = useState<Importer[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedImporter, setSelectedImporter] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [newManual, setNewManual] = useState<Omit<Manual, 'id'>>({
    name: '',
    manualPdfFile: '',
  });
  const [editingManual, setEditingManual] = useState<Manual | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);

  useEffect(() => {
    loadImporters();
  }, []);

  useEffect(() => {
    if (selectedImporter) {
      loadBrands(selectedImporter);
      setSelectedBrand('');
      setSelectedProduct('');
      setManuals([]);
    }
  }, [selectedImporter]);

  useEffect(() => {
    if (selectedBrand) {
      loadProducts(selectedBrand);
      setSelectedProduct('');
      setManuals([]);
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedProduct) {
      loadManuals(selectedProduct);
    } else {
      setManuals([]);
    }
  }, [selectedProduct]);

  const isFormValid = () => {
    return selectedProduct && isPdfUploaded && newManual.name !== '';
  };

  const loadImporters = async () => {
    try {
      const loadedImporters = await importersAPI.getAll();
      setImporters(loadedImporters);
    } catch (err) {
      setError('בעיה בטעינת יבואנים');
    }
  };

  const loadBrands = async (importerId: string) => {
    try {
      const loadedBrands = await brandsAPI.getByImporterId(importerId);
      setBrands(loadedBrands);
    } catch (err) {
      setError('בעיה בטעינת מותגים');
    }
  };

  const loadProducts = async (brandId: string) => {
    try {
      const loadedProducts = await productsAPI.getByBrandId(brandId);
      setProducts(loadedProducts);
    } catch (err) {
      setError('בעיה בטעינת מוצרים');
    }
  };

  const loadManuals = async (productId: string) => {
    try {
      const loadedManuals = await manualsAPI.getByProductId(productId);
      setManuals(loadedManuals);
    } catch (err: any) {
      console.error('Error loading manual:', err);
      setError('בעיה בטעינת מדריכים');
    }
  };

  const handleAddManual = async () => {
    if (!isFormValid()) {
      setError('תעלה קובץ PDF ותמלא את כל השדות');
      return;
    }

    try {
      const newManualId = await manualsAPI.add(selectedProduct, newManual);
      setIsPdfUploaded(false);
      setManuals([...manuals, { id: newManualId, ...newManual }]);
      setNewManual({ name: '', manualPdfFile: '' });
    } catch (err) {
      console.error('Error adding manual:', err);
      setError('בעיה בהוספת מדריך');
    }
  };

  const handleUpdateManual = async () => {
    if (editingManual?.id && selectedProduct) {
      try {
        await manualsAPI.update(selectedProduct, editingManual.id, editingManual);
        setEditingManual(null);
        loadManuals(selectedProduct);
      } catch (err) {
        console.error('Error updating manual:', err);
        setError('בעיה בעדכון מדריך');
      }
    }
  };

  const handleDeleteManual = async (manualId: string) => {
    if (selectedProduct) {
      try {
        await manualsAPI.delete(selectedProduct, manualId);
        loadManuals(selectedProduct);
      } catch (err) {
        console.error('Error deleting manual:', err);
        setError('בעיה במחיקת מדריך');
      }
    }
  };

  return (
    <>
      <div className={styles.Container}>
        <h1>ניהול מדריכים</h1>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.selectionContainer}>
          <select
            value={selectedImporter}
            onChange={(e) => {
              setSelectedImporter(e.target.value);
              setSelectedBrand('');
              setSelectedProduct('');
            }}
          >
            <option value="">בחר יבואן</option>
            {importers.map((importer) => (
              <option key={importer.id} value={importer.id}>
                {importer.name}
              </option>
            ))}
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedProduct('');
            }}
            disabled={!selectedImporter}
          >
            <option value="">בחר מותג</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>

          <select
            value={selectedProduct}
            onChange={(e) => {
              setSelectedProduct(e.target.value);
            }}
            disabled={!selectedBrand}
          >
            <option value="">בחר מוצר</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <>
            <GenericForm<Omit<Manual, 'id'>>
              fields={manualFields}
              values={newManual}
              onChange={(field, value) => setNewManual({ ...newManual, [field]: value })}
              onSubmit={handleAddManual}
              buttonText="הוסף מדריך"
              isSubmitting={!isFormValid()}
              isPdfUploaded={isPdfUploaded}
              setNewManual={setNewManual}
              setIsPdfUploaded={setIsPdfUploaded}
            />

            <h2>רשימת מדריכים</h2>
            <ul className={styles.List}>
              {manuals.map((manual: Manual) => (
                <li key={manual.id}>
                  {editingManual?.id === manual.id ? (
                    <GenericForm<Manual>
                      fields={manualFields}
                      values={editingManual}
                      onChange={(field, value) =>
                        setEditingManual({ ...editingManual, [field]: value as string })
                      }
                      onSubmit={handleUpdateManual}
                      buttonText="שמור"
                      isPdfUploaded={isPdfUploaded}
                      setNewManual={setEditingManual as any}
                      setIsPdfUploaded={setIsPdfUploaded}
                    />
                  ) : (
                    <>
                      <span>{manual.name}</span>
                      {manual.manualPdfFile && (
                        <a
                          href={manual.manualPdfFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.viewPdfButton}
                        >
                          הורד קובץ PDF
                        </a>
                      )}
                      <button onClick={() => setEditingManual(manual)}>ערוך</button>
                      <button onClick={() => manual.id && handleDeleteManual(manual.id)}>מחק</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default ManualsPage;