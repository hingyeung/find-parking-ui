export type Coordinate = {
  latitude: number;
  longitude: number;
}

export type ApplicationState = {
  currentLocation?: Coordinate;
  parkingSensorData: any[];
  mapStyle: string;
  clickedMapObject?: ClickedMapObject;
}

export type ParkingSpace = {
  coordinate: Coordinate;
  id: string;
}

export type APIResponseParkingSpace = {
  coordinate: {
    lat: string;
    lng: string;
  }
  bay_id: string;
}

export type ClickedMapObject = {
  object: any;
  pointerX: number;
  pointerY: number;
}