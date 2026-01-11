import { z } from 'zod';

export const SuccessString = 'success';

export const SuccessStatusSchema = z.literal(SuccessString);

export type SuccessStatus = z.infer<typeof SuccessStatusSchema>;

export type SuccessResponse<DataType = unknown> = {
  status: SuccessStatus;
  data: DataType;
};

export type ApiResponse = SuccessResponse | null;
