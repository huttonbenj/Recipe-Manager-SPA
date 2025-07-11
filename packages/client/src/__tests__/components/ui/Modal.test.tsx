import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../utils/test-utils';
import { Modal } from '../../../components/ui/Modal/Modal';

describe('Modal', () => {
    it('renders children and title when open', () => {
        render(
            <Modal isOpen onClose={vi.fn()} title="Test Modal">
                <div>Modal Content</div>
            </Modal>
        );
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(
            <Modal isOpen={false} onClose={vi.fn()} title="Test Modal">
                <div>Modal Content</div>
            </Modal>
        );
        expect(screen.queryByText('Test Modal')).toBeNull();
    });

    it('calls onClose when close button is clicked', () => {
        const onClose = vi.fn();
        render(
            <Modal isOpen onClose={onClose} title="Test Modal">
                <div>Modal Content</div>
            </Modal>
        );
        fireEvent.click(screen.getByRole('button', { name: /close modal/i }));
        expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose when escape key is pressed', () => {
        const onClose = vi.fn();
        render(
            <Modal isOpen onClose={onClose} title="Test Modal">
                <div>Modal Content</div>
            </Modal>
        );
        fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
        expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose when backdrop is clicked', () => {
        const onClose = vi.fn();
        render(
            <Modal isOpen onClose={onClose} title="Test Modal">
                <div>Modal Content</div>
            </Modal>
        );
        fireEvent.click(screen.getByText('Modal Content').parentElement?.parentElement?.parentElement!);
        expect(onClose).toHaveBeenCalled();
    });
}); 