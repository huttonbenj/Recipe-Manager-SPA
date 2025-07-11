import { renderHook } from '@testing-library/react';
import { useImageValidation, type ImageValidationOptions } from '../../../../hooks/image';
import { describe, it, expect } from 'vitest';

describe('useImageValidation', () => {
    const createFile = (type: string, size: number) => {
        return { type, size } as File;
    };

    it('returns default config values', () => {
        const { result } = renderHook(() => useImageValidation());
        expect(result.current.maxSize).toBe(5 * 1024 * 1024);
        expect(result.current.allowedTypes).toEqual([
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
        ]);
    });

    it('overrides config with custom options', () => {
        const options: ImageValidationOptions = { maxSize: 1000, allowedTypes: ['image/png'] };
        const { result } = renderHook(() => useImageValidation(options));
        expect(result.current.maxSize).toBe(1000);
        expect(result.current.allowedTypes).toEqual(['image/png']);
    });

    it('validateFile returns error for disallowed type', () => {
        const { result } = renderHook(() => useImageValidation());
        const file = createFile('image/bmp', 100);
        expect(result.current.validateFile(file)).toMatch(/not allowed/);
    });

    it('validateFile returns error for file too large', () => {
        const { result } = renderHook(() => useImageValidation({ maxSize: 100 }));
        const file = createFile('image/png', 200);
        expect(result.current.validateFile(file)).toMatch(/exceeds maximum/);
    });

    it('validateFile returns null for valid file', () => {
        const { result } = renderHook(() => useImageValidation());
        const file = createFile('image/png', 100);
        expect(result.current.validateFile(file)).toBeNull();
    });

    it('isFileTypeAllowed returns true for allowed type', () => {
        const { result } = renderHook(() => useImageValidation());
        const file = createFile('image/jpeg', 100);
        expect(result.current.isFileTypeAllowed(file)).toBe(true);
    });

    it('isFileTypeAllowed returns false for disallowed type', () => {
        const { result } = renderHook(() => useImageValidation({ allowedTypes: ['image/png'] }));
        const file = createFile('image/jpeg', 100);
        expect(result.current.isFileTypeAllowed(file)).toBe(false);
    });

    it('isFileSizeValid returns true for valid size', () => {
        const { result } = renderHook(() => useImageValidation({ maxSize: 100 }));
        const file = createFile('image/png', 100);
        expect(result.current.isFileSizeValid(file)).toBe(true);
    });

    it('isFileSizeValid returns false for too large', () => {
        const { result } = renderHook(() => useImageValidation({ maxSize: 100 }));
        const file = createFile('image/png', 101);
        expect(result.current.isFileSizeValid(file)).toBe(false);
    });
}); 