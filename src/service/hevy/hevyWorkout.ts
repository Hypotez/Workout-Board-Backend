import HttpClient from '../httpClient';

import { 
  AllWorkoutResponse, 
  SingleWorkoutResponse, 
  WorkoutCountsResponse, 
  WorkoutCountsSchema, 
  WorkoutCreateResponseSchema, 
  WorkoutPayload, 
  WorkoutResponse, 
  WorkoutResponseSchema, 
  WorkoutSchema 
} from '../../schemas/hevy/workout';

import { IHevyWorkoutService } from '../../types/service';

import { UuidType } from '../../schemas/shared/common';
import { EventsResponse, EventsResponseSchema } from '../../schemas/hevy/event';

export default class HevyWorkoutService extends HttpClient implements IHevyWorkoutService {
  async getWorkouts(page: number, pageSize: number): Promise<WorkoutResponse | null> {
    const response = await this.fetchWithAuth(`/v1/workouts?page=${page}&pageSize=${pageSize}`, { method: "GET" });

    if (response) {
      const workoutResponse = WorkoutResponseSchema.safeParse(response.data)

      if (workoutResponse.success) {
        return workoutResponse.data
      }
    }

    return null
  }

  async getAllWorkouts(pageSize: number): Promise<AllWorkoutResponse | null> {
    const result: AllWorkoutResponse = []
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

  async getWorkoutsCount(): Promise<WorkoutCountsResponse | null> {
    const response = await this.fetchWithAuth(`/v1/workouts/count`, { method: "GET" });

    if (response) {
      const workoutCountsResponse = WorkoutCountsSchema.safeParse(response.data);

      if (workoutCountsResponse.success) {
        return workoutCountsResponse.data;
      }
    }

    return null;
  }

  async getSingleWorkoutById(workoutId: UuidType): Promise<SingleWorkoutResponse | null> {
    const response = await this.fetchWithAuth(`/v1/workouts/${workoutId}`, { method: "GET" });

    if (response) {
      const workoutResponse = WorkoutSchema.safeParse(response.data);

      if (workoutResponse.success) {
        return workoutResponse.data;
      }
    }

    return null;
  }

  async createWorkout(workoutPayload: WorkoutPayload): Promise<SingleWorkoutResponse | null> {
    const response = await this.fetchWithAuth(`/v1/workouts`, { method: "POST", body: JSON.stringify(workoutPayload) });

    if (response) {
      const workoutResponse = WorkoutCreateResponseSchema.safeParse(response.data);

      if (workoutResponse.success) {
        return workoutResponse.data.workout[0];
      }
    }

    return null;
  }

  async updateWorkout(workoutId: UuidType, workoutPayload: WorkoutPayload): Promise<SingleWorkoutResponse | null> {
    const response = await this.fetchWithAuth(`/v1/workouts/${workoutId}`, { method: "PUT", body: JSON.stringify(workoutPayload) });

    if (response) {
      const workoutResponse = WorkoutCreateResponseSchema.safeParse(response.data);

      if (workoutResponse.success) {
        return workoutResponse.data.workout[0];
      }
    }

    return null;
  }

  async getWorkoutEvents(pageSize: number, page: number, since: Date): Promise<EventsResponse | null> {
    const response = await this.fetchWithAuth(`/v1/workouts/events?pageSize=${pageSize}&page=${page}&since=${since}`, { method: "GET" });

    if (response) {
      const eventsResponse = EventsResponseSchema.safeParse(response.data);

      if (eventsResponse.success) {
        return eventsResponse.data;
      }
    }

    return null;
  }
}