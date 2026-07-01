import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../shared/navigation/routes';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ animation: 'none', headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}
