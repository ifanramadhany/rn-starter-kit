import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ChartColumn, CirclePlay, ListChecks } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MainTabParamList } from '../../../shared/navigation/routes';
import type { AppColors } from '../../../shared/theme/colors';
import { useTheme } from '../../../shared/theme/ThemeProvider';

type TabRouteName = keyof MainTabParamList;
type IconComponent = React.ComponentType<{
  color?: string;
  size?: number;
  strokeWidth?: number;
}>;

const tabIcons: Record<TabRouteName, IconComponent> = {
  QuestionsTab: ListChecks,
  StartSurveyTab: CirclePlay,
  DashboardTab: ChartColumn,
};

export default function SurveyBottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, insets.bottom), [colors, insets.bottom]);

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isActive = state.index === index;
          const options = descriptors[route.key]?.options;
          const label =
            typeof options?.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options?.title ?? route.name;
          const Icon = tabIcons[route.name as TabRouteName];
          const iconColor = isActive ? colors.onSecondaryContainer : colors.textMuted;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onLongPress={() => {
                navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              }}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isActive && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={({ pressed }) => [
                styles.tab,
                isActive ? styles.tabActive : null,
                pressed ? styles.tabPressed : null,
              ]}
            >
              <Icon color={iconColor} size={22} strokeWidth={2.3} />
              <Text style={[styles.label, isActive ? styles.labelActive : null]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(colors: AppColors, bottomInset: number) {
  return StyleSheet.create({
    wrapper: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      paddingBottom: Math.max(bottomInset, 14),
      paddingHorizontal: 16,
    },
    bar: {
      width: '100%',
      maxWidth: 680,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 32,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: 10,
      paddingVertical: 10,
      shadowColor: colors.shadow,
      shadowOpacity: 0.18,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },
    tab: {
      flex: 1,
      minHeight: 58,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      paddingHorizontal: 10,
    },
    tabActive: {
      backgroundColor: colors.secondaryContainer,
    },
    tabPressed: {
      opacity: 0.88,
    },
    label: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
    },
    labelActive: {
      color: colors.onSecondaryContainer,
    },
  });
}
