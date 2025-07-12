import React from 'react';
import { Save } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Form';
import { Modal } from '../../ui/Modal';

interface UserProfileEditModalProps {
    isOpen: boolean;
    formData: {
        name: string;
        email: string;
    };
    isLoading: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    onFormDataChange: (field: string, value: string) => void;
}

export const UserProfileEditModal: React.FC<UserProfileEditModalProps> = ({
    isOpen,
    formData,
    isLoading,
    onSubmit,
    onCancel,
    onFormDataChange
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onCancel} title="Edit Profile">
            <form onSubmit={onSubmit} className="space-y-6">
                <Input
                    label="Name"
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => onFormDataChange('name', e.target.value)}
                    required
                />
                <Input
                    label="Email"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => onFormDataChange('email', e.target.value)}
                    required
                />

                <div className="flex justify-end space-x-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        isLoading={isLoading}
                    >
                        <Save className="h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
}; 