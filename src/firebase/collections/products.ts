import { db } from '../firebase.config';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { FirebaseError } from '../errors/FirebaseError';

export interface Product {
  id?: string;
  brandId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category?: string;
}

const COLLECTION_NAME = 'products';

export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      throw new FirebaseError('Failed to fetch products', 'FETCH_PRODUCTS_ERROR');
    }
  },

  getById: async (id: string): Promise<Product | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return null;
      }
      return { id: docSnap.id, ...docSnap.data() } as Product;
    } catch (error) {
      throw new FirebaseError(`Failed to fetch product with id ${id}`, 'FETCH_PRODUCT_ERROR');
    }
  },

  getByBrandId: async (brandId: string): Promise<Product[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), where("brandId", "==", brandId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      throw new FirebaseError(`Failed to fetch products for brand ${brandId}`, 'FETCH_PRODUCTS_BY_BRAND_ERROR');
    }
  },

  add: async (data: Omit<Product, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
      return docRef.id;
    } catch (error) {
      throw new FirebaseError('Failed to add product', 'ADD_PRODUCT_ERROR');
    }
  },

  update: async (id: string, data: Partial<Product>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, data);
    } catch (error) {
      throw new FirebaseError(`Failed to update product with id ${id}`, 'UPDATE_PRODUCT_ERROR');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      throw new FirebaseError(`Failed to delete product with id ${id}`, 'DELETE_PRODUCT_ERROR');
    }
  },
};