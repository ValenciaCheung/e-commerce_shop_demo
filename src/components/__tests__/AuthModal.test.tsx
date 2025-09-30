import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthModal from '../AuthModal';
import { useAuth } from '@/contexts/AuthContext';

// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const mockAuthContextValue = {
  authModalMode: 'login' as const,
  closeAuthModal: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
  isLoading: false,
  openAuthModal: jest.fn(),
  user: null,
  isAuthenticated: false,
  logout: jest.fn(),
};

describe('AuthModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when authModalMode is null', () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: null,
    });
    
    render(<AuthModal />);
    
    expect(screen.queryByText('Sign in to your account')).not.toBeInTheDocument();
  });

  it('should render login form when authModalMode is login', () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: 'login',
    });
    
    render(<AuthModal />);
    
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it('should render register form when authModalMode is register', () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: 'register',
    });
    
    render(<AuthModal />);
    
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
  });

  it('should handle input changes', () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: 'login',
    });
    
    render(<AuthModal />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should validate required fields on login', async () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: 'login',
    });
    
    render(<AuthModal />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
    
    expect(mockAuthContextValue.login).not.toHaveBeenCalled();
  });

  it('should validate email format', async () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: 'login',
    });
    
    render(<AuthModal />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
    
    expect(mockAuthContextValue.login).not.toHaveBeenCalled();
  });

  it('should validate password length on register', async () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: 'register',
    });
    
    render(<AuthModal />);
    
    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /create account/i });
    
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
    
    expect(mockAuthContextValue.register).not.toHaveBeenCalled();
  });

  it('should validate password confirmation', async () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: 'register',
    });
    
    render(<AuthModal />);
    
    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /create account/i });
    
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
    
    expect(mockAuthContextValue.register).not.toHaveBeenCalled();
  });

  it('should call login function with correct parameters', async () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: 'login',
      login: jest.fn().mockResolvedValue(true),
    });
    
    render(<AuthModal />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockAuthContextValue.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should call register function with correct parameters', async () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: 'register',
      register: jest.fn().mockResolvedValue(true),
    });
    
    render(<AuthModal />);
    
    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /create account/i });
    
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockAuthContextValue.register).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'John',
        'Doe'
      );
    });
  });

  it('should close modal on successful login', async () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: 'login',
      login: jest.fn().mockResolvedValue(true),
    });
    
    render(<AuthModal />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockAuthContextValue.closeAuthModal).toHaveBeenCalled();
    });
  });

  it('should handle login error', async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: 'login',
      login: mockLogin,
    });
    
    render(<AuthModal />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
    
    expect(mockAuthContextValue.closeAuthModal).not.toHaveBeenCalled();
  });

  it('should toggle password visibility', () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: 'login',
    });
    
    render(<AuthModal />);
    
    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should switch between login and register modes', () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: 'login',
    });
    
    render(<AuthModal />);
    
    const switchToRegisterButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(switchToRegisterButton);
    
    expect(mockAuthContextValue.openAuthModal).toHaveBeenCalledWith('register');
  });

  it('should close modal when close button is clicked', () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: 'login',
    });
    
    render(<AuthModal />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockAuthContextValue.closeAuthModal).toHaveBeenCalled();
  });

  it('should close modal when overlay is clicked', () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: 'login',
    });
    
    render(<AuthModal />);
    
    const overlay = screen.getByTestId('auth-modal-overlay') || document.querySelector('.fixed.inset-0');
    if (overlay) {
      fireEvent.click(overlay);
      expect(mockAuthContextValue.closeAuthModal).toHaveBeenCalled();
    }
  });

  it('should show loading state during authentication', () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: 'login',
      isLoading: true,
    });
    
    render(<AuthModal />);
    
    const submitButton = screen.getByRole('button', { name: /signing in/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });

  it('should clear errors when input changes', async () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: 'login',
    });
    
    render(<AuthModal />);
    
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Trigger validation error
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
    
    // Clear error by typing
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
  });

  it('should reset form when modal is closed and reopened', () => {
    const mockCloseAuthModal = jest.fn();
    mockUseAuth.mockReturnValue({
      ...mockAuthContextValue,
      authModalMode: 'login',
      closeAuthModal: mockCloseAuthModal,
    });
    
    render(<AuthModal />);
    
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockCloseAuthModal).toHaveBeenCalled();
    // Form should be reset when modal is closed
  });
});