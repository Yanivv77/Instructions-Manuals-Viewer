import { importersAPI } from '../importers';
import { FirebaseError } from '../../errors/FirebaseError';

// Mock the Firebase modules
jest.mock('../../firebase.config', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

describe('importersAPI', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all importers', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ name: 'Importer 1' }) },
        { id: '2', data: () => ({ name: 'Importer 2' }) },
      ];
      require('firebase/firestore').getDocs.mockResolvedValue({ docs: mockDocs });

      const result = await importersAPI.getAll();
      expect(result).toEqual([
        { id: '1', name: 'Importer 1' },
        { id: '2', name: 'Importer 2' },
      ]);
    });

    it('should throw FirebaseError on failure', async () => {
      require('firebase/firestore').getDocs.mockRejectedValue(new Error('Firebase error'));

      await expect(importersAPI.getAll()).rejects.toThrow(FirebaseError);
    });
  });

  
});