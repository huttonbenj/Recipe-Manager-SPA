import React from 'react';
import { Link } from 'react-router-dom';

export const RegisterFormFooter: React.FC = () => {
    return (
        <p className="text-sm text-surface-600 dark:text-surface-400 text-center">
            Already have an account?{' '}
            <Link
                to="/login"
                className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300"
            >
                Sign in
            </Link>
        </p>
    );
}; 