export class ApiError extends Error {
  status: number;
  detail: string | any;

  constructor(status: number, detail: string | any) {
    super(typeof detail === 'string' ? detail : 'An API error occurred');
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

export class ValidationError extends ApiError {
  errors: any[];

  constructor(detail: any) {
    super(422, detail);
    this.name = 'ValidationError';
    this.errors = Array.isArray(detail) ? detail : [detail];
  }
}

export class UnauthorizedError extends ApiError {
  constructor(detail: string = 'Unauthorized') {
    super(401, detail);
    this.name = 'UnauthorizedError';
  }
}

export class NotFoundError extends ApiError {
  constructor(detail: string = 'Resource not found') {
    super(404, detail);
    this.name = 'NotFoundError';
  }
}

export class InternalServerError extends ApiError {
  constructor(detail: string = 'Internal server error') {
    super(500, detail);
    this.name = 'InternalServerError';
  }
}
