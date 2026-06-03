import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import {
  CalendarScreen,
  HabitsScreen,
  JournalScreen,
  MainTabBar,
  StatsScreen,
  TodayScreen,
} from '../../features/menu';
import type { MainTabParamList } from '../../shared/navigation/routes';

const Tab = createBottomTabNavigator<MainTabParamList>();

function renderMainTabBar(props: BottomTabBarProps) {
  return <MainTabBar {...props} />;
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Today"
      screenOptions={{ headerShown: false }}
      tabBar={renderMainTabBar}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Habits" component={HabitsScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
    </Tab.Navigator>
  );
}
