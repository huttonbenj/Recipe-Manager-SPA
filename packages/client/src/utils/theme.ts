type ThemeColor = 'default' | 'royal' | 'ocean' | 'forest' | 'sunset';

export const getThemeColors = (theme: ThemeColor) => {
  const colors = {
    default: {
      primary: 'emerald-500',
      primaryHover: 'emerald-600',
      primaryDark: 'emerald-400',
      primaryDarkHover: 'emerald-300',
      secondary: 'orange-500',
      secondaryHover: 'orange-600',
      secondaryDark: 'orange-400',
      secondaryDarkHover: 'orange-300',
      gradient: 'bg-gradient-to-r from-emerald-500 to-orange-500',
      gradientDark: 'dark:from-emerald-600 dark:to-orange-600',
      ring: 'ring-emerald-500',
      focusRing: 'focus:ring-emerald-500',
      border: 'border-emerald-500',
      text: 'text-emerald-600',
      textDark: 'dark:text-emerald-400',
      bg: 'bg-emerald-50',
      bgDark: 'dark:bg-emerald-900/20',
    },
    royal: {
      primary: 'purple-600',
      primaryHover: 'purple-700',
      primaryDark: 'purple-400',
      primaryDarkHover: 'purple-300',
      secondary: 'amber-500',
      secondaryHover: 'amber-600',
      secondaryDark: 'amber-400',
      secondaryDarkHover: 'amber-300',
      gradient: 'bg-gradient-to-r from-purple-600 to-amber-500',
      gradientDark: 'dark:from-purple-700 dark:to-amber-600',
      ring: 'ring-purple-500',
      focusRing: 'focus:ring-purple-500',
      border: 'border-purple-500',
      text: 'text-purple-600',
      textDark: 'dark:text-purple-400',
      bg: 'bg-purple-50',
      bgDark: 'dark:bg-purple-900/20',
    },
    ocean: {
      primary: 'blue-600',
      primaryHover: 'blue-700',
      primaryDark: 'blue-400',
      primaryDarkHover: 'blue-300',
      secondary: 'cyan-500',
      secondaryHover: 'cyan-600',
      secondaryDark: 'cyan-400',
      secondaryDarkHover: 'cyan-300',
      gradient: 'bg-gradient-to-r from-blue-600 to-cyan-500',
      gradientDark: 'dark:from-blue-700 dark:to-cyan-600',
      ring: 'ring-blue-500',
      focusRing: 'focus:ring-blue-500',
      border: 'border-blue-500',
      text: 'text-blue-600',
      textDark: 'dark:text-blue-400',
      bg: 'bg-blue-50',
      bgDark: 'dark:bg-blue-900/20',
    },
    forest: {
      primary: 'green-600',
      primaryHover: 'green-700',
      primaryDark: 'green-400',
      primaryDarkHover: 'green-300',
      secondary: 'lime-500',
      secondaryHover: 'lime-600',
      secondaryDark: 'lime-400',
      secondaryDarkHover: 'lime-300',
      gradient: 'bg-gradient-to-r from-green-600 to-lime-500',
      gradientDark: 'dark:from-green-700 dark:to-lime-600',
      ring: 'ring-green-500',
      focusRing: 'focus:ring-green-500',
      border: 'border-green-500',
      text: 'text-green-600',
      textDark: 'dark:text-green-400',
      bg: 'bg-green-50',
      bgDark: 'dark:bg-green-900/20',
    },
    sunset: {
      primary: 'orange-600',
      primaryHover: 'orange-700',
      primaryDark: 'orange-400',
      primaryDarkHover: 'orange-300',
      secondary: 'pink-500',
      secondaryHover: 'pink-600',
      secondaryDark: 'pink-400',
      secondaryDarkHover: 'pink-300',
      gradient: 'bg-gradient-to-r from-orange-600 to-pink-500',
      gradientDark: 'dark:from-orange-700 dark:to-pink-600',
      ring: 'ring-orange-500',
      focusRing: 'focus:ring-orange-500',
      border: 'border-orange-500',
      text: 'text-orange-600',
      textDark: 'dark:text-orange-400',
      bg: 'bg-orange-50',
      bgDark: 'dark:bg-orange-900/20',
    },
  };

  return colors[theme] || colors.default;
};

