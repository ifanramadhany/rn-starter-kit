import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { PokemonListItem } from '../services/pokemonApi';
import { formatPokemonName, getPokemonImageUrl } from '../utils/pokemon';

type PokemonCardProps = {
  pokemon: PokemonListItem;
  displayNumber: number;
};

export default function PokemonCard({ pokemon, displayNumber }: PokemonCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: getPokemonImageUrl(pokemon.url) }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.number}>#{displayNumber}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {formatPokemonName(pokemon.name)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 190,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
  },
  info: {
    marginTop: 10,
  },
  number: {
    color: '#64748b',
    fontWeight: '600',
  },
  name: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
  },
});
