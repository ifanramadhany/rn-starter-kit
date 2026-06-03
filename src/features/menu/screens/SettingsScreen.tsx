import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuthStore } from '../../auth';
import type { AppColors } from '../../../shared/theme/colors';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import type { ThemeMode } from '../../../shared/theme/themeStorage';
import { Card } from '../../../shared/ui';
import ScreenScaffold from '../components/ScreenScaffold';

const themeModes: ThemeMode[] = ['system', 'light', 'dark'];

export default function SettingsScreen() {
  const { logout } = useAuthStore();
  const { colors, mode, setMode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ScreenScaffold
      title="Settings"
      subtitle="Preferences"
      showBackAction
      showSettingsAction={false}
    >
      <Card>
        <Text style={styles.title}>Theme</Text>
        <Text style={styles.body}>Choose how the app should display across every screen.</Text>
        <View style={styles.themeOptions}>
          {themeModes.map((themeMode) => {
            const isSelected = mode === themeMode;

            return (
              <Pressable
                key={themeMode}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={[styles.themeOption, isSelected ? styles.themeOptionSelected : null]}
                onPress={() => setMode(themeMode)}
              >
                <Text
                  style={[
                    styles.themeOptionText,
                    isSelected ? styles.themeOptionTextSelected : null,
                  ]}
                >
                  {themeMode}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card>
        <Text style={styles.title}>Account</Text>
        <Text style={styles.body}>Sign out from this device and return to the login screen.</Text>
        <Pressable accessibilityRole="button" style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </Card>
    </ScreenScaffold>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '800',
    },
    body: {
      marginTop: 8,
      color: colors.textMuted,
      fontSize: 15,
      lineHeight: 22,
    },
    themeOptions: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 16,
      padding: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    themeOption: {
      flex: 1,
      minHeight: 42,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
    },
    themeOptionSelected: {
      backgroundColor: colors.surface,
    },
    themeOptionText: {
      color: colors.textMuted,
      fontSize: 14,
      fontWeight: '700',
      textTransform: 'capitalize',
    },
    themeOptionTextSelected: {
      color: colors.accentText,
    },
    logoutButton: {
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      borderRadius: 8,
      backgroundColor: colors.dangerAction,
    },
    logoutButtonText: {
      color: '#ffffff',
      fontSize: 15,
      fontWeight: '800',
    },
  });
}
