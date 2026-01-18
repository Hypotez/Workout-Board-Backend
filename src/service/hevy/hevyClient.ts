import HevyWorkoutService from './hevyWorkouts';
import HevyRoutinesService from './hevyRoutines';
import HevyExerciseTemplatesService from './hevyExerciseTemplates';
import HevyExerciseHistoryService from './hevyExerciseHistory';

import { UrlType } from '../../schemas/shared/common';

export default class HevyClient {
  public workouts: HevyWorkoutService;
  public routines: HevyRoutinesService;
  public exerciseTemplates: HevyExerciseTemplatesService;
  public exerciseHistory: HevyExerciseHistoryService;

  constructor(apiKey?: string) {
    const baseUrl: UrlType = 'https://api.hevyapp.com' as UrlType;

    this.workouts = new HevyWorkoutService(baseUrl, apiKey);
    this.routines = new HevyRoutinesService(baseUrl, apiKey);
    this.exerciseTemplates = new HevyExerciseTemplatesService(baseUrl, apiKey);
    this.exerciseHistory = new HevyExerciseHistoryService(baseUrl, apiKey);
  }

  public setApiKey(apiKey?: string) {
    this.workouts.setApiKey(apiKey);
    this.routines.setApiKey(apiKey);
    this.exerciseTemplates.setApiKey(apiKey);
    this.exerciseHistory.setApiKey(apiKey);
  }
}
