import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CalendarDays, ChartColumn, CircleCheck, NotebookPen } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MainTabParamList } from '../../../shared/navigation/routes';
import type { AppColors } from '../../../shared/theme/colors';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import TodayIcon from './icons/TodayIcon';

type TabRouteName = keyof MainTabParamList;
type IconComponent = React.ComponentType<{
  color?: string;
  size?: number;
  strokeWidth?: number;
}>;

const tabIcons: Record<TabRouteName, IconComponent> = {
  Today: TodayIcon,
  Habits: CircleCheck,
  Calendar: CalendarDays,
  Stats: ChartColumn,
  Journal: NotebookPen,
};

export default function MainTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, insets.bottom), [colors, insets.bottom]);

  return (
    <View style={styles.menu}>
      {state.routes.map((route, index) => {
        const isActive = state.index === index;
        const options = descriptors[route.key]?.options;
        const label =
          typeof options?.tabBarLabel === 'string'
            ? options.tabBarLabel
            : options?.title ?? route.name;
        const Icon = tabIcons[route.name as TabRouteName];
        const iconColor = isActive ? colors.accentText : colors.textMuted;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            style={[styles.menuItem, isActive ? styles.menuItemActive : null]}
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
            onLongPress={() => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            }}
          >
            <Icon color={iconColor} size={22} strokeWidth={2.4} />
            <Text
              numberOfLines={1}
              style={[styles.menuText, isActive ? styles.menuTextActive : null]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(colors: AppColors, bottomInset: number) {
  return StyleSheet.create({
    menu: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      paddingTop: 10,
      paddingBottom: Math.max(bottomInset, 10),
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      borderTopWidth: 1,
    },
    menuItem: {
      flex: 1,
      minHeight: 56,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      borderRadius: 8,
    },
    menuItemActive: {
      backgroundColor: colors.background,
    },
    menuText: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
    },
    menuTextActive: {
      color: colors.accentText,
    },
  });
}
