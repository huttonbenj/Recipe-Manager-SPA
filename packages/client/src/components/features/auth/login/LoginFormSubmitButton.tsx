import { LogIn, Loader2, Sparkles } from 'lucide-react';
import { cn } from '../../../../utils/cn';

interface LoginFormSubmitButtonProps {
    isLoading: boolean;
}

export const LoginFormSubmitButton = ({ isLoading }: LoginFormSubmitButtonProps) => {
    return (
        <button
            type="submit"
            disabled={isLoading}
            className={cn(
                "group relative w-full flex justify-center items-center py-3 px-6 text-sm font-medium rounded-xl text-white",
                "bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700",
                "focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:ring-offset-2 focus:ring-offset-white/50",
                "transition-all duration-200 transform hover:scale-105 active:scale-95",
                "shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100",
                "disabled:shadow-none overflow-hidden"
            )}
            data-testid="login-button"
        >
            {/* Gradient overlay for disabled state */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-r from-surface-400 to-surface-500 opacity-0 transition-opacity duration-200",
                isLoading && "opacity-50"
            )} />

            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />

            {/* Button content */}
            <div className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Signing in...</span>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" />
                            <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                    </>
                ) : (
                    <>
                        <LogIn className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium">Sign in</span>
                        <Sparkles className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </>
                )}
            </div>

            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150 origin-center" />
        </button>
    );
}; 