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

const manualFields: FormField<Manual>[] = [
  { name: 'name', label: 'שם מדריך', type: 'text', placeholder: 'הכנס שם מדריך', required: true },
  { name: 'manualPdfFile', label: 'קובץ PDF', type: 'text', placeholder: 'הכנס שם קובץ PDF', required: true },
];

const ManualsPage: React.FC = () => {
  const [manuals, setManuals] = useState<Manual[]| any>([]);
  const [importers, setImporters] = useState<Importer[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedImporter, setSelectedImporter] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [newManual, setNewManual] = useState<Omit<Manual, 'id'>>({ name: '', productId: '', manualPdfFile: '',productName: '' });
  const [editingManual, setEditingManual] = useState<Manual | any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadImporters();
    loadManuals();
  }, []);

  useEffect(() => {
    if (selectedImporter) {
      loadBrands(selectedImporter);
    }
  }, [selectedImporter]);

  useEffect(() => {
    if (selectedBrand) {
      loadProducts(selectedBrand);
    }
  }, [selectedBrand]);

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

  const loadManuals = async () => {
    try {
      const loadedManuals = await manualsAPI.getAll();
      const manualsWithProductNames = await Promise.all(
        loadedManuals.map(async (manual: Manual) => {
          const product = await productsAPI.getById(manual.productId);
          return { ...manual, productName: product?.name };
        })
      );
      setManuals(manualsWithProductNames);
    } catch (err) {
      setError('בעיה בטעינת מדריכים');
    }
  };

  const handleAddManual = async () => {
    try {
      await manualsAPI.add(newManual);
      setNewManual({ name: '', productId: '', manualPdfFile: '' ,productName:''});
      loadManuals();
    } catch (err) {
      setError('בעיה בהוספת מדריך');
    }
  };

  const handleUpdateManual = async () => {
    if (editingManual?.id) {
      try {
        await manualsAPI.update(editingManual.id, editingManual);
        setEditingManual(null);
        loadManuals();
      } catch (err) {
        setError('בעיה בעדכון מדריך');
      }
    }
  };

  const handleDeleteManual = async (id: string) => {
    try {
      await manualsAPI.delete(id);
      loadManuals();
    } catch (err) {
      setError('בעיה במחיקת מדריך');
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
              <option key={importer.id} value={importer.id}>{importer.name}</option>
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
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>

          <select 
            value={selectedProduct}
            onChange={(e) => {
              setSelectedProduct(e.target.value);
              setNewManual({...newManual, productId: e.target.value});
            }}
            disabled={!selectedBrand}
          >
            <option value="">בחר מוצר</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
        </div>

        <GenericForm<Omit<Manual, 'id'>>
          fields={manualFields}
          values={newManual}
          onChange={(field, value) => setNewManual({...newManual, [field]: value as string})}
          onSubmit={handleAddManual}
          buttonText="הוסף מדריך"
        />

        <ul className={styles.List}>
          {manuals.map((manual : Manual) => (
            <li key={manual.id}>
              {editingManual?.id === manual.id ? (
                <GenericForm<Manual>
                  fields={manualFields}
                  values={editingManual}
                  onChange={(field, value) => setEditingManual({...editingManual, [field]: value as string})}
                  onSubmit={handleUpdateManual}
                  buttonText="שמור"
                />
              ) : (
                <>
                  <span>{manual.name} - {manual.productName}</span>
                  <button onClick={() => setEditingManual(manual)}>ערוך</button>
                  <button onClick={() => manual.id && handleDeleteManual(manual.id)}>מחק</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ManualsPage;