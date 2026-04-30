import { useQuery } from '@tanstack/react-query';
import { postsQueryKeys } from '../constants/queryKeys';
import { getPosts } from '../services';

export function usePostListQuery() {
  return useQuery({
    queryKey: postsQueryKeys.list,
    queryFn: getPosts,
  });
}
