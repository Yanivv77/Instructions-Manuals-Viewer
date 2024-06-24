import { db } from '../firebase.config';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { FirebaseError } from '../errors/FirebaseError';

export interface Brand {
  id?: string;
  importerId: string;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
}

const COLLECTION_NAME = 'brands';

export const brandsAPI = {
  getAll: async (): Promise<Brand[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Brand));
    } catch (error) {
      throw new FirebaseError('Failed to fetch brands', 'FETCH_BRANDS_ERROR');
    }
  },

  getById: async (id: string): Promise<Brand | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return null;
      }
      return { id: docSnap.id, ...docSnap.data() } as Brand;
    } catch (error) {
      throw new FirebaseError(`Failed to fetch brand with id ${id}`, 'FETCH_BRAND_ERROR');
    }
  },

  getByImporterId: async (importerId: string): Promise<Brand[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), where("importerId", "==", importerId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Brand));
    } catch (error) {
      throw new FirebaseError(`Failed to fetch brands for importer ${importerId}`, 'FETCH_BRANDS_BY_IMPORTER_ERROR');
    }
  },

  add: async (data: Omit<Brand, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
      return docRef.id;
    } catch (error) {
      throw new FirebaseError('Failed to add brand', 'ADD_BRAND_ERROR');
    }
  },

  update: async (id: string, data: Partial<Brand>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, data);
    } catch (error) {
      throw new FirebaseError(`Failed to update brand with id ${id}`, 'UPDATE_BRAND_ERROR');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      throw new FirebaseError(`Failed to delete brand with id ${id}`, 'DELETE_BRAND_ERROR');
    }
  },
};