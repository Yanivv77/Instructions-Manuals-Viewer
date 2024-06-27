import { manualsAPI } from '../manuals';
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

describe('manualsAPI', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all manuals', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ modelName: 'Model 1', productId: 'prod1', pdfUrl: 'url1' }) },
        { id: '2', data: () => ({ modelName: 'Model 2', productId: 'prod2', pdfUrl: 'url2' }) },
      ];
      require('firebase/firestore').getDocs.mockResolvedValue({ docs: mockDocs });

      const result = await manualsAPI.getAll();
      expect(result).toEqual([
        { id: '1', modelName: 'Model 1', productId: 'prod1', pdfUrl: 'url1' },
        { id: '2', modelName: 'Model 2', productId: 'prod2', pdfUrl: 'url2' },
      ]);
    });

    it('should throw FirebaseError on failure', async () => {
      require('firebase/firestore').getDocs.mockRejectedValue(new Error('Firebase error'));

      await expect(manualsAPI.getAll()).rejects.toThrow(FirebaseError);
    });
  });

});