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

// Define types for test cases
interface ResponsiveTest {
  breakpoint: BreakpointKey
  expected: string
}

interface ResponsiveTestCase {
  component: string
  tests: ResponsiveTest[]
}

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
    component: 'SearchForm',
    tests: [
      { breakpoint: 'mobile', expected: 'Stacked layout, full width inputs' },
      { breakpoint: 'tablet', expected: 'Responsive horizontal layout' },
      { breakpoint: 'desktop', expected: 'Optimized horizontal layout' }
    ]
  },
  {
    component: 'RecipeList',
    tests: [
      { breakpoint: 'mobile', expected: 'Single column, stacked cards' },
      { breakpoint: 'tablet', expected: 'Two column grid' },
      { breakpoint: 'desktop', expected: 'Grid layout with sidebar' }
    ]
  },
  {
    component: 'RecipeCard',
    tests: [
      { breakpoint: 'mobile', expected: 'Single column layout, full width cards' },
      { breakpoint: 'tablet', expected: 'Two column grid layout' },
      { breakpoint: 'desktop', expected: 'Three+ column grid layout' }
    ]
  },
  {
    component: 'RecipeFilters',
    tests: [
      { breakpoint: 'mobile', expected: 'Collapsed filters with toggle button' },
      { breakpoint: 'tablet', expected: 'Expanded filters in sidebar' },
      { breakpoint: 'desktop', expected: 'Expanded filters in sidebar' }
    ]
  },
  {
    component: 'SearchForm',
    tests: [
      { breakpoint: 'mobile', expected: 'Stacked inputs, full width' },
      { breakpoint: 'tablet', expected: 'Horizontal layout with responsive inputs' },
      { breakpoint: 'desktop', expected: 'Horizontal layout with responsive inputs' }
    ]
  }
] satisfies ResponsiveTestCase[]

/**
 * Run responsive design tests in browser console
 */
export const runResponsiveTests = (): void => {
  if (typeof window === 'undefined') {
    console.warn('Responsive tests can only run in browser environment')
    return
  }

  const width = window.innerWidth
  const currentBreakpoint = getCurrentBreakpoint()
  
  console.group('🔍 Responsive Design Test')
  console.log(`Current viewport: ${width}px`)
  console.log(`Current breakpoint: ${RESPONSIVE_BREAKPOINTS[currentBreakpoint].label}`)
  console.log('Expected behavior:')
  
  RESPONSIVE_TEST_CASES.forEach(testCase => {
    const relevantTest = testCase.tests.find((test: ResponsiveTest) => test.breakpoint === currentBreakpoint)
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