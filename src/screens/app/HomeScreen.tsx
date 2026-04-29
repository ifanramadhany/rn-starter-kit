import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Image,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ListRenderItem,
} from 'react-native';
import { useAuthStore } from '../../modules/auth/store/useAuthStore';
import { usePokemonInfiniteList } from '../../services/hooks';
import { useScrollStore } from '../../store/useScrollStore';

export default function HomeScreen() {
  const { logout } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [shouldRestoreScroll, setShouldRestoreScroll] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const { homeScreenScrollPosition, setHomeScreenScrollPosition } = useScrollStore();
  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePokemonInfiniteList(20);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Reset scroll position on manual refresh
    setHomeScreenScrollPosition(0);
    setShouldRestoreScroll(true);
    await refetch();
    setRefreshing(false);
  };

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.y;
    // Save scroll position to store
    setHomeScreenScrollPosition(scrollOffset);
    // Show button if scrolled down more than 300 pixels
    setShowScrollToTop(scrollOffset > 300);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Restore scroll position when data is loaded
  useEffect(() => {
    if (!isLoading && data && shouldRestoreScroll && homeScreenScrollPosition > 0) {
      // Use setTimeout to ensure the FlatList has finished rendering
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: homeScreenScrollPosition,
          animated: false,
        });
        setShouldRestoreScroll(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, data, shouldRestoreScroll, homeScreenScrollPosition]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading Pokemon...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <Button title="Retry" onPress={() => refetch()} />
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  interface PokemonItem {
    name: string;
    url: string;
  }

  // Flatten pages data into single array
  const pokemonList: PokemonItem[] = data?.pages.flatMap((page) => page.results) || [];
  const totalCount = data?.pages[0]?.count || 0;

  const renderPokemonItem: ListRenderItem<PokemonItem> = ({ item }) => {
    // Extract Pokemon ID from URL: https://pokeapi.co/api/v2/pokemon/1/
    const pokemonId = item.url
      .split('/')
      .filter((x: string) => x)
      .pop();
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

    return (
      <View style={styles.pokemonCard}>
        <Image source={{ uri: imageUrl }} style={styles.pokemonImage} />
        <Text style={styles.pokemonName}>{item.name.toUpperCase()}</Text>
        <Text style={styles.pokemonId}>#{pokemonId}</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#0000ff" />
        <Text style={styles.loadingMoreText}>Loading more Pokemon...</Text>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pokemon List</Text>
        <Button title="Logout" onPress={logout} color="#ff6b6b" />
      </View>
      <FlatList
        ref={flatListRef}
        style={styles.container}
        data={pokemonList}
        renderItem={renderPokemonItem}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        numColumns={2}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={<Text style={styles.subtitle}>Tap cards to see details</Text>}
        ListFooterComponent={
          <>
            {renderFooter()}
            <View style={styles.footerContainer}>
              <Text style={styles.countText}>
                Showing: {pokemonList.length} / {totalCount}
              </Text>
            </View>
          </>
        }
      />

      {showScrollToTop && (
        <TouchableOpacity
          style={styles.scrollToTopButton}
          onPress={scrollToTop}
          activeOpacity={0.7}
        >
          <Text style={styles.scrollToTopText}>Top</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  pokemonCard: {
    flex: 1,
    margin: 8,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  pokemonImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  pokemonName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  pokemonId: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  countText: {
    marginVertical: 16,
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  footerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loadingMoreText: {
    fontSize: 14,
    color: '#666',
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  scrollToTopText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
