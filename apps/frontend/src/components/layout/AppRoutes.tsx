/**
 * Main application routing component
 * Defines all routes and navigation structure
 */

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Layout components
import Layout from '@/components/layout/Layout'

// Page components
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Recipes from '@/pages/Recipes'
import RecipeDetail from '@/pages/RecipeDetail'
import CreateRecipe from '@/pages/CreateRecipe'
import EditRecipe from '@/pages/EditRecipe'
import Favorites from '@/pages/Favorites'
import Bookmarks from '@/pages/Bookmarks'
import NotFound from '@/pages/NotFound'

// Hooks
import { useAuth } from '@/hooks/useAuth'

/**
 * Protected Route wrapper component
 * Redirects to login if user is not authenticated
 */
interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user } = useAuth()

    return user ? <>{children}</> : <Navigate to="/login" replace />
}

/**
 * Public Route wrapper component  
 * Redirects to home if user is already authenticated
 */
interface PublicRouteProps {
    children: React.ReactNode
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { user } = useAuth()

    return !user ? <>{children}</> : <Navigate to="/" replace />
}

/**
 * Main application routes component
 * Defines all application routes with authentication guards
 */
export const AppRoutes: React.FC = () => {
    return (
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

            {/* Public home page with layout */}
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
            </Route>

            {/* Protected routes with layout */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                {/* Recipe routes */}
                <Route path="recipes" element={<Recipes />} />
                <Route path="recipes/:id" element={<RecipeDetail />} />
                <Route path="recipes/create" element={<CreateRecipe />} />
                <Route path="recipes/:id/edit" element={<EditRecipe />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="bookmarks" element={<Bookmarks />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
} 