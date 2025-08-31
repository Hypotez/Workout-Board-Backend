import logger from '../logger/logger'
import { ApiResponse, SuccessResponse, SuccessString } from '../schemas/shared/api';
import { UrlType, UuidType } from '../schemas/shared/common';

export default class HttpClient {
  private baseUrl: UrlType;
  private apiKey: UuidType | undefined;

  constructor(url: UrlType, apiKey?: UuidType) {
    this.baseUrl = url;
    this.apiKey = apiKey;
  }

  protected async fetchWithAuth(endpoint: string, options?: RequestInit): Promise<ApiResponse> {
    const fullPath = this.baseUrl + endpoint;
    const headers = {
      ...options?.headers,
      'accept': 'application/json',
      'content-type': 'application/json',
      ...(this.apiKey && { 'api-key': this.apiKey })
    };

    const response = await fetch(fullPath, { ...options, headers });

    let finalResponse: unknown = null;
    try {
      const contentType = response.headers.get('Content-Type');

      if (contentType?.includes('application/json')) {
        finalResponse = await response.json()
      } else if (contentType?.includes('text/plain')) {
        finalResponse = await response.text()
      }

    } catch (error) {
      logger.error('[HttpClient][FetchWithAuth][Content-Type]', error)
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

    logger.error(`[HttpClient][FetchWithAuth][Response] Status: ${response.status} , Text: ${response.statusText} `)

    return null
  }
}