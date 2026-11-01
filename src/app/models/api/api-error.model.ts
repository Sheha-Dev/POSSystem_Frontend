export interface ApiError {
  status: number;
  message: string;
  validationErrors?: Readonly<Record<string, readonly string[]>>;
}
