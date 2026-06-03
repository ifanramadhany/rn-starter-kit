import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, Settings } from 'lucide-react-native';

import type { MainStackParamList } from '../../../shared/navigation/routes';
import type { AppColors } from '../../../shared/theme/colors';
import { useTheme } from '../../../shared/theme/ThemeProvider';

type AppHeaderProps = {
  title: string;
  subtitle: string;
  showBackAction?: boolean;
  showSettingsAction?: boolean;
};

export default function AppHeader({
  title,
  subtitle,
  showBackAction = false,
  showSettingsAction = true,
}: AppHeaderProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  const styles = useMemo(() => createStyles(colors), [colors]);

  function navigateToSettings() {
    const parentNavigation = navigation.getParent<NativeStackNavigationProp<MainStackParamList>>();

    if (parentNavigation) {
      parentNavigation.navigate('Settings');
      return;
    }

    navigation.navigate('Settings');
  }

  return (
    <View style={styles.header}>
      {showBackAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.headerIconButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color={colors.text} size={22} strokeWidth={2.4} />
        </Pressable>
      ) : null}
      <View style={styles.headerText}>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      {showSettingsAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Settings"
          style={styles.headerIconButton}
          onPress={navigateToSettings}
        >
          <Settings color={colors.text} size={20} strokeWidth={2.3} />
        </Pressable>
      ) : null}
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
      backgroundColor: colors.surface,
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
    headerText: {
      flex: 1,
    },
    subtitle: {
      color: colors.textSubtle,
      fontSize: 13,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    title: {
      marginTop: 4,
      color: colors.text,
      fontSize: 28,
      fontWeight: '800',
    },
    headerIconButton: {
      width: 38,
      minHeight: 38,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
  });
}
