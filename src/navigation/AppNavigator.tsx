import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert as AlertType } from '../types/alerts';

// Screen imports
import AlertsHomeScreen from '../screens/AlertsHomeScreen';
import CreateAlertScreen from '../screens/CreateAlertScreen';
import AlertDetailScreen from '../screens/AlertDetailScreen';
import ReportSelectionScreen from '../screens/ReportSelectionScreen';

// Define navigation param types
export type RootStackParamList = {
  AlertsHome: undefined;
  CreateAlert: { alertType?: AlertType['type']; editAlertId?: string } | undefined;
  AlertDetail: { alertId: string };
  ReportSelection: { alertId?: string; selectedReportIds?: string[] };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AlertsHome"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="AlertsHome" component={AlertsHomeScreen} />
        <Stack.Screen name="CreateAlert" component={CreateAlertScreen} />
        <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />
        <Stack.Screen name="ReportSelection" component={ReportSelectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
