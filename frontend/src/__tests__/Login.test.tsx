import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import Login from '../pages/Login';
import { vi } from 'vitest';

// Mock imports
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

vi.mock('../services/authService', () => ({
    authService: {
        login: vi.fn().mockResolvedValue({
            success: true,
            data: {
                token: 'fake-token',
                user: { id: '1', email: 'test@test.com' }
            }
        })
    }
}));

const createTestStore = () => configureStore({
    reducer: {
        auth: authReducer
    }
});

const renderWithProviders = (component: React.ReactElement) => {
    const store = createTestStore();
    return render(
        <Provider store={store}>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </Provider>
    );
};

describe('Login Page', () => {
    it('renders login form', () => {
        renderWithProviders(<Login />);

        expect(screen.getByRole('heading', { name: /connexion/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    });

    it('updates input values', () => {
        renderWithProviders(<Login />);

        const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        expect(emailInput.value).toBe('test@example.com');
    });

    it('submits form with valid data', async () => {
        renderWithProviders(<Login />);

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /connexion.../i })).toBeDisabled();
        });
    });
});
