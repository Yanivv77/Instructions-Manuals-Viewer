// app/lib/getData.ts

import { cache } from 'react'
import 'server-only'
import { Importer, Brand, Product, Manual } from '@/types'
import { headers } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const preloadImporters = () => {
  void getImporters()
}

export const getImporters = cache(async (): Promise<Importer[]> => {
  const res = await fetch(`${API_BASE_URL}/api/importers`, {
    next: { revalidate: 3600 },
    headers: { 'Content-Type': 'application/json' },
  })
  
  if (!res.ok) {
    throw new Error(`Failed to fetch importers: ${res.status}`)
  }
  
  return res.json()
})

export const getImporterById = cache(async (importerId: string): Promise<Importer | null> => {
  try {

    const res = await fetch(`${API_BASE_URL}/api/importers/${importerId}`, {
      next: { revalidate: 3600 },
      headers: { 'Content-Type': 'application/json' },
    });


    const text = await res.text();


    if (!res.ok) {
      throw new Error(`Failed to fetch importer: ${res.status} - ${text}`);
    }

    try {
      const data = JSON.parse(text);
      return data;
    } catch (jsonError) {
      console.error(`Failed to parse JSON for importer ${importerId}:`, jsonError);
      throw new Error(`Invalid JSON response for importer ${importerId}`);
    }
  } catch (error) {
    console.error(`Error fetching importer ${importerId}:`, error);
    throw error;
  }
});


export async function getBrandById(id: string): Promise<Brand | null> {
  try {
    const response = await fetch(`/api/brands/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch brand: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getBrandById:', error);
    return null;
  }
}


export const getProductById = cache(async (productId: string): Promise<Product | null> => {
  const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
    next: { revalidate: 3600 }, 
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.status}`);
  }

  return res.json();
});

export const preloadBrands = (importerId: string) => {
  void getBrands(importerId)
}

export const getBrands = cache(async (importerId: string): Promise<Brand[]> => {
  const res = await fetch(`${API_BASE_URL}/api/brands?importerId=${importerId}`, {
    next: { revalidate: 3600 },
    headers: { 'Content-Type': 'application/json' },
  })
  
  
  if (!res.ok) {
    throw new Error(`Failed to fetch brands: ${res.status}`)
  }
  
  return res.json()
})

export const preloadProducts = (brandId: string) => {
  void getProducts(brandId)
}

export const getProducts = cache(
  async (brandId: string): Promise<Product[]> => {
    const res = await fetch(
      `${API_BASE_URL}/api/products?brandId=${brandId}`,
      {
        next: { revalidate: 3600 },
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    return res.json();
  }
);

export const getManuals = cache(async (productId: string): Promise<Manual[]> => {
  const res = await fetch(`${API_BASE_URL}/api/manuals?productId=${productId}`, {
    next: { revalidate: 3600 },
    headers: { 'Content-Type': 'application/json' },
  })
  
  if (!res.ok) {
    throw new Error(`Failed to fetch manuals: ${res.status}`)
  }
  
  return res.json()
})

export const getManualsByProductId = cache(
  async (productId: string): Promise<Manual[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/manuals?productId=${productId}`, {
        next: { revalidate: 3600 },
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch manuals: ${res.status}`);
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error('Unexpected API response:', data);
        throw new Error('Invalid data format received from API');
      }

      return data;
    } catch (error) {
      console.error('Error fetching manuals:', error);
      return []; 
    }
  }
);