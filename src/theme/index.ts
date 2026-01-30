import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { StyleSheet, TextStyle } from 'react-native';

// S&P Global Platts Color Palette
export const colors = {
  // Primary brand colors
  primary: '#CC0033',
  primaryDark: '#A30029',
  primaryLight: '#FF1A4D',

  // Secondary colors
  secondary: '#333333',
  secondaryLight: '#666666',

  // Background colors
  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceVariant: '#F0F0F0',

  // Text colors
  text: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textOnPrimary: '#FFFFFF',

  // Link color
  link: '#0066CC',
  linkHover: '#004C99',

  // Border colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  divider: '#EEEEEE',

  // Status colors
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',

  // Alert type colors
  alertReport: '#0066CC',
  alertPrice: '#28A745',
  alertNews: '#6F42C1',
  alertPublication: '#FD7E14',
  alertScheduled: '#20C997',
};

// Typography styles
export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '300' as TextStyle['fontWeight'],
    color: colors.text,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: colors.text,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '500' as TextStyle['fontWeight'],
    color: colors.text,
  },
  h4: {
    fontSize: 18,
    fontWeight: '500' as TextStyle['fontWeight'],
    color: colors.text,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: colors.text,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: colors.textSecondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: colors.textTertiary,
  },
  button: {
    fontSize: 14,
    fontWeight: '600' as TextStyle['fontWeight'],
    textTransform: 'uppercase' as TextStyle['textTransform'],
    letterSpacing: 0.5,
  },
  link: {
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: colors.link,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

// Shadows
export const shadows = StyleSheet.create({
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});

// React Native Paper theme configuration
export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    onPrimary: colors.textOnPrimary,
    primaryContainer: colors.primaryLight,
    secondary: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    onSurface: colors.text,
    onSurfaceVariant: colors.textSecondary,
    outline: colors.border,
    error: colors.error,
  },
  roundness: borderRadius.md,
};

// Common styles
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenPadding: {
    paddingHorizontal: spacing.md,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  paperTheme,
  commonStyles,
};
