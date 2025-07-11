import { renderHook, act } from '@testing-library/react';
import { useFormValidation, CommonValidationRules, type ValidationRule, type ValidationRules } from '../../../../hooks/form/useFormValidation';
import { describe, it, expect } from 'vitest';

type TestForm = { name: string; age: number };

describe('useFormValidation', () => {
    const rules: ValidationRules<TestForm> = {
        name: [CommonValidationRules.required('Name required') as ValidationRule<string | number>, CommonValidationRules.minLength(3) as ValidationRule<string | number>],
        age: [CommonValidationRules.min(18, 'Must be 18+') as ValidationRule<string | number>, CommonValidationRules.max(99) as ValidationRule<string | number>],
    };

    it('validates a single field and sets error', () => {
        const { result } = renderHook(() => useFormValidation<TestForm>(rules));
        act(() => {
            result.current.validateField('name', '');
        });
        expect(result.current.errors.name).toBe('Name required');
    });

    it('clears field error when valid', () => {
        const { result } = renderHook(() => useFormValidation<TestForm>(rules));
        act(() => {
            result.current.validateField('name', '');
            result.current.validateField('name', 'John');
        });
        expect(result.current.errors.name).toBeUndefined();
    });

    it('validates the whole form and returns false if errors', () => {
        const { result } = renderHook(() => useFormValidation<TestForm>(rules));
        let valid = false;
        act(() => {
            valid = result.current.validateForm({ name: '', age: 10 });
        });
        expect(valid).toBe(false);
        expect(result.current.errors.name).toBe('Name required');
        expect(result.current.errors.age).toBe('Must be 18+');
    });

    it('validates the whole form and returns true if valid', () => {
        const { result } = renderHook(() => useFormValidation<TestForm>(rules));
        let valid = false;
        act(() => {
            valid = result.current.validateForm({ name: 'Jane', age: 25 });
        });
        expect(valid).toBe(true);
        expect(result.current.errors.name).toBeUndefined();
        expect(result.current.errors.age).toBeUndefined();
    });

    it('clearErrors removes all errors', () => {
        const { result } = renderHook(() => useFormValidation<TestForm>(rules));
        act(() => {
            result.current.validateForm({ name: '', age: 10 });
            result.current.clearErrors();
        });
        expect(result.current.errors).toEqual({});
    });

    it('clearFieldError removes a specific field error', () => {
        const { result } = renderHook(() => useFormValidation<TestForm>(rules));
        act(() => {
            result.current.validateForm({ name: '', age: 10 });
            result.current.clearFieldError('name');
        });
        expect(result.current.errors.name).toBeUndefined();
        expect(result.current.errors.age).toBe('Must be 18+');
    });

    it('hasErrors is true if errors exist', () => {
        const { result } = renderHook(() => useFormValidation<TestForm>(rules));
        act(() => {
            result.current.validateForm({ name: '', age: 10 });
        });
        expect(result.current.hasErrors).toBe(true);
    });

    it('hasErrors is false if no errors', () => {
        const { result } = renderHook(() => useFormValidation<TestForm>(rules));
        act(() => {
            result.current.validateForm({ name: 'Jane', age: 25 });
        });
        expect(result.current.hasErrors).toBe(false);
    });
}); 