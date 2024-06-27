
import React, { useState } from 'react';
import { FormField, Manual } from '@/types';
import PdfUpload from '../PdfUpload/PdfUpload';
import styles from './GenericForm.module.scss'; 


interface GenericFormProps<T> {
  fields: FormField<T>[];
  values: T | null;
  onChange: (field: keyof T, value: any) => void;
  onSubmit: () => void;
  buttonText: string;
  isSubmitting?: boolean;
  isPdfUploaded?: boolean; 
  setNewManual?: (manual: Omit<Manual, 'id'>) => void; 
  setIsPdfUploaded?: (uploaded: boolean) => void;
}

function GenericForm<T>({
  fields,
  values,
  onChange,
  onSubmit,
  buttonText,
  isSubmitting = false,
  isPdfUploaded = false,
  setNewManual = () => {},
  setIsPdfUploaded = () => {},
}: GenericFormProps<T>) {
  const handleFieldChange = (fieldName: keyof T, value: any) => {
    onChange(fieldName, value);
  };

  return (
    <form className={styles.form} onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}>
      {fields.map((field) => (
        <div key={field.name as string} className={styles.fieldContainer}>
          <label htmlFor={field.name as string}>{field.label}</label>

          {field.type === 'textarea' ? ( 
            <textarea
              id={field.name as string}
              value={(values?.[field.name]) as string || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name as string}
              value={(values?.[field.name]) as string || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.required}
            >
              <option value="">בחר {field.label}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === 'pdfUpload' ? (
            
            <PdfUpload
            onUpload={(url) => {
              setNewManual({ ...values, manualPdfFile: url } as Omit<Manual, 'id'>);
              setIsPdfUploaded(true);
            }}
            isPdfUploaded={isPdfUploaded} 
          />
          ) : ( 
            <input
            type={field.type}
            id={field.name as string}
            value={values?.[field.name] as string || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            />
          )}
        </div>
      ))}
       <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {buttonText}
      </button>
    </form>
  );
}

export default GenericForm;