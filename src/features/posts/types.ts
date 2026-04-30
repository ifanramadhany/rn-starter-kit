export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

export type CreatePostPayload = {
  userId: number;
  title: string;
  body: string;
};

export type UpdatePostPayload = {
  id: number;
  userId: number;
  title: string;
  body: string;
};
