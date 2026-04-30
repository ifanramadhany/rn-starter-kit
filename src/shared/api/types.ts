export type ApiResponse<T> = {
  status: number;
  message: string;
  result: T;
};
