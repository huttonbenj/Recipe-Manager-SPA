import { CLIENT_CONFIG } from '@recipe-manager/shared';

export const toastConfig = {
    position: 'top-right' as const,
    toastOptions: {
        duration: CLIENT_CONFIG.TOAST_DURATION.DEFAULT,
        style: {
            background: '#363636',
            color: '#fff',
        },
        success: {
            duration: CLIENT_CONFIG.TOAST_DURATION.SUCCESS,
            iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
            },
        },
        error: {
            duration: CLIENT_CONFIG.TOAST_DURATION.ERROR,
            iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
            },
        },
    },
}; 