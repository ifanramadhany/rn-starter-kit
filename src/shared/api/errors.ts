import axios from 'axios';
import type { ApiResponse } from './types';

type ApiErrorResponse = {
  message?: string;
  result?: unknown;
  data?: unknown;
};

export class ApiError<T = unknown> extends Error {
  response: ApiResponse<T>;

  constructor(response: ApiResponse<T>) {
    super(response.message);
    this.name = 'ApiError';
    this.response = response;
  }
}

export function normalizeAxiosError(error: unknown): ApiError<unknown> {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return new ApiError({
      status: 500,
      message: 'Something went wrong',
      result: null,
    });
  }

  const responseData = error.response?.data;

  return new ApiError({
    status: error.response?.status ?? 500,
    message: responseData?.message ?? error.message,
    result: responseData?.result ?? responseData?.data ?? null,
  });
}
