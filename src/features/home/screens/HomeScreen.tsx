import React, { useMemo } from 'react';
import { Button, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useResponsiveLayout } from '../../../shared/hooks/useResponsiveLayout';
import type { MainStackParamList } from '../../../shared/navigation/routes';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import type { ThemeMode } from '../../../shared/theme/themeStorage';
import { useAuthStore } from '../../auth';
import PokemonGrid from '../components/PokemonGrid';
import { createStyles } from './HomeScreen.styles';

const themeModes: ThemeMode[] = ['system', 'light', 'dark'];

export default function HomeScreen() {
  const { logout } = useAuthStore();
  const { colors, mode, setMode } = useTheme();
  const { isTablet } = useResponsiveLayout();
  const styles = useMemo(() => createStyles(colors, { isTablet }), [colors, isTablet]);
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList, 'Home'>>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topBar}>
          <Text style={styles.themeLabel}>Theme</Text>
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
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Pokemon List</Text>
          <View style={styles.actions}>
            <Button title="Posts" onPress={() => navigation.navigate('Posts')} />
            <Button title="Logout" onPress={logout} />
          </View>
        </View>

        <PokemonGrid />
      </View>
    </View>
  );
}
