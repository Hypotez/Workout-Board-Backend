import { HevyClientService, Uuid, Url } from "../types";


export default class HevyClient implements HevyClientService {
  private baseUrl: Url;
  private apiKey: Uuid;

  constructor(url: Url, apiKey: Uuid) {
    this.baseUrl = url;
    this.apiKey = apiKey;
  }

  private async fetchWithAuth(endpoint: string, options?: RequestInit): Promise<void> {
    const fullPath = this.baseUrl + endpoint;
    const headers = {
      ...options?.headers,
      'accept': 'application/json',
      'api-key': this.apiKey
    };

    const response = await fetch(fullPath, { ...options, headers });

    

    return 
  }

  async getWorkouts(page: number, pageSize: number): Promise<void> {
    //const result = await this.fetchWithAuth(`/v1/workouts?page=${page}&pageSize=${pageSize}`, { method: "GET"});
    return;
  }

}
