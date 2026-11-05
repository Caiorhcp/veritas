import { api } from '@/api/client';
import type { Post } from '@/types/post';

export async function getPosts(limit = 5): Promise<Post[]> {
  const { data } = await api.get<Post[]>('/posts', { params: { _limit: limit } });
  return data;
}
