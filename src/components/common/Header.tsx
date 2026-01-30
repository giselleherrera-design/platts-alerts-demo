import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../../theme';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  rightActions?: React.ReactNode;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showLogo = true,
  rightActions,
  onBack,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          )}
          {showLogo && (
            <View style={styles.logo}>
              <View style={styles.logoLine} />
              <Text style={styles.logoTextRed}>S&P Global</Text>
              <Text style={styles.logoTextBlack}>Platts</Text>
            </View>
          )}
        </View>
        {rightActions && <View style={styles.rightActions}>{rightActions}</View>}
      </View>
      {(title || subtitle) && (
        <View style={styles.titleContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <View style={styles.titleDivider} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingTop: spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  backArrow: {
    fontSize: 24,
    color: colors.text,
  },
  logo: {
    flexDirection: 'column',
  },
  logoLine: {
    width: 120,
    height: 3,
    backgroundColor: colors.primary,
    marginBottom: spacing.xs,
  },
  logoTextRed: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  logoTextBlack: {
    fontSize: 24,
    fontWeight: '300',
    color: colors.text,
    marginTop: -4,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body2,
    marginBottom: spacing.sm,
  },
  titleDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginTop: spacing.sm,
  },
});

export default Header;
