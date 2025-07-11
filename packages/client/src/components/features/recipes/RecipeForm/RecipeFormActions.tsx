import React from 'react';
import { ImageIcon } from 'lucide-react';
import { Button } from '../../../ui/Button';

interface RecipeFormActionsProps {
    isEditing: boolean;
    isSubmitting: boolean;
    onCancel: () => void;
    onSubmit: () => void;
}

export const RecipeFormActions: React.FC<RecipeFormActionsProps> = ({
    isEditing,
    isSubmitting,
    onCancel,
    onSubmit,
}) => {
    const getButtonText = () => {
        if (isSubmitting) {
            return isEditing ? 'Updating Recipe...' : 'Creating Recipe...';
        }
        return isEditing ? 'Update Recipe' : 'Create Recipe';
    };

    return (
        <div className="flex items-center justify-end space-x-4">
            <Button
                type="button"
                variant="outline"
                onClick={onCancel}
            >
                Cancel
            </Button>

            <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                onClick={onSubmit}
            >
                {!isSubmitting && <ImageIcon className="h-4 w-4 mr-2" />}
                {getButtonText()}
            </Button>
        </div>
    );
}; 