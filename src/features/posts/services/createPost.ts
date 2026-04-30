import { jsonPlaceholderClient } from '../../../shared/api/clients/jsonPlaceholderClient';
import { normalizeAxiosError } from '../../../shared/api/errors';
import type { ApiResponse } from '../../../shared/api/types';
import type { CreatePostPayload, Post } from '../types';

export async function createPost(payload: CreatePostPayload): Promise<ApiResponse<Post>> {
  try {
    const response = await jsonPlaceholderClient.post<Post>('/posts', payload);

    return {
      status: response.status,
      message: 'Post created successfully',
      result: response.data,
    };
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}
