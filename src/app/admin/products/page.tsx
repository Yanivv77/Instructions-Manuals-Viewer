'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout';
import GenericForm from '@/components/Admin/GenericForm/GenericForm';
import { productsAPI } from '@/firebase/collections/products';
import { brandsAPI } from '@/firebase/collections/brands';
import { importersAPI } from '@/firebase/collections/importers';
import { Product, Brand, Importer, FormField } from '@/types';
import styles from '../form.module.scss';

const productFields: FormField<Product>[] = [
  { name: 'name', label: 'שם מוצר', type: 'text', placeholder: 'הכנס שם מוצר', required: true },
  { name: 'imageUrl', label: 'כתובת תמונה', type: 'url', placeholder: 'הכנס כתובת תמונה' }
];

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [importers, setImporters] = useState<Importer[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({ name: '', brandId: '' });
  const [editingProduct, setEditingProduct] = useState<Product | any>(null);
  const [selectedImporter, setSelectedImporter] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadImporters();
  }, []);

  useEffect(() => {
    if (selectedImporter) {
      loadBrands(selectedImporter);
      setSelectedBrand('');
      setProducts([]);
    }
  }, [selectedImporter]);

  useEffect(() => {
    if (selectedBrand) {
      loadProducts(selectedBrand);
    } else {
      setProducts([]);
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

  const handleAddProduct = async () => {
    if (!selectedBrand) {
      setError('יש לבחור מותג לפני הוספת מוצר');
      return;
    }
    try {
      await productsAPI.add({ ...newProduct, brandId: selectedBrand });
      setNewProduct({ name: '', brandId: '' });
      loadProducts(selectedBrand);
    } catch (err) {
      setError('בעיה בהוספת מוצר');
    }
  };

  const handleUpdateProduct = async () => {
    if (editingProduct?.id) {
      try {
        await productsAPI.update(editingProduct.id, editingProduct);
        setEditingProduct(null);
        loadProducts(selectedBrand);
      } catch (err) {
        setError('בעיה בעדכון מוצר');
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await productsAPI.delete(id);
      loadProducts(selectedBrand);
    } catch (err) {
      setError('בעיה במחיקת מוצר');
    }
  };

  return (
    <>
      <div className={styles.Container}>
        <h1>ניהול מוצרים</h1>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.selectionContainer}>
          <select
            value={selectedImporter}
            onChange={(e) => setSelectedImporter(e.target.value)}
          >
            <option value="">בחר יבואן</option>
            {importers.map((importer) => (
              <option key={importer.id} value={importer.id}>{importer.name}</option>
            ))}
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            disabled={!selectedImporter}
          >
            <option value="">בחר מותג</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>

        {selectedBrand && (
          <>
            <GenericForm<Omit<Product, 'id'>>
              fields={productFields}
              values={newProduct}
              onChange={(field, value) => setNewProduct({...newProduct, [field]: value})}
              onSubmit={handleAddProduct}
              buttonText="הוסף מוצר"
            />

            <h2>רשימת מוצרים</h2>
            <ul className={styles.List}>
              {products.map((product) => (
                <li key={product.id}>
                  {editingProduct?.id === product.id ? (
                    <GenericForm<Product>
                      fields={productFields}
                      values={editingProduct}
                      onChange={(field, value) => setEditingProduct({...editingProduct, [field]: value})}
                      onSubmit={handleUpdateProduct}
                      buttonText="שמור"
                    />
                  ) : (
                    <>
                      <span>{product.name}</span>
                      <button onClick={() => setEditingProduct(product)}>ערוך</button>
                      <button onClick={() => product.id && handleDeleteProduct(product.id)}>מחק</button>
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

export default ProductsPage;