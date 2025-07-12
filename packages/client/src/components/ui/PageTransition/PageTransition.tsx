import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../../utils/cn';

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
    const location = useLocation();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [currentPath, setCurrentPath] = useState(location.pathname);

    useEffect(() => {
        if (location.pathname !== currentPath) {
            setIsTransitioning(true);

            // Start transition
            const timer = setTimeout(() => {
                setCurrentPath(location.pathname);
                setIsTransitioning(false);
            }, 150); // Half the transition duration

            return () => clearTimeout(timer);
        }
        return undefined;
    }, [location.pathname, currentPath]);

    return (
        <div
            className={cn(
                "page-transition-wrapper",
                isTransitioning ? "page-transition-exit" : "page-transition-enter",
                className
            )}
        >
            {children}
        </div>
    );
};

// Alternative transition with fade and slide
export const PageTransitionSlide: React.FC<PageTransitionProps> = ({ children, className }) => {
    const location = useLocation();
    const [displayLocation, setDisplayLocation] = useState(location);
    const [transitionStage, setTransitionStage] = useState('fadeIn');

    useEffect(() => {
        if (location !== displayLocation) {
            setTransitionStage('fadeOut');
        }
    }, [location, displayLocation]);

    return (
        <div
            className={cn(
                "page-transition-slide",
                `page-transition-${transitionStage}`,
                className
            )}
            onAnimationEnd={() => {
                if (transitionStage === 'fadeOut') {
                    setDisplayLocation(location);
                    setTransitionStage('fadeIn');
                }
            }}
        >
            {children}
        </div>
    );
};

// Gentle scale transition
export const PageTransitionScale: React.FC<PageTransitionProps> = ({ children, className }) => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setIsVisible(false);
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <div
            className={cn(
                "page-transition-scale",
                isVisible ? "page-transition-scale-enter" : "page-transition-scale-exit",
                className
            )}
        >
            {children}
        </div>
    );
}; 