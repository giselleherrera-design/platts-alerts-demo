import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme';

interface ActionButtonProps {
  icon: 'check' | 'copy' | 'delete' | 'edit' | 'add';
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
}

const ICONS: Record<string, string> = {
  check: '✓',
  copy: '⧉',
  delete: '🗑',
  edit: '✎',
  add: '+',
};

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  onPress,
  disabled = false,
  style,
  size = 'medium',
}) => {
  const sizeStyles = {
    small: { padding: spacing.xs, fontSize: 14 },
    medium: { padding: spacing.sm, fontSize: 18 },
    large: { padding: spacing.md, fontSize: 22 },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { padding: sizeStyles[size].padding },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.icon,
          { fontSize: sizeStyles[size].fontSize },
          icon === 'check' && styles.checkIcon,
          icon === 'delete' && styles.deleteIcon,
          disabled && styles.disabledText,
        ]}
      >
        {ICONS[icon]}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  icon: {
    color: colors.textSecondary,
  },
  checkIcon: {
    color: colors.success,
  },
  deleteIcon: {
    color: colors.textSecondary,
  },
  disabledText: {
    color: colors.textTertiary,
  },
});

export default ActionButton;
