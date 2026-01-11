import HttpClient from '../httpClient';

import { IHevyExerciseHistoryService } from '../../types/service';
import {
  GetExercisesHistory,
  GetExercisesHistorySchema,
} from '../../schemas/shared/hevy/exerciseHistory';

export default class HevyExerciseHistoryService
  extends HttpClient
  implements IHevyExerciseHistoryService
{
  async getExerciseHistory(
    templateId: string,
    start_date?: Date,
    end_date?: Date
  ): Promise<GetExercisesHistory | null> {
    let url = `/v1/exercise_history/${templateId}`;

    const params: string[] = [];

    if (start_date) {
      params.push(`start_date=${start_date.toISOString()}`);
    }

    if (end_date) {
      params.push(`end_date=${end_date.toISOString()}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    const response = await this.fetchWithAuth(url, { method: 'GET' });

    if (response) {
      const templatesResponse = GetExercisesHistorySchema.safeParse(response.data);

      if (templatesResponse.success) {
        return templatesResponse.data;
      }
    }

    return null;
  }
}
