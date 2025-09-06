import HttpClient from '../httpClient';

import { 
  GetWorkoutsCounts,
  GetWorkoutsCountsSchema,
  CreateOrUpdateWorkoutResponseSchema, 
  CreateOrUpdateWorkout,
  GetPaginatedWorkouts,
  GetWorkout,
  GetWorkoutSchema,
  GetPaginatedWorkoutsResponseSchema,
  GetAllWorkouts
} from '../../schemas/hevy/workout';

import { IHevyWorkoutsService } from '../../types/service';

import { UuidType } from '../../schemas/shared/common';
import { GetEvents, EventsSchema } from '../../schemas/hevy/event';

export default class HevyWorkoutService extends HttpClient implements IHevyWorkoutsService {
  async getWorkouts(page: number, pageSize: number): Promise<GetPaginatedWorkouts | null> {
    const response = await this.fetchWithAuth(`/v1/workouts?page=${page}&pageSize=${pageSize}`, { method: "GET" });

    if (response) {
      const workoutResponse = GetPaginatedWorkoutsResponseSchema.safeParse(response.data)

      if (workoutResponse.success) {
        return workoutResponse.data
      }
    }

    return null
  }

  async getAllWorkouts(pageSize: number): Promise<GetAllWorkouts | null> {
    const result: GetAllWorkouts = [];
    let page = 1;
    let pageCount = 1;

    do {
      const response = await this.getWorkouts(page, pageSize);
      if (!response) break;

      result.push(...response.workouts);
      pageCount = response.page_count;
      page++;
    } while (page <= pageCount);

    return result.length > 0 ? result : null;
  }

  async getWorkoutsCount(): Promise<GetWorkoutsCounts | null> {
    const response = await this.fetchWithAuth(`/v1/workouts/count`, { method: "GET" });

    if (response) {
      const workoutCountsResponse = GetWorkoutsCountsSchema.safeParse(response.data);

      if (workoutCountsResponse.success) {
        return workoutCountsResponse.data;
      }
    }

    return null;
  }

  async getSingleWorkoutById(workoutId: UuidType): Promise<GetWorkout | null> {
    const response = await this.fetchWithAuth(`/v1/workouts/${workoutId}`, { method: "GET" });

    if (response) {
      const workoutResponse = GetWorkoutSchema.safeParse(response.data);

      if (workoutResponse.success) {
        return workoutResponse.data;
      }
    }

    return null;
  }

  async createWorkout(workoutPayload: CreateOrUpdateWorkout): Promise<GetWorkout | null> {
    const response = await this.fetchWithAuth(`/v1/workouts`, { method: "POST", body: JSON.stringify(workoutPayload) });

    if (response) {
      const workoutResponse = CreateOrUpdateWorkoutResponseSchema.safeParse(response.data);

      if (workoutResponse.success) {
        return workoutResponse.data.workout[0];
      }
    }

    return null;
  }

  async updateWorkout(workoutId: UuidType, workoutPayload: CreateOrUpdateWorkout): Promise<GetWorkout | null> {
    const response = await this.fetchWithAuth(`/v1/workouts/${workoutId}`, { method: "PUT", body: JSON.stringify(workoutPayload) });

    if (response) {
      const workoutResponse = CreateOrUpdateWorkoutResponseSchema.safeParse(response.data);

      if (workoutResponse.success) {
        return workoutResponse.data.workout[0];
      }
    }

    return null;
  }

  async getWorkoutEvents(pageSize: number, page: number, since: Date): Promise<GetEvents | null> {
    const response = await this.fetchWithAuth(`/v1/workouts/events?pageSize=${pageSize}&page=${page}&since=${since}`, { method: "GET" });

    if (response) {
      const eventsResponse = EventsSchema.safeParse(response.data);

      if (eventsResponse.success) {
        return eventsResponse.data;
      }
    }

    return null;
  }
}