import { EventsResponse } from "../schemas/hevy/event";
import { AllWorkoutResponse, SingleWorkoutResponse, WorkoutCountsResponse, WorkoutPayload, WorkoutResponse } from "../schemas/hevy/workout";
import { UuidType } from "../schemas/shared/common";

import HevyWorkoutService from "../service/hevy/hevyWorkout";

export interface IHevyWorkoutService {
    /**
     * Get a paginated list of workouts.
     * @param page Page number (Must be 1 or greater)
     * @param pageSize Number of items on the requested page (Max 10)
     * @returns Hevy response
    */
    getWorkouts(page: number, pageSize: number): Promise<WorkoutResponse | null>;
    /**
     * Get a list of all workouts.
     * @param pageSize Number of items on the requested page (Max 10)
     * @returns Hevy response
    */
    getAllWorkouts(pageSize: number): Promise<AllWorkoutResponse | null>;
    /**
     * Get the total number of workouts on the account.
     * @returns Hevy response
    */
    getWorkoutsCount(): Promise<WorkoutCountsResponse | null>;
    /**
     * Get workout events.
     * @param pageSize Number of items on the requested page (Max 10)
     * @param page Page number (Must be 1 or greater)
     * @param since Only return events that occurred after this date
     * @returns Hevy response
     */
    getWorkoutEvents(pageSize: number, page: number, since: Date): Promise<EventsResponse | null>;
    /**
     * Get a single workout by ID.
     * @param workoutId The ID of the workout to retrieve.
     * @returns Hevy response
     */
    getSingleWorkoutById(workoutId: UuidType): Promise<SingleWorkoutResponse | null>;
    /**
     * Create a new workout.
     * @param workoutId The ID of the workout to create.
     * @returns Hevy response
     */
    createWorkout(workoutPayload: WorkoutPayload): Promise<SingleWorkoutResponse | null>;
    /**
     * Update an existing workout.
     * @param workoutId The ID of the workout to update.
     * @returns Hevy response
     */
    updateWorkout(workoutId: UuidType, workoutPayload: WorkoutPayload): Promise<SingleWorkoutResponse | null>;
}

export interface Service {
    hevyClient: HevyClientService;
}

export interface HevyClientService {
    workouts: HevyWorkoutService;
}