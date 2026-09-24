import { 
  ApiError, 
  ValidationError, 
  UnauthorizedError, 
  NotFoundError, 
  InternalServerError 
} from "./apiErrors";

export const handleApiResponseError = async (response: Response) => {
  const status = response.status;
  let errorData;
  
  try {
    errorData = await response.json();
  } catch (e) {
    errorData = { detail: response.statusText || 'Unknown error' };
  }

  let detail = errorData.detail || errorData.message || 'An unexpected error occurred';

  // FastAPI validation errors arrive as [{ loc, msg }, ...] — flatten them
  // into a sentence instead of letting callers print "[object Object]".
  if (Array.isArray(detail)) {
    detail = detail
      .map((d: any) => String(d?.msg ?? d).replace(/^Value error,\s*/i, ''))
      .join('. ');
  }

  switch (status) {
    case 401:
      throw new UnauthorizedError(detail);
    case 404:
      throw new NotFoundError(detail);
    case 422:
      throw new ValidationError(detail);
    case 500:
      throw new InternalServerError(detail);
    default:
      throw new ApiError(status, detail);
  }
};
