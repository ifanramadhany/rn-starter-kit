import {
  useQuery,
  useInfiniteQuery,
  UseQueryResult,
  UseInfiniteQueryResult,
  InfiniteData,
} from '@tanstack/react-query';
import {
  fetchPokemonList,
  fetchPokemonDetail,
  fetchMultiplePokemon,
  Pokemon,
  PokemonListResponse,
} from './pokemon';

/**
 * Type for infinite query data with pages
 */
export interface PokemonInfiniteData {
  pages: PokemonListResponse[];
  pageParams: number[];
}

/**
 * Custom hook to fetch Pokemon list with React Query
 * Provides caching, automatic refetching, and loading/error states
 */
export const usePokemonList = (
  limit: number = 20,
  offset: number = 0,
): UseQueryResult<PokemonListResponse, Error> => {
  return useQuery({
    queryKey: ['pokemonList', limit, offset],
    queryFn: () => fetchPokemonList(limit, offset),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10, // Garbage collect after 10 minutes
    retry: 2,
  });
};

/**
 * Custom hook for infinite scroll pagination of Pokemon list
 * Automatically handles pagination and data accumulation
 */
export const usePokemonInfiniteList = (
  limit: number = 20,
): UseInfiniteQueryResult<InfiniteData<PokemonListResponse>, Error> => {
  return useInfiniteQuery({
    queryKey: ['pokemonListInfinite', limit],
    queryFn: ({ pageParam = 0 }) => fetchPokemonList(limit, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * limit;
      return lastPage.next ? nextOffset : undefined;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    initialPageParam: 0,
  });
};

/**
 * Custom hook to fetch a single Pokemon detail
 */
export const usePokemonDetail = (
  id: string | number,
  enabled: boolean = true,
): UseQueryResult<Pokemon, Error> => {
  return useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemonDetail(id),
    enabled,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    gcTime: 1000 * 60 * 30, // Garbage collect after 30 minutes
    retry: 1,
  });
};

/**
 * Custom hook to fetch multiple Pokemon details
 */
export const useMultiplePokemon = (ids: (string | number)[]): UseQueryResult<Pokemon[], Error> => {
  return useQuery({
    queryKey: ['multiplePokemon', ids],
    queryFn: () => fetchMultiplePokemon(ids),
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });
};
