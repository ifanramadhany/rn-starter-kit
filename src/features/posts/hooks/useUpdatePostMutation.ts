import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse } from '../../../shared/api/types';
import { postsQueryKeys } from '../constants/queryKeys';
import { updatePost } from '../services';
import type { Post } from '../types';

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
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
            result: currentData.result.map((post) =>
              post.id === response.result.id ? response.result : post,
            ),
          };
        },
      );
    },
  });
}
