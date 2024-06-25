import { modelsAPI } from '../models';
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

describe('modelsAPI', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all models', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ modelName: 'Model 1', productId: 'prod1', pdfUrl: 'url1' }) },
        { id: '2', data: () => ({ modelName: 'Model 2', productId: 'prod2', pdfUrl: 'url2' }) },
      ];
      require('firebase/firestore').getDocs.mockResolvedValue({ docs: mockDocs });

      const result = await modelsAPI.getAll();
      expect(result).toEqual([
        { id: '1', modelName: 'Model 1', productId: 'prod1', pdfUrl: 'url1' },
        { id: '2', modelName: 'Model 2', productId: 'prod2', pdfUrl: 'url2' },
      ]);
    });

    it('should throw FirebaseError on failure', async () => {
      require('firebase/firestore').getDocs.mockRejectedValue(new Error('Firebase error'));

      await expect(modelsAPI.getAll()).rejects.toThrow(FirebaseError);
    });
  });

});