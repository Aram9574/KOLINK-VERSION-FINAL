import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../components/features/auth/LoginPage';
import { UserContext } from '../context/UserContext';
import { supabase } from '../services/supabaseClient';
import { translations } from '../translations';

// Mock child components to simplify test
vi.mock('../components/features/auth/SocialLoginButtons', () => ({
    default: () => <div data-testid="social-login-buttons">Social Login</div>
}));

vi.mock('../components/features/auth/AuthVisuals', () => ({
    default: () => <div data-testid="auth-visuals">Visuals</div>
}));

// Mock Helmet
vi.mock('react-helmet-async', () => ({
    Helmet: ({ children }: any) => <div>{children}</div>
}));

// Mock UserProfileContext
vi.mock('../context/UserProfileContext', () => ({
    useUserProfile: () => ({
        profile: { language: 'en' },
        isLoading: false,
        refreshProfile: vi.fn(),
        updateProfile: vi.fn(),
        setLanguage: vi.fn(),
    }),
    UserProfileProvider: ({ children }: any) => <div>{children}</div>
}));

describe('LoginPage Integration', () => {
    const mockUserContext = {
        user: {},
        authUser: null,
        session: null,
        language: 'en',
        loading: false,
        logout: vi.fn(),
        setUser: vi.fn(),
        updateProfile: vi.fn(),
        setLanguage: vi.fn(),
        setLoading: vi.fn(),
        refreshUser: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form by default', () => {
        render(
            <BrowserRouter>
                <UserContext.Provider value={mockUserContext as any}>
                    <LoginPage />
                </UserContext.Provider>
            </BrowserRouter>
        );

        expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/tu@email.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
    });

    it('handles email login submission', async () => {
        render(
            <BrowserRouter>
                <UserContext.Provider value={mockUserContext as any}>
                    <LoginPage />
                </UserContext.Provider>
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText(/tu@email.com/i);
        const passwordInput = screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*/i);
        const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            // @ts-ignore
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });
    });

    it('toggles to signup mode', () => {
        render(
            <BrowserRouter>
                <UserContext.Provider value={mockUserContext as any}>
                    <LoginPage />
                </UserContext.Provider>
            </BrowserRouter>
        );

        const toggleButton = screen.getByText(/Regístrate Gratis/i);
        fireEvent.click(toggleButton);

        expect(screen.getByText(/Crea tu cuenta/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Crear Cuenta/i })).toBeInTheDocument();
    });
});
