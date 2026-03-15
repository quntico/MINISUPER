
/**
 * Standard paginated response from the API.
 */
export interface PaginatedResponse<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

/**
 * Standard API Error format.
 */
export interface ApiError {
  code: number;
  message: string;
  data?: Record<string, any>;
}
