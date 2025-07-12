import React from 'react';
import { Save, X, Sparkles } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { useTheme } from '../../../../contexts/ThemeContext';
import { getThemeColors } from '../../../../utils/theme';
import { cn } from '../../../../utils/cn';

interface RecipeFormActionsProps {
    isEditing: boolean;
    isSubmitting: boolean;
    onCancel: () => void;
}

export const RecipeFormActions: React.FC<RecipeFormActionsProps> = ({ isEditing, isSubmitting, onCancel }) => {
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Progress indicator */}
            <div className="flex items-center gap-3 text-sm text-surface-600 dark:text-surface-400">
                <div className="flex items-center gap-1">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        `${themeColors.primary.replace('600', '500')}`
                    )}></div>
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        `${themeColors.primary.replace('600', '500')}`
                    )}></div>
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        `${themeColors.primary.replace('600', '500')}`
                    )}></div>
                    <div className={cn(
                        "w-2 h-2 rounded-full animate-pulse",
                        `${themeColors.primary.replace('600', '500')}`
                    )}></div>
                </div>
                <span className="font-medium">
                    {isEditing ? 'Ready to save changes' : 'Ready to create recipe'}
                </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-6 py-3 text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-200"
                >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                </Button>

                <div className="relative">
                    <div className={cn(
                        "absolute inset-0 rounded-xl blur-lg opacity-60",
                        `bg-gradient-to-r ${themeColors.primary} ${themeColors.secondary}`
                    )}></div>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                        className={cn(
                            "relative px-8 py-3 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105",
                            `bg-gradient-to-r ${themeColors.primary} ${themeColors.secondary} hover:${themeColors.primaryHover} hover:${themeColors.secondaryHover}`
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                {isEditing ? 'Saving Changes...' : 'Creating Recipe...'}
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                {isEditing ? 'Save Changes' : 'Create Recipe'}
                                <Sparkles className="h-4 w-4 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}; 