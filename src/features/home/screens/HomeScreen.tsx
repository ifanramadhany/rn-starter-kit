import React, { useMemo } from 'react';
import { Button, Text, View } from 'react-native';
import { useResponsiveLayout } from '../../../shared/hooks/useResponsiveLayout';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { useAuthStore } from '../../auth';
import PokemonGrid from '../components/PokemonGrid';
import { createStyles } from './HomeScreen.styles';

export default function HomeScreen() {
  const { logout } = useAuthStore();
  const { colors } = useTheme();
  const { isTablet } = useResponsiveLayout();
  const styles = useMemo(() => createStyles(colors, { isTablet }), [colors, isTablet]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Pokemon List</Text>
          <View style={styles.actions}>
            <Button title="Logout" onPress={logout} />
          </View>
        </View>

        <PokemonGrid />
      </View>
    </View>
  );
}
