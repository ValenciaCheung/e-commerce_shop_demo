import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { User } from '@/lib/types';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date().toISOString(),
};

// Test component to access auth context
function TestComponent() {
  const {
    user,
    isAuthenticated,
    isLoading,
    authModalMode,
    login,
    register,
    logout,
    openAuthModal,
    closeAuthModal,
  } = useAuth();

  return (
    <div>
      <div data-testid="user-email">{user?.email || 'No user'}</div>
      <div data-testid="is-authenticated">{isAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="is-loading">{isLoading ? 'true' : 'false'}</div>
      <div data-testid="auth-modal-mode">{authModalMode || 'null'}</div>
      
      <button
        data-testid="login-button"
        onClick={() => login('test@example.com', 'password123')}
      >
        Login
      </button>
      
      <button
        data-testid="register-button"
        onClick={() => register('test@example.com', 'password123', 'John', 'Doe')}
      >
        Register
      </button>
      
      <button data-testid="logout-button" onClick={logout}>
        Logout
      </button>
      
      <button
        data-testid="open-login-modal"
        onClick={() => openAuthModal('login')}
      >
        Open Login Modal
      </button>
      
      <button
        data-testid="open-register-modal"
        onClick={() => openAuthModal('register')}
      >
        Open Register Modal
      </button>
      
      <button data-testid="close-modal" onClick={closeAuthModal}>
        Close Modal
      </button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    renderWithProvider();
    
    expect(screen.getByTestId('user-email')).toHaveTextContent('No user');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    expect(screen.getByTestId('auth-modal-mode')).toHaveTextContent('null');
  });

  it('should load user from localStorage on initialization', () => {
    const savedUser = JSON.stringify(mockUser);
    localStorageMock.getItem.mockReturnValue(savedUser);
    
    renderWithProvider();
    
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
  });

  it('should handle successful login', async () => {
    renderWithProvider();
    
    act(() => {
      fireEvent.click(screen.getByTestId('login-button'));
    });
    
    // Should show loading state
    expect(screen.getByTestId('is-loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });
    
    // Should save user to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'user',
      expect.stringContaining('test@example.com')
    );
  });

  it('should handle login with invalid credentials', async () => {
    renderWithProvider();
    
    // Mock login with empty email to trigger validation error
    const { login } = useAuth();
    
    try {
      await act(async () => {
        await login('', 'password');
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
    
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
  });

  it('should handle successful registration', async () => {
    renderWithProvider();
    
    act(() => {
      fireEvent.click(screen.getByTestId('register-button'));
    });
    
    // Should show loading state
    expect(screen.getByTestId('is-loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });
    
    // Should save user to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'user',
      expect.stringContaining('test@example.com')
    );
  });

  it('should handle registration validation errors', async () => {
    renderWithProvider();
    
    const { register } = useAuth();
    
    // Test missing fields
    try {
      await act(async () => {
        await register('', '', '', '');
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
    
    // Test short password
    try {
      await act(async () => {
        await register('test@example.com', '123', 'John', 'Doe');
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
    
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
  });

  it('should handle logout', async () => {
    // First login
    renderWithProvider();
    
    act(() => {
      fireEvent.click(screen.getByTestId('login-button'));
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    });
    
    // Then logout
    act(() => {
      fireEvent.click(screen.getByTestId('logout-button'));
    });
    
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user-email')).toHaveTextContent('No user');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
  });

  it('should handle auth modal state', () => {
    renderWithProvider();
    
    // Open login modal
    act(() => {
      fireEvent.click(screen.getByTestId('open-login-modal'));
    });
    
    expect(screen.getByTestId('auth-modal-mode')).toHaveTextContent('login');
    
    // Open register modal
    act(() => {
      fireEvent.click(screen.getByTestId('open-register-modal'));
    });
    
    expect(screen.getByTestId('auth-modal-mode')).toHaveTextContent('register');
    
    // Close modal
    act(() => {
      fireEvent.click(screen.getByTestId('close-modal'));
    });
    
    expect(screen.getByTestId('auth-modal-mode')).toHaveTextContent('null');
  });

  it('should validate email format during login', async () => {
    renderWithProvider();
    
    const { login } = useAuth();
    
    try {
      await act(async () => {
        await login('invalid-email', 'password123');
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
    
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
  });

  it('should validate password length during registration', async () => {
    renderWithProvider();
    
    const { register } = useAuth();
    
    try {
      await act(async () => {
        await register('test@example.com', '123', 'John', 'Doe');
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
    
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
  });

  it('should handle localStorage errors gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    
    // Should not crash when localStorage fails
    expect(() => renderWithProvider()).not.toThrow();
    
    expect(screen.getByTestId('user-email')).toHaveTextContent('No user');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
  });

  it('should handle invalid JSON in localStorage', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');
    
    // Should not crash when localStorage contains invalid JSON
    expect(() => renderWithProvider()).not.toThrow();
    
    expect(screen.getByTestId('user-email')).toHaveTextContent('No user');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
  });

  it('should persist authentication state across page reloads', () => {
    const savedUser = JSON.stringify(mockUser);
    localStorageMock.getItem.mockReturnValue(savedUser);
    
    renderWithProvider();
    
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('user');
  });

  it('should clear localStorage on logout', async () => {
    // First login
    renderWithProvider();
    
    act(() => {
      fireEvent.click(screen.getByTestId('login-button'));
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    });
    
    // Then logout
    act(() => {
      fireEvent.click(screen.getByTestId('logout-button'));
    });
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
  });
});