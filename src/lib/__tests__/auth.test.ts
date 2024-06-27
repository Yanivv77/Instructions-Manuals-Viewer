import { User } from 'firebase/auth';

// Declare mockAuth type
type MockAuth = {
  currentUser: User | null;
};

let mockAuth: MockAuth;

describe('Auth functions', () => {
  let registerUser: (email: string, password: string) => Promise<User>;
  let loginUser: (email: string, password: string) => Promise<User>;
  let logoutUser: () => Promise<void>;
  let getCurrentUser: () => User | null;

  beforeEach(() => {
    mockAuth = {
      currentUser: null,
    };

    // Mock Firebase Auth
    jest.doMock('firebase/auth', () => ({
      getAuth: jest.fn(() => mockAuth),
      createUserWithEmailAndPassword: jest.fn(),
      signInWithEmailAndPassword: jest.fn(),
      signOut: jest.fn(),
    }));

    // Mock the auth module
    jest.doMock('../auth', () => {
      const originalModule = jest.requireActual('../auth');
      return {
        ...originalModule,
        auth: mockAuth,
      };
    });

    // Import the functions after mocking
    const authModule = require('../auth');
    registerUser = authModule.registerUser;
    loginUser = authModule.loginUser;
    logoutUser = authModule.logoutUser;
    getCurrentUser = authModule.getCurrentUser;
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('registerUser should call createUserWithEmailAndPassword', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' } as User;
    const { createUserWithEmailAndPassword } = require('firebase/auth');
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });

    const result = await registerUser('test@example.com', 'password123');
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, 'test@example.com', 'password123');
    expect(result).toEqual(mockUser);
  });

  test('loginUser should call signInWithEmailAndPassword', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' } as User;
    const { signInWithEmailAndPassword } = require('firebase/auth');
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });

    const result = await loginUser('test@example.com', 'password123');
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, 'test@example.com', 'password123');
    expect(result).toEqual(mockUser);
  });

  test('logoutUser should call signOut', async () => {
    const { signOut } = require('firebase/auth');
    await logoutUser();
    expect(signOut).toHaveBeenCalledWith(mockAuth);
  });

  test('getCurrentUser should return currentUser', () => {
    const mockUser = { uid: '123', email: 'test@example.com' } as User;
    mockAuth.currentUser = mockUser;
    const result = getCurrentUser();
    expect(result).toEqual(mockUser);
  });
});