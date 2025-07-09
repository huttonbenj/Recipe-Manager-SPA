import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';

interface UserProfileData {
    id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

interface ProfileFormData {
    name: string;
}

interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const UserProfile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState<ProfileFormData>({ name: '' });
    const [profileLoading, setProfileLoading] = useState(false);

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.get<{ user: UserProfileData }>('/api/users/profile');
            setProfile(response.user);
            setProfileForm({ name: response.user.name });
        } catch (err) {
            setError('Failed to fetch profile');
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!profileForm.name.trim()) {
            setError('Name is required');
            return;
        }

        try {
            setProfileLoading(true);
            setError(null);
            setSuccess(null);

            const response = await apiClient.put<{ user: UserProfileData }>('/api/users/profile', {
                name: profileForm.name.trim()
            });

            setProfile(response.user);
            setIsEditingProfile(false);
            setSuccess('Profile updated successfully');
        } catch (err) {
            setError('Failed to update profile');
            console.error('Error updating profile:', err);
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordForm.currentPassword || !passwordForm.newPassword) {
            setError('All password fields are required');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setError('New password must be at least 8 characters long');
            return;
        }

        try {
            setPasswordLoading(true);
            setError(null);
            setSuccess(null);

            await apiClient.put('/api/users/password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });

            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setIsChangingPassword(false);
            setSuccess('Password changed successfully');
        } catch (err) {
            setError('Failed to change password');
            console.error('Error changing password:', err);
        } finally {
            setPasswordLoading(false);
        }
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !profile) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="text-red-600 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-red-600 text-lg">{error}</p>
                        <button
                            onClick={fetchProfile}
                            className="mt-4 btn-primary"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="mt-2 text-gray-600">Manage your account information and preferences</p>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="ml-3 text-sm text-green-700">{success}</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="ml-3 text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Profile Information */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                                {!isEditingProfile && (
                                    <button
                                        onClick={() => setIsEditingProfile(true)}
                                        className="btn-secondary"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="px-6 py-4">
                            {isEditingProfile ? (
                                <form onSubmit={handleProfileSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({ name: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            type="submit"
                                            disabled={profileLoading}
                                            className="btn-primary"
                                        >
                                            {profileLoading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditingProfile(false);
                                                setProfileForm({ name: profile?.name || '' });
                                                setError(null);
                                            }}
                                            className="btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <p className="mt-1 text-sm text-gray-900">{profile?.name}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <p className="mt-1 text-sm text-gray-900">{profile?.email}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Member Since</label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {profile?.created_at ? formatDate(profile.created_at) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
                                {!isChangingPassword && (
                                    <button
                                        onClick={() => setIsChangingPassword(true)}
                                        className="btn-secondary"
                                    >
                                        Change Password
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="px-6 py-4">
                            {isChangingPassword ? (
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                            minLength={8}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                            minLength={8}
                                        />
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            type="submit"
                                            disabled={passwordLoading}
                                            className="btn-primary"
                                        >
                                            {passwordLoading ? 'Changing...' : 'Change Password'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsChangingPassword(false);
                                                setPasswordForm({
                                                    currentPassword: '',
                                                    newPassword: '',
                                                    confirmPassword: ''
                                                });
                                                setError(null);
                                            }}
                                            className="btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <p className="text-sm text-gray-600">
                                    Update your password to keep your account secure.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 