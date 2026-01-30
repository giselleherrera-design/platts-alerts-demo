import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Alert as RNAlert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Header } from '../components/common';
import { AlertTypeSelector } from '../components/alerts';
import { useAlerts } from '../context/AlertContext';
import { colors, spacing, borderRadius, typography } from '../theme';
import {
  AlertType,
  ALERT_TYPE_LABELS,
  FREQUENCY_LABELS,
  AlertFrequency,
  ReportAlertConfig,
  PriceAlertConfig,
  NewsAlertConfig,
  PublicationAlertConfig,
  ScheduledAlertConfig,
} from '../types/alerts';
import {
  availableReports,
  availablePriceSymbols,
  newsTopics,
  newsSources,
} from '../services/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateAlert'>;

const CreateAlertScreen: React.FC<Props> = ({ navigation, route }) => {
  const { addAlert, updateAlert, getAlertById } = useAlerts();
  const editAlertId = route.params?.editAlertId;
  const existingAlert = editAlertId ? getAlertById(editAlertId) : null;
  const isEditMode = !!existingAlert;

  const [step, setStep] = useState<'type' | 'config' | 'review'>(
    existingAlert ? 'config' : route.params?.alertType ? 'config' : 'type'
  );
  const [selectedType, setSelectedType] = useState<AlertType | null>(
    existingAlert?.type || route.params?.alertType || null
  );
  const [alertName, setAlertName] = useState(existingAlert?.name || '');
  const [frequency, setFrequency] = useState<AlertFrequency>(
    (existingAlert?.config as any)?.frequency || 'realtime'
  );

  // Report Alert specific
  const [selectedReports, setSelectedReports] = useState<string[]>(() => {
    if (existingAlert?.type === 'report') {
      return (existingAlert.config as ReportAlertConfig).reports.map(r => r.id);
    }
    return [];
  });

  // Price Alert specific
  const [selectedSymbol, setSelectedSymbol] = useState(() => {
    if (existingAlert?.type === 'price') {
      return (existingAlert.config as PriceAlertConfig).symbol;
    }
    return '';
  });
  const [priceCondition, setPriceCondition] = useState<'above' | 'below' | 'change_percent'>(() => {
    if (existingAlert?.type === 'price') {
      return (existingAlert.config as PriceAlertConfig).condition;
    }
    return 'above';
  });
  const [priceThreshold, setPriceThreshold] = useState(() => {
    if (existingAlert?.type === 'price') {
      return String((existingAlert.config as PriceAlertConfig).threshold);
    }
    return '';
  });

  // News Alert specific
  const [keywords, setKeywords] = useState(() => {
    if (existingAlert?.type === 'news') {
      return (existingAlert.config as NewsAlertConfig).keywords.join(', ');
    }
    return '';
  });
  const [selectedTopics, setSelectedTopics] = useState<string[]>(() => {
    if (existingAlert?.type === 'news') {
      return (existingAlert.config as NewsAlertConfig).topics || [];
    }
    return [];
  });
  const [selectedSources, setSelectedSources] = useState<string[]>(() => {
    if (existingAlert?.type === 'news') {
      return (existingAlert.config as NewsAlertConfig).sources || [];
    }
    return [];
  });

  // Publication Alert specific
  const [selectedPublications, setSelectedPublications] = useState<string[]>(() => {
    if (existingAlert?.type === 'publication') {
      return (existingAlert.config as PublicationAlertConfig).publications;
    }
    return [];
  });

  // Scheduled Alert specific
  const [scheduleTime, setScheduleTime] = useState(() => {
    if (existingAlert?.type === 'scheduled') {
      return (existingAlert.config as ScheduledAlertConfig).scheduleTime;
    }
    return '08:00';
  });
  const [scheduleDays, setScheduleDays] = useState<number[]>(() => {
    if (existingAlert?.type === 'scheduled') {
      return (existingAlert.config as ScheduledAlertConfig).scheduleDays;
    }
    return [1, 2, 3, 4, 5];
  });
  const [includedAlertTypes, setIncludedAlertTypes] = useState<AlertType[]>(() => {
    if (existingAlert?.type === 'scheduled') {
      return (existingAlert.config as ScheduledAlertConfig).includedAlertTypes || [];
    }
    return [];
  });

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      RNAlert.alert(title, message);
    }
  };

  const handleTypeSelect = (type: AlertType) => {
    setSelectedType(type);
    setStep('config');
  };

  const handleBack = () => {
    if (step === 'config') {
      setStep('type');
      setSelectedType(null);
    } else if (step === 'review') {
      setStep('config');
    } else {
      navigation.goBack();
    }
  };

  const validateConfig = (): boolean => {
    if (!alertName.trim()) {
      showAlert('Error', 'Please enter an alert name');
      return false;
    }

    switch (selectedType) {
      case 'report':
        if (selectedReports.length === 0) {
          showAlert('Error', 'Please select at least one report');
          return false;
        }
        break;
      case 'price':
        if (!selectedSymbol || !priceThreshold) {
          showAlert('Error', 'Please configure price alert settings');
          return false;
        }
        break;
      case 'news':
        if (!keywords.trim() && selectedTopics.length === 0) {
          showAlert('Error', 'Please enter keywords or select topics');
          return false;
        }
        break;
      case 'publication':
        if (selectedPublications.length === 0) {
          showAlert('Error', 'Please select at least one publication');
          return false;
        }
        break;
      case 'scheduled':
        if (scheduleDays.length === 0) {
          showAlert('Error', 'Please select at least one day');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 'config') {
      if (validateConfig()) {
        setStep('review');
      }
    }
  };

  const handleSave = async () => {
    if (!selectedType) return;

    let config: any;
    switch (selectedType) {
      case 'report':
        config = {
          frequency,
          reports: availableReports.filter((r) => selectedReports.includes(r.id)),
        } as ReportAlertConfig;
        break;
      case 'price':
        const symbol = availablePriceSymbols.find((s) => s.symbol === selectedSymbol);
        config = {
          frequency,
          symbol: selectedSymbol,
          symbolName: symbol?.name || '',
          condition: priceCondition,
          threshold: parseFloat(priceThreshold),
        } as PriceAlertConfig;
        break;
      case 'news':
        config = {
          frequency,
          keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
          topics: selectedTopics,
          sources: selectedSources,
        } as NewsAlertConfig;
        break;
      case 'publication':
        config = {
          frequency,
          publications: selectedPublications,
          categories: [],
        } as PublicationAlertConfig;
        break;
      case 'scheduled':
        config = {
          frequency: 'daily',
          scheduleTime,
          scheduleDays,
          includedAlertTypes,
        } as ScheduledAlertConfig;
        break;
    }

    if (isEditMode && editAlertId) {
      await updateAlert(editAlertId, {
        name: alertName,
        type: selectedType,
        config,
      });
    } else {
      await addAlert({
        name: alertName,
        type: selectedType,
        isActive: true,
        config,
      });
    }

    navigation.navigate('AlertsHome');
  };

  const renderConfigForm = () => {
    return (
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Alert Name</Text>
          <TextInput
            style={styles.input}
            value={alertName}
            onChangeText={setAlertName}
            placeholder="Enter alert name"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Frequency</Text>
          <View style={styles.frequencyOptions}>
            {(['realtime', 'daily', 'weekly'] as AlertFrequency[]).map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.frequencyOption,
                  frequency === freq && styles.frequencyOptionSelected,
                ]}
                onPress={() => setFrequency(freq)}
              >
                <Text
                  style={[
                    styles.frequencyOptionText,
                    frequency === freq && styles.frequencyOptionTextSelected,
                  ]}
                >
                  {FREQUENCY_LABELS[freq]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedType === 'report' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Reports</Text>
            <View style={styles.reportsList}>
              {availableReports.slice(0, 8).map((report) => (
                <TouchableOpacity
                  key={report.id}
                  style={[
                    styles.reportItem,
                    selectedReports.includes(report.id) && styles.reportItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedReports((prev) =>
                      prev.includes(report.id)
                        ? prev.filter((id) => id !== report.id)
                        : [...prev, report.id]
                    );
                  }}
                >
                  <Text
                    style={[
                      styles.reportItemText,
                      selectedReports.includes(report.id) && styles.reportItemTextSelected,
                    ]}
                  >
                    {report.name}
                  </Text>
                  <Text style={styles.reportItemSubtext}>
                    {report.geography} • {report.commodity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {selectedType === 'price' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Symbol</Text>
              <View style={styles.symbolList}>
                {availablePriceSymbols.map((symbol) => (
                  <TouchableOpacity
                    key={symbol.symbol}
                    style={[
                      styles.symbolItem,
                      selectedSymbol === symbol.symbol && styles.symbolItemSelected,
                    ]}
                    onPress={() => setSelectedSymbol(symbol.symbol)}
                  >
                    <Text style={styles.symbolCode}>{symbol.symbol}</Text>
                    <Text style={styles.symbolName}>{symbol.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Condition</Text>
              <View style={styles.conditionOptions}>
                {[
                  { value: 'above', label: 'Price Above' },
                  { value: 'below', label: 'Price Below' },
                  { value: 'change_percent', label: 'Change %' },
                ].map((cond) => (
                  <TouchableOpacity
                    key={cond.value}
                    style={[
                      styles.conditionOption,
                      priceCondition === cond.value && styles.conditionOptionSelected,
                    ]}
                    onPress={() => setPriceCondition(cond.value as typeof priceCondition)}
                  >
                    <Text
                      style={[
                        styles.conditionOptionText,
                        priceCondition === cond.value && styles.conditionOptionTextSelected,
                      ]}
                    >
                      {cond.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Threshold</Text>
              <TextInput
                style={styles.input}
                value={priceThreshold}
                onChangeText={setPriceThreshold}
                placeholder={priceCondition === 'change_percent' ? 'Enter percentage' : 'Enter price'}
                placeholderTextColor={colors.textTertiary}
                keyboardType="decimal-pad"
              />
            </View>
          </>
        )}

        {selectedType === 'news' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Keywords (comma separated)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={keywords}
                onChangeText={setKeywords}
                placeholder="Enter keywords"
                placeholderTextColor={colors.textTertiary}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Topics</Text>
              <View style={styles.topicsGrid}>
                {newsTopics.map((topic) => (
                  <TouchableOpacity
                    key={topic}
                    style={[
                      styles.topicChip,
                      selectedTopics.includes(topic) && styles.topicChipSelected,
                    ]}
                    onPress={() => {
                      setSelectedTopics((prev) =>
                        prev.includes(topic)
                          ? prev.filter((t) => t !== topic)
                          : [...prev, topic]
                      );
                    }}
                  >
                    <Text
                      style={[
                        styles.topicChipText,
                        selectedTopics.includes(topic) && styles.topicChipTextSelected,
                      ]}
                    >
                      {topic}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sources</Text>
              <View style={styles.topicsGrid}>
                {newsSources.map((source) => (
                  <TouchableOpacity
                    key={source}
                    style={[
                      styles.topicChip,
                      selectedSources.includes(source) && styles.topicChipSelected,
                    ]}
                    onPress={() => {
                      setSelectedSources((prev) =>
                        prev.includes(source)
                          ? prev.filter((s) => s !== source)
                          : [...prev, source]
                      );
                    }}
                  >
                    <Text
                      style={[
                        styles.topicChipText,
                        selectedSources.includes(source) && styles.topicChipTextSelected,
                      ]}
                    >
                      {source}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {selectedType === 'publication' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Publications</Text>
            <View style={styles.reportsList}>
              {['Gas Daily', 'Megawatt Daily', 'Power Markets Week', 'Oil Daily', 'European Gas Markets', 'LNG Daily', 'Metals Weekly', 'Petrochemical Alert'].map((pub) => (
                <TouchableOpacity
                  key={pub}
                  style={[
                    styles.reportItem,
                    selectedPublications.includes(pub) && styles.reportItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedPublications((prev) =>
                      prev.includes(pub)
                        ? prev.filter((p) => p !== pub)
                        : [...prev, pub]
                    );
                  }}
                >
                  <Text
                    style={[
                      styles.reportItemText,
                      selectedPublications.includes(pub) && styles.reportItemTextSelected,
                    ]}
                  >
                    {pub}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {selectedType === 'scheduled' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Delivery Time</Text>
              <TextInput
                style={styles.input}
                value={scheduleTime}
                onChangeText={setScheduleTime}
                placeholder="HH:MM (e.g., 08:00)"
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Days of Week</Text>
              <View style={styles.daysGrid}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayChip,
                      scheduleDays.includes(index) && styles.dayChipSelected,
                    ]}
                    onPress={() => {
                      setScheduleDays((prev) =>
                        prev.includes(index)
                          ? prev.filter((d) => d !== index)
                          : [...prev, index]
                      );
                    }}
                  >
                    <Text
                      style={[
                        styles.dayChipText,
                        scheduleDays.includes(index) && styles.dayChipTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Include Alert Types</Text>
              <View style={styles.topicsGrid}>
                {(['report', 'price', 'news', 'publication'] as AlertType[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.topicChip,
                      includedAlertTypes.includes(type) && styles.topicChipSelected,
                    ]}
                    onPress={() => {
                      setIncludedAlertTypes((prev) =>
                        prev.includes(type)
                          ? prev.filter((t) => t !== type)
                          : [...prev, type]
                      );
                    }}
                  >
                    <Text
                      style={[
                        styles.topicChipText,
                        includedAlertTypes.includes(type) && styles.topicChipTextSelected,
                      ]}
                    >
                      {ALERT_TYPE_LABELS[type]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
      </View>
    );
  };

  const renderReview = () => {
    return (
      <View style={styles.reviewContainer}>
        <Text style={styles.reviewTitle}>Review Your Alert</Text>

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Name:</Text>
          <Text style={styles.reviewValue}>{alertName}</Text>
        </View>

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Type:</Text>
          <Text style={styles.reviewValue}>
            {selectedType ? ALERT_TYPE_LABELS[selectedType] : ''}
          </Text>
        </View>

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Frequency:</Text>
          <Text style={styles.reviewValue}>{FREQUENCY_LABELS[frequency]}</Text>
        </View>

        {selectedType === 'report' && (
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Reports:</Text>
            <Text style={styles.reviewValue}>{selectedReports.length} selected</Text>
          </View>
        )}

        {selectedType === 'price' && (
          <>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Symbol:</Text>
              <Text style={styles.reviewValue}>{selectedSymbol}</Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Threshold:</Text>
              <Text style={styles.reviewValue}>
                {priceCondition === 'above' ? '>' : priceCondition === 'below' ? '<' : '±'}
                {priceThreshold}
                {priceCondition === 'change_percent' ? '%' : ''}
              </Text>
            </View>
          </>
        )}

        {selectedType === 'news' && (
          <>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Keywords:</Text>
              <Text style={styles.reviewValue}>{keywords || 'None'}</Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Topics:</Text>
              <Text style={styles.reviewValue}>{selectedTopics.join(', ') || 'None'}</Text>
            </View>
          </>
        )}

        {selectedType === 'publication' && (
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Publications:</Text>
            <Text style={styles.reviewValue}>{selectedPublications.join(', ')}</Text>
          </View>
        )}

        {selectedType === 'scheduled' && (
          <>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Time:</Text>
              <Text style={styles.reviewValue}>{scheduleTime}</Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Days:</Text>
              <Text style={styles.reviewValue}>
                {scheduleDays.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}
              </Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Includes:</Text>
              <Text style={styles.reviewValue}>
                {includedAlertTypes.map(t => ALERT_TYPE_LABELS[t]).join(', ') || 'None'}
              </Text>
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title={
          step === 'type'
            ? 'Create New Alert'
            : step === 'config'
            ? `${isEditMode ? 'Edit' : 'Configure'} ${selectedType ? ALERT_TYPE_LABELS[selectedType] : ''}`
            : `Review ${isEditMode ? 'Changes' : 'Alert'}`
        }
        showLogo={false}
        onBack={handleBack}
      />

      <ScrollView style={styles.content}>
        {step === 'type' && (
          <AlertTypeSelector
            selectedType={selectedType}
            onSelectType={handleTypeSelect}
          />
        )}

        {step === 'config' && renderConfigForm()}

        {step === 'review' && renderReview()}
      </ScrollView>

      {step !== 'type' && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
            <Text style={styles.cancelButtonText}>
              {step === 'config' ? 'Back' : 'Edit'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={step === 'review' ? handleSave : handleNext}
          >
            <Text style={styles.nextButtonText}>
              {step === 'review' ? (isEditMode ? 'Save Changes' : 'Create Alert') : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  formContainer: {
    padding: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  frequencyOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  frequencyOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  frequencyOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  frequencyOptionText: {
    ...typography.body2,
    color: colors.text,
  },
  frequencyOptionTextSelected: {
    color: colors.textOnPrimary,
  },
  reportsList: {
    gap: spacing.sm,
  },
  reportItem: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  reportItemSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FFF0F3',
  },
  reportItemText: {
    ...typography.body1,
    color: colors.text,
  },
  reportItemTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  reportItemSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  symbolList: {
    gap: spacing.sm,
  },
  symbolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  symbolItemSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FFF0F3',
  },
  symbolCode: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.primary,
    width: 80,
  },
  symbolName: {
    ...typography.body2,
    color: colors.text,
  },
  conditionOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  conditionOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  conditionOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  conditionOptionText: {
    ...typography.caption,
    color: colors.text,
  },
  conditionOptionTextSelected: {
    color: colors.textOnPrimary,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  dayChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  dayChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayChipText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '500',
  },
  dayChipTextSelected: {
    color: colors.textOnPrimary,
  },
  topicChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface,
  },
  topicChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  topicChipText: {
    ...typography.caption,
    color: colors.text,
  },
  topicChipTextSelected: {
    color: colors.textOnPrimary,
  },
  reviewContainer: {
    padding: spacing.md,
  },
  reviewTitle: {
    ...typography.h3,
    marginBottom: spacing.lg,
  },
  reviewRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reviewLabel: {
    ...typography.body2,
    color: colors.textSecondary,
    width: 100,
  },
  reviewValue: {
    ...typography.body1,
    color: colors.text,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.text,
  },
  nextButton: {
    flex: 2,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  nextButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
});

export default CreateAlertScreen;
