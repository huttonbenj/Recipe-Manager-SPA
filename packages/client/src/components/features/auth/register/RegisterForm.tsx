import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Mail, User } from 'lucide-react';
import { useAuth } from '../../../../hooks';
import { RegisterFormHeader } from './RegisterFormHeader';
import { RegisterFormField } from './RegisterFormField';
import { RegisterFormPasswordField } from './RegisterFormPasswordField';
import { RegisterFormSubmitButton } from './RegisterFormSubmitButton';
import { RegisterFormFooter } from './RegisterFormFooter';

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const RegisterForm = () => {
    const { register: registerUser, isLoading, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Partial<RegisterFormData>>({});

    // Redirect if already authenticated
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        const newErrors: Partial<RegisterFormData> = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords don't match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await registerUser({ email: formData.email, name: formData.name, password: formData.password });
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    const updateFormData = (field: keyof RegisterFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <RegisterFormHeader />

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <RegisterFormField
                            id="name"
                            label="Full Name"
                            type="text"
                            placeholder="Full name"
                            value={formData.name}
                            onChange={(e) => updateFormData('name', e.target.value)}
                            error={errors.name}
                            icon={User}
                            autoComplete="name"
                        />

                        <RegisterFormField
                            id="email"
                            label="Email address"
                            type="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={(e) => updateFormData('email', e.target.value)}
                            error={errors.email}
                            icon={Mail}
                            autoComplete="email"
                        />

                        <RegisterFormPasswordField
                            id="password"
                            label="Password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => updateFormData('password', e.target.value)}
                            error={errors.password}
                            showPassword={showPassword}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                            autoComplete="new-password"
                        />

                        <RegisterFormPasswordField
                            id="confirmPassword"
                            label="Confirm Password"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                            error={errors.confirmPassword}
                            showPassword={showConfirmPassword}
                            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                            autoComplete="new-password"
                        />
                    </div>

                    <RegisterFormSubmitButton isLoading={isLoading} />

                    <RegisterFormFooter />
                </form>
            </div>
        </div>
    );
}; 