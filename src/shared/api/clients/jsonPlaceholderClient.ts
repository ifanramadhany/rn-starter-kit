import axios from 'axios';
import { env } from '../../config/env';

export const jsonPlaceholderClient = axios.create({
  baseURL: env.jsonPlaceholderApiBaseUrl,
  timeout: 10000,
});
