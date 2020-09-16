import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { StarShipCatalogueComponent } from "./star-ship-catalogue/star-ship-catalogue.component";
import { StarWarsService } from "./service/star-wars.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";

@NgModule({
  imports: [BrowserModule, HttpClientModule, ReactiveFormsModule],
  declarations: [AppComponent, StarShipCatalogueComponent],
  bootstrap: [AppComponent],
  providers: [StarWarsService]
})
export class AppModule {}
