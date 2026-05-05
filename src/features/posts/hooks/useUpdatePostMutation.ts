import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsQueryKeys } from '../constants/queryKeys';
import { updatePost } from '../services';

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKeys.list });
    },
  });
}
