/**
 * Main application routing component
 * Defines all routes and navigation structure
 */

import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Layout components
import Layout from '@/components/layout/Layout'

// Lazy-loaded page components for code splitting
const Login = React.lazy(() => import('@/pages/Login'))
const Register = React.lazy(() => import('@/pages/Register'))
const Recipes = React.lazy(() => import('@/pages/Recipes'))
const RecipeDetail = React.lazy(() => import('@/pages/RecipeDetail'))
const CreateRecipe = React.lazy(() => import('@/pages/CreateRecipe'))
const EditRecipe = React.lazy(() => import('@/pages/EditRecipe'))
const Favorites = React.lazy(() => import('@/pages/Favorites'))
const Bookmarks = React.lazy(() => import('@/pages/Bookmarks'))
const NotFound = React.lazy(() => import('@/pages/NotFound'))
const Profile = React.lazy(() => import('@/pages/Profile'))

// UI Components
import { Loading } from '@/components/ui'

// Hooks
import { useAuth } from '@/hooks/useAuth'

/**
 * Loading fallback component for lazy-loaded routes
 */
const RouteLoadingFallback: React.FC = () => (
    <Loading variant="spinner" size="lg" text="Loading page..." fullScreen />
)

/**
 * Protected Route wrapper component
 * Redirects to login if user is not authenticated
 */
interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, isLoading, isAuthenticated } = useAuth()

    // Show loading spinner while auth is being determined
    if (isLoading) {
        return <Loading variant="spinner" size="lg" text="Checking authentication..." fullScreen />
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

/**
 * Public Route wrapper component
 * Redirects to recipes if user is already authenticated
 */
interface PublicRouteProps {
    children: React.ReactNode
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { user, isLoading, isAuthenticated } = useAuth()

    // Show loading spinner while auth is being determined
    if (isLoading) {
        return <Loading variant="spinner" size="lg" text="Loading..." fullScreen />
    }

    // Redirect to recipes if already authenticated
    if (isAuthenticated && user) {
        return <Navigate to="/recipes" replace />
    }

    return <>{children}</>
}

/**
 * Main application routes
 */
const AppRoutes: React.FC = () => {
    return (
        <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
                {/* Public routes */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />

                {/* Protected routes with layout */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/recipes" replace />} />
                    <Route path="recipes" element={<Recipes />} />
                    <Route path="recipes/:id" element={<RecipeDetail />} />
                    <Route path="recipes/create" element={<CreateRecipe />} />
                    <Route path="recipes/:id/edit" element={<EditRecipe />} />
                    <Route path="favorites" element={<Favorites />} />
                    <Route path="bookmarks" element={<Bookmarks />} />
                    <Route path="profile" element={<Profile />} />
                </Route>

                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    )
}

export default AppRoutes 