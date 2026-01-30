import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Alert, ALERT_TYPE_LABELS, isReportAlert, isPriceAlert, isNewsAlert, isPublicationAlert, isScheduledAlert } from '../../types/alerts';
import { Tooltip } from '../common';
import ReportList from './ReportList';

interface AlertCardProps {
  alert: Alert;
  onToggleActive: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onPress: (alert: Alert) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onToggleActive,
  onDuplicate,
  onDelete,
  onEdit,
  onPress,
}) => {
  const [expanded, setExpanded] = useState(false);

  const getAlertTypeColor = () => {
    switch (alert.type) {
      case 'report':
        return colors.alertReport;
      case 'price':
        return colors.alertPrice;
      case 'news':
        return colors.alertNews;
      case 'publication':
        return colors.alertPublication;
      case 'scheduled':
        return colors.alertScheduled;
      default:
        return colors.primary;
    }
  };

  const renderExpandedContent = () => {
    if (!expanded) return null;

    if (isReportAlert(alert)) {
      return (
        <View style={styles.expandedContent}>
          <Text style={styles.sectionTitle}>Selected Reports and Data Files</Text>
          <ReportList reports={alert.config.reports} />
          <TouchableOpacity style={styles.editButton} onPress={() => onEdit(alert.id)}>
            <Text style={styles.editButtonText}>Edit Alert</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isPriceAlert(alert)) {
      return (
        <View style={styles.expandedContent}>
          <Text style={styles.sectionTitle}>Price Configuration</Text>
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Symbol:</Text>
            <Text style={styles.configValue}>{alert.config.symbolName}</Text>
          </View>
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Condition:</Text>
            <Text style={styles.configValue}>
              {alert.config.condition === 'above'
                ? 'Price above'
                : alert.config.condition === 'below'
                ? 'Price below'
                : 'Change by'}{' '}
              {alert.config.threshold}
              {alert.config.condition === 'change_percent' ? '%' : ''}
            </Text>
          </View>
          {alert.config.currentPrice !== undefined && (
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>Current Price:</Text>
              <Text style={styles.configValue}>${alert.config.currentPrice.toFixed(2)}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.editButton} onPress={() => onEdit(alert.id)}>
            <Text style={styles.editButtonText}>Edit Alert</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isNewsAlert(alert)) {
      return (
        <View style={styles.expandedContent}>
          <Text style={styles.sectionTitle}>News Configuration</Text>
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Keywords:</Text>
            <Text style={styles.configValue}>{alert.config.keywords.join(', ')}</Text>
          </View>
          {alert.config.sources && alert.config.sources.length > 0 && (
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>Sources:</Text>
              <Text style={styles.configValue}>{alert.config.sources.join(', ')}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.editButton} onPress={() => onEdit(alert.id)}>
            <Text style={styles.editButtonText}>Edit Alert</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isPublicationAlert(alert)) {
      return (
        <View style={styles.expandedContent}>
          <Text style={styles.sectionTitle}>Publication Configuration</Text>
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Publications:</Text>
            <Text style={styles.configValue}>{alert.config.publications.join(', ')}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => onEdit(alert.id)}>
            <Text style={styles.editButtonText}>Edit Alert</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isScheduledAlert(alert)) {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return (
        <View style={styles.expandedContent}>
          <Text style={styles.sectionTitle}>Schedule Configuration</Text>
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Time:</Text>
            <Text style={styles.configValue}>{alert.config.scheduleTime}</Text>
          </View>
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Days:</Text>
            <Text style={styles.configValue}>
              {alert.config.scheduleDays.map(d => dayNames[d]).join(', ')}
            </Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => onEdit(alert.id)}>
            <Text style={styles.editButtonText}>Edit Alert</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.titleRow}>
          <Text style={[styles.alertName, { color: getAlertTypeColor() }]}>
            {alert.name}
          </Text>
          <Text style={styles.alertType}> {ALERT_TYPE_LABELS[alert.type]}</Text>
          <Text style={styles.expandIcon}>{expanded ? '▲' : '▼'}</Text>
        </View>
        <View style={styles.actions}>
          <Tooltip
            text={alert.isActive ? 'Deactivate alert' : 'Activate alert'}
            onPress={(e: any) => {
              e?.stopPropagation?.();
              onToggleActive(alert.id);
            }}
          >
            <Text style={alert.isActive ? styles.activeIcon : styles.inactiveIcon}>
              {alert.isActive ? '✓' : '✗'}
            </Text>
          </Tooltip>
          <Tooltip
            text="Edit alert"
            onPress={(e: any) => {
              e?.stopPropagation?.();
              onEdit(alert.id);
            }}
          >
            <Text style={styles.actionIcon}>✎</Text>
          </Tooltip>
          <Tooltip
            text="Duplicate alert"
            onPress={(e: any) => {
              e?.stopPropagation?.();
              onDuplicate(alert.id);
            }}
          >
            <Text style={styles.actionIcon}>⧉</Text>
          </Tooltip>
          <Tooltip
            text="Delete alert"
            onPress={(e: any) => {
              e?.stopPropagation?.();
              onDelete(alert.id);
            }}
          >
            <Text style={styles.deleteIcon}>🗑</Text>
          </Tooltip>
        </View>
      </TouchableOpacity>
      {renderExpandedContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertName: {
    fontSize: 14,
    fontWeight: '500',
  },
  alertType: {
    ...typography.body2,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  expandIcon: {
    marginLeft: spacing.sm,
    fontSize: 10,
    color: colors.textTertiary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.sm,
  },
  actionIcon: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  activeIcon: {
    fontSize: 18,
    color: colors.success,
  },
  inactiveIcon: {
    fontSize: 18,
    color: colors.error,
  },
  deleteIcon: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  expandedContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.surfaceVariant,
  },
  sectionTitle: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  configRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  configLabel: {
    ...typography.body2,
    color: colors.textSecondary,
    width: 100,
  },
  configValue: {
    ...typography.body2,
    color: colors.text,
    flex: 1,
  },
  editButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default AlertCard;
