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

  const detail = errorData.detail || errorData.message || 'An unexpected error occurred';

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
