import { z } from 'zod';

export const SuccessString = 'success';
export const ErrorString = 'error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SuccessStatusCodeSchema = z.literal(200);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ErrorStatusCodeSchema = z.union([
  z.literal(400),
  z.literal(401),
  z.literal(403),
  z.literal(404),
  z.literal(500),
]);

const SuccessStatusSchema = z.literal(SuccessString);
const ErrorStatusSchema = z.literal(ErrorString);

const ErrorSchema = z.string().nullable();
const DataSchema = z.unknown();

export const SuccessResponseSchema = z.object({
  status: SuccessStatusSchema,
  data: DataSchema,
});

export const ErrorResponseSchema = z.object({
  status: ErrorStatusSchema,
  error: ErrorSchema,
});

export type SuccessStatusCode = z.infer<typeof SuccessStatusCodeSchema>;
export type ErrorStatusCode = z.infer<typeof ErrorStatusCodeSchema>;

export type SuccessStatus = z.infer<typeof SuccessStatusSchema>;
export type ErrorStatus = z.infer<typeof ErrorStatusSchema>;

export type ErrorType = z.infer<typeof ErrorSchema>;
export type DataType = z.infer<typeof DataSchema>;

export type SuccessResponse<DataType = unknown> = {
  status: SuccessStatus;
  data: DataType;
};

export type ErrorResponse = {
  status: ErrorStatus;
  error: ErrorType;
};

export type ApiResponse = SuccessResponse | null;
