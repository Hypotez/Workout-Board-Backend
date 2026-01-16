import HttpClient from '../httpClient';

import {
  GetRoutineResponse,
  GetRoutinesResponse,
  GetRoutinesResponseSchema,
  GetRoutineResponseSchema,
  CreateRoutineResponseSchema,
  CreateRoutine,
  CreateRoutineResponse,
  UpdateRoutine,
} from '../../schemas/shared/hevy/routine';

import { IHevyRoutinesService } from '../../types/service';

export default class HevyRoutinesService extends HttpClient implements IHevyRoutinesService {
  async getRoutines(page: number, pageSize: number): Promise<GetRoutinesResponse | null> {
    const response = await this.fetchWithAuth(`/v1/routines?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
    });

    if (response) {
      const routinesResponse = GetRoutinesResponseSchema.safeParse(response.data);

      if (routinesResponse.success) {
        return routinesResponse.data;
      }
    }

    return null;
  }

  async getRoutineById(routineId: string): Promise<GetRoutineResponse | null> {
    const response = await this.fetchWithAuth(`/v1/routines/${routineId}`, { method: 'GET' });

    if (response) {
      const routineResponse = GetRoutineResponseSchema.safeParse(response.data);

      if (routineResponse.success) {
        return routineResponse.data;
      }
    }

    return null;
  }

  async createRoutine(routinePayload: CreateRoutine): Promise<CreateRoutineResponse | null> {
    const response = await this.fetchWithAuth(`/v1/routines`, {
      method: 'POST',
      body: JSON.stringify(routinePayload),
    });

    if (response) {
      const routineResponse = CreateRoutineResponseSchema.safeParse(response.data);

      if (routineResponse.success) {
        return routineResponse.data;
      }
    }

    return null;
  }

  async updateRoutine(
    routineId: string,
    routinePayload: UpdateRoutine
  ): Promise<CreateRoutineResponse | null> {
    const response = await this.fetchWithAuth(`/v1/routines/${routineId}`, {
      method: 'PUT',
      body: JSON.stringify(routinePayload),
    });

    if (response) {
      const routineResponse = CreateRoutineResponseSchema.safeParse(response.data);

      if (routineResponse.success) {
        return routineResponse.data;
      }
    }

    return null;
  }
}
