import HevyWorkoutService from './hevyWorkout';
import { UrlType, UuidType } from '../../schemas/shared/common';

export default class HevyClient {
  public workouts: HevyWorkoutService;

  constructor(baseUrl: UrlType, apiKey: UuidType) {
    this.workouts = new HevyWorkoutService(baseUrl, apiKey);
  }
}