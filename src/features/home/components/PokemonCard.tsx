import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { AppColors } from '../../../shared/theme/colors';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import type { PokemonListItem } from '../services/pokemonApi';
import { formatPokemonName, getPokemonImageUrl } from '../utils/pokemon';

type PokemonCardProps = {
  pokemon: PokemonListItem;
  displayNumber: number;
};

export default function PokemonCard({ pokemon, displayNumber }: PokemonCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      flex: 1,
      minHeight: 190,
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.surface,
      borderColor: colors.border,
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
      color: colors.textSubtle,
      fontWeight: '600',
    },
    name: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
  });
}
