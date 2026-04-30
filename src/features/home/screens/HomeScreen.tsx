import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../../../shared/navigation/routes';
import { useAuthStore } from '../../auth';
import PokemonGrid from '../components/PokemonGrid';

export default function HomeScreen() {
  const { logout } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList, 'Home'>>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pokemon List</Text>
        <View style={styles.actions}>
          <Button title="Posts" onPress={() => navigation.navigate('Posts')} />
          <Button title="Logout" onPress={logout} />
        </View>
      </View>

      <PokemonGrid />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