export const getThemeColorClasses = (theme: ThemeColor) => {
  const colors = getThemeColors(theme);
  
  return {
    text: `text-${colors.primary} ${colors.textDark}`,
    textHover: `hover:text-${colors.primaryHover} dark:hover:text-${colors.primaryDarkHover}`,
    bg: `bg-${colors.primary} ${colors.bgDark}`,
    bgHover: `hover:bg-${colors.primaryHover} dark:hover:bg-${colors.primaryDarkHover}`,
    bgLight: `${colors.bg} ${colors.bgDark}`,
    gradient: `${colors.gradient} ${colors.gradientDark}`,
    border: `${colors.border} dark:border-${colors.primaryDark}`,
    ring: `${colors.ring} dark:ring-${colors.primaryDark}`,
    focusRing: `${colors.focusRing} dark:focus:ring-${colors.primaryDark}`,
    secondary: `text-${colors.secondary} ${colors.textDark}`,
    secondaryBg: `bg-${colors.secondary} dark:bg-${colors.secondaryDark}`,
    secondaryHover: `hover:bg-${colors.secondaryHover} dark:hover:bg-${colors.secondaryDarkHover}`,
  };
};

// Helper function to get theme-aware gradient classes
export const getThemeGradient = (theme: ThemeColor, variant: 'primary' | 'secondary' | 'full' = 'full') => {
  const colors = getThemeColors(theme);
  
  switch (variant) {
    case 'primary':
      return `bg-gradient-to-r from-${colors.primary} to-${colors.primaryHover} dark:from-${colors.primaryDark} dark:to-${colors.primaryDarkHover}`;
    case 'secondary':
      return `bg-gradient-to-r from-${colors.secondary} to-${colors.secondaryHover} dark:from-${colors.secondaryDark} dark:to-${colors.secondaryDarkHover}`;
    case 'full':
    default:
      return `${colors.gradient} ${colors.gradientDark}`;
  }
};

// Helper function to get theme-aware text colors
export const getThemeTextColor = (theme: ThemeColor, variant: 'primary' | 'secondary' = 'primary') => {
  const colors = getThemeColors(theme);
  
  if (variant === 'secondary') {
    return `text-${colors.secondary} dark:text-${colors.secondaryDark}`;
  }
  
  return `${colors.text} ${colors.textDark}`;
};

// Helper function to get theme-aware background colors
export const getThemeBackgroundColor = (theme: ThemeColor, variant: 'primary' | 'secondary' | 'light' = 'primary') => {
  const colors = getThemeColors(theme);
  
  switch (variant) {
    case 'secondary':
      return `bg-${colors.secondary} dark:bg-${colors.secondaryDark}`;
    case 'light':
      return `${colors.bg} ${colors.bgDark}`;
    case 'primary':
    default:
      return `bg-${colors.primary} dark:bg-${colors.primaryDark}`;
  }
}; 

// Helper function for form input styles with theme-aware focus ring
export const getThemeFormInputClasses = (theme: ThemeColor) => {
  const colors = getThemeColors(theme);
  
  return `w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${colors.focusRing} focus:border-${colors.primary} dark:focus:ring-${colors.primaryDark} dark:focus:border-${colors.primaryDark}`;
};

// Helper function for badge/pill styles
export const getThemeBadgeClasses = (theme: ThemeColor, variant: 'primary' | 'secondary' = 'primary') => {
  const colors = getThemeColors(theme);
  
  if (variant === 'secondary') {
    return `bg-${colors.secondary}-100 text-${colors.secondary}-700 dark:bg-${colors.secondary}-900/40 dark:text-${colors.secondary}-200`;
  }
  
  return `bg-${colors.primary}-100 text-${colors.primary}-700 dark:bg-${colors.primary}-900/40 dark:text-${colors.primary}-200`;
};

// Helper function for active/inactive toggle button styles
export const getThemeToggleButtonClasses = (theme: ThemeColor, isActive: boolean) => {
  const colors = getThemeColors(theme);
  
  if (isActive) {
    return `bg-${colors.primary}-100 text-${colors.primary}-700 dark:bg-${colors.primary}-900/30 dark:text-${colors.primary}-300`;
  }
  
  return 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600';
};

// Helper function for getting theme-aware filter pill styles
export const getThemeFilterPillClasses = (theme: ThemeColor, isActive: boolean) => {
  const colors = getThemeColors(theme);
  
  if (isActive) {
    return `bg-${colors.primary}-100 text-${colors.primary}-700 dark:bg-${colors.primary}-900/30 dark:text-${colors.primary}-300`;
  }
  
  return 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600';
};

// Helper function for view mode toggle button styles
export const getThemeViewToggleClasses = (theme: ThemeColor, isActive: boolean) => {
  if (isActive) {
    return 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm';
  }
  
  return 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200';
}; 