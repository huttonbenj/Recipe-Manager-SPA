import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export const LoginFormHeader = () => {
    return (
        <div>
            <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                <LogIn className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                Or{' '}
                <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    create a new account
                </Link>
            </p>
        </div>
    );
}; 