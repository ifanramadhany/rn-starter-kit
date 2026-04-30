import { pokemonClient } from '../../../shared/api/clients/pokemonClient';
import { normalizeAxiosError } from '../../../shared/api/errors';
import type { ApiResponse } from '../../../shared/api/types';

export const POKEMON_PAGE_SIZE = 20;

export type PokemonListItem = {
  name: string;
  url: string;
};

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
};

export type PokemonListResult = {
  count: number;
  next: string | null;
  previous: string | null;
  items: PokemonListItem[];
};

type GetPokemonListParams = {
  offset?: number;
  limit?: number;
};

export async function getPokemonList({
  offset = 0,
  limit = POKEMON_PAGE_SIZE,
}: GetPokemonListParams = {}): Promise<ApiResponse<PokemonListResult>> {
  try {
    const response = await pokemonClient.get<PokemonListResponse>('/pokemon', {
      params: {
        limit,
        offset,
      },
    });

    return {
      status: response.status,
      message: 'success',
      result: {
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        items: response.data.results,
      },
    };
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export function getNextPokemonOffset(nextUrl: string | null) {
  if (!nextUrl) {
    return undefined;
  }

  const nextPageUrl = new URL(nextUrl);
  const nextOffset = nextPageUrl.searchParams.get('offset');

  return nextOffset ? Number(nextOffset) : undefined;
}
