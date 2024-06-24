import { productsAPI } from '../products';
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

describe('productsAPI', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all products', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ name: 'Product 1', brandId: 'brand1' }) },
        { id: '2', data: () => ({ name: 'Product 2', brandId: 'brand2' }) },
      ];
      require('firebase/firestore').getDocs.mockResolvedValue({ docs: mockDocs });

      const result = await productsAPI.getAll();
      expect(result).toEqual([
        { id: '1', name: 'Product 1', brandId: 'brand1' },
        { id: '2', name: 'Product 2', brandId: 'brand2' },
      ]);
    });

    it('should throw FirebaseError on failure', async () => {
      require('firebase/firestore').getDocs.mockRejectedValue(new Error('Firebase error'));

      await expect(productsAPI.getAll()).rejects.toThrow(FirebaseError);
    });
  });

});