import { z } from "zod";

export const SuccessString = "success"
export const ErrorString = "error"

const SuccessStatusCodeSchema = z.literal(200);
const ErrorStatusCodeSchema = z.union([z.literal(400), z.literal(401), z.literal(403), z.literal(404), z.literal(500)]);
const ErrorSchema = z.string().nullable();
const DataSchema = z.unknown();
const SuccessStatusSchema = z.literal(SuccessString)
const ErrorStatusSchema = z.literal(ErrorString)

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

export type SuccessResponse<Data = unknown> = {
  status: SuccessStatus;
  data: Data;
};

export type ErrorResponse = {
  status: ErrorStatus;
  error: Error;
};

export type ApiResponse = SuccessResponse | null

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
    getWorkouts(page: number, pageSize: number): Promise<WorkoutResponse | null>;
}

//Hevy API Schemas

const SetSchema = z.object({
  index: z.number(),
  type: z.string(),
  weight_kg: z.number().nullable(),
  reps: z.number().nullable(),
  distance_meters: z.number().nullable(),
  duration_seconds: z.number().nullable(),
  rpe: z.number().nullable(),
  custom_metric: z.number().nullable()
});

const SetsSchema = z.array(SetSchema) 

const ExerciseSchema = z.object({
  index: z.number(),
  title: z.string(),
  notes: z.string(),
  exercise_template_id: z.string(),
  superset_id: z.number().nullable(),
  sets: SetsSchema
});

const ExercisesSchema = z.array(ExerciseSchema)

const WorkoutSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  updated_at: z.string(),
  created_at: z.string(),
  exercises: ExercisesSchema
})

const WorkoutsSchema = z.array(WorkoutSchema)

export const WorkoutResponseSchema = z.object({
  page: z.number(),
  page_count: z.number(),
  workouts: WorkoutsSchema
})

export type WorkoutResponse = z.infer<typeof WorkoutResponseSchema>;
