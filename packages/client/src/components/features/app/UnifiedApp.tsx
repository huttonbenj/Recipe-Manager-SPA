import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, BookOpen, Plus, User, LucideProps, ChefHat, Command } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';
import { ThemeControls } from './ThemeControls';
import { BrowseTab } from './tabs/BrowseTab';
import { MyRecipesTab } from './tabs/MyRecipesTab';
import { CreateTab } from './tabs/CreateTab';
import { ProfileTab } from './tabs/ProfileTab';

type TabId = 'browse' | 'my-recipes' | 'create' | 'profile';

interface Tab {
    id: TabId;
    label: string;
    icon: React.ComponentType<LucideProps>;
    component: React.ComponentType<any>;
}

const tabs: Tab[] = [
    { id: 'browse', label: 'Browse', icon: Search, component: BrowseTab },
    { id: 'my-recipes', label: 'My Recipes', icon: BookOpen, component: MyRecipesTab },
    { id: 'create', label: 'Create', icon: Plus, component: CreateTab },
    { id: 'profile', label: 'Profile', icon: User, component: ProfileTab },
];

export const UnifiedApp: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabId>('browse');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Handle tab changes and URL synchronization
    useEffect(() => {
        const tab = searchParams.get('tab') as TabId;
        if (tab && tabs.some(t => t.id === tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd/Ctrl + K to open search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleTabChange = (tabId: TabId) => {
        setActiveTab(tabId);
        const params = new URLSearchParams(searchParams);
        params.set('tab', tabId);
        navigate(`/app?${params.toString()}`, { replace: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <ChefHat className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                                Recipe Manager
                            </span>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-2xl mx-8">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="flex items-center space-x-3 w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-500 dark:text-gray-400 text-left flex-1">
                                    Search recipes, ingredients, cuisines...
                                </span>
                                <div className="flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
                                    <Command className="w-3 h-3" />
                                    <span>K</span>
                                </div>
                            </button>
                        </div>

                        {/* Theme Controls */}
                        <ThemeControls />
                    </div>
                </div>
            </header>

            {/* Tab Navigation */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Tab Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="transition-all duration-300 ease-in-out">
                    {activeTab === 'browse' && <BrowseTab />}
                    {activeTab === 'my-recipes' && <MyRecipesTab />}
                    {activeTab === 'create' && <CreateTab />}
                    {activeTab === 'profile' && <ProfileTab />}
                </div>
            </main>

            {/* Global Search */}
            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    );
}; 