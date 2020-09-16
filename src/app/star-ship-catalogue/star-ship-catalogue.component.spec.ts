import { TestBed, ComponentFixture } from "@angular/core/testing";
import { StarShipCatalogueComponent } from "./star-ship-catalogue.component";
import { By } from "@angular/platform-browser";
import { StarWarsService } from "../service/star-wars.service";
import { of, throwError } from "rxjs";
import { IStarShip } from "../models/star-wars";
import { FormBuilder } from "@angular/forms";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ChangeDetectionStrategy } from "@angular/compiler/src/core";

const data: IStarShip[] = [
  {
    consumables: "1 week",
    megaLights: "100",
    name: "X-wing",
    mileage: 11111
  }
];

const dataWithStops: IStarShip[] = [
  {
    consumables: "1 week",
    megaLights: "100",
    name: "X-wing",
    mileage: 11111,
    stopsRequired: 1
  }
];

describe("GIVEN StarShipCatalogueComponent", () => {
  let component: StarShipCatalogueComponent;
  let fixture: ComponentFixture<StarShipCatalogueComponent>;
  let starWarsService: StarWarsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [StarShipCatalogueComponent],
      providers: [
        {
          provide: StarWarsService,
          useValue: {
            fetchStarShips: () => of(data),
            updateStopsRequired: () => dataWithStops
          }
        },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(StarShipCatalogueComponent, {
        set: { changeDetection: ChangeDetectionStrategy.OnPush }
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StarShipCatalogueComponent);
    component = fixture.componentInstance;

    starWarsService = TestBed.get(StarWarsService);

    fixture.detectChanges();
  });

  it("THEN should create", () => {
    expect(component).toBeTruthy();
  });

  describe("GIVEN user has not input any value in the form", () => {
    it("THEN form invalid when distance is empty", () => {
      expect(component.starShipForm.valid).toBeFalsy();
    });
  });

  describe("GIVEN user has input some value in the form", () => {
    describe("AND if the value is a string", () => {
      it("THEN form should be invalid and formControl has wrong pattern error", () => {
        let distance = component.starShipForm.controls["distanceToTravel"];

        distance.setValue("wer");

        expect(component.starShipForm.valid).toBeFalsy();
        expect(distance.valid).toBeFalsy();
        expect(distance.hasError("pattern")).toBeTruthy();
      });
    });

    describe("AND if the value is a number 0", () => {
      it("THEN form should be invalid and formControl has minimum value error", () => {
        let distance = component.starShipForm.controls["distanceToTravel"];

        distance.setValue(0);

        expect(component.starShipForm.valid).toBeFalsy();
        expect(distance.valid).toBeFalsy();
        expect(distance.hasError("min")).toBeTruthy();
      });
    });

    describe("AND if the value is a number greater than 0", () => {
      it("THEN form and formControl should be valid", () => {
        let distance = component.starShipForm.controls["distanceToTravel"];

        distance.setValue(1000);

        expect(distance.valid).toBeTruthy();
        expect(component.starShipForm.valid).toBeTruthy();
      });
    });
  });

  describe("WHEN user requests for Star Ships catalogue", () => {
    describe("AND service provides successful response", () => {
      it("THEN we should get the data in the component", () => {
        spyOn(starWarsService, "fetchStarShips").and.callThrough();

        let distance = component.starShipForm.controls["distanceToTravel"];

        distance.setValue(111111);

        component.getStarShips();

        fixture.detectChanges();

        component.starShips$.subscribe(response => {
          expect(response).toEqual(dataWithStops);
        });

        expect(component.hasData).toBeTruthy();
        expect(component.hasError).toBeFalsy();
      });
    });

    describe("AND service provides error response", () => {
      it("THEN we should see error in the component", () => {
        spyOn(starWarsService, "fetchStarShips").and.returnValue(
          throwError("Error")
        );

        let distance = component.starShipForm.controls["distanceToTravel"];

        distance.setValue(111111);

        component.getStarShips();

        fixture.detectChanges();

        component.starShips$.subscribe(
          response => {},
          error => {
            expect(error).toBeTruthy();
          }
        );

        expect(component.hasError).toBeTruthy();
        expect(component.hasData).toBeFalsy();
      });
    });
  });
});
