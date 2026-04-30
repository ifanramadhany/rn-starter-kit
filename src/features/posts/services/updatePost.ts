import { jsonPlaceholderClient } from '../../../shared/api/clients/jsonPlaceholderClient';
import { normalizeAxiosError } from '../../../shared/api/errors';
import type { ApiResponse } from '../../../shared/api/types';
import type { Post, UpdatePostPayload } from '../types';

export async function updatePost({
  id,
  ...payload
}: UpdatePostPayload): Promise<ApiResponse<Post>> {
  try {
    const response = await jsonPlaceholderClient.put<Post>(`/posts/${id}`, payload);

    return {
      status: response.status,
      message: 'Post updated successfully',
      result: {
        ...payload,
        ...response.data,
        id,
      },
    };
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}
