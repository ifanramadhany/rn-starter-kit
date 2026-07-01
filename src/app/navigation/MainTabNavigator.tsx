import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { SurveyBottomTabBar } from '../../features/survey';
import type { MainTabParamList } from '../../shared/navigation/routes';
import DashboardNavigator from './DashboardNavigator';
import QuestionsNavigator from './QuestionsNavigator';
import SurveyFlowNavigator from './SurveyFlowNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

function renderMainTabBar(props: BottomTabBarProps) {
  return <SurveyBottomTabBar {...props} />;
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="QuestionsTab"
      screenOptions={{ headerShown: false }}
      tabBar={renderMainTabBar}
    >
      <Tab.Screen
        name="QuestionsTab"
        component={QuestionsNavigator}
        options={{ title: 'Questions' }}
      />
      <Tab.Screen
        name="StartSurveyTab"
        component={SurveyFlowNavigator}
        options={{ title: 'Start Survey' }}
      />
      <Tab.Screen
        name="DashboardTab"
        component={DashboardNavigator}
        options={{ title: 'Dashboard' }}
      />
    </Tab.Navigator>
  );
}
