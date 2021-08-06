import {TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {WeatherService} from './weather.service';
import {WeatherForecast} from './weatherforecast';
import {Pact, Matchers} from '@pact-foundation/pact';
import { PactWeb } from '@pact-foundation/pact-web';
// import { string } from '@pact-foundation/pact/src/dsl/matchers';
// const { Pact } = require("@pact-foundation/pact")

describe('WeatherService', () => {

  /**
   * Angular setup
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        WeatherService
      ],
    });
  });

  const provider = new Pact({
    consumer: 'angular-frontend',
    provider: 'producer',
    port: 1234,
    host: '127.0.0.1',
  });

  afterAll(async () => {
    await provider.finalize();
  })

  describe('Get Weatherforecast', () => {

    const expectedForecasts: Array<WeatherForecast> = [];

    beforeAll(async () => {
      const test = await provider.setup();
      console.log(test);
      await provider.addInteraction({
        state: `the weather API returns the forecast for the next 5 days`,
        uponReceiving: 'a request to get the forecast',
        withRequest: {
          method: 'GET',
          path: '/weatherforecast',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        willRespondWith: {
          status: 200,
          body: Matchers.eachLike({
              date: Date,
              temperatureC: Number,
              temperatureF: Number,
              summary: "",
          },{min:5}),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      })
    })

    afterAll(async () => {
      await provider.verify();
    })

    // beforeAll((done) => {
    //   provider.addInteraction({
    //     state: `the weather API returns the forecast for the next 5 days`,
    //     uponReceiving: 'a request to get the forecast',
    //     withRequest: {
    //       method: 'GET',
    //       path: '/weatherforecast',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       }
    //     },
    //     willRespondWith: {
    //       status: 200,
    //       body: Matchers.eachLike({
    //           date: Date,
    //           temperatureC: Number,
    //           temperatureF: Number,
    //           summary: "",
    //       },{min:5}),
    //       headers: {
    //         'Content-Type': 'application/json'
    //       }
    //     }
    //   }).then(done, error => done.fail(error));
    // });

    it('should get the next 5 days', (done) => {
      const weatherServicer: WeatherService = TestBed.inject(WeatherService);
      weatherServicer.get2().subscribe(response => {
        expect(response.length).toBe(5);
        response.forEach(x => expect(x.Summary.length).toBeGreaterThan(0));
        done();
      }, error => {
        done.fail(error);
      });
    });
  });
});
