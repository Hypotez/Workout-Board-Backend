import HttpClient from '../httpClient';

import { IHevyExerciseTemplatesService } from '../../types/service';
import { GetExerciseTemplate, GetExerciseTemplates, GetExerciseTemplateSchema, GetExerciseTemplatesSchema } from '../../schemas/hevy/exerciseTemplates';
import { UuidType } from '../../schemas/shared/common';

export default class HevyExerciseTemplatesService extends HttpClient implements IHevyExerciseTemplatesService {
  async getExerciseTemplates(page: number, pageSize: number): Promise<GetExerciseTemplates | null> {
    const response = await this.fetchWithAuth(`/v1/exercise_templates?page=${page}&pageSize=${pageSize}`, { method: "GET" });

    if (response) {
        const templatesResponse = GetExerciseTemplatesSchema.safeParse(response.data)

        if (templatesResponse.success) {
            return templatesResponse.data
        }
    }

    return null
  }

    async getExerciseTemplateById(templateId: string): Promise<GetExerciseTemplate | null> {
      const response = await this.fetchWithAuth(`/v1/exercise_templates/${templateId}`, { method: "GET" });

      if (response) {
          const templateResponse = GetExerciseTemplateSchema.safeParse(response.data)

          if (templateResponse.success) {
              return templateResponse.data
          }
      }

      return null
  }
}