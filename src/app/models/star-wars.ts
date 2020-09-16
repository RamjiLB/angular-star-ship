export const apiUrl = "https://swapi.dev/api/";

export enum Swapi_Endpoint {
  STARSHIPS = "starships/"
}

export interface IStarShip {
  // name of the star ship
  name: string;

  // mega lights the star ship can travel within a standard hour
  megaLights: string;

  // the maximum length of time that this starship can provide consumables for its entire crew without having to resupply
  consumables: string;

  // number of standard megalight hours the ship can travel before need of re supply
  mileage: number;

  // number of re supply stops required to go a specific distance
  // note: added it so it can be filled based on which component uses this. For example, tomorrow if we are charting a course between two planets, then once we in that case we retrive the ship data and pass it on to the course chrating component. In charting component we can calculate the stops required, as the distance is something unique based on the use case of the ship.
  stopsRequired?: string | number;
}

export interface IStarShipForm {
  // distance you want to cover in the star ship
  distanceToTravel: number;
}
