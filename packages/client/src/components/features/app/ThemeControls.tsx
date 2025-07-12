import React, { useState } from 'react';
import { Sun, Moon, Monitor, Palette, Check } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/cn';
import { getThemeViewToggleClasses, getThemeBackgroundColor } from '../../../utils/theme';

export const ThemeControls: React.FC = () => {
    const { theme, setThemeMode, setThemeColor } = useTheme();
    const [showColorPicker, setShowColorPicker] = useState(false);

    const themeOptions = [
        { id: 'light', label: 'Light', icon: Sun },
        { id: 'dark', label: 'Dark', icon: Moon },
        { id: 'system', label: 'System', icon: Monitor },
    ] as const;

    const colorOptions = [
        {
            id: 'default',
            label: 'Emerald & Orange',
            preview: 'bg-gradient-to-r from-emerald-500 to-orange-500',
            description: 'Classic teal and warm orange'
        },
        {
            id: 'royal',
            label: 'Royal Purple',
            preview: 'bg-gradient-to-r from-purple-600 to-amber-500',
            description: 'Elegant purple with gold accents'
        },
        {
            id: 'ocean',
            label: 'Ocean Blue',
            preview: 'bg-gradient-to-r from-blue-600 to-cyan-500',
            description: 'Deep blue with cyan highlights'
        },
        {
            id: 'forest',
            label: 'Forest Green',
            preview: 'bg-gradient-to-r from-green-600 to-lime-500',
            description: 'Natural green with fresh lime'
        },
        {
            id: 'sunset',
            label: 'Sunset Orange',
            preview: 'bg-gradient-to-r from-orange-600 to-pink-500',
            description: 'Warm orange with pink highlights'
        },
    ] as const;

    return (
        <div className="relative">
            <div className="flex items-center space-x-2">
                {/* Theme Mode Toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    {themeOptions.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setThemeMode(id)}
                            className={cn(
                                'flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all',
                                getThemeViewToggleClasses(theme.color, theme.mode === id)
                            )}
                            title={label}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>

                {/* Color Theme Toggle */}
                <div className="relative">
                    <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Color Theme"
                    >
                        <Palette className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                            Colors
                        </span>
                    </button>

                    {showColorPicker && (
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                    Color Theme
                                </h3>
                                <div className="space-y-2">
                                    {colorOptions.map(({ id, label, preview, description }) => (
                                        <button
                                            key={id}
                                            onClick={() => {
                                                setThemeColor(id);
                                                setShowColorPicker(false);
                                            }}
                                            className={cn(
                                                'w-full flex items-center space-x-3 px-3 py-3 rounded-md text-sm transition-colors',
                                                theme.color === id
                                                    ? `${getThemeBackgroundColor('default', 'light')} text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20`
                                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                            )}
                                        >
                                            <div className={cn('w-5 h-5 rounded-full shadow-sm', preview)} />
                                            <div className="flex-1 text-left">
                                                <div className="font-medium">{label}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {description}
                                                </div>
                                            </div>
                                            {theme.color === id && (
                                                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 