import { useMutation } from '@tanstack/react-query';
import { createPost } from '../services';

export function useCreatePostMutation() {
  return useMutation({
    mutationFn: createPost,
  });
}
