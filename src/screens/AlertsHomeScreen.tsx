import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Alert as RNAlert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Header, SearchBar } from '../components/common';
import { AlertCard } from '../components/alerts';
import { useAlerts } from '../context/AlertContext';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Alert } from '../types/alerts';

type Props = NativeStackScreenProps<RootStackParamList, 'AlertsHome'>;

const AlertsHomeScreen: React.FC<Props> = ({ navigation }) => {
  const {
    filteredAlerts,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    toggleAlertActive,
    duplicateAlert,
    deleteAlert,
  } = useAlerts();

  const handleDelete = (id: string) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to delete this alert? This action cannot be undone.');
      if (confirmed) {
        deleteAlert(id);
      }
    } else {
      RNAlert.alert(
        'Delete Alert',
        'Are you sure you want to delete this alert? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deleteAlert(id),
          },
        ]
      );
    }
  };

  const handleAlertPress = (alert: Alert) => {
    navigation.navigate('AlertDetail', { alertId: alert.id });
  };

  const handleEdit = (id: string) => {
    navigation.navigate('CreateAlert', { editAlertId: id });
  };

  const renderHeader = () => (
    <View>
      <Header
        title="Alerts Home"
        subtitle="Create a new alert and review or edit existing alerts."
        rightActions={
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonText}>ADD TO SHORTCUTS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonText}>PRINT</Text>
            </TouchableOpacity>
          </View>
        }
      />
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search Alerts"
          />
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateAlert')}
        >
          <Text style={styles.createButtonText}>CREATE NEW ALERT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No alerts found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'Try adjusting your search terms'
          : 'Create your first alert to get started'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => navigation.navigate('CreateAlert')}
        >
          <Text style={styles.emptyButtonText}>Create Alert</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Alerts Home" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading alerts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Alerts Home" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filteredAlerts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => (
          <AlertCard
            alert={item}
            onToggleActive={toggleAlertActive}
            onDuplicate={duplicateAlert}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onPress={handleAlertPress}
          />
        )}
        contentContainerStyle={filteredAlerts.length === 0 && styles.emptyListContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
  },
  headerButtonText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  createButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  createButtonText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textOnPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body2,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.body1,
    color: colors.error,
    textAlign: 'center',
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body2,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  emptyButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
});

export default AlertsHomeScreen;
