import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import { AlertCircle } from 'lucide-react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    fallbackSrc?: string;
    blurDataURL?: string;
    priority?: boolean;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    aspectRatio?: 'square' | 'video' | 'photo' | 'wide' | 'tall';
    placeholder?: 'blur' | 'empty' | 'shimmer';
    onLoad?: () => void;
    onError?: () => void;
    lazy?: boolean;
    sizes?: string;
    quality?: number;
}

export const Image: React.FC<ImageProps> = ({
    src,
    alt,
    className,
    fallbackSrc,
    blurDataURL,
    priority = false,
    objectFit = 'cover',
    aspectRatio,
    placeholder = 'shimmer',
    onLoad,
    onError,
    lazy = true,
    sizes,
    quality = 75,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);
    const [isIntersecting, setIsIntersecting] = useState(!lazy || priority);
    const imgRef = useRef<HTMLImageElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Aspect ratio classes
    const aspectRatioClasses = {
        square: 'aspect-square',
        video: 'aspect-video',
        photo: 'aspect-[4/3]',
        wide: 'aspect-[16/9]',
        tall: 'aspect-[3/4]',
    };

    // Object fit classes
    const objectFitClasses = {
        contain: 'object-contain',
        cover: 'object-cover',
        fill: 'object-fill',
        none: 'object-none',
        'scale-down': 'object-scale-down',
    };

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (!lazy || priority) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsIntersecting(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px',
                threshold: 0.1,
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        observerRef.current = observer;

        return () => {
            observer.disconnect();
        };
    }, [lazy, priority]);

    // Handle image load
    const handleLoad = () => {
        setIsLoaded(true);
        setIsError(false);
        onLoad?.();
    };

    // Handle image error
    const handleError = () => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
            setIsError(false);
        } else {
            setIsError(true);
            setIsLoaded(false);
        }
        onError?.();
    };

    // Generate optimized URL (you can customize this for your image service)
    const getOptimizedUrl = (url: string, width?: number, height?: number) => {
        // Example: Add query parameters for image optimization
        const params = new URLSearchParams();
        if (width) params.append('w', width.toString());
        if (height) params.append('h', height.toString());
        if (quality) params.append('q', quality.toString());

        const hasParams = params.toString();
        return hasParams ? `${url}?${params}` : url;
    };

    // Container classes
    const containerClasses = cn(
        'relative overflow-hidden bg-surface-100 dark:bg-surface-800',
        aspectRatio && aspectRatioClasses[aspectRatio],
        className
    );

    // Image classes
    const imageClasses = cn(
        'transition-all duration-700 ease-out',
        objectFitClasses[objectFit],
        'w-full h-full',
        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
        isError && 'hidden'
    );

    // Blur placeholder classes
    const blurPlaceholderClasses = cn(
        'absolute inset-0 transition-opacity duration-700 ease-out',
        objectFitClasses[objectFit],
        'w-full h-full',
        isLoaded ? 'opacity-0' : 'opacity-100',
        'filter blur-sm scale-110'
    );

    // Shimmer placeholder classes
    const shimmerPlaceholderClasses = cn(
        'absolute inset-0 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 dark:from-surface-700 dark:via-surface-600 dark:to-surface-700',
        'animate-shimmer bg-[length:200%_100%]',
        isLoaded ? 'opacity-0' : 'opacity-100',
        'transition-opacity duration-700 ease-out'
    );

    return (
        <div className={containerClasses} ref={imgRef}>
            {/* Blur placeholder */}
            {blurDataURL && placeholder === 'blur' && (
                <img
                    src={blurDataURL}
                    alt=""
                    className={blurPlaceholderClasses}
                    aria-hidden="true"
                />
            )}

            {/* Shimmer placeholder */}
            {placeholder === 'shimmer' && (
                <div className={shimmerPlaceholderClasses} aria-hidden="true" />
            )}

            {/* Main image */}
            {isIntersecting && (
                <img
                    src={getOptimizedUrl(currentSrc)}
                    alt={alt}
                    className={imageClasses}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading={priority ? 'eager' : 'lazy'}
                    sizes={sizes}
                    {...props}
                />
            )}

            {/* Error state */}
            {isError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p className="text-sm text-center px-2">
                        Failed to load image
                    </p>
                </div>
            )}

            {/* Loading indicator */}
            {!isLoaded && !isError && isIntersecting && (
                <div className="absolute inset-0 flex items-center justify-center bg-surface-100 dark:bg-surface-800">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
                </div>
            )}
        </div>
    );
};

// Preset image components
export const RecipeImage: React.FC<Omit<ImageProps, 'aspectRatio'>> = (props) => (
    <Image aspectRatio="photo" {...props} />
);

export const AvatarImage: React.FC<Omit<ImageProps, 'aspectRatio' | 'objectFit'>> = (props) => (
    <Image aspectRatio="square" objectFit="cover" {...props} />
);

export const HeroImage: React.FC<Omit<ImageProps, 'aspectRatio'>> = (props) => (
    <Image aspectRatio="wide" priority {...props} />
);

export const CardImage: React.FC<Omit<ImageProps, 'aspectRatio'>> = (props) => (
    <Image aspectRatio="photo" placeholder="shimmer" {...props} />
); 