import { HevyClientService, Uuid, Url, SuccessResponse, SuccessString, ApiResponse, WorkoutResponseSchema, WorkoutResponse, AllWorkoutResponse } from "../types";
import logger from '../logger/logger'


export default class HevyClient implements HevyClientService {
  private baseUrl: Url;
  private apiKey: Uuid;

  constructor(url: Url, apiKey: Uuid) {
    this.baseUrl = url;
    this.apiKey = apiKey;
  }

  private async fetchWithAuth(endpoint: string, options?: RequestInit): Promise<ApiResponse> {
    const fullPath = this.baseUrl + endpoint;
    const headers = {
      ...options?.headers,
      'accept': 'application/json',
      'api-key': this.apiKey
    };

    const response = await fetch(fullPath, { ...options, headers });

    let finalResponse: unknown = null;
    try {
      finalResponse = await response.json()
    } catch (error) {
      logger.error('[HevyClient][FetchWithAuth][Content-Type]', error)
    }

    if (response.ok) {
      const returnResponse: SuccessResponse = {
        status: SuccessString,
        data: null
      }

      if (finalResponse) {
        returnResponse.data = finalResponse
      }

      return returnResponse
    }

    logger.error(`[HevyClient][FetchWithAuth][Response] Status: ${response.status} , Text: ${response.statusText} `)

    return null
  }

  async getWorkouts(page: number, pageSize: number): Promise<WorkoutResponse | null> {
    const response = await this.fetchWithAuth(`/v1/workouts?page=${page}&pageSize=${pageSize}`, { method: "GET"});
    
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

}
