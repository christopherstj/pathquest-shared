export class ApiError extends Error {
  public readonly status: number;
  public readonly url: string;
  public readonly bodyText?: string;

  constructor(opts: { status: number; url: string; message?: string; bodyText?: string }) {
    super(opts.message ?? `API request failed (${opts.status})`);
    this.name = "ApiError";
    this.status = opts.status;
    this.url = opts.url;
    this.bodyText = opts.bodyText;
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}


