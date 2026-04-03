export class AppError extends Error {
  code: string;
  statusCode: number;
  retryable: boolean;
  details?: unknown;

  constructor(params: {
    message: string;
    code: string;
    statusCode?: number;
    retryable?: boolean;
    details?: unknown;
  }) {
    super(params.message);
    this.name = this.constructor.name;
    this.code = params.code;
    this.statusCode = params.statusCode ?? 500;
    this.retryable = params.retryable ?? false;
    this.details = params.details;
  }
}

export class JsonParseAppError extends AppError {
  constructor(message: string, details?: unknown) {
    super({
      message,
      code: "JSON_PARSE_ERROR",
      statusCode: 502,
      retryable: true,
      details,
    });
  }
}

export class ProviderAppError extends AppError {
  constructor(message: string, details?: unknown) {
    super({
      message,
      code: "LLM_PROVIDER_ERROR",
      statusCode: 502,
      retryable: true,
      details,
    });
  }
}
