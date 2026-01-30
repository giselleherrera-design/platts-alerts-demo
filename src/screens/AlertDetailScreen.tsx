import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Alert as RNAlert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Header } from '../components/common';
import { ReportList } from '../components/alerts';
import { useAlerts } from '../context/AlertContext';
import { colors, spacing, borderRadius, typography } from '../theme';
import {
  Alert,
  ALERT_TYPE_LABELS,
  FREQUENCY_LABELS,
  isReportAlert,
  isPriceAlert,
  isNewsAlert,
  isPublicationAlert,
  isScheduledAlert,
} from '../types/alerts';

type Props = NativeStackScreenProps<RootStackParamList, 'AlertDetail'>;

const AlertDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { alertId } = route.params;
  const { getAlertById, updateAlert, deleteAlert } = useAlerts();
  const [alert, setAlert] = useState<Alert | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    const foundAlert = getAlertById(alertId);
    setAlert(foundAlert);
    if (foundAlert) {
      setEditedName(foundAlert.name);
    }
  }, [alertId, getAlertById]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleToggleActive = async () => {
    if (alert) {
      await updateAlert(alert.id, { isActive: !alert.isActive });
      setAlert({ ...alert, isActive: !alert.isActive });
    }
  };

  const handleSaveName = async () => {
    if (alert && editedName.trim()) {
      await updateAlert(alert.id, { name: editedName.trim() });
      setAlert({ ...alert, name: editedName.trim() });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    RNAlert.alert(
      'Delete Alert',
      'Are you sure you want to delete this alert? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (alert) {
              await deleteAlert(alert.id);
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  if (!alert) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Alert Details" showLogo={false} onBack={handleBack} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Alert not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderAlertConfig = () => {
    if (isReportAlert(alert)) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Reports ({alert.config.reports.length})</Text>
          <ReportList reports={alert.config.reports} maxVisible={10} />
        </View>
      );
    }

    if (isPriceAlert(alert)) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Configuration</Text>
          <View style={styles.configCard}>
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>Symbol</Text>
              <Text style={styles.configValue}>{alert.config.symbol}</Text>
            </View>
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>Name</Text>
              <Text style={styles.configValue}>{alert.config.symbolName}</Text>
            </View>
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>Condition</Text>
              <Text style={styles.configValue}>
                {alert.config.condition === 'above'
                  ? 'Price Above'
                  : alert.config.condition === 'below'
                  ? 'Price Below'
                  : 'Change Percentage'}
              </Text>
            </View>
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>Threshold</Text>
              <Text style={styles.configValue}>
                {alert.config.threshold}
                {alert.config.condition === 'change_percent' ? '%' : ''}
              </Text>
            </View>
            {alert.config.currentPrice !== undefined && (
              <View style={styles.configRow}>
                <Text style={styles.configLabel}>Current Price</Text>
                <Text style={[styles.configValue, styles.priceValue]}>
                  ${alert.config.currentPrice.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    if (isNewsAlert(alert)) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>News Configuration</Text>
          <View style={styles.configCard}>
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>Keywords</Text>
              <View style={styles.tagsContainer}>
                {alert.config.keywords.map((keyword, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{keyword}</Text>
                  </View>
                ))}
              </View>
            </View>
            {alert.config.sources && alert.config.sources.length > 0 && (
              <View style={styles.configRow}>
                <Text style={styles.configLabel}>Sources</Text>
                <Text style={styles.configValue}>{alert.config.sources.join(', ')}</Text>
              </View>
            )}
            {alert.config.topics && alert.config.topics.length > 0 && (
              <View style={styles.configRow}>
                <Text style={styles.configLabel}>Topics</Text>
                <Text style={styles.configValue}>{alert.config.topics.join(', ')}</Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    if (isPublicationAlert(alert)) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Publication Configuration</Text>
          <View style={styles.configCard}>
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>Publications</Text>
              <Text style={styles.configValue}>
                {alert.config.publications.join(', ') || 'None selected'}
              </Text>
            </View>
            {alert.config.categories && alert.config.categories.length > 0 && (
              <View style={styles.configRow}>
                <Text style={styles.configLabel}>Categories</Text>
                <Text style={styles.configValue}>{alert.config.categories.join(', ')}</Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    if (isScheduledAlert(alert)) {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule Configuration</Text>
          <View style={styles.configCard}>
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>Time</Text>
              <Text style={styles.configValue}>{alert.config.scheduleTime}</Text>
            </View>
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>Days</Text>
              <Text style={styles.configValue}>
                {alert.config.scheduleDays.map((d) => dayNames[d]).join(', ')}
              </Text>
            </View>
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>Includes</Text>
              <Text style={styles.configValue}>
                {alert.config.includedAlertTypes
                  .map((t) => ALERT_TYPE_LABELS[t])
                  .join(', ') || 'None'}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Alert Details"
        showLogo={false}
        onBack={handleBack}
        rightActions={
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content}>
        {/* Alert Name */}
        <View style={styles.section}>
          <View style={styles.nameRow}>
            {isEditing ? (
              <View style={styles.editNameContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={editedName}
                  onChangeText={setEditedName}
                  autoFocus
                />
                <TouchableOpacity onPress={handleSaveName} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.alertName}>{alert.name}</Text>
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Text style={styles.editLink}>Edit</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          <Text style={styles.alertType}>{ALERT_TYPE_LABELS[alert.type]}</Text>
        </View>

        {/* Status Toggle */}
        <View style={styles.section}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.statusLabel}>Alert Status</Text>
              <Text style={styles.statusValue}>
                {alert.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
            <Switch
              value={alert.isActive}
              onValueChange={handleToggleActive}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={alert.isActive ? colors.primary : colors.textTertiary}
            />
          </View>
        </View>

        {/* Frequency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Frequency</Text>
          <View style={styles.frequencyBadge}>
            <Text style={styles.frequencyText}>{FREQUENCY_LABELS[alert.config.frequency]}</Text>
          </View>
        </View>

        {/* Alert-specific config */}
        {renderAlertConfig()}

        {/* Metadata */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alert Information</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Created</Text>
            <Text style={styles.metaValue}>
              {new Date(alert.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Last Updated</Text>
            <Text style={styles.metaValue}>
              {new Date(alert.updatedAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Alert ID</Text>
            <Text style={styles.metaValue}>{alert.id}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  deleteButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  deleteButtonText: {
    ...typography.body2,
    color: colors.error,
  },
  section: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertName: {
    ...typography.h2,
    color: colors.primary,
    flex: 1,
  },
  editLink: {
    ...typography.body2,
    color: colors.link,
    marginLeft: spacing.md,
  },
  editNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    fontSize: 18,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  saveButtonText: {
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  alertType: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLabel: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  statusValue: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text,
  },
  sectionTitle: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  frequencyBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    alignSelf: 'flex-start',
  },
  frequencyText: {
    ...typography.body2,
    color: colors.text,
  },
  configCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  configRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  priceValue: {
    fontWeight: '600',
    color: colors.success,
  },
  tagsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  tagText: {
    ...typography.caption,
    color: colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  metaLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  metaValue: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

export default AlertDetailScreen;
