'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout';
import GenericForm from '@/components/Admin/GenericForm/GenericForm';
import { importersAPI } from '@/firebase/collections/importers';
import { brandsAPI } from '@/firebase/collections/brands';
import { Importer, Brand, FormField } from '@/types';
import styles from '../form.module.scss';

const importerFields: FormField<Importer>[] = [
  { name: 'name', label: 'שם יבואן', type: 'text', placeholder: 'הכנס שם', required: true },
  { name: 'logoUrl', label: 'לוגו יבואן', type: 'url', placeholder: 'הכנס כתובת לתמונה' },
];

const ImportersPage: React.FC = () => {
  const [importers, setImporters] = useState<Importer[]>([]);
  const [newImporter, setNewImporter] = useState<Omit<Importer, 'id'>>({ name: '' });
  const [editingImporter, setEditingImporter] = useState<Importer | any>(null);
  const [selectedImporter, setSelectedImporter] = useState<Importer | any>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadImporters();
  }, []);

  useEffect(() => {
    if (selectedImporter) {
      loadBrands(selectedImporter.id!);
    }
  }, [selectedImporter]);

  const loadImporters = async () => {
    try {
      const loadedImporters = await importersAPI.getAll();
      setImporters(loadedImporters);
    } catch (err) {
      setError('בעייה בטעינת יבואנים');
    }
  };

  const loadBrands = async (importerId: string) => {
    try {
      const loadedBrands = await brandsAPI.getByImporterId(importerId);
      setBrands(loadedBrands);
    } catch (err) {
      setError('בעייה בטעינת מותגים');
    }
  };

  const handleAddImporter = async () => {
    try {
      await importersAPI.add(newImporter);
      setNewImporter({ name: '' });
      loadImporters();
    } catch (err) {
      setError('בעייה בהוספת יבואן');
    }
  };

  const handleUpdateImporter = async () => {
    if (editingImporter?.id) {
      try {
        await importersAPI.update(editingImporter.id, editingImporter);
        setEditingImporter(null);
        loadImporters();
      } catch (err) {
        setError('בעייה בעדכון יבואן');
      }
    }
  };

  const handleDeleteImporter = async (id: string) => {
    try {
      await importersAPI.delete(id);
      loadImporters();
    } catch (err) {
      setError('בעייה במחיקת יבואן');
    }
  };

  return (
    <>
      <div className={styles.Container}>
        <h1>הוספת יבואן</h1>
        {error && <p className={styles.error}>{error}</p>}
        
        <GenericForm<Omit<Importer, 'id'>>
          fields={importerFields}
          values={newImporter}
          onChange={(field, value) => setNewImporter({...newImporter, [field]: value})}
          onSubmit={handleAddImporter}
          buttonText="הוסף יבואן"
        />

       

        <h2>רשימת יבואנים</h2>
        <ul className={styles.List}>
          {importers.map((importer) => (
            <li key={importer.id}>
              {editingImporter?.id === importer.id ? (
                <GenericForm<Importer>
                  fields={importerFields}
                  values={editingImporter}
                  onChange={(field, value) => setEditingImporter({...editingImporter, [field]: value})}
                  onSubmit={handleUpdateImporter}
                  buttonText="שמור"
                />
              ) : (
                <>
                  <span>{importer.name}</span>
                  <button onClick={() => setEditingImporter(importer)}>ערוך</button>
                  <button onClick={() => importer.id && handleDeleteImporter(importer.id)}>מחק</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ImportersPage;