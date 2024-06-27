
import { db } from '../firebase.config';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { FirebaseError } from '../errors/FirebaseError';
import { Manual } from '@/types';

export const manualsAPI = {
  getByProductId: async (productId: string): Promise<Manual[]> => {
    try {
      const manualsCollectionRef = collection(db, 'products', productId, 'manuals');
      const querySnapshot = await getDocs(manualsCollectionRef);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Manual));
    } catch (error) {
      throw new FirebaseError(
        `Failed to fetch manuals for product ${productId}`,
        'FETCH_MANUALS_BY_PRODUCT_ERROR'
      );
    }
  },

  add: async (productId: string, data: Omit<Manual, 'id'>): Promise<string> => {
    try {
      const manualsCollectionRef = collection(db, 'products', productId, 'manuals');
      const docRef = await addDoc(manualsCollectionRef, data);
      return docRef.id;
    } catch (error) {
      throw new FirebaseError('Failed to add manual', 'ADD_MANUAL_ERROR');
    }
  },

  update: async (productId: string, manualId: string, data: Partial<Manual>): Promise<void> => {
    try {
      const docRef = doc(db, 'products', productId, 'manuals', manualId);
      await updateDoc(docRef, data);
    } catch (error) {
      throw new FirebaseError(
        `Failed to update manual with id ${manualId} for product ${productId}`,
        'UPDATE_MANUAL_ERROR'
      );
    }
  },

  delete: async (productId: string, manualId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'products', productId, 'manuals', manualId));
    } catch (error) {
      throw new FirebaseError(
        `Failed to delete manual with id ${manualId} for product ${productId}`,
        'DELETE_MANUAL_ERROR'
      );
    }
  },
};