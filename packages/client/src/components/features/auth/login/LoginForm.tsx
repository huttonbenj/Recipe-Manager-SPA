import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAuth } from '../../../../hooks';
import { LoginFormHeader } from './LoginFormHeader';
import { LoginFormField } from './LoginFormField';
import { LoginFormPasswordField } from './LoginFormPasswordField';
import { LoginFormSubmitButton } from './LoginFormSubmitButton';
import { LoginFormFooter } from './LoginFormFooter';
import { cn } from '../../../../utils/cn';

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

        // Enhanced validation with better error messages
        const newErrors: Partial<LoginFormData> = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

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
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Modern background with gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-accent-50 to-surface-50 dark:from-surface-950 dark:via-brand-950 dark:to-accent-950" />

            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-brand-500/20 to-accent-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-br from-accent-500/20 to-brand-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-brand-500/10 to-accent-500/10 rounded-full blur-3xl animate-pulse" />
            </div>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-md mx-auto px-4">
                {/* Glass morphism card */}
                <div className={cn(
                    "glass-card p-8 rounded-2xl shadow-xl border border-white/20 dark:border-white/10",
                    "backdrop-blur-xl bg-white/70 dark:bg-surface-900/70",
                    "animate-in fade-in zoom-in duration-500"
                )}>
                    <LoginFormHeader />

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <LoginFormField
                                id="email"
                                label="Email address"
                                type="email"
                                placeholder="Enter your email"
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
                                placeholder="Enter your password"
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

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-500 rounded-full opacity-20 animate-bounce" />
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-accent-500 to-brand-500 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }} />
            </div>
        </div>
    );
}; 