import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, AlertType } from '../types/alerts';
import { mockAlerts, generateId, getCurrentTimestamp, defaultAlertConfigs } from '../services/mockData';

const STORAGE_KEY = '@financial_alerts';

interface AlertContextType {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredAlerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAlert: (id: string, updates: Partial<Alert>) => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;
  toggleAlertActive: (id: string) => Promise<void>;
  duplicateAlert: (id: string) => Promise<void>;
  getAlertById: (id: string) => Alert | undefined;
  refreshAlerts: () => Promise<void>;
  createNewAlert: (type: AlertType, name: string) => Alert;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load alerts from storage or use mock data
  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      if (stored) {
        setAlerts(JSON.parse(stored));
      } else {
        // Use mock data on first load
        setAlerts(mockAlerts);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockAlerts));
      }
    } catch (e) {
      setError('Failed to load alerts');
      console.error('Error loading alerts:', e);
      // Fallback to mock data
      setAlerts(mockAlerts);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save alerts to storage
  const saveAlerts = useCallback(async (newAlerts: Alert[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAlerts));
    } catch (e) {
      console.error('Error saving alerts:', e);
    }
  }, []);

  // Filter alerts based on search query
  const filteredAlerts = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return alerts;
    }
    const query = searchQuery.toLowerCase();
    return alerts.filter(
      (alert) =>
        alert.name.toLowerCase().includes(query) ||
        alert.type.toLowerCase().includes(query)
    );
  }, [alerts, searchQuery]);

  // Add new alert
  const addAlert = useCallback(
    async (alertData: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newAlert: Alert = {
        ...alertData,
        id: generateId(),
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };
      const newAlerts = [newAlert, ...alerts];
      setAlerts(newAlerts);
      await saveAlerts(newAlerts);
    },
    [alerts, saveAlerts]
  );

  // Update existing alert
  const updateAlert = useCallback(
    async (id: string, updates: Partial<Alert>) => {
      const newAlerts = alerts.map((alert) =>
        alert.id === id
          ? { ...alert, ...updates, updatedAt: getCurrentTimestamp() }
          : alert
      );
      setAlerts(newAlerts);
      await saveAlerts(newAlerts);
    },
    [alerts, saveAlerts]
  );

  // Delete alert
  const deleteAlert = useCallback(
    async (id: string) => {
      const newAlerts = alerts.filter((alert) => alert.id !== id);
      setAlerts(newAlerts);
      await saveAlerts(newAlerts);
    },
    [alerts, saveAlerts]
  );

  // Toggle alert active status
  const toggleAlertActive = useCallback(
    async (id: string) => {
      const newAlerts = alerts.map((alert) =>
        alert.id === id
          ? { ...alert, isActive: !alert.isActive, updatedAt: getCurrentTimestamp() }
          : alert
      );
      setAlerts(newAlerts);
      await saveAlerts(newAlerts);
    },
    [alerts, saveAlerts]
  );

  // Duplicate alert
  const duplicateAlert = useCallback(
    async (id: string) => {
      const alertToDuplicate = alerts.find((alert) => alert.id === id);
      if (alertToDuplicate) {
        const duplicatedAlert: Alert = {
          ...alertToDuplicate,
          id: generateId(),
          name: `${alertToDuplicate.name} (Copy)`,
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp(),
        };
        const newAlerts = [duplicatedAlert, ...alerts];
        setAlerts(newAlerts);
        await saveAlerts(newAlerts);
      }
    },
    [alerts, saveAlerts]
  );

  // Get alert by ID
  const getAlertById = useCallback(
    (id: string) => alerts.find((alert) => alert.id === id),
    [alerts]
  );

  // Refresh alerts from storage
  const refreshAlerts = useCallback(async () => {
    await loadAlerts();
  }, [loadAlerts]);

  // Create a new alert with default config
  const createNewAlert = useCallback(
    (type: AlertType, name: string): Alert => {
      return {
        id: generateId(),
        name,
        type,
        isActive: true,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
        config: defaultAlertConfigs[type] as Alert['config'],
      };
    },
    []
  );

  // Load alerts on mount
  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const value: AlertContextType = {
    alerts,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filteredAlerts,
    addAlert,
    updateAlert,
    deleteAlert,
    toggleAlertActive,
    duplicateAlert,
    getAlertById,
    refreshAlerts,
    createNewAlert,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

export const useAlerts = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

export default AlertContext;
