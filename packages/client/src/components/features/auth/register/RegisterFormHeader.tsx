import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export const RegisterFormHeader = () => {
    return (
        <div>
            <div className="mx-auto h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                Or{' '}
                <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    sign in to your existing account
                </Link>
            </p>
        </div>
    );
}; 