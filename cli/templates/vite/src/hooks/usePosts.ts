import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/services/posts';

export function usePosts(limit = 5) {
  return useQuery({ queryKey: ['posts', limit], queryFn: () => getPosts(limit) });
}
