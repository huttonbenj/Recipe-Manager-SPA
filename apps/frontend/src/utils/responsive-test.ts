/**
 * Responsive testing utility
 * Helps verify responsive design implementation across different breakpoints
 */

// Responsive breakpoint definitions
const RESPONSIVE_BREAKPOINTS = {
  mobile: { min: 0, max: 767, label: 'Mobile (≤767px)' },
  tablet: { min: 768, max: 1023, label: 'Tablet (768-1023px)' },
  desktop: { min: 1024, max: Infinity, label: 'Desktop (≥1024px)' }
} as const

export type BreakpointKey = keyof typeof RESPONSIVE_BREAKPOINTS

/**
 * Get current breakpoint based on window width
 */
export const getCurrentBreakpoint = (): BreakpointKey => {
  if (typeof window === 'undefined') return 'desktop'
  
  const width = window.innerWidth
  
  if (width <= 767) return 'mobile'
  if (width <= 1023) return 'tablet'
  return 'desktop'
}

/**
 * Check if current viewport matches a specific breakpoint
 */
export const isBreakpoint = (breakpoint: BreakpointKey): boolean => {
  if (typeof window === 'undefined') return false
  
  const width = window.innerWidth
  const bp = RESPONSIVE_BREAKPOINTS[breakpoint]
  
  return width >= bp.min && width <= bp.max
}

/**
 * Responsive test cases to verify implementation
 */
export const RESPONSIVE_TEST_CASES = [
  {
    component: 'Header',
    tests: [
      { breakpoint: 'mobile', expected: 'Mobile menu visible, desktop nav hidden' },
      { breakpoint: 'tablet', expected: 'Mobile menu visible, desktop nav hidden' },
      { breakpoint: 'desktop', expected: 'Desktop nav visible, mobile menu hidden' }
    ]
  },
  {
    component: 'RecipeList',
    tests: [
      { breakpoint: 'mobile', expected: '1 column grid' },
      { breakpoint: 'tablet', expected: '2 column grid' },
      { breakpoint: 'desktop', expected: '3-4 column grid' }
    ]
  },
  {
    component: 'RecipeDetail',
    tests: [
      { breakpoint: 'mobile', expected: 'Single column layout' },
      { breakpoint: 'tablet', expected: 'Single column layout' },
      { breakpoint: 'desktop', expected: '2/3 main + 1/3 sidebar layout' }
    ]
  },
  {
    component: 'Forms',
    tests: [
      { breakpoint: 'mobile', expected: 'Stack layout, full width inputs' },
      { breakpoint: 'tablet', expected: 'Stack layout, full width inputs' },
      { breakpoint: 'desktop', expected: 'Grid layout with sidebar' }
    ]
  }
] as const

/**
 * Log responsive test results
 */
export const logResponsiveTest = () => {
  const currentBreakpoint = getCurrentBreakpoint()
  const width = typeof window !== 'undefined' ? window.innerWidth : 0
  
  console.group('🔍 Responsive Design Test')
  console.log(`Current viewport: ${width}px`)
  console.log(`Current breakpoint: ${RESPONSIVE_BREAKPOINTS[currentBreakpoint].label}`)
  console.log('Expected behavior:')
  
  RESPONSIVE_TEST_CASES.forEach(testCase => {
    const relevantTest = testCase.tests.find(test => test.breakpoint === currentBreakpoint)
    if (relevantTest) {
      console.log(`  ${testCase.component}: ${relevantTest.expected}`)
    }
  })
  
  console.groupEnd()
}

/**
 * Hook to listen for breakpoint changes
 */
export const useBreakpointListener = (callback: (breakpoint: BreakpointKey) => void) => {
  if (typeof window === 'undefined') return
  
  let currentBreakpoint = getCurrentBreakpoint()
  
  const handleResize = () => {
    const newBreakpoint = getCurrentBreakpoint()
    if (newBreakpoint !== currentBreakpoint) {
      currentBreakpoint = newBreakpoint
      callback(newBreakpoint)
    }
  }
  
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
} 