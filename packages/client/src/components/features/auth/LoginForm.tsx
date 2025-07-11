import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAuth } from '../../../hooks';
import { LoginFormHeader } from './login/LoginFormHeader';
import { LoginFormField } from './login/LoginFormField';
import { LoginFormPasswordField } from './login/LoginFormPasswordField';
import { LoginFormSubmitButton } from './login/LoginFormSubmitButton';
import { LoginFormFooter } from './login/LoginFormFooter';

interface LoginFormData {
    email: string;
    password: string;
}

export const LoginForm = () => {
    const { login, isLoading, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<Partial<LoginFormData>>({});

    // Redirect if already authenticated
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        const newErrors: Partial<LoginFormData> = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await login(formData.email, formData.password);
        } catch (error) {
            // Error handling is done in the auth context
            console.error('Login failed:', error);
        }
    };

    const updateFormData = (field: keyof LoginFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <LoginFormHeader />

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <LoginFormField
                            id="email"
                            label="Email address"
                            type="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={(e) => updateFormData('email', e.target.value)}
                            error={errors.email}
                            icon={Mail}
                            autoComplete="email"
                            isFirst={true}
                            testId="email-input"
                        />

                        <LoginFormPasswordField
                            id="password"
                            label="Password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => updateFormData('password', e.target.value)}
                            error={errors.password}
                            showPassword={showPassword}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                            autoComplete="current-password"
                            isLast={true}
                            testId="password-input"
                        />
                    </div>

                    <LoginFormSubmitButton isLoading={isLoading} />

                    <LoginFormFooter />
                </form>
            </div>
        </div>
    );
}; 