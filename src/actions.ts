import { ApplicationState, ClickedMapObject, Coordinate, ParkingSpace } from './types';
import { AnyAction } from 'redux';
import { getCurrentPosition } from './services/location_service';
import { ThunkDispatch } from 'redux-thunk';
import { createAction } from 'typesafe-actions';
import { findAvailableParkings } from "./services/parking_sensor_service";
import { ViewState } from 'react-map-gl';

const UNDEFINED_LOCATION: Coordinate = {
  latitude: 9999,
  longitude: 9999
};

const UPDATE_CURRENT_LOCATION = 'UPDATE_CURRENT_LOCATION';
const UPDATE_AVAILABLE_PARKINGS = "UPDATE_AVAILABLE_PARKINGS";
const CLICK_PARKING_SPACE = "CLICK_PARKING_SPACE";
const UPDATE_MAP_VIEW_STATE = "UPDATE_MAP_VIEW_STATE";

export const clickParkingSpace = createAction(
  CLICK_PARKING_SPACE,
  resolve => {
    return (clickedMapObj: ClickedMapObject) => resolve(clickedMapObj);
  }
);

export const updateMapViewState = createAction(
  UPDATE_MAP_VIEW_STATE,
  resolve => {
    return (viewState: ViewState) => resolve(viewState)
  }
);

export const updateCurrentLocation = createAction(
  UPDATE_CURRENT_LOCATION,
  resolve => {
    return (coordinate: Coordinate) => resolve(coordinate);
  }
);

export const updateAvailableParkings = createAction(
  UPDATE_AVAILABLE_PARKINGS,
  resolve => {
    return (parkingSpaces: ParkingSpace[]) => resolve(parkingSpaces);
  }
);

export const fetchCurrentLocationAndAvailableParkingsWithThunk = () => {
  return async (dispatch: ThunkDispatch<ApplicationState, void, AnyAction>, getState: () => ApplicationState) => {
    return dispatch(fetchCurrentLocationWithThunk()).then(() => {
      const currentLocation = getState().currentLocation || UNDEFINED_LOCATION;
      dispatch(fetchParkingSensorDataWithThunk(currentLocation)).then(() => {
      })
    })
  }
};

// http://www.coding-ly.com/2018/11/11/typescript-redux-immutable-real-world-example/
export const fetchCurrentLocationWithThunk = () => {
  return async (dispatch: ThunkDispatch<ApplicationState, void, AnyAction>) => {
    const currentPosition = await getCurrentPosition();
    console.log('currentPosition fetched', currentPosition);
    dispatch(updateCurrentLocation(currentPosition));
  };
};

export const fetchParkingSensorDataWithThunk = (currentLocation: Coordinate) => {
  return async (dispatch: ThunkDispatch<ApplicationState, void, AnyAction>) => {
    const parkingSensorData: any = await findAvailableParkings(currentLocation);
    dispatch(updateAvailableParkings(parkingSensorData));
  }
};