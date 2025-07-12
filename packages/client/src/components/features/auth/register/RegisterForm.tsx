import React, { useState } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { useTheme } from '../../../../contexts/ThemeContext';
import { getThemeColors } from '../../../../utils/theme';
import { RegisterFormHeader } from './RegisterFormHeader';
import { RegisterFormField } from './RegisterFormField';
import { RegisterFormPasswordField } from './RegisterFormPasswordField';
import { RegisterFormSubmitButton } from './RegisterFormSubmitButton';
import { RegisterFormFooter } from './RegisterFormFooter';
import { User, Mail } from 'lucide-react';

export const RegisterForm: React.FC = () => {
    const { register, isLoading } = useAuth();
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
            style={{
                background: `linear-gradient(to bottom right, ${themeColors.primary}05, ${themeColors.secondary}05, rgb(var(--color-surface-50)))`
            }}
        >
            <div className="max-w-md w-full space-y-8">
                <RegisterFormHeader />
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <RegisterFormField
                            id="name"
                            label="Full Name"
                            type="text"
                            autoComplete="name"
                            placeholder="Full name"
                            value={formData.name}
                            onChange={handleChange}
                            icon={User}
                        />
                        <RegisterFormField
                            id="email"
                            label="Email Address"
                            type="email"
                            autoComplete="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            icon={Mail}
                        />
                        <RegisterFormPasswordField
                            id="password"
                            label="Password"
                            autoComplete="new-password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            showPassword={showPassword}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                        />
                        <RegisterFormPasswordField
                            id="confirmPassword"
                            label="Confirm Password"
                            autoComplete="new-password"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            showPassword={showConfirmPassword}
                            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    </div>

                    {error && (
                        <div className="rounded-md bg-error-50 dark:bg-error-900/20 p-4">
                            <div className="text-sm text-error-700 dark:text-error-400">
                                {error}
                            </div>
                        </div>
                    )}

                    <RegisterFormSubmitButton isLoading={isLoading} />
                    <RegisterFormFooter />
                </form>
            </div>
        </div>
    );
}; 