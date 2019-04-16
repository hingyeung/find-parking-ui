import { ViewState } from 'react-map-gl';

export type Coordinate = {
  latitude: number;
  longitude: number;
}

export type ApplicationState = {
  currentLocation?: Coordinate;
  parkingSensorData: any[];
  mapStyle: string;
  clickedMapObject?: ClickedMapObject;
  mapViewState: ViewState;
  hoveringOnParkingIcon: boolean;
}

export type ParkingSpace = {
  coordinate: Coordinate;
  id: string;
  currentRestriction?: APIResponseParkingRestriction;
}

export type APIResponseParkingRestriction = {
  readonly description: string;
  readonly duration: number;
  readonly disabilityExt?: number;
  readonly effectiveOnPH: boolean;
  readonly exemption?: string;
  readonly typeDesc: string;
  readonly fromDay: number;
  readonly toDay: number;
  readonly startTime: string;
  readonly endTime: string;
};

export type APIResponseParkingSpace = {
  location: {
    coordinates: [string, string]
  };
  bay_id: string;
  restrictions: APIResponseParkingRestriction[];
}

export type ClickedMapObject = {
  object: any;
  pointerX: number;
  pointerY: number;
}

export type MapObjectPayload = {
  position: [number, number];
}

export type ClickedMapObjectPayload = {
  bayId: string;
  position: [number, number];
  currentRestriction?: APIResponseParkingRestriction;
  index: number;
}