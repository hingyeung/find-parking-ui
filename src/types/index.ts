export interface Coordinate {
  readonly latitude: number;
  readonly longitude: number;
}

export interface ApplicationState {
  currentLocation?: Coordinate;
}