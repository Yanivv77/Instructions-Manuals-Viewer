export type FormField<T> = {
  name: keyof T;
  label: string;
  type: 'text' | 'number' | 'email' | 'url' | 'textarea' | 'date' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
};

export interface Importer {
  id?: string;
  name: string;
  logoUrl?: string;
}

export interface Brand {
  id?: string;
  importerId: string;
  name: string;
  logoUrl?: string;
}

export interface Product {
  id?: string;
  brandId: string;
  name: string;
  imageUrl?: string;
}

export interface Manual {
  productName: string;
  id?: string;
  productId: string;
  name: string;
  imageUrl?: string;
  manualPdfFile: string;
}