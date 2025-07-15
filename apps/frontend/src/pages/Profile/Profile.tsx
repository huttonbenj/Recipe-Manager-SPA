/**
 * Profile page component
 * Displays user information and provides account management options
 */

import React from 'react'
import { useAuth } from '@/hooks'
import { User, Mail, LogOut, Settings, Shield, Activity, Edit, Key, Bell } from 'lucide-react'

// UI Components
import { Button, Card, Loading } from '@/components/ui'

const Profile: React.FC = () => {
    const { user, logout, isLoading } = useAuth()

    if (isLoading) {
        return <Loading fullScreen text="Loading profile..." />
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">You are not logged in</h2>
                    <p className="text-secondary-600 dark:text-secondary-400 mb-6">Please log in to view your profile.</p>
                    <Button onClick={() => window.location.href = '/login'}>
                        Go to Login
                    </Button>
                </div>
            </div>
        )
    }

    const handleLogout = async () => {
        try {
            await logout()
            // Redirect handled by AuthContext or a wrapper component
        } catch (error) {
            console.error('Logout failed', error)
            // Show error toast
        }
    }

    const menuItems = [
        {
            title: 'Account Settings',
            description: 'Manage your personal information and preferences.',
            icon: Settings,
            action: () => { console.log('Account Settings clicked') },
            color: 'text-blue-500'
        },
        {
            title: 'Change Password',
            description: 'Update your password for better security.',
            icon: Key,
            action: () => { console.log('Change Password clicked') },
            color: 'text-green-500'
        },
        {
            title: 'Notifications',
            description: 'Control how you receive notifications from us.',
            icon: Bell,
            action: () => { console.log('Notifications clicked') },
            color: 'text-yellow-500'
        },
        {
            title: 'Login Activity',
            description: 'Review recent login history and active sessions.',
            icon: Activity,
            action: () => { console.log('Login Activity clicked') },
            color: 'text-purple-500'
        },
        {
            title: 'Security',
            description: 'Manage two-factor authentication and other security settings.',
            icon: Shield,
            action: () => { console.log('Security clicked') },
            color: 'text-red-500'
        }
    ]

    return (
        <div className="min-h-screen bg-secondary-100/50 dark:bg-secondary-900/50">
            <div className="container mx-auto px-4 py-12">
                {/* Profile Header */}
                <Card className="mb-8 p-6 sm:p-8" variant="glass">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                                <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                            </div>
                            <Button variant="primary" className="absolute -bottom-1 -right-1 rounded-full h-8 w-8 p-0 flex items-center justify-center shadow-md">
                                <Edit className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary-900 dark:text-white tracking-tight">
                                {user.name}
                            </h1>
                            <p className="mt-2 text-base text-secondary-600 dark:text-secondary-400 flex items-center justify-center sm:justify-start gap-2">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </p>
                            <p className="mt-1 text-sm text-secondary-500">
                                Joined on {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-auto">
                            <Button onClick={handleLogout} variant="outline" size="sm" leftIcon={<LogOut className="w-4 h-4" />}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Profile Menu */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item, index) => (
                        <Card
                            key={index}
                            hover
                            clickable
                            onClick={item.action}
                            className="p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg ${item.color} transition-colors duration-300 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50`}>
                                    <item.icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Profile 