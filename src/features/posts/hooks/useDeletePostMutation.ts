import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse } from '../../../shared/api/types';
import { postsQueryKeys } from '../constants/queryKeys';
import { deletePost } from '../services';
import type { Post } from '../types';

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (response) => {
      queryClient.setQueryData<ApiResponse<Post[]> | undefined>(
        postsQueryKeys.list,
        (currentData) => {
          if (!currentData) {
            return currentData;
          }

          return {
            ...currentData,
            message: response.message,
            result: currentData.result.filter((post) => post.id !== response.result.id),
          };
        },
      );
    },
  });
}
