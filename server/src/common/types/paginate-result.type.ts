export type PaginateResult<T> = {
  total: number;
  page: number;
  pages: number;
  limit: number;
  list: T[];
};
