// src/types/index.ts

export interface Importer {
  id?: string;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
}

export interface Brand {
  id?: string;
  importerId: string;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
}

export interface Product {
  id?: string;
  brandId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category?: string;
}

export interface Model {
  id?: string;
  productId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  manualUrl: string;
  releaseDate?: Date;
}