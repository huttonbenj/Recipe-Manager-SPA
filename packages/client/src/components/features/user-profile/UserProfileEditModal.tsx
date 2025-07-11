import React from 'react';
import { Save, X } from 'lucide-react';

interface UserProfileEditModalProps {
    isOpen: boolean;
    formData: {
        name: string;
        email: string;
    };
    isLoading: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    onFormDataChange: (field: string, value: string) => void;
}

export const UserProfileEditModal: React.FC<UserProfileEditModalProps> = ({
    isOpen,
    formData,
    isLoading,
    onSubmit,
    onCancel,
    onFormDataChange
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-card rounded-lg p-6 w-full max-w-md m-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50">Edit Profile</h2>
                    <button
                        onClick={onCancel}
                        className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-300 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => onFormDataChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-md bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-50 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => onFormDataChange('email', e.target.value)}
                            className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-md bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-50 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 transition-colors"
                            required
                        />
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary flex-1"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 