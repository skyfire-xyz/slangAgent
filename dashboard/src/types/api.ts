export interface ApiError extends Error {
  status: number;
  statusText: string;
  message: string;
  body: any;
}
