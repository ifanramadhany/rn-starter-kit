import { apiClient } from './api';

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

/**
 * Fetch a list of Pokemon
 * @param limit - Number of Pokemon to fetch (default: 20)
 * @param offset - Offset for pagination (default: 0)
 */
export const fetchPokemonList = async (
  limit: number = 20,
  offset: number = 0,
): Promise<PokemonListResponse> => {
  const response = await apiClient.get<PokemonListResponse>('/pokemon', {
    params: { limit, offset },
  });
  return response.data;
};

/**
 * Fetch details for a specific Pokemon
 * @param id - Pokemon ID or name
 */
export const fetchPokemonDetail = async (id: string | number): Promise<Pokemon> => {
  const response = await apiClient.get<Pokemon>(`/pokemon/${id}`);
  return response.data;
};

/**
 * Fetch multiple Pokemon details in parallel
 * @param ids - Array of Pokemon IDs or names
 */
export const fetchMultiplePokemon = async (ids: (string | number)[]): Promise<Pokemon[]> => {
  const promises = ids.map((id) => fetchPokemonDetail(id));
  return Promise.all(promises);
};
