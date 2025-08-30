import { SuccessStatusCode, ErrorStatusCode, ErrorType } from "../schemas/shared/api";

export interface ResponseHelpers {
  success: <T = unknown>(
    data?: T,
    statusCode?: SuccessStatusCode
  ) => void;

  error: (
    error?: ErrorType,
    statusCode?: ErrorStatusCode
  ) => void;
}