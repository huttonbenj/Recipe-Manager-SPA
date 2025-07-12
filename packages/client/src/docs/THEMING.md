# Recipe Manager Theming Guide

This guide explains how to use the theme utilities in new components to ensure consistent theming across the application.

## Theme System Overview

The Recipe Manager app supports:
- **Light and Dark modes**: Automatically switches based on system preference or user selection
- **Color Themes**: Five different color themes (Default/Emerald, Royal, Ocean, Forest, Sunset)

## Using Theme Utilities

### 1. Accessing the Current Theme

First, import the `useTheme` hook:

```tsx
import { useTheme } from '../../../contexts/ThemeContext';

const MyComponent = () => {
  const { theme, isDarkMode } = useTheme();
  
  // theme.mode: 'light' | 'dark' | 'system'
  // theme.color: 'default' | 'royal' | 'ocean' | 'forest' | 'sunset'
  // isDarkMode: boolean (true if dark mode is active)
  
  // ...
};
```

### 2. Theme Utility Functions

Import the theme utilities:

```tsx
import { 
  getThemeColors,
  getThemeGradient,
  getThemeTextColor,
  getThemeBackgroundColor,
  getThemeBadgeClasses,
  getThemeFormInputClasses,
  getThemeToggleButtonClasses,
  getThemeFilterPillClasses,
  getThemeViewToggleClasses
} from '../../../utils/theme';
```

### 3. Common Use Cases

#### Theme-Aware Text Colors

```tsx
import { cn } from '../../../utils/cn';
import { getThemeTextColor } from '../../../utils/theme';

// In your component:
<p className={cn(
  "font-medium",
  getThemeTextColor(theme.color, 'primary') // or 'secondary'
)}>
  Themed text
</p>
```

#### Theme-Aware Background Colors

```tsx
import { cn } from '../../../utils/cn';
import { getThemeBackgroundColor } from '../../../utils/theme';

// In your component:
<div className={cn(
  "p-4 rounded-lg",
  getThemeBackgroundColor(theme.color, 'light') // or 'primary' or 'secondary'
)}>
  Content with themed background
</div>
```

#### Theme-Aware Gradients

```tsx
import { cn } from '../../../utils/cn';
import { getThemeGradient } from '../../../utils/theme';

// In your component:
<div className={cn(
  "p-4 rounded-lg text-white",
  getThemeGradient(theme.color, 'full') // or 'primary' or 'secondary'
)}>
  Content with themed gradient background
</div>
```

#### Form Inputs with Themed Focus Rings

```tsx
import { cn } from '../../../utils/cn';
import { getThemeFormInputClasses } from '../../../utils/theme';

// In your component:
<input
  type="text"
  className={getThemeFormInputClasses(theme.color)}
  placeholder="Enter text..."
/>
```

#### Theme-Aware Badges and Pills

```tsx
import { cn } from '../../../utils/cn';
import { getThemeBadgeClasses } from '../../../utils/theme';

// In your component:
<span className={cn(
  "px-2 py-1 rounded-full text-xs font-medium",
  getThemeBadgeClasses(theme.color, 'primary') // or 'secondary'
)}>
  Badge Text
</span>
```

#### Toggle Buttons

```tsx
import { cn } from '../../../utils/cn';
import { getThemeToggleButtonClasses } from '../../../utils/theme';

// In your component:
<button
  className={cn(
    "px-3 py-2 rounded-md",
    getThemeToggleButtonClasses(theme.color, isActive) // isActive: boolean
  )}
>
  Toggle Button
</button>
```

#### Filter Pills

```tsx
import { cn } from '../../../utils/cn';
import { getThemeFilterPillClasses } from '../../../utils/theme';

// In your component:
<button
  className={cn(
    "px-3 py-1 rounded-full text-sm",
    getThemeFilterPillClasses(theme.color, isSelected) // isSelected: boolean
  )}
>
  Filter Option
</button>
```

