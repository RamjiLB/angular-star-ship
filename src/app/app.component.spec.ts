import { TestBed, ComponentFixture } from "@angular/core/testing";
import { AppComponent } from "./app.component";
// https://angular.io/api/platform-browser/By
import { By } from "@angular/platform-browser";

describe("GIVEN AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("THEN should create", () => {
    expect(component).toBeTruthy();
  });
});
