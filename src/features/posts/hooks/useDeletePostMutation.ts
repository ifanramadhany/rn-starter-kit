import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsQueryKeys } from '../constants/queryKeys';
import { deletePost } from '../services';

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKeys.list });
    },
  });
}