#### View Mode Toggles

```tsx
import { cn } from '../../../utils/cn';
import { getThemeViewToggleClasses } from '../../../utils/theme';

// In your component:
<button
  className={cn(
    "p-2 rounded-md",
    getThemeViewToggleClasses(theme.color, isActive) // isActive: boolean
  )}
>
  View Option
</button>
```

### 4. Using Theme Colors Directly

If you need more control, you can access the theme colors directly:

```tsx
import { cn } from '../../../utils/cn';
import { getThemeColors } from '../../../utils/theme';

const MyComponent = () => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme.color);
  
  return (
    <div className={cn(
      `border-${themeColors.primary} text-${themeColors.secondary}`,
      `hover:bg-${themeColors.primaryHover} dark:hover:bg-${themeColors.primaryDarkHover}`
    )}>
      Custom themed content
    </div>
  );
};
```

## Component Examples

### Card with Theme Support

```tsx
import React from 'react';
import { cn } from '../../../utils/cn';
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeBackgroundColor, getThemeTextColor } from '../../../utils/theme';

interface MyCardProps {
  title: string;
  content: string;
  className?: string;
}

export const MyCard: React.FC<MyCardProps> = ({ title, content, className }) => {
  const { theme } = useTheme();
  
  return (
    <div className={cn(
      "rounded-lg shadow-md p-4 border",
      getThemeBackgroundColor(theme.color, 'light'),
      "border-gray-200 dark:border-gray-700",
      className
    )}>
      <h3 className={cn(
        "text-lg font-bold mb-2",
        getThemeTextColor(theme.color, 'primary')
      )}>
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        {content}
      </p>
    </div>
  );
};
```

### Button with Theme Support

```tsx
import React from 'react';
import { cn } from '../../../utils/cn';
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeColors } from '../../../utils/theme';

interface MyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export const MyButton: React.FC<MyButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className
}) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme.color);
  
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return `bg-${themeColors.primary} text-white hover:bg-${themeColors.primaryHover} dark:bg-${themeColors.primaryDark} dark:hover:bg-${themeColors.primaryDarkHover}`;
      case 'secondary':
        return `bg-${themeColors.secondary} text-white hover:bg-${themeColors.secondaryHover} dark:bg-${themeColors.secondaryDark} dark:hover:bg-${themeColors.secondaryDarkHover}`;
      case 'outline':
        return `border ${themeColors.border} bg-transparent ${themeColors.text} hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800`;
      default:
        return `bg-${themeColors.primary} text-white hover:bg-${themeColors.primaryHover}`;
    }
  };
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-md font-medium transition-colors",
        getButtonStyles(),
        className
      )}
    >
      {children}
    </button>
  );
};
```

## Best Practices

1. **Always use theme utilities** instead of hardcoded color values
2. **Use the `cn()` utility** to combine theme classes with other classes
3. **Support both light and dark modes** by using dark: prefixed classes
4. **Test your components** with all color themes and both light/dark modes
5. **Use semantic color variants** (primary, secondary) rather than specific color names
6. **Add smooth transitions** for theme changes using `transition-colors`

## Available Theme Colors

Each theme provides the following color variables:

- **primary**: Main theme color
- **primaryHover**: Darker version of primary for hover states
- **primaryDark**: Dark mode version of primary
- **primaryDarkHover**: Dark mode hover version of primary
- **secondary**: Secondary theme color
- **secondaryHover**: Darker version of secondary for hover states
- **secondaryDark**: Dark mode version of secondary
- **secondaryDarkHover**: Dark mode hover version of secondary
- **gradient**: Full gradient using primary and secondary
- **gradientDark**: Dark mode version of the gradient
- **ring**: Focus ring color
- **focusRing**: Focus ring utility class
- **border**: Border color
- **text**: Text color
- **textDark**: Dark mode text color
- **bg**: Light background color
- **bgDark**: Dark background color 