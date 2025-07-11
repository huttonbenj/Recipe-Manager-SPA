import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from '../../../../components/features/auth/register/RegisterForm';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Mock useAuth
vi.mock('../../../../hooks', () => ({
    useAuth: () => mockAuth,
}));

const mockRegister = vi.fn();
const mockAuth = {
    register: mockRegister,
    isLoading: false,
    isAuthenticated: false,
};

function renderWithRouter(ui: React.ReactElement) {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('RegisterForm', () => {
    beforeEach(() => {
        mockRegister.mockReset();
        mockAuth.isLoading = false;
        mockAuth.isAuthenticated = false;
    });

    it('renders all fields and submit button', () => {
        renderWithRouter(<RegisterForm />);
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty fields', async () => {
        renderWithRouter(<RegisterForm />);
        await userEvent.click(screen.getByRole('button', { name: /create account/i }));
        expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
        const passwordErrors = await screen.findAllByText(/password is required/i);
        expect(passwordErrors.length).toBe(2);
        expect(await screen.findByText(/confirm password is required/i)).toBeInTheDocument();
    });

    it("shows error if passwords don't match", async () => {
        renderWithRouter(<RegisterForm />);
        await userEvent.type(screen.getByLabelText(/^password$/i), 'abc123');
        await userEvent.type(screen.getByLabelText(/confirm password/i), 'different');
        await userEvent.click(screen.getByRole('button', { name: /create account/i }));
        expect(await screen.findByText(/passwords don't match/i)).toBeInTheDocument();
    });

    it('clears error when user corrects a field', async () => {
        renderWithRouter(<RegisterForm />);
        await userEvent.click(screen.getByRole('button', { name: /create account/i }));
        const nameInput = screen.getByLabelText(/full name/i);
        await userEvent.type(nameInput, 'Test User');
        await waitFor(() => {
            expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
        });
    });

    it('toggles password visibility for both password fields', async () => {
        renderWithRouter(<RegisterForm />);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const confirmInput = screen.getByLabelText(/confirm password/i);
        // The toggle buttons are the only type=button in their containers
        const toggleBtns = screen.getAllByRole('button', { name: '' });
        expect(toggleBtns.length).toBeGreaterThanOrEqual(2);
        // Initially type should be password
        expect(passwordInput).toHaveAttribute('type', 'password');
        expect(confirmInput).toHaveAttribute('type', 'password');
        await userEvent.click(toggleBtns[0]!);
        expect(passwordInput).toHaveAttribute('type', 'text');
        await userEvent.click(toggleBtns[1]!);
        expect(confirmInput).toHaveAttribute('type', 'text');
    });

    it('shows loading state on submit button when loading', () => {
        mockAuth.isLoading = true;
        renderWithRouter(<RegisterForm />);
        const button = screen.getByRole('button', { name: /creating account/i });
        expect(button).toBeDisabled();
        expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('calls register with correct data on valid submit', async () => {
        renderWithRouter(<RegisterForm />);
        await userEvent.type(screen.getByLabelText(/full name/i), 'Test User');
        await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
        await userEvent.type(screen.getByLabelText(/^password$/i), 'abc123');
        await userEvent.type(screen.getByLabelText(/confirm password/i), 'abc123');
        await userEvent.click(screen.getByRole('button', { name: /create account/i }));
        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                name: 'Test User',
                email: 'test@example.com',
                password: 'abc123',
            });
        });
    });

    it('redirects if already authenticated', () => {
        mockAuth.isAuthenticated = true;
        renderWithRouter(<RegisterForm />);
        expect(screen.queryByRole('form')).not.toBeInTheDocument();
    });
}); 