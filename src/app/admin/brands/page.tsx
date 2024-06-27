'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout';
import GenericForm from '@/components/Admin/GenericForm/GenericForm';
import { brandsAPI } from '@/firebase/collections/brands';
import { importersAPI } from '@/firebase/collections/importers';
import { Brand, Importer, FormField } from '@/types';
import styles from '../form.module.scss';

const brandFields: FormField<Brand>[] = [
  { name: 'name', label: 'שם מותג', type: 'text', placeholder: 'הוסף שם מותג', required: true },
  { name: 'logoUrl', label: 'לוגו מותג', type: 'url', placeholder: 'הוסף קישור לתמונה' },
];

const BrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [importers, setImporters] = useState<Importer[]>([]);
  const [newBrand, setNewBrand] = useState<Omit<Brand, 'id'>>({ name: '', importerId: '' });
  const [editingBrand, setEditingBrand] = useState<Brand | any>(null);
  const [selectedImporter, setSelectedImporter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadImporters();
  }, []);

  useEffect(() => {
    if (selectedImporter) {
      loadBrands(selectedImporter);
    } else {
      setBrands([]);
    }
  }, [selectedImporter]);

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

  const handleAddBrand = async () => {
    if (!selectedImporter) {
      setError('יש לבחור יבואן לפני הוספת מותג');
      return;
    }
    try {
      await brandsAPI.add({ ...newBrand, importerId: selectedImporter });
      setNewBrand({ name: '', importerId: '' });
      loadBrands(selectedImporter);
    } catch (err) {
      setError('בעיה בהוספת מותג');
    }
  };

  const handleUpdateBrand = async () => {
    if (editingBrand?.id) {
      try {
        await brandsAPI.update(editingBrand.id, editingBrand);
        setEditingBrand(null);
        loadBrands(selectedImporter);
      } catch (err) {
        setError('בעיה בעדכון מותג');
      }
    }
  };

  const handleDeleteBrand = async (id: string) => {
    try {
      await brandsAPI.delete(id);
      loadBrands(selectedImporter);
    } catch (err) {
      setError('בעיה במחיקת מותג');
    }
  };

  return (
    <>
      <div className={styles.Container}>
        <h1>ניהול מותגים</h1>
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
        </div>

        {selectedImporter && (
          <>
            <GenericForm<Omit<Brand, 'id'>>
              fields={brandFields}
              values={newBrand}
              onChange={(field, value) => setNewBrand({...newBrand, [field]: value})}
              onSubmit={handleAddBrand}
              buttonText="הוסף מותג"
            />
          
            <h2>רשימת מותגים</h2>
            <ul className={styles.List}>
              {brands.map((brand) => (
                <li key={brand.id}>
                  {editingBrand?.id === brand.id ? (
                    <GenericForm<Brand>
                      fields={brandFields}
                      values={editingBrand}
                      onChange={(field, value) => setEditingBrand({...editingBrand, [field]: value})}
                      onSubmit={handleUpdateBrand}
                      buttonText="שמור"
                    />
                  ) : (
                    <>
                      <span>{brand.name}</span>
                      <button onClick={() => setEditingBrand(brand)}>ערוך</button>
                      <button onClick={() => brand.id && handleDeleteBrand(brand.id)}>מחק</button>
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

export default BrandsPage;