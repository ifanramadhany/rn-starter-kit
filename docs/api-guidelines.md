# API Guidelines

Use this pattern when adding a new feature that talks to an API.

## Response Shape

Every service should return this app-level shape:

```ts
type ApiResponse<T> = {
  status: number;
  message: string;
  result: T;
};
```

The raw API response can be different for every endpoint. Map it manually inside the service before returning it.

```txt
raw API response -> feature service -> ApiResponse<T> -> React Query hook -> component
```

## Example Feature Structure

Example for a `posts` feature:

```txt
src/features/posts/
├── components/
│   └── PostCard.tsx
├── hooks/
│   ├── useCreatePostMutation.ts
│   ├── useDeletePostMutation.ts
│   ├── usePostListQuery.ts
│   └── useUpdatePostMutation.ts
├── screens/
│   └── PostsScreen.tsx
├── services/
│   ├── createPost.ts
│   ├── deletePost.ts
│   ├── getPosts.ts
│   ├── index.ts
│   └── updatePost.ts
├── types.ts
└── index.ts
```

## Types

```ts
// src/features/posts/types.ts
export type Post = {
  id: string;
  title: string;
  body: string;
};

export type CreatePostPayload = {
  title: string;
  body: string;
};

export type UpdatePostPayload = {
  id: string;
  title?: string;
  body?: string;
};
```

## Services

Services own endpoint paths, request payloads, raw response mapping, and error normalization.

```ts
// src/features/posts/services/getPosts.ts
import { jsonPlaceholderClient } from '../../../shared/api/clients/jsonPlaceholderClient';
import { normalizeAxiosError } from '../../../shared/api/errors';
import type { ApiResponse } from '../../../shared/api/types';
import type { Post } from '../types';

type PostListRawResponse = {
  data: Post[];
  message?: string;
};

export async function getPosts(): Promise<ApiResponse<Post[]>> {
  try {
    const response = await jsonPlaceholderClient.get<PostListRawResponse>('/posts');

    return {
      status: response.status,
      message: response.data.message ?? 'success',
      result: response.data.data,
    };
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}
```

```ts
// src/features/posts/services/createPost.ts
import { jsonPlaceholderClient } from '../../../shared/api/clients/jsonPlaceholderClient';
import { normalizeAxiosError } from '../../../shared/api/errors';
import type { ApiResponse } from '../../../shared/api/types';
import type { CreatePostPayload, Post } from '../types';

type PostRawResponse = {
  data: Post;
  message?: string;
};

export async function createPost(
  payload: CreatePostPayload,
): Promise<ApiResponse<Post>> {
  try {
    const response = await jsonPlaceholderClient.post<PostRawResponse>(
      '/posts',
      payload,
    );

    return {
      status: response.status,
      message: response.data.message ?? 'success',
      result: response.data.data,
    };
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}
```

```ts
// src/features/posts/services/updatePost.ts
import { jsonPlaceholderClient } from '../../../shared/api/clients/jsonPlaceholderClient';
import { normalizeAxiosError } from '../../../shared/api/errors';
import type { ApiResponse } from '../../../shared/api/types';
import type { Post, UpdatePostPayload } from '../types';

type PostRawResponse = {
  data: Post;
  message?: string;
};

export async function updatePost({
  id,
  ...payload
}: UpdatePostPayload): Promise<ApiResponse<Post>> {
  try {
    const response = await jsonPlaceholderClient.put<PostRawResponse>(
      `/posts/${id}`,
      payload,
    );

    return {
      status: response.status,
      message: response.data.message ?? 'success',
      result: response.data.data,
    };
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}
```

```ts
// src/features/posts/services/deletePost.ts
import { jsonPlaceholderClient } from '../../../shared/api/clients/jsonPlaceholderClient';
import { normalizeAxiosError } from '../../../shared/api/errors';
import type { ApiResponse } from '../../../shared/api/types';

export async function deletePost(id: string): Promise<ApiResponse<{ id: string }>> {
  try {
    const response = await jsonPlaceholderClient.delete<{ message?: string }>(
      `/posts/${id}`,
    );

    return {
      status: response.status,
      message: response.data.message ?? 'success',
      result: { id },
    };
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}
```

```ts
// src/features/posts/services/index.ts
export { createPost } from './createPost';
export { deletePost } from './deletePost';
export { getPosts } from './getPosts';
export { updatePost } from './updatePost';
```

## Query Hooks

React Query hooks own cache keys, invalidation, and mutation behavior. Components should call hooks, not services directly.

```ts
// src/features/posts/hooks/usePostListQuery.ts
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../services';

export function usePostListQuery() {
  return useQuery({
    queryKey: ['posts', 'list'],
    queryFn: getPosts,
  });
}
```

```ts
// src/features/posts/hooks/useCreatePostMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../services';

export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'list'] });
    },
  });
}
```

```ts
// src/features/posts/hooks/useUpdatePostMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePost } from '../services';

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'list'] });
    },
  });
}
```

```ts
// src/features/posts/hooks/useDeletePostMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '../services';

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'list'] });
    },
  });
}
```

## Component Usage

Components should read normalized data from `data.result`.

```tsx
// src/features/posts/screens/PostsScreen.tsx
import React from 'react';
import { ActivityIndicator, Button, FlatList, Text, View } from 'react-native';
import { usePostListQuery } from '../hooks/usePostListQuery';
import { useCreatePostMutation } from '../hooks/useCreatePostMutation';

export default function PostsScreen() {
  const postsQuery = usePostListQuery();
  const createPostMutation = useCreatePostMutation();

  if (postsQuery.isLoading) {
    return <ActivityIndicator />;
  }

  if (postsQuery.error) {
    return <Text>Failed to load posts.</Text>;
  }

  return (
    <View>
      <Button
        title="Create Post"
        onPress={() =>
          createPostMutation.mutate({
            title: 'New post',
            body: 'Post body',
          })
        }
      />

      <FlatList
        data={postsQuery.data?.result ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.title}</Text>}
      />
    </View>
  );
}
```

## Rules

- Put raw API response types in the service file unless they are reused elsewhere.
- Put app/domain types in `types.ts`.
- Put domain/base-url Axios clients in `src/shared/api/clients/`.
- Always return `ApiResponse<T>` from services.
- Always throw normalized errors with `normalizeAxiosError`.
- Components should use hooks, not call API services directly.
- Use `useQuery` for GET.
- Use `useMutation` for POST, PUT, PATCH, and DELETE.
- Invalidate related query keys after successful mutations.
- Keep feature internals inside the feature folder.
