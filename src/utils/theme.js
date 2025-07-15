import { Appearance } from 'react-native';
import { getData, storeData } from './storage';

// Theme storage key
const THEME_STORAGE_KEY = '@YuKomi:theme_settings';

// Theme definitions
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
};

// Light theme colors
export const LIGHT_THEME = {
  primary: '#3498DB',
  secondary: '#E74C3C',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: {
    primary: '#2C3E50',
    secondary: '#7F8C8D',
    inverse: '#FFFFFF',
  },
  border: '#E9ECEF',
  notification: '#E74C3C',
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
  statusBar: 'dark-content',
};

// Dark theme colors
export const DARK_THEME = {
  primary: '#3498DB',
  secondary: '#E74C3C',
  background: '#1A1A1A',
  surface: '#2C2C2C',
  card: '#2C2C2C',
  text: {
    primary: '#FFFFFF',
    secondary: '#BDC3C7',
    inverse: '#2C3E50',
  },
  border: '#404040',
  notification: '#E74C3C',
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.7)',
  statusBar: 'light-content',
};

// Default theme settings
const DEFAULT_THEME_SETTINGS = {
  theme: THEMES.AUTO,
  customColors: {},
  readerTheme: {
    backgroundColor: '#000000',
    controlsOpacity: 0.8,
  },
};

// Get system theme
export const getSystemTheme = () => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark' ? THEMES.DARK : THEMES.LIGHT;
};

// Get theme settings from storage
export const getThemeSettings = async () => {
  try {
    const settings = await getData(THEME_STORAGE_KEY);
    return settings || DEFAULT_THEME_SETTINGS;
  } catch (error) {
    console.error('Error getting theme settings:', error);
    return DEFAULT_THEME_SETTINGS;
  }
};

// Update theme settings
export const updateThemeSettings = async (newSettings) => {
  try {
    const currentSettings = await getThemeSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    await storeData(THEME_STORAGE_KEY, updatedSettings);
    return updatedSettings;
  } catch (error) {
    console.error('Error updating theme settings:', error);
    throw error;
  }
};

// Get current theme colors
export const getCurrentTheme = async () => {
  try {
    const settings = await getThemeSettings();
    let activeTheme = settings.theme;
    
    // If auto, use system theme
    if (activeTheme === THEMES.AUTO) {
      activeTheme = getSystemTheme();
    }
    
    // Get base theme
    const baseTheme = activeTheme === THEMES.DARK ? DARK_THEME : LIGHT_THEME;
    
    // Apply custom colors if any
    const theme = {
      ...baseTheme,
      ...settings.customColors,
      isDark: activeTheme === THEMES.DARK,
      name: activeTheme,
    };
    
    return theme;
  } catch (error) {
    console.error('Error getting current theme:', error);
    return {
      ...LIGHT_THEME,
      isDark: false,
      name: THEMES.LIGHT,
    };
  }
};

// Theme-aware styles helper
export const createThemedStyles = (styleFunction) => {
  return async () => {
    const theme = await getCurrentTheme();
    return styleFunction(theme);
  };
};

// Get reader theme
export const getReaderTheme = async () => {
  try {
    const settings = await getThemeSettings();
    const currentTheme = await getCurrentTheme();
    
    return {
      ...settings.readerTheme,
      isDark: currentTheme.isDark,
      textColor: currentTheme.text.primary,
      controlsColor: currentTheme.text.inverse,
    };
  } catch (error) {
    console.error('Error getting reader theme:', error);
    return {
      backgroundColor: '#000000',
      controlsOpacity: 0.8,
      isDark: true,
      textColor: '#FFFFFF',
      controlsColor: '#FFFFFF',
    };
  }
};

// Update reader theme
export const updateReaderTheme = async (readerThemeSettings) => {
  try {
    const currentSettings = await getThemeSettings();
    const updatedSettings = {
      ...currentSettings,
      readerTheme: {
        ...currentSettings.readerTheme,
        ...readerThemeSettings,
      },
    };
    await storeData(THEME_STORAGE_KEY, updatedSettings);
    return updatedSettings.readerTheme;
  } catch (error) {
    console.error('Error updating reader theme:', error);
    throw error;
  }
};

// Listen to system theme changes
export const addThemeChangeListener = (callback) => {
  const subscription = Appearance.addChangeListener(({ colorScheme }) => {
    callback(colorScheme === 'dark' ? THEMES.DARK : THEMES.LIGHT);
  });
  
  return subscription;
};

// Remove theme change listener
export const removeThemeChangeListener = (subscription) => {
  if (subscription) {
    subscription.remove();
  }
};

// Predefined color schemes for customization
export const COLOR_SCHEMES = {
  blue: {
    primary: '#3498DB',
    secondary: '#2980B9',
  },
  green: {
    primary: '#2ECC71',
    secondary: '#27AE60',
  },
  purple: {
    primary: '#9B59B6',
    secondary: '#8E44AD',
  },
  orange: {
    primary: '#E67E22',
    secondary: '#D35400',
  },
  red: {
    primary: '#E74C3C',
    secondary: '#C0392B',
  },
  teal: {
    primary: '#1ABC9C',
    secondary: '#16A085',
  },
};

// Apply color scheme
export const applyColorScheme = async (schemeName) => {
  try {
    const scheme = COLOR_SCHEMES[schemeName];
    if (!scheme) {
      throw new Error('Invalid color scheme');
    }
    
    const currentSettings = await getThemeSettings();
    const updatedSettings = {
      ...currentSettings,
      customColors: {
        ...currentSettings.customColors,
        ...scheme,
      },
    };
    
    await storeData(THEME_STORAGE_KEY, updatedSettings);
    return updatedSettings;
  } catch (error) {
    console.error('Error applying color scheme:', error);
    throw error;
  }
};

// Reset theme to default
export const resetTheme = async () => {
  try {
    await storeData(THEME_STORAGE_KEY, DEFAULT_THEME_SETTINGS);
    return DEFAULT_THEME_SETTINGS;
  } catch (error) {
    console.error('Error resetting theme:', error);
    throw error;
  }
};

// Get theme for specific component
export const getComponentTheme = async (componentName) => {
  const theme = await getCurrentTheme();
  
  const componentThemes = {
    header: {
      backgroundColor: theme.primary,
      textColor: theme.text.inverse,
      borderColor: theme.border,
    },
    card: {
      backgroundColor: theme.card,
      textColor: theme.text.primary,
      borderColor: theme.border,
      shadowColor: theme.shadow,
    },
    button: {
      primary: {
        backgroundColor: theme.primary,
        textColor: theme.text.inverse,
      },
      secondary: {
        backgroundColor: theme.surface,
        textColor: theme.text.primary,
        borderColor: theme.border,
      },
      danger: {
        backgroundColor: theme.error,
        textColor: theme.text.inverse,
      },
    },
    input: {
      backgroundColor: theme.surface,
      textColor: theme.text.primary,
      borderColor: theme.border,
      placeholderColor: theme.text.secondary,
    },
    modal: {
      backgroundColor: theme.surface,
      overlayColor: theme.overlay,
      textColor: theme.text.primary,
    },
  };
  
  return componentThemes[componentName] || theme;
};

// Export theme utilities
export default {
  THEMES,
  LIGHT_THEME,
  DARK_THEME,
  COLOR_SCHEMES,
  getSystemTheme,
  getThemeSettings,
  updateThemeSettings,
  getCurrentTheme,
  createThemedStyles,
  getReaderTheme,
  updateReaderTheme,
  addThemeChangeListener,
  removeThemeChangeListener,
  applyColorScheme,
  resetTheme,
  getComponentTheme,
};

