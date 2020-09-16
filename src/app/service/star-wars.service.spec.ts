import { TestBed, async, inject } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { StarWarsService } from "./star-wars.service";
import { IStarShip } from "../models/star-wars";

const starShipsResponse = {
  results: [
    {
      name: "Sentinel-class landing craft",
      model: "Sentinel-class landing craft",
      manufacturer: "Sienar Fleet Systems, Cyngus Spaceworks",
      cost_in_credits: "240000",
      length: "38",
      max_atmosphering_speed: "1000",
      crew: "5",
      passengers: "75",
      cargo_capacity: "180000",
      consumables: "1 month",
      hyperdrive_rating: "1.0",
      MGLT: "70",
      starship_class: "landing craft",
      pilots: [],
      films: ["http://swapi.dev/api/films/1/"],
      created: "2014-12-10T15:48:00.586000Z",
      edited: "2014-12-20T21:23:49.873000Z",
      url: "http://swapi.dev/api/starships/5/"
    },
    {
      name: "Republic Cruiser",
      model: "Consular-class cruiser",
      manufacturer: "Corellian Engineering Corporation",
      cost_in_credits: "unknown",
      length: "115",
      max_atmosphering_speed: "900",
      crew: "9",
      passengers: "16",
      cargo_capacity: "unknown",
      consumables: "unknown",
      hyperdrive_rating: "2.0",
      MGLT: "unknown",
      starship_class: "Space cruiser",
      pilots: [],
      films: ["http://swapi.dev/api/films/4/"],
      created: "2014-12-19T17:01:31.488000Z",
      edited: "2014-12-20T21:23:49.912000Z",
      url: "http://swapi.dev/api/starships/31/"
    }
  ]
};

const alteredStarShipResponse = [
  {
    name: "Sentinel-class landing craft",
    consumables: "1 month",
    megaLights: "70",
    mileage: 50400
  },
  {
    name: "Republic Cruiser",
    consumables: "unknown",
    megaLights: "unknown",
    mileage: NaN
  }
];

const mockWithStops: IStarShip[] = [
  {
    name: "Sentinel-class landing craft",
    consumables: "1 month",
    megaLights: "70",
    mileage: 50400,
    stopsRequired: 2
  },
  {
    name: "Republic Cruiser",
    consumables: "unknown",
    megaLights: "unknown",
    mileage: NaN,
    stopsRequired: "NA"
  }
];

const mockWithoutStops: IStarShip[] = [
  {
    name: "Sentinel-class landing craft",
    consumables: "1 month",
    megaLights: "70",
    mileage: 50400
  },
  {
    name: "Republic Cruiser",
    consumables: "unknown",
    megaLights: "unknown",
    mileage: NaN
  }
];

describe("GIVEN StarWarsService", () => {
  let starWarsService: StarWarsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StarWarsService]
    });

    starWarsService = TestBed.get(StarWarsService);
    httpMock = TestBed.get(HttpTestingController);
  });

  describe("WHEN user tries to fetchStarShips", () => {
    it("THEN should fetch star ships as an Observable", async(
      inject(
        [HttpTestingController, StarWarsService],
        (
          httpClient: HttpTestingController,
          starWarsService: StarWarsService
        ) => {
          spyOn(starWarsService, "mapStarShipResponse").and.callThrough();
          starWarsService.fetchStarShips().subscribe((ships: any) => {
            expect(ships).toEqual(alteredStarShipResponse);
          });

          let req = httpMock.expectOne("https://swapi.dev/api/starships/");
          expect(req.request.method).toBe("GET");

          req.flush(starShipsResponse);
          httpMock.verify();
        }
      )
    ));
  });

  describe("WHEN updateStopsRequired is called", () => {
    it("THEN stops required is calculated and updated properly as per data", () => {
      const result = starWarsService.updateStopsRequired(
        111111,
        mockWithoutStops
      );

      expect(result).toEqual(mockWithStops);
    });
  });
});
