import { jsonPlaceholderClient } from '../../../shared/api/clients/jsonPlaceholderClient';
import { normalizeAxiosError } from '../../../shared/api/errors';
import type { ApiResponse } from '../../../shared/api/types';
import type { Post } from '../types';

export async function getPosts(): Promise<ApiResponse<Post[]>> {
  try {
    const response = await jsonPlaceholderClient.get<Post[]>('/posts', {
      params: {
        _limit: 10,
      },
    });

    return {
      status: response.status,
      message: 'success',
      result: response.data,
    };
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}
