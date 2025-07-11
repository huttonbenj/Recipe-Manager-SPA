import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../../../hooks/ui/usePagination';

const setUp = (pageSize?: number, totalItems?: number) =>
    renderHook(() => usePagination(pageSize, totalItems));

describe('usePagination Hook', () => {
    it('initialises with defaults', () => {
        const { result } = setUp();
        expect(result.current.currentPage).toBe(1);
        expect(result.current.pageSize).toBe(10);
        expect(result.current.totalItems).toBe(0);
        expect(result.current.totalPages).toBe(0);
        expect(result.current.hasNextPage).toBe(false);
        expect(result.current.hasPreviousPage).toBe(false);
    });

    it('calculates total pages and indices correctly', () => {
        const { result } = setUp(10, 95); // 10 per page, 95 items → 10 pages
        expect(result.current.totalPages).toBe(10);
        expect(result.current.startIndex).toBe(1);
        expect(result.current.endIndex).toBe(10);
    });

    it('advances pages with goToNextPage and goToPreviousPage', () => {
        const { result } = setUp(10, 30); // 3 pages

        act(() => result.current.goToNextPage());
        expect(result.current.currentPage).toBe(2);

        act(() => result.current.goToPreviousPage());
        expect(result.current.currentPage).toBe(1);
    });

    it('prevents going past boundaries', () => {
        const { result } = setUp(10, 15); // 2 pages

        // Try previous on first page
        act(() => result.current.goToPreviousPage());
        expect(result.current.currentPage).toBe(1);

        // Move to last page then go next
        act(() => result.current.goToLastPage());
        expect(result.current.currentPage).toBe(2);
        act(() => result.current.goToNextPage());
        expect(result.current.currentPage).toBe(2);
    });

    it('changes page size and resets page', () => {
        const { result } = setUp(20, 100);

        act(() => result.current.goToPage(3));
        expect(result.current.currentPage).toBe(3);

        act(() => result.current.setPageSize(50));
        expect(result.current.pageSize).toBe(50);
        expect(result.current.currentPage).toBe(1); // reset
        expect(result.current.totalPages).toBe(2);
    });

    it('updates totalItems and adjusts current page if necessary', () => {
        const { result } = setUp(10, 100);

        act(() => result.current.goToLastPage()); // page 10
        expect(result.current.currentPage).toBe(10);

        act(() => result.current.setTotalItems(45)); // only 5 pages now
        expect(result.current.totalItems).toBe(45);
        expect(result.current.totalPages).toBe(5);
        expect(result.current.currentPage).toBe(5); // adjusted down
    });
}); 