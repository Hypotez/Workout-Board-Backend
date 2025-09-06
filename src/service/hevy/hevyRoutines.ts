import HttpClient from '../httpClient';

import { 
  GetRoutineResponse,
  GetRoutinesResponse,
  GetRoutinesResponseSchema,
  GetRoutineResponseSchema,
  CreateRoutineResponseSchema,
  CreateRoutine,
  CreateRoutineResponse,
  UpdateRoutine
} from '../../schemas/hevy/routine';

import {
  UuidType
} from '../../schemas/shared/common';

import { IHevyRoutinesService } from '../../types/service';

export default class HevyRoutinesService extends HttpClient implements IHevyRoutinesService {
  async getRoutines(page: number, pageSize: number): Promise<GetRoutinesResponse| null> {
    const response = await this.fetchWithAuth(`/v1/routines?page=${page}&pageSize=${pageSize}`, { method: "GET" });

    if (response) {

        const routinesResponse = GetRoutinesResponseSchema.safeParse(response.data)

        if (routinesResponse.success) {
            return routinesResponse.data
        }
    }

    return null
  }

  async getRoutineById(routineId: UuidType): Promise<GetRoutineResponse | null> {
    const response = await this.fetchWithAuth(`/v1/routines/${routineId}`, { method: "GET" });

    if (response) {
      const routineResponse = GetRoutineResponseSchema.safeParse(response.data);

      if (routineResponse.success) {
        return routineResponse.data;
      }
    }

    return null;
  }

  async createRoutine(workoutPayload: CreateRoutine): Promise<CreateRoutineResponse | null>  {
    const response = await this.fetchWithAuth(`/v1/routines`, { method: "POST", body: JSON.stringify(workoutPayload) });

    if (response) {
      const routineResponse = CreateRoutineResponseSchema.safeParse(response.data);

      if (routineResponse.success) {
        return routineResponse.data;
      }
    }

    return null;
  }

  async updateRoutine(routineId: UuidType, workoutPayload: UpdateRoutine): Promise<CreateRoutineResponse | null> {
    const response = await this.fetchWithAuth(`/v1/routines/${routineId}`, { method: "PUT", body: JSON.stringify(workoutPayload) });

    if (response) {
      const routineResponse = CreateRoutineResponseSchema.safeParse(response.data);

      if (routineResponse.success) {
        return routineResponse.data;
      }
    }

    return null;
  }
}