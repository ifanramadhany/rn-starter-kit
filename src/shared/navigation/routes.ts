import type { NavigatorScreenParams } from '@react-navigation/native';

export const mainTabRouteNames = ['Today', 'Habits', 'Calendar', 'Stats', 'Journal'] as const;

export const mainStackRouteNames = ['MainTabs', 'Settings'] as const;

export const mainRouteNames = [...mainStackRouteNames, ...mainTabRouteNames] as const;

export type MainTabParamList = {
  [RouteName in (typeof mainTabRouteNames)[number]]: undefined;
};

export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Settings: undefined;
};
