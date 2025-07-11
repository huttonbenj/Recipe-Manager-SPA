import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useImageUpload } from '../../../../hooks/image/useImageUpload';

// Mock the dependencies
vi.mock('../../../../hooks/image/useImageValidation', () => ({
    useImageValidation: () => ({
        validateFile: vi.fn((_file: File) => {
            if (_file.size > 5000000) return 'File too large';
            if (!_file.type.startsWith('image/')) return 'Invalid file type';
            return null;
        }),
    }),
}));

vi.mock('../../../../hooks/image/useImageProcessing', () => ({
    useImageProcessing: () => ({
        resizeImage: vi.fn((_file: File) => Promise.resolve(_file)),
        createPreview: vi.fn((_file: File) => Promise.resolve('data:image/jpeg;base64,test')),
    }),
}));

describe('useImageUpload', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns main state and functions', () => {
        const { result } = renderHook(() => useImageUpload());
        expect(result.current.imageFile).toBe(null);
        expect(result.current.imagePreview).toBe(null);
        expect(result.current.isUploading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(typeof result.current.handleInputChange).toBe('function');
        expect(typeof result.current.handleDrop).toBe('function');
        expect(typeof result.current.removeImage).toBe('function');
        expect(typeof result.current.setExistingImage).toBe('function');
        expect(typeof result.current.setUploadProgress).toBe('function');
        expect(typeof result.current.clearError).toBe('function');
        expect(typeof result.current.validateFile).toBe('function');
    });

    it('handles file selection successfully', async () => {
        const { result } = renderHook(() => useImageUpload());

        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg', lastModified: Date.now() });

        await act(async () => {
            const mockEvent = {
                target: { files: [file] }
            } as unknown as React.ChangeEvent<HTMLInputElement>;

            result.current.handleInputChange(mockEvent);

            // Wait for async operations
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.imageFile).toBe(file);
        expect(result.current.imagePreview).toBe('data:image/jpeg;base64,test');
        expect(result.current.isUploading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it('handles file validation error', async () => {
        const { result } = renderHook(() => useImageUpload());

        const file = new File(['test'], 'test.txt', { type: 'text/plain' });

        await act(async () => {
            const mockEvent = {
                target: { files: [file] }
            } as unknown as React.ChangeEvent<HTMLInputElement>;

            result.current.handleInputChange(mockEvent);

            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.error).toBe('Invalid file type');
        expect(result.current.imageFile).toBe(null);
        expect(result.current.isUploading).toBe(false);
    });

    it('handles drag and drop', async () => {
        const { result } = renderHook(() => useImageUpload());

        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

        await act(async () => {
            const mockEvent = {
                preventDefault: vi.fn(),
                dataTransfer: { files: [file] }
            } as unknown as React.DragEvent;

            result.current.handleDrop(mockEvent);

            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.imageFile).toBe(file);
        expect(result.current.imagePreview).toBe('data:image/jpeg;base64,test');
    });

    it('handles drag and drop with no files', () => {
        const { result } = renderHook(() => useImageUpload());

        act(() => {
            const mockEvent = {
                preventDefault: vi.fn(),
                dataTransfer: { files: [] }
            } as unknown as React.DragEvent;

            result.current.handleDrop(mockEvent);
        });

        expect(result.current.imageFile).toBe(null);
    });

    it('removes image', () => {
        const { result } = renderHook(() => useImageUpload());

        // First set an image
        act(() => {
            result.current.setExistingImage('test-url');
        });

        expect(result.current.imagePreview).toBe('test-url');

        // Then remove it
        act(() => {
            result.current.removeImage();
        });

        expect(result.current.imageFile).toBe(null);
        expect(result.current.imagePreview).toBe(null);
        expect(result.current.uploadProgress).toBe(0);
        expect(result.current.isUploading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it('sets existing image', () => {
        const { result } = renderHook(() => useImageUpload());

        act(() => {
            result.current.setExistingImage('https://example.com/image.jpg');
        });

        expect(result.current.imagePreview).toBe('https://example.com/image.jpg');
        expect(result.current.imageFile).toBe(null);
        expect(result.current.error).toBe(null);
    });

    it('sets upload progress', () => {
        const { result } = renderHook(() => useImageUpload());

        act(() => {
            result.current.setUploadProgress(50);
        });

        expect(result.current.uploadProgress).toBe(50);
    });

    it('clears error', () => {
        const { result } = renderHook(() => useImageUpload());

        // First set an error by trying to upload invalid file
        act(() => {
            const file = new File(['test'], 'test.txt', { type: 'text/plain' });
            const mockEvent = {
                target: { files: [file] }
            } as unknown as React.ChangeEvent<HTMLInputElement>;

            result.current.handleInputChange(mockEvent);
        });

        expect(result.current.error).toBe('Invalid file type');

        // Then clear it
        act(() => {
            result.current.clearError();
        });

        expect(result.current.error).toBe(null);
    });

    it('handles input change with no files', () => {
        const { result } = renderHook(() => useImageUpload());

        act(() => {
            const mockEvent = {
                target: { files: null }
            } as unknown as React.ChangeEvent<HTMLInputElement>;

            result.current.handleInputChange(mockEvent);
        });

        expect(result.current.imageFile).toBe(null);
    });
}); 