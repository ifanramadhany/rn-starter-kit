import axios from 'axios';
import { env } from '../../config/env';

export const pokemonClient = axios.create({
  baseURL: env.pokemonApiBaseUrl,
  timeout: 10000,
});
