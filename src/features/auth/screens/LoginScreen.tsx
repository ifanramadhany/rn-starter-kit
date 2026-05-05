import React, { useMemo } from 'react';
import { View, Text, Button } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { useAuthStore } from '../store/useAuthStore';
import { createStyles } from './LoginScreen.styles';

export default function LoginScreen() {
  const { login } = useAuthStore();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <Button title="Login" onPress={() => login('dummy-token')} />
    </View>
  );
}
