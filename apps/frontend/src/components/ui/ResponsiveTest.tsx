/**
 * ResponsiveTest component - Development only
 * Displays current breakpoint and responsive test information
 */

import React, { useState, useEffect } from 'react'
import { getCurrentBreakpoint, logResponsiveTest, type BreakpointKey } from '@/utils/responsive-test'

interface ResponsiveTestProps {
    show?: boolean
}

const ResponsiveTest: React.FC<ResponsiveTestProps> = ({ show = false }) => {
    const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointKey>('desktop')
    const [windowWidth, setWindowWidth] = useState(0)

    useEffect(() => {
        const updateBreakpoint = () => {
            setCurrentBreakpoint(getCurrentBreakpoint())
            setWindowWidth(window.innerWidth)
        }

        updateBreakpoint()
        window.addEventListener('resize', updateBreakpoint)
        return () => window.removeEventListener('resize', updateBreakpoint)
    }, [])

    useEffect(() => {
        if (show) {
            logResponsiveTest()
        }
    }, [currentBreakpoint, show])

    if (!show || import.meta.env.PROD) {
        return null
    }

    const getBreakpointColor = (breakpoint: BreakpointKey) => {
        switch (breakpoint) {
            case 'mobile': return 'bg-red-500'
            case 'tablet': return 'bg-yellow-500'
            case 'desktop': return 'bg-green-500'
            default: return 'bg-gray-500'
        }
    }

    return (
        <div className="fixed bottom-2 right-2 z-[9999] bg-black/80 text-white px-2 py-1 rounded text-xs font-mono max-w-[120px] overflow-hidden">
            <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getBreakpointColor(currentBreakpoint)}`} />
                <span className="truncate">{currentBreakpoint.toUpperCase()}</span>
                <span className="text-gray-300 text-[10px] flex-shrink-0">({windowWidth}px)</span>
            </div>
        </div>
    )
}

export default ResponsiveTest 