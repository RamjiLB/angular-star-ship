import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  IStarShipForm,
  IStarShip,
  apiUrl,
  Swapi_Endpoint
} from "../models/star-wars";
import { StarWarsService } from "../service/star-wars.service";
import { map, catchError } from "rxjs/operators";
import { Observable, of, throwError } from "rxjs";

@Component({
  selector: "app-star-ship-catalogue",
  templateUrl: "./star-ship-catalogue.component.html",
  styleUrls: ["./star-ship-catalogue.component.css"]
})
export class StarShipCatalogueComponent implements OnInit {
  starShipForm: FormGroup;
  starShips$: Observable<IStarShip[]>;
  isLoading: boolean = false;
  hasData: boolean = false;
  hasError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private starWarsService: StarWarsService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): void {
    this.starShipForm = this.formBuilder.group({
      distanceToTravel: [
        "",
        [
          Validators.required,
          Validators.pattern(/^-?(0|[1-9]\d*)?$/),
          Validators.min(1)
        ]
      ]
    } as { [key in keyof IStarShipForm]: any });
  }

  getStarShips(): void {
    if (this.starShipForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.hasData = false;

    const formData: IStarShipForm = this.starShipForm.value;

    this.starShips$ = this.starWarsService.fetchStarShips().pipe(
      map((starShipList: IStarShip[]) => {
        this.isLoading = false;
        this.hasData = !!starShipList.length;

        return this.starWarsService.updateStopsRequired(
          formData.distanceToTravel,
          starShipList
        );
      }),
      catchError(error => {
        this.isLoading = false;
        this.hasError = true;
        return throwError(error);
      })
    );
  }
}
