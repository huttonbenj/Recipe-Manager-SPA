
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
    Skeleton,
    SkeletonText,
    SkeletonAvatar,
    SkeletonButton,
    SkeletonCard,
    SkeletonImage,
    RecipeCardSkeleton,
    RecipeListItemSkeleton,
    UserProfileSkeleton,
    DashboardSkeleton
} from '../../../components/ui/Skeleton';

describe('Skeleton Component', () => {
    it('renders basic skeleton with default props', () => {
        const { container } = render(<Skeleton />);
        const skeleton = container.firstChild;
        expect(skeleton).toBeInTheDocument();
        expect(skeleton).toHaveClass('bg-surface-200', 'dark:bg-surface-800');
    });

    it('renders skeleton with custom variant', () => {
        const { container } = render(<Skeleton variant="text" />);
        const skeleton = container.firstChild;
        expect(skeleton).toHaveClass('block');
    });

    it('renders skeleton with shimmer animation', () => {
        const { container } = render(<Skeleton shimmer={true} />);
        const skeleton = container.firstChild;
        expect(skeleton).toHaveClass('animate-skeleton-shimmer');
    });

    it('renders skeleton with custom size', () => {
        const { container } = render(<Skeleton size="lg" />);
        const skeleton = container.firstChild;
        expect(skeleton).toHaveClass('h-8');
    });

    it('renders skeleton with custom width and height', () => {
        const { container } = render(<Skeleton width="100px" height="50px" />);
        const skeleton = container.firstChild;
        expect(skeleton).toHaveStyle({ width: '100px', height: '50px' });
    });

    it('renders skeleton without animation when animate is false', () => {
        const { container } = render(<Skeleton animate={false} />);
        const skeleton = container.firstChild;
        expect(skeleton).not.toHaveClass('animate-pulse');
    });

    it('renders multiple lines for text variant', () => {
        const { container } = render(<Skeleton variant="text" lines={3} />);
        const skeletonContainer = container.firstChild;
        expect(skeletonContainer).toHaveClass('space-y-2');
    });
});

describe('Skeleton Preset Components', () => {
    it('renders SkeletonText', () => {
        const { container } = render(<SkeletonText />);
        const skeleton = container.firstChild;
        expect(skeleton).toHaveClass('block');
    });

    it('renders SkeletonAvatar', () => {
        const { container } = render(<SkeletonAvatar />);
        const skeleton = container.firstChild;
        expect(skeleton).toHaveClass('rounded-full');
    });

    it('renders SkeletonButton', () => {
        const { container } = render(<SkeletonButton />);
        const skeleton = container.firstChild;
        expect(skeleton).toHaveClass('rounded-md');
    });

    it('renders SkeletonCard', () => {
        const { container } = render(<SkeletonCard />);
        const skeleton = container.firstChild;
        expect(skeleton).toHaveClass('rounded-lg');
    });

    it('renders SkeletonImage', () => {
        const { container } = render(<SkeletonImage />);
        const skeleton = container.firstChild;
        expect(skeleton).toHaveClass('rounded-lg');
    });
});

describe('Complex Skeleton Presets', () => {
    it('renders RecipeCardSkeleton', () => {
        const { container } = render(<RecipeCardSkeleton />);
        const skeletonContainer = container.firstChild;
        expect(skeletonContainer).toHaveClass('bg-white', 'dark:bg-surface-900', 'rounded-xl');
    });

    it('renders RecipeListItemSkeleton', () => {
        const { container } = render(<RecipeListItemSkeleton />);
        const skeletonContainer = container.firstChild;
        expect(skeletonContainer).toHaveClass('bg-white', 'dark:bg-surface-900', 'rounded-lg');
    });

    it('renders UserProfileSkeleton', () => {
        const { container } = render(<UserProfileSkeleton />);
        const skeletonContainer = container.firstChild;
        expect(skeletonContainer).toHaveClass('bg-white', 'dark:bg-surface-900', 'rounded-xl');
    });

    it('renders DashboardSkeleton', () => {
        const { container } = render(<DashboardSkeleton />);
        const skeletonContainer = container.firstChild;
        expect(skeletonContainer).toHaveClass('space-y-6');
    });
}); 