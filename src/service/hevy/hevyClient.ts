import HevyWorkoutService from './hevyWorkouts';
import HevyRoutinesService from './hevyRoutines';
import HevyExerciseTemplatesService from './hevyExerciseTemplates';
import HevyExerciseHistoryService from './hevyExerciseHistory';

import { UrlType, UuidType } from '../../schemas/shared/common';

export default class HevyClient {
  public workouts: HevyWorkoutService;
  public routines: HevyRoutinesService;
  public exerciseTemplates: HevyExerciseTemplatesService;
  public exerciseHistory: HevyExerciseHistoryService;

  constructor(apiKey: UuidType) {
    const baseUrl: UrlType = 'https://api.hevyapp.com/v1/' as UrlType;

    this.workouts = new HevyWorkoutService(baseUrl, apiKey);
    this.routines = new HevyRoutinesService(baseUrl, apiKey);
    this.exerciseTemplates = new HevyExerciseTemplatesService(baseUrl, apiKey);
    this.exerciseHistory = new HevyExerciseHistoryService(baseUrl, apiKey);
  }
}
