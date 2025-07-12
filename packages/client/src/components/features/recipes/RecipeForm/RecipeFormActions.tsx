import React from 'react';
import { Button } from '../../../ui/Button';

interface RecipeFormActionsProps {
    isEditing: boolean;
    isSubmitting: boolean;
    onCancel: () => void;
}

export const RecipeFormActions: React.FC<RecipeFormActionsProps> = ({ isEditing, isSubmitting, onCancel }) => {
    return (
        <div className="flex items-center justify-end gap-4 pt-8">
            <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isSubmitting}
            >
                Cancel
            </Button>
            <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                isLoading={isSubmitting}
            >
                {isEditing ? 'Save Changes' : 'Create Recipe'}
            </Button>
        </div>
    );
}; 