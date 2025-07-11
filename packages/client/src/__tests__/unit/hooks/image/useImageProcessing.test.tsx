import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useImageProcessing } from '../../../../hooks/image/useImageProcessing';

describe('useImageProcessing', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns main functions and config', () => {
        const { result } = renderHook(() => useImageProcessing());
        expect(typeof result.current.resizeImage).toBe('function');
        expect(typeof result.current.createPreview).toBe('function');
        expect(typeof result.current.getImageDimensions).toBe('function');
        expect(result.current.maxWidth).toBe(1920);
        expect(result.current.maxHeight).toBe(1080);
        expect(result.current.quality).toBe(0.8);
    });

    it('accepts custom options', () => {
        const customOptions = {
            quality: 0.9,
            maxWidth: 800,
            maxHeight: 600,
        };

        const { result } = renderHook(() => useImageProcessing(customOptions));

        expect(result.current.quality).toBe(0.9);
        expect(result.current.maxWidth).toBe(800);
        expect(result.current.maxHeight).toBe(600);
    });

    it('memoizes config correctly', () => {
        const options = { quality: 0.9 };
        const { result, rerender } = renderHook(() => useImageProcessing(options));

        const initialConfig = {
            quality: result.current.quality,
            maxWidth: result.current.maxWidth,
            maxHeight: result.current.maxHeight,
        };

        rerender();

        expect(result.current.quality).toBe(initialConfig.quality);
        expect(result.current.maxWidth).toBe(initialConfig.maxWidth);
        expect(result.current.maxHeight).toBe(initialConfig.maxHeight);
    });

    it('updates config when options change', () => {
        const { result, rerender } = renderHook(
            ({ options }) => useImageProcessing(options),
            { initialProps: { options: { quality: 0.8 } } }
        );

        expect(result.current.quality).toBe(0.8);

        rerender({ options: { quality: 0.9 } });

        expect(result.current.quality).toBe(0.9);
    });

    it('uses default options when none provided', () => {
        const { result } = renderHook(() => useImageProcessing());

        expect(result.current.quality).toBe(0.8);
        expect(result.current.maxWidth).toBe(1920);
        expect(result.current.maxHeight).toBe(1080);
    });

    it('merges custom options with defaults', () => {
        const { result } = renderHook(() => useImageProcessing({ quality: 0.5 }));

        expect(result.current.quality).toBe(0.5);
        expect(result.current.maxWidth).toBe(1920); // default
        expect(result.current.maxHeight).toBe(1080); // default
    });

    it('handles empty options object', () => {
        const { result } = renderHook(() => useImageProcessing({}));

        expect(result.current.quality).toBe(0.8);
        expect(result.current.maxWidth).toBe(1920);
        expect(result.current.maxHeight).toBe(1080);
    });

    it('handles undefined options', () => {
        const { result } = renderHook(() => useImageProcessing(undefined));

        expect(result.current.quality).toBe(0.8);
        expect(result.current.maxWidth).toBe(1920);
        expect(result.current.maxHeight).toBe(1080);
    });

    describe('resizeImage', () => {
        let file: File;
        let originalCreateElement: typeof document.createElement;
        let originalCreateObjectURL: typeof URL.createObjectURL;
        let imgOnLoad: (() => void) | null = null;
        let img: any;
        let ctx: any;
        let canvas: any;

        beforeEach(() => {
            file = new File(['dummy'], 'test.png', { type: 'image/png' });
            img = { onload: () => { }, onerror: () => { }, width: 2000, height: 1500, set src(_: any) { if (imgOnLoad) setTimeout(imgOnLoad, 0); } };
            ctx = { drawImage: vi.fn() };
            canvas = { getContext: vi.fn(() => ctx), toBlob: vi.fn() };
            originalCreateElement = document.createElement;
            document.createElement = ((tag: string, ...args: any[]) => {
                if (tag === 'canvas') return canvas;
                // @ts-ignore
                return originalCreateElement.call(document, tag, ...args);
            }) as typeof document.createElement;
            originalCreateObjectURL = URL.createObjectURL;
            URL.createObjectURL = vi.fn(() => 'blob:url');
            imgOnLoad = null;
        });
        afterEach(() => {
            document.createElement = originalCreateElement;
            URL.createObjectURL = originalCreateObjectURL;
        });
        it('resizes image if larger than max dimensions', async () => {
            canvas.toBlob = vi.fn((cb) => cb(new Blob(['resized'], { type: 'image/png' })));
            const { result } = renderHook(() => useImageProcessing({ maxWidth: 1000, maxHeight: 800 }));
            // Patch Image to our mock
            window.Image = function () { return img; } as any;
            imgOnLoad = () => img.onload && img.onload(null as any);
            const resized = await result.current.resizeImage(file);
            expect(resized).toBeInstanceOf(File);
            expect(resized.name).toBe('test.png');
            expect(canvas.toBlob).toHaveBeenCalled();
        });
        it('returns original file if not resized', async () => {
            img.width = 500; img.height = 400;
            const { result } = renderHook(() => useImageProcessing({ maxWidth: 1000, maxHeight: 800 }));
            window.Image = function () { return img; } as any;
            imgOnLoad = () => img.onload && img.onload(null as any);
            const output = await result.current.resizeImage(file);
            expect(output).toBe(file);
        });
        it('returns original file if toBlob returns null', async () => {
            canvas.toBlob = vi.fn((cb) => cb(null));
            const { result } = renderHook(() => useImageProcessing({ maxWidth: 1000, maxHeight: 800 }));
            window.Image = function () { return img; } as any;
            imgOnLoad = () => img.onload && img.onload(null as any);
            const output = await result.current.resizeImage(file);
            expect(output).toBe(file);
        });
    });

    describe('createPreview', () => {
        let file: File;
        let originalFileReader: any;
        beforeEach(() => {
            file = new File(['dummy'], 'test.png', { type: 'image/png' });
            originalFileReader = window.FileReader;
        });
        afterEach(() => {
            window.FileReader = originalFileReader;
        });
        it('creates a preview successfully', async () => {
            const mockResult = 'data:image/png;base64,abc';
            function MockFileReader(this: any) {
                this.readAsDataURL = function () { setTimeout(() => this.onload({ target: { result: mockResult } }), 0); };
            }
            window.FileReader = MockFileReader as any;
            const { result } = renderHook(() => useImageProcessing());
            const preview = await result.current.createPreview(file);
            expect(preview).toBe(mockResult);
        });
        it('handles FileReader error', async () => {
            function MockFileReader(this: any) {
                this.readAsDataURL = function () { setTimeout(() => this.onerror(), 0); };
            }
            window.FileReader = MockFileReader as any;
            const { result } = renderHook(() => useImageProcessing());
            await expect(result.current.createPreview(file)).rejects.toThrow('Failed to create image preview');
        });
    });

    describe('getImageDimensions', () => {
        let file: File;
        let originalImage: any;
        beforeEach(() => {
            file = new File(['dummy'], 'test.png', { type: 'image/png' });
            originalImage = window.Image;
        });
        afterEach(() => {
            window.Image = originalImage;
        });
        it('gets image dimensions successfully', async () => {
            const img = { onload: () => { }, onerror: () => { }, width: 123, height: 456, set src(_: any) { setTimeout(() => { if (typeof img.onload === 'function') img.onload(); }, 0); } };
            window.Image = function () { return img; } as any;
            const { result } = renderHook(() => useImageProcessing());
            const dims = await result.current.getImageDimensions(file);
            expect(dims).toEqual({ width: 123, height: 456 });
        });
        it('handles image load error', async () => {
            const img = { onload: () => { }, onerror: () => { }, set src(_: any) { setTimeout(() => { if (typeof img.onerror === 'function') img.onerror(); }, 0); } };
            window.Image = function () { return img; } as any;
            const { result } = renderHook(() => useImageProcessing());
            await expect(result.current.getImageDimensions(file)).rejects.toThrow('Failed to load image');
        });
    });
}); 