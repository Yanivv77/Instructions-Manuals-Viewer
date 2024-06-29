export type FormField<T> = {
  name: keyof T;
  label: string;
  type: 'text' | 'number' | 'email' | 'url' | 'textarea' | 'date' | 'select'| 'pdfUpload';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
};

export interface Importer {
  id?: string;
  name: string;
  logoUrl?: string;
  createdAt?: Date;
}

export interface Brand {
  id?: string;
  importerId: string;
  importerName?: string; 
  name: string;
  logoUrl?: string;
  createdAt?: Date;
}

export interface Product {
  id?: string;
  brandId: string;
  brandName?: string;
  name: string;
  imageUrl?: string;
  createdAt?: Date;
}

export interface Manual {
  id?: string;
  productId?: string;
  productName?: string;
  name: string;
  imageUrl?: string;
  manualPdfFile: string;
  createdAt?: Date;
}
