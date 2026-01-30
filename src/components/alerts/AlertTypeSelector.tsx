import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { AlertType, ALERT_TYPE_LABELS } from '../../types/alerts';

interface AlertTypeSelectorProps {
  selectedType: AlertType | null;
  onSelectType: (type: AlertType) => void;
}

const ALERT_TYPE_ICONS: Record<AlertType, string> = {
  report: '📄',
  price: '💰',
  news: '📰',
  publication: '📚',
  scheduled: '⏰',
};

const ALERT_TYPE_DESCRIPTIONS: Record<AlertType, string> = {
  report: 'Get notified when specific reports are updated',
  price: 'Monitor price changes and thresholds',
  news: 'Stay updated on news topics and keywords',
  publication: 'Track new publications in your areas of interest',
  scheduled: 'Receive digest alerts at scheduled times',
};

const AlertTypeSelector: React.FC<AlertTypeSelectorProps> = ({
  selectedType,
  onSelectType,
}) => {
  const alertTypes: AlertType[] = ['report', 'price', 'news', 'publication', 'scheduled'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Alert Type</Text>
      <View style={styles.grid}>
        {alertTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeCard,
              selectedType === type && styles.selectedCard,
            ]}
            onPress={() => onSelectType(type)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{ALERT_TYPE_ICONS[type]}</Text>
            <Text
              style={[
                styles.label,
                selectedType === type && styles.selectedLabel,
              ]}
            >
              {ALERT_TYPE_LABELS[type]}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {ALERT_TYPE_DESCRIPTIONS[type]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  grid: {
    gap: spacing.sm,
  },
  typeCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: '#FFF0F3',
  },
  icon: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  selectedLabel: {
    color: colors.primary,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

export default AlertTypeSelector;
