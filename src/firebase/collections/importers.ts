import { db } from '../firebase.config';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FirebaseError } from '../errors/FirebaseError';

export interface Importer {
  id?: string;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
}

const COLLECTION_NAME = 'importers';

export const importersAPI = {
  getAll: async (): Promise<Importer[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Importer));
    } catch (error) {
      throw new FirebaseError('Failed to fetch importers', 'FETCH_IMPORTERS_ERROR');
    }
  },

  getById: async (id: string): Promise<Importer | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return null;
      }
      return { id: docSnap.id, ...docSnap.data() } as Importer;
    } catch (error) {
      throw new FirebaseError(`Failed to fetch importer with id ${id}`, 'FETCH_IMPORTER_ERROR');
    }
  },

  add: async (data: Omit<Importer, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
      return docRef.id;
    } catch (error) {
      throw new FirebaseError('Failed to add importer', 'ADD_IMPORTER_ERROR');
    }
  },

  update: async (id: string, data: Partial<Importer>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, data);
    } catch (error) {
      throw new FirebaseError(`Failed to update importer with id ${id}`, 'UPDATE_IMPORTER_ERROR');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      throw new FirebaseError(`Failed to delete importer with id ${id}`, 'DELETE_IMPORTER_ERROR');
    }
  },
};