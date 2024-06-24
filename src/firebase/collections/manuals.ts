import { db } from '../firebase.config';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { FirebaseError } from '../errors/FirebaseError';

export interface Manual {
  id?: string;
  productId: string;
  modelName: string;
  description?: string;
  imageUrl?: string;
  pdfUrl: string;
  releaseDate?: Date;
}

const COLLECTION_NAME = 'manuals';

export const manualsAPI = {
  getAll: async (): Promise<Manual[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Manual));
    } catch (error) {
      throw new FirebaseError('Failed to fetch manuals', 'FETCH_MANUALS_ERROR');
    }
  },

  getById: async (id: string): Promise<Manual | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return null;
      }
      return { id: docSnap.id, ...docSnap.data() } as Manual;
    } catch (error) {
      throw new FirebaseError(`Failed to fetch manual with id ${id}`, 'FETCH_MANUAL_ERROR');
    }
  },

  getByProductId: async (productId: string): Promise<Manual[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), where("productId", "==", productId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Manual));
    } catch (error) {
      throw new FirebaseError(`Failed to fetch manuals for product ${productId}`, 'FETCH_MANUALS_BY_PRODUCT_ERROR');
    }
  },

  add: async (data: Omit<Manual, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
      return docRef.id;
    } catch (error) {
      throw new FirebaseError('Failed to add manual', 'ADD_MANUAL_ERROR');
    }
  },

  update: async (id: string, data: Partial<Manual>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, data);
    } catch (error) {
      throw new FirebaseError(`Failed to update manual with id ${id}`, 'UPDATE_MANUAL_ERROR');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      throw new FirebaseError(`Failed to delete manual with id ${id}`, 'DELETE_MANUAL_ERROR');
    }
  },
};