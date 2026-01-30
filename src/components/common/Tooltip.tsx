import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  onPress?: (e?: any) => void;
  style?: object;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, onPress, style }) => {
  const [isHovered, setIsHovered] = useState(false);

  // On web, use hover state to show custom tooltip
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity
          onPress={onPress}
          // @ts-ignore - web-only props
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={styles.touchable}
        >
          {children}
        </TouchableOpacity>
        {isHovered && (
          <View style={styles.tooltipContainer}>
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>{text}</Text>
            </View>
            <View style={styles.tooltipArrow} />
          </View>
        )}
      </View>
    );
  }

  // On native, just render the touchable
  return (
    <TouchableOpacity
      onPress={onPress}
      style={style}
      accessibilityLabel={text}
      accessibilityHint={text}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  touchable: {
    padding: spacing.sm,
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: [{ translateX: -50 }],
    alignItems: 'center',
    zIndex: 1000,
    marginBottom: 4,
  },
  tooltip: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    maxWidth: 150,
  },
  tooltipText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.secondary,
  },
});

export default Tooltip;
