import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Header } from '../components/common';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Report } from '../types/alerts';
import { availableReports } from '../services/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'ReportSelection'>;

const ReportSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const initialSelected = route.params?.selectedReportIds || [];
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelected);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGeography, setFilterGeography] = useState<string | null>(null);
  const [filterCommodity, setFilterCommodity] = useState<string | null>(null);

  // Get unique geographies and commodities for filters
  const geographies = useMemo(
    () => [...new Set(availableReports.map((r) => r.geography))],
    []
  );
  const commodities = useMemo(
    () => [...new Set(availableReports.map((r) => r.commodity))],
    []
  );

  // Filter reports based on search and filters
  const filteredReports = useMemo(() => {
    return availableReports.filter((report) => {
      const matchesSearch =
        !searchQuery ||
        report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.commodity.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGeography = !filterGeography || report.geography === filterGeography;
      const matchesCommodity = !filterCommodity || report.commodity === filterCommodity;
      return matchesSearch && matchesGeography && matchesCommodity;
    });
  }, [searchQuery, filterGeography, filterCommodity]);

  const handleToggleSelect = (reportId: string) => {
    setSelectedIds((prev) =>
      prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    const allIds = filteredReports.map((r) => r.id);
    const allSelected = allIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...allIds])]);
    }
  };

  const handleConfirm = () => {
    // In a real app, you would pass this back to the parent screen
    navigation.goBack();
  };

  const renderFilterChip = (
    label: string,
    isActive: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={[styles.filterChip, isActive && styles.filterChipActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderReportItem = ({ item }: { item: Report }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.reportItem, isSelected && styles.reportItemSelected]}
        onPress={() => handleToggleSelect(item.id)}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.reportInfo}>
          <Text style={[styles.reportName, isSelected && styles.reportNameSelected]}>
            {item.name}
          </Text>
          <Text style={styles.reportMeta}>
            {item.geography} • {item.commodity} • {item.type}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Select Reports"
        showLogo={false}
        onBack={() => navigation.goBack()}
        rightActions={
          <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Done ({selectedIds.length})</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search reports..."
          placeholderTextColor={colors.textTertiary}
        />
      </View>

      {/* Geography Filters */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Geography</Text>
        <View style={styles.filterRow}>
          {renderFilterChip('All', !filterGeography, () => setFilterGeography(null))}
          {geographies.map((geo) =>
            renderFilterChip(geo, filterGeography === geo, () =>
              setFilterGeography(filterGeography === geo ? null : geo)
            )
          )}
        </View>
      </View>

      {/* Commodity Filters */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Commodity</Text>
        <View style={styles.filterRow}>
          {renderFilterChip('All', !filterCommodity, () => setFilterCommodity(null))}
          {commodities.slice(0, 5).map((comm) =>
            renderFilterChip(comm, filterCommodity === comm, () =>
              setFilterCommodity(filterCommodity === comm ? null : comm)
            )
          )}
        </View>
      </View>

      {/* Select All Button */}
      <TouchableOpacity style={styles.selectAllButton} onPress={handleSelectAll}>
        <Text style={styles.selectAllText}>
          {filteredReports.every((r) => selectedIds.includes(r.id))
            ? 'Deselect All'
            : 'Select All'}{' '}
          ({filteredReports.length} reports)
        </Text>
      </TouchableOpacity>

      {/* Reports List */}
      <FlatList
        data={filteredReports}
        keyExtractor={(item) => item.id}
        renderItem={renderReportItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No reports match your filters</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  confirmButtonText: {
    ...typography.body2,
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  searchContainer: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  filterSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  filterChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    ...typography.caption,
    color: colors.text,
  },
  filterChipTextActive: {
    color: colors.textOnPrimary,
  },
  selectAllButton: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectAllText: {
    ...typography.body2,
    color: colors.link,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reportItemSelected: {
    backgroundColor: '#FFF0F3',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  reportInfo: {
    flex: 1,
  },
  reportName: {
    ...typography.body1,
    color: colors.text,
  },
  reportNameSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  reportMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
});

export default ReportSelectionScreen;
