import HevyWorkoutService from './hevyWorkouts';
import HevyRoutinesService from './hevyRoutines';

import { UrlType, UuidType } from '../../schemas/shared/common';

export default class HevyClient {
  public workouts: HevyWorkoutService;
  public routines: HevyRoutinesService;

  constructor(baseUrl: UrlType, apiKey: UuidType) {
    this.workouts = new HevyWorkoutService(baseUrl, apiKey);
    this.routines = new HevyRoutinesService(baseUrl, apiKey);
  }
}