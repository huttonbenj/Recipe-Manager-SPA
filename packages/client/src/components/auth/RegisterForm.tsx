import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const RegisterForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const { register, loading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setValidationErrors([]);

        try {
            await register({ email, password, name });
        } catch (err: any) {
            if (err instanceof Error) {
                // Try to parse the error message for better display
                let errorMessage = err.message;

                // If it's a validation error, try to extract the details
                if (errorMessage.includes('Invalid password')) {
                    errorMessage = 'Password does not meet the following requirements:';
                    // Check if there are validation details in the error
                    const errorWithDetails = err as Error & { details?: string[] };
                    if (errorWithDetails.details && Array.isArray(errorWithDetails.details)) {
                        setValidationErrors(errorWithDetails.details);
                    } else {
                        // Fallback to generic message
                        setValidationErrors(['Please check the password requirements below.']);
                    }
                } else if (errorMessage.includes('already exists')) {
                    errorMessage = 'An account with this email already exists. Please use a different email or try logging in.';
                }

                setError(errorMessage);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join Recipe Manager today
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="card p-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="mt-1 input-field"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="mt-1 input-field"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="mt-1 input-field"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="mt-2 text-xs text-gray-600">
                                    <p className="font-medium mb-1">Password must contain:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>At least 8 characters</li>
                                        <li>One lowercase letter</li>
                                        <li>One uppercase letter</li>
                                        <li>One number</li>
                                        <li>One special character (@$!%*?&)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-600">{error}</p>
                                {validationErrors.length > 0 && (
                                    <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                                        {validationErrors.map((validationError, index) => (
                                            <li key={index}>{validationError}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating account...' : 'Create account'}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                            Sign in here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}; 