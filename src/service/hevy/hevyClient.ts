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

  constructor() {
    const baseUrl: UrlType = 'https://api.hevyapp.com/v1/' as UrlType;

    this.workouts = new HevyWorkoutService(baseUrl);
    this.routines = new HevyRoutinesService(baseUrl);
    this.exerciseTemplates = new HevyExerciseTemplatesService(baseUrl);
    this.exerciseHistory = new HevyExerciseHistoryService(baseUrl);
  }
}
