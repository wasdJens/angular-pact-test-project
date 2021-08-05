import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {WeatherForecast} from './weatherforecast';
import {Injectable} from '@angular/core';
import {
  BehaviorSubject,
  ReplaySubject,
  combineLatest,
  Observable,
  of,
  forkJoin,
} from 'rxjs';

@Injectable()
export class WeatherService {

  private BASE_URL = '/weatherforecast';

  constructor(private httpClient: HttpClient, private bearerToken: string) {
  }

  /**
   * Calls the backend to load Weatherforecasts .
   * @param {number} days for how many days we want to get forecasts.
   * @returns {Observable<Array<WeatherForecast>>} Observable of the WeatherForecast.
   */
  get2(days: number = 0): Observable<Array<WeatherForecast>> {

    let params = days === 0
    ? ``
    : `?days=${days}`;

    return this.httpClient.get<Array<WeatherForecast>>(`${this.BASE_URL}${params}`);
  }
}
