import { useInfiniteQuery } from '@tanstack/react-query';
import { getNextPokemonOffset, getPokemonList, POKEMON_PAGE_SIZE } from '../services/pokemonApi';

export function usePokemonListInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: ['pokemon', 'list'],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getPokemonList({
        offset: pageParam,
        limit: POKEMON_PAGE_SIZE,
      }),
    getNextPageParam: (lastPage) => getNextPokemonOffset(lastPage.result.next),
  });
}
