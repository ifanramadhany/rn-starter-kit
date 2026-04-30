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
import { usePokemonListInfiniteQuery } from '../hooks/usePokemonListInfiniteQuery';
import type { PokemonListItem } from '../services/pokemonApi';
import PokemonCard from './PokemonCard';

export default function PokemonGrid() {
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
      data={pokemonList}
      numColumns={2}
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

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statusText: {
    marginTop: 12,
    color: '#475569',
  },
  errorText: {
    marginBottom: 12,
    color: '#b91c1c',
    textAlign: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 28,
  },
  listRow: {
    gap: 12,
    marginBottom: 12,
  },
  footer: {
    paddingVertical: 16,
  },
});
