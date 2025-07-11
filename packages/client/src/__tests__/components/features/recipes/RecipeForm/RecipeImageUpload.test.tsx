import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecipeImageUpload } from '../../../../../components/features/recipes/RecipeForm/RecipeImageUpload';

const mockOnImageChange = vi.fn();
const mockOnRemoveImage = vi.fn();

describe('RecipeImageUpload', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders upload area when no image preview', () => {
        render(
            <RecipeImageUpload
                imagePreview={null}
                onImageChange={mockOnImageChange}
                onRemoveImage={mockOnRemoveImage}
            />
        );

        expect(screen.getByText('Recipe Image')).toBeInTheDocument();
        expect(screen.getByText('Upload a photo of your recipe')).toBeInTheDocument();
        expect(screen.getByText('Choose Image')).toBeInTheDocument();

        // Should show upload area with dashed border
        const uploadArea = screen.getByText('Upload a photo of your recipe').closest('div');
        expect(uploadArea).toHaveClass('border-2', 'border-dashed', 'border-gray-300', 'rounded-lg');

        // Should show ImageIcon
        const imageIcon = uploadArea?.querySelector('svg');
        expect(imageIcon).toBeInTheDocument();
    });

    it('renders image preview when imagePreview is provided', () => {
        const mockImageUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

        render(
            <RecipeImageUpload
                imagePreview={mockImageUrl}
                onImageChange={mockOnImageChange}
                onRemoveImage={mockOnRemoveImage}
            />
        );

        expect(screen.getByText('Recipe Image')).toBeInTheDocument();

        // Should show image preview
        const previewImage = screen.getByRole('img');
        expect(previewImage).toBeInTheDocument();
        expect(previewImage).toHaveAttribute('src', mockImageUrl);
        expect(previewImage).toHaveAttribute('alt', 'Recipe preview');
        expect(previewImage).toHaveClass('w-full', 'h-64', 'object-cover', 'rounded-lg');

        // Should show remove button
        const removeButton = screen.getByRole('button');
        expect(removeButton).toBeInTheDocument();
        expect(removeButton).toHaveClass('absolute', 'top-2', 'right-2', 'rounded-full', 'p-2');

        // Should not show upload area
        expect(screen.queryByText('Upload a photo of your recipe')).not.toBeInTheDocument();
    });

    it('calls onImageChange when file is selected', () => {
        render(
            <RecipeImageUpload
                imagePreview={null}
                onImageChange={mockOnImageChange}
                onRemoveImage={mockOnRemoveImage}
            />
        );

        const fileInput = screen.getByText('Choose Image')
            .parentElement?.querySelector('input[type="file"]');

        expect(fileInput).toBeInTheDocument();

        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const event = { target: { files: [file] } };

        fireEvent.change(fileInput!, event);

        expect(mockOnImageChange).toHaveBeenCalledTimes(1);
        // Check that the event was called with the correct file
        const callArgs = mockOnImageChange.mock.calls[0]?.[0];
        expect(callArgs?.target.files[0]).toBe(file);
    });

    it('calls onRemoveImage when remove button is clicked', () => {
        const mockImageUrl = 'data:image/jpeg;base64,test';

        render(
            <RecipeImageUpload
                imagePreview={mockImageUrl}
                onImageChange={mockOnImageChange}
                onRemoveImage={mockOnRemoveImage}
            />
        );

        const removeButton = screen.getByRole('button');
        fireEvent.click(removeButton);

        expect(mockOnRemoveImage).toHaveBeenCalledTimes(1);
    });

    it('has correct file input attributes', () => {
        render(
            <RecipeImageUpload
                imagePreview={null}
                onImageChange={mockOnImageChange}
                onRemoveImage={mockOnRemoveImage}
            />
        );

        const fileInput = screen.getByText('Choose Image')
            .parentElement?.querySelector('input[type="file"]');

        expect(fileInput).toHaveAttribute('type', 'file');
        expect(fileInput).toHaveAttribute('accept', 'image/*');
        expect(fileInput).toHaveClass('hidden');
    });

    it('renders Card components with proper structure', () => {
        render(
            <RecipeImageUpload
                imagePreview={null}
                onImageChange={mockOnImageChange}
                onRemoveImage={mockOnRemoveImage}
            />
        );

        // Should render within Card structure
        expect(screen.getByText('Recipe Image')).toBeInTheDocument();

        // Card header should contain the title
        const cardHeader = screen.getByText('Recipe Image').closest('div');
        expect(cardHeader).toBeInTheDocument();

        // Should have proper heading styling
        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveClass('text-xl', 'font-semibold', 'text-gray-900');
    });

    it('renders remove button with X icon when image is present', () => {
        const mockImageUrl = 'data:image/jpeg;base64,test';

        render(
            <RecipeImageUpload
                imagePreview={mockImageUrl}
                onImageChange={mockOnImageChange}
                onRemoveImage={mockOnRemoveImage}
            />
        );

        const removeButton = screen.getByRole('button');
        expect(removeButton).toHaveAttribute('type', 'button');

        // Should contain X icon (lucide-react renders as svg)
        const xIcon = removeButton.querySelector('svg');
        expect(xIcon).toBeInTheDocument();
        expect(xIcon).toHaveClass('h-4', 'w-4');
    });
}); 