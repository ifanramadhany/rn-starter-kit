import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ApiError } from '../../../shared/api/errors';
import { useResponsiveLayout } from '../../../shared/hooks/useResponsiveLayout';
import type { AppColors } from '../../../shared/theme/colors';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { usePokemonListInfiniteQuery } from '../hooks/usePokemonListInfiniteQuery';
import type { PokemonListItem } from '../services/pokemonApi';
import PokemonCard from './PokemonCard';

export default function PokemonGrid() {
  const { colors } = useTheme();
  const { isTablet, isDesktop } = useResponsiveLayout();
  const columnCount = isDesktop ? 4 : isTablet ? 3 : 2;
  const styles = useMemo(() => createStyles(colors, { isTablet }), [colors, isTablet]);
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
    usePokemonListInfiniteQuery();

  const pokemonList = useMemo(() => data?.pages.flatMap((page) => page.result.items) ?? [], [data]);

  const renderPokemon = ({ item, index }: ListRenderItemInfo<PokemonListItem>) => (
    <PokemonCard pokemon={item} displayNumber={index + 1} />
  );

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>Loading pokemon...</Text>
      </View>
    );
  }

  if (error) {
    const message =
      error instanceof ApiError ? error.response.message : 'Failed to load pokemon list.';

    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>{message}</Text>
        <Button title="Try Again" onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <FlatList
      key={columnCount}
      data={pokemonList}
      numColumns={columnCount}
      keyExtractor={(item) => item.name}
      renderItem={renderPokemon}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.listRow}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.6}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footer}>
            <ActivityIndicator />
          </View>
        ) : null
      }
    />
  );
}

type PokemonGridStyleOptions = {
  isTablet: boolean;
};

function createStyles(colors: AppColors, { isTablet }: PokemonGridStyleOptions) {
  return StyleSheet.create({
    centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    statusText: {
      marginTop: 12,
      color: colors.textMuted,
    },
    errorText: {
      marginBottom: 12,
      color: colors.dangerText,
      textAlign: 'center',
    },
    listContent: {
      paddingHorizontal: isTablet ? 32 : 20,
      paddingTop: 20,
      paddingBottom: isTablet ? 36 : 28,
    },
    listRow: {
      gap: 12,
      marginBottom: 12,
    },
    footer: {
      paddingVertical: 16,
    },
  });
}
