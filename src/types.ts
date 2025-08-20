import { z } from "zod";

const SuccessStatusCodeSchema = z.literal(200);
const ErrorStatusCodeSchema = z.union([z.literal(400), z.literal(401), z.literal(403), z.literal(404), z.literal(500)]);
const ErrorSchema = z.string().nullable();
const DataSchema = z.unknown();
export const urlSchema = z.url("Not a valid URL").brand<"Url">();
export const uuidSchema = z.uuid("Not a valid UUID").brand<"Uuid">();
export const nonEmptyStringSchema = z.string().min(1, "String cannot be empty").brand<"NonEmptyString">();

export type SuccessStatusCode = z.infer<typeof SuccessStatusCodeSchema>;
export type ErrorStatusCode = z.infer<typeof ErrorStatusCodeSchema>;
export type Url = z.infer<typeof urlSchema>;
export type Uuid = z.infer<typeof uuidSchema>;
export type Error = z.infer<typeof ErrorSchema>;

export const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.literal("success"),
    data: dataSchema,
  });

export type ErrorResponse = {
    status: "error";
    error: Error;
}

export type SuccessResponse<T = unknown> = {
  status: "success";
  data: T;
};

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

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