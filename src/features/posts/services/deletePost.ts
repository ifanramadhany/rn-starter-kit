import { jsonPlaceholderClient } from '../../../shared/api/clients/jsonPlaceholderClient';
import { normalizeAxiosError } from '../../../shared/api/errors';
import type { ApiResponse } from '../../../shared/api/types';

export async function deletePost(id: number): Promise<ApiResponse<{ id: number }>> {
  try {
    const response = await jsonPlaceholderClient.delete(`/posts/${id}`);

    return {
      status: response.status,
      message: 'Post deleted successfully',
      result: { id },
    };
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}
