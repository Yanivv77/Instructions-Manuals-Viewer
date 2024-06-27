import React from 'react';
import { FormField } from '@/types';
import styles from './GenericForm.module.scss';

interface GenericFormProps<T> {
  fields: FormField<T>[];
  values: T | null;  
  onChange: (field: keyof T, value: string) => void;
  onSubmit: () => void;
  buttonText: string;
}

function GenericForm<T>({ fields, values, onChange, onSubmit, buttonText }: GenericFormProps<T>) {
  return (
    <form className={styles.form} onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      {fields.map((field) => (
        <div key={field.name as string} className={styles.fieldContainer}>
          <label htmlFor={field.name as string}>{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.name as string}
              value={(values?.[field.name]) as string || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name as string}
              value={(values?.[field.name]) as string || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              required={field.required}
            >
              <option value="">בחר {field.label}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              id={field.name as string}
              value={values?.[field.name] as string || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          )}
        </div>
      ))}
      <button type="submit" className={styles.submitButton}>{buttonText}</button>
    </form>
  );
}

export default GenericForm;