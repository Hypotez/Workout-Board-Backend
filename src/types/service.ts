import { GetEvents } from '../schemas/hevy/event';
import {
  CreateRoutine,
  CreateRoutineResponse,
  GetRoutineResponse,
  GetRoutinesResponse,
  UpdateRoutine,
} from '../schemas/hevy/routine';
import {
  CreateOrUpdateWorkout,
  GetAllWorkouts,
  GetPaginatedWorkouts,
  GetWorkout,
  GetWorkoutsCounts,
} from '../schemas/hevy/workout';
import { UuidType } from '../schemas/shared/common';

import HevyWorkoutService from '../service/hevy/hevyWorkouts';
import HevyRoutinesService from '../service/hevy/hevyRoutines';
import { GetExerciseTemplate, GetExerciseTemplates } from '../schemas/hevy/exerciseTemplates';
import { GetExercisesHistory } from '../schemas/hevy/exerciseHistory';

export interface IHevyWorkoutsService {
  /**
   * Get a paginated list of workouts.
   * @param page Page number (Must be 1 or greater)
   * @param pageSize Number of items on the requested page (Max 10)
   * @returns Hevy response
   */
  getWorkouts(page: number, pageSize: number): Promise<GetPaginatedWorkouts | null>;
  /**
   * Get a list of all workouts.
   * @param pageSize Number of items on the requested page (Max 10)
   * @returns Hevy response
   */
  getAllWorkouts(pageSize: number): Promise<GetAllWorkouts | null>;
  /**
   * Get the total number of workouts on the account.
   * @returns Hevy response
   */
  getWorkoutsCount(): Promise<GetWorkoutsCounts | null>;
  /**
   * Get workout events.
   * @param pageSize Number of items on the requested page (Max 10)
   * @param page Page number (Must be 1 or greater)
   * @param since Only return events that occurred after this date
   * @returns Hevy response
   */
  getWorkoutEvents(pageSize: number, page: number, since: Date): Promise<GetEvents | null>;
  /**
   * Get a single workout by ID.
   * @param workoutId The ID of the workout to retrieve.
   * @returns Hevy response
   */
  getSingleWorkoutById(workoutId: UuidType): Promise<GetWorkout | null>;
  /**
   * Create a new workout.
   * @param workoutId The ID of the workout to create.
   * @returns Hevy response
   */
  createWorkout(workoutPayload: CreateOrUpdateWorkout): Promise<GetWorkout | null>;
  /**
   * Update an existing workout.
   * @param workoutId The ID of the workout to update.
   * @returns Hevy response
   */
  updateWorkout(
    workoutId: UuidType,
    workoutPayload: CreateOrUpdateWorkout
  ): Promise<GetWorkout | null>;
}

export interface IHevyRoutinesService {
  /**
   * Get a paginated list of routines.
   * @param page Page number (Must be 1 or greater)
   * @param pageSize Number of items on the requested page (Max 10)
   * @returns Hevy response
   */
  getRoutines(page: number, pageSize: number): Promise<GetRoutinesResponse | null>;
  /**
   * Get a routine by its Id.
   * @param routineId The ID of the routine to retrieve.
   * @returns Hevy response
   */
  getRoutineById(routineId: UuidType): Promise<GetRoutineResponse | null>;
  /**
   * Create a new routine.
   * @param routinePayload The payload of the routine to create.
   * @returns Hevy response
   */
  createRoutine(routinePayload: CreateRoutine): Promise<CreateRoutineResponse | null>;
  /**
   * Update an existing routine.
   * @param routineId The ID of the routine to update.
   * @param routinePayload The updated routine data.
   * @returns Hevy response
   */
  updateRoutine(
    routineId: UuidType,
    routinePayload: UpdateRoutine
  ): Promise<CreateRoutineResponse | null>;
}

export interface IHevyExerciseTemplatesService {
  /**
   * Get a paginated list of exercise templates.
   * @param page Page number (Must be 1 or greater)
   * @param pageSize Number of items on the requested page (Max 10)
   * @returns Hevy response
   */
  getExerciseTemplates(page: number, pageSize: number): Promise<GetExerciseTemplates | null>;
  /**
   * Get a single exercise template by ID.
   * @param templateId The ID of the exercise template to retrieve.
   * @returns Hevy response
   */
  getExerciseTemplateById(templateId: string): Promise<GetExerciseTemplate | null>;
}

export interface IHevyExerciseHistoryService {
  /**
   * Get exercise history for a specific exercise template.
   * @param templateId The ID of the exercise template to retrieve history for.
   * @param start_date The start date for the history retrieval.
   * @param end_date The end date for the history retrieval.
   * @returns Hevy response
   */
  getExerciseHistory(
    templateId: string,
    start_date?: Date,
    end_date?: Date
  ): Promise<GetExercisesHistory | null>;
}

export interface Service {
  hevyClient: HevyClientService;
}

export interface HevyClientService {
  workouts: HevyWorkoutService;
  routines: HevyRoutinesService;
  exerciseTemplates: IHevyExerciseTemplatesService;
  exerciseHistory: IHevyExerciseHistoryService;
}
