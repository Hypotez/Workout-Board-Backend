import { z } from "zod";

export const successString = "success"
export const errorString = "error"

const SuccessStatusCodeSchema = z.literal(200);
const ErrorStatusCodeSchema = z.union([z.literal(400), z.literal(401), z.literal(403), z.literal(404), z.literal(500)]);
const ErrorSchema = z.string().nullable();
const DataSchema = z.unknown();
const SuccessStatusSchema = z.literal(successString)
const ErrorStatusSchema = z.literal(errorString)

export const urlSchema = z.url("Not a valid URL").brand<"Url">();
export const uuidSchema = z.uuid("Not a valid UUID").brand<"Uuid">();
export const nonEmptyStringSchema = z.string().min(1, "String cannot be empty").brand<"NonEmptyString">();

export type SuccessStatusCode = z.infer<typeof SuccessStatusCodeSchema>;
export type ErrorStatusCode = z.infer<typeof ErrorStatusCodeSchema>;
export type SuccessStatus = z.infer<typeof SuccessStatusSchema>;
export type ErrorStatus = z.infer<typeof ErrorStatusSchema>;
export type Url = z.infer<typeof urlSchema>;
export type Uuid = z.infer<typeof uuidSchema>;
export type Error = z.infer<typeof ErrorSchema>;
export type Data = z.infer<typeof DataSchema>;

export const SuccessResponseSchema =
  z.object({
    status: SuccessStatusSchema,
    data: DataSchema,
  });

export const ErrorResponseSchema = z.object({
  status: ErrorStatusSchema,
  error: ErrorSchema,
});

export type SuccessResponse<Data> = {
  status: SuccessStatus;
  data: Data;
};

export type ErrorResponse = {
  status: ErrorStatus;
  error: Error;
};

export interface ResponseHelpers {
  success: <T = unknown>(
    data?: T,
    statusCode?: SuccessStatusCode
  ) => void;

  error: (
    error?: Error,
    statusCode?: ErrorStatusCode
  ) => void;
}

export interface Service {
    hevyClient: HevyClientService;
}

export interface HevyClientService {
    /**
     * Get a paginated list of workouts.
     * @param page Page number (Must be 1 or greater)
     * @param pageSize Number of items on the requested page (Max 10)
     * @returns Hevy response
    */
    getWorkouts(page: number, pageSize: number): Promise<void>;
}