import { JSONPLACEHOLDER_API_BASE_URL, POKEMON_API_BASE_URL } from '@env';

function requiredEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  pokemonApiBaseUrl: requiredEnv('POKEMON_API_BASE_URL', POKEMON_API_BASE_URL),
  jsonPlaceholderApiBaseUrl: requiredEnv(
    'JSONPLACEHOLDER_API_BASE_URL',
    JSONPLACEHOLDER_API_BASE_URL,
  ),
};
