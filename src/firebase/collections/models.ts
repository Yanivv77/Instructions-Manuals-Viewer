import { db } from '../firebase.config';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { FirebaseError } from '../errors/FirebaseError';

export interface Model {
  id?: string;
  productId: string;
  modelName: string;
  description?: string;
  imageUrl?: string;
  pdfUrl: string;
  releaseDate?: Date;
}

const COLLECTION_NAME = 'models';

export const modelsAPI = {
  getAll: async (): Promise<Model[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Model));
    } catch (error) {
      throw new FirebaseError('Failed to fetch models', 'FETCH_MODELS_ERROR');
    }
  },

  getById: async (id: string): Promise<Model | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return null;
      }
      return { id: docSnap.id, ...docSnap.data() } as Model;
    } catch (error) {
      throw new FirebaseError(`Failed to fetch models with id ${id}`, 'FETCH_MODEL_ERROR');
    }
  },

  getByProductId: async (productId: string): Promise<Model[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), where("productId", "==", productId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Model));
    } catch (error) {
      throw new FirebaseError(`Failed to fetch models for product ${productId}`, 'FETCH_MODELS_BY_PRODUCT_ERROR');
    }
  },

  add: async (data: Omit<Model, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
      return docRef.id;
    } catch (error) {
      throw new FirebaseError('Failed to add models', 'ADD_MODEL_ERROR');
    }
  },

  update: async (id: string, data: Partial<Model>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, data);
    } catch (error) {
      throw new FirebaseError(`Failed to update models with id ${id}`, 'UPDATE_MODEL_ERROR');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      throw new FirebaseError(`Failed to delete models with id ${id}`, 'DELETE_MODEL_ERROR');
    }
  },
};