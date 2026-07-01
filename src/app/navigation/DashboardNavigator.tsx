import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AdminDashboardScreen } from '../../features/survey';
import type { DashboardStackParamList } from '../../shared/navigation/routes';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export default function DashboardNavigator() {
  return (
    <Stack.Navigator screenOptions={{ animation: 'none', headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    </Stack.Navigator>
  );
}
