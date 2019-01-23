export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface ApplicationState {
  currentLocation?: Coordinate;
  parkingSensorData: any[];
  mapStyle: string;
}

export interface ParkingSpace {
  coordinate: Coordinate;
  id: string;
}

export interface APIResponseParkingSpace {
  coordinate: {
    lat: string;
    lng: string;
  }
  bay_id: string;
}