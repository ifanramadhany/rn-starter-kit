import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsQueryKeys } from '../constants/queryKeys';
import { createPost } from '../services';

export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKeys.list });
    },
  });
}
