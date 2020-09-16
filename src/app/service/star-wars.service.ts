import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable, of, Subject } from "rxjs";
import {
  map,
  tap,
  retry,
  retryWhen,
  switchMap,
  flatMap,
  exhaustMap,
  distinctUntilChanged,
  catchError
} from "rxjs/operators";
import { IStarShip, apiUrl, Swapi_Endpoint } from "../models/star-wars";

@Injectable()
export class StarWarsService {
  starShipCatalogue: IStarShip[];
  nextPageUrl: string;

  constructor(private http: HttpClient) {}

  // get star ships from star wars API
  fetchStarShips(nextPageUrl?: string): Observable<IStarShip[]> {
    const apiUrlString: string = !nextPageUrl
      ? `${apiUrl}${Swapi_Endpoint.STARSHIPS}`
      : nextPageUrl.replace("http", "https");

    // reset catalogue of ships when a fresh request is made
    if (!nextPageUrl) {
      this.starShipCatalogue = [];
    }

    return this.http.get(apiUrlString).pipe(
      map(starShips => {
        const nextPageUrl: string = starShips["next"];

        // map star ship data from response to model
        this.mapStarShipResponse(starShips);

        return { nextPageUrl, results: this.starShipCatalogue };
      }),
      switchMap(starShipResponse => {
        // if there is next page available call the api again to fetch the data
        if (starShipResponse.nextPageUrl) {
          return this.fetchStarShips(starShipResponse.nextPageUrl);
        }

        // when there is no more next page return the list of ships as an observable
        return of(starShipResponse.results);
      })
    );
  }

  updateStopsRequired(
    distanceToCover: number,
    starShipList: IStarShip[]
  ): IStarShip[] {
    return starShipList.map(ship => {
      return {
        ...ship,
        stopsRequired: isNaN(ship.mileage)
          ? "NA"
          : Math.round(distanceToCover / ship.mileage)
      };
    });
  }

  private mapStarShipResponse(starShipResponse: object): void {
    starShipResponse["results"].map(ship => {
      this.starShipCatalogue.push({
        name: ship.name,
        megaLights: ship.MGLT,
        consumables: ship.consumables,
        mileage: this.calculateMileage(ship.MGLT, ship.consumables)
      });
    });
  }

  // calculates maximum standard hours the ship can travel before in need of supply
  private calculateMileage(megaLights: string, consumables: string): number {
    return +megaLights * this.convertConsumablesToStandardHours(consumables);
  }

  // converts ships consumables capacity in to standard mega light hours
  private convertConsumablesToStandardHours(consumables: string): number {
    const day = 24;
    const week = 7 * 24;
    const month = 30 * 24;
    const year = 365 * 24;

    const consumablePeriod: string[] = consumables.split(" ");
    const consumablePeriodValue: number = +consumablePeriod[0];
    const consumablePeriodType: string = consumablePeriod[1];

    switch (consumablePeriodType) {
      case "day":
      case "days": {
        return consumablePeriodValue * day;
      }

      case "week":
      case "weeks": {
        return consumablePeriodValue * week;
      }

      case "month":
      case "months": {
        return consumablePeriodValue * month;
      }

      case "year":
      case "years": {
        return consumablePeriodValue * year;
      }
    }
  }
}
