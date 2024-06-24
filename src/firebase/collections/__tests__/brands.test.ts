import { brandsAPI } from '../brands';
import { FirebaseError } from '../../errors/FirebaseError';

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
  query: jest.fn(),
  where: jest.fn(),
}));

describe('brandsAPI', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all brands', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ name: 'Brand 1', importerId: 'imp1' }) },
        { id: '2', data: () => ({ name: 'Brand 2', importerId: 'imp2' }) },
      ];
      require('firebase/firestore').getDocs.mockResolvedValue({ docs: mockDocs });

      const result = await brandsAPI.getAll();
      expect(result).toEqual([
        { id: '1', name: 'Brand 1', importerId: 'imp1' },
        { id: '2', name: 'Brand 2', importerId: 'imp2' },
      ]);
    });

    it('should throw FirebaseError on failure', async () => {
      require('firebase/firestore').getDocs.mockRejectedValue(new Error('Firebase error'));

      await expect(brandsAPI.getAll()).rejects.toThrow(FirebaseError);
    });
  });

 
});