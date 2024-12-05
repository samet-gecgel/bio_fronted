export interface IPagedResult<T> {
  data: T[];          
  totalItems: number; 
  totalPages: number; 
  errorMessage: string | null;
}