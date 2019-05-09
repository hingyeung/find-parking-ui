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
const UPDATE_MAP_LOCATION = "UPDATE_MAP_LOCATION";
const HOVER_ON_PARKING_ICON = "HOVER_ON_PARKING_ICON";
const TOGGLE_SHOW_LOADING_ZONES_ONLY = "TOGGLE_SHOW_LOADING_ZONES_ONLY";
const TOGGLE_ACCESSIBLE_MODE = "TOGGLE_ACCESSIBLE_MODE";
const RESET_CLICKED_MAP_OBJECT = "RESET_CLICKED_MAP_OBJECT";
const CLOSE_DISCLAIMER_POPUP_ALERT = "CLOSE_DISCLAIMER_POPUP_ALERT";
const CLOSE_ABOUT_POPUP_ALERT = "CLOSE_ABOUT_POPUP_ALERT";
const OPEN_ABOUT_POPUP_ALERT = "OPEN_ABOUT_POPUP_ALERT";
const CLEAR_ERROR_MESSAGE = "CLEAR_ERROR_MESSAGE";
const SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE";

export const setErrorMessage = createAction(
  SET_ERROR_MESSAGE,
  resolve => {
    return (errMsg) => resolve(errMsg);
  }
);

export const clearErrorMessage = createAction(
  CLEAR_ERROR_MESSAGE,
  resolve => {
    return () => resolve();
  }
);

export const closeDisclaimerPopupAlert = createAction(
  CLOSE_DISCLAIMER_POPUP_ALERT,
  resolve => {
    return () => resolve();
  }
);

export const openAboutPopup = createAction(
  OPEN_ABOUT_POPUP_ALERT,
  resolve => {
    return () => resolve();
  }
);

export const closeAboutPopupAlert = createAction(
  CLOSE_ABOUT_POPUP_ALERT,
  resolve => {
    return () => resolve();
  }
);

export const resetClickedMapObject = createAction(
  RESET_CLICKED_MAP_OBJECT,
  resolve => {
    return () => resolve();
  }
);

export const toggleShowLoadingZonesOnly = createAction(
  TOGGLE_SHOW_LOADING_ZONES_ONLY,
  resolve => {
    return () => resolve();
  }
);

export const toggleAccessibleMode = createAction(
  TOGGLE_ACCESSIBLE_MODE,
  resolve => {
    return () => resolve();
  }
);

export const hoverOnParkingIcon = createAction(
  HOVER_ON_PARKING_ICON,
  resolve => {
    return (isHovering: boolean) => resolve(isHovering);
  }
);

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

export const updateMapLocation = createAction(
  UPDATE_MAP_LOCATION,
  resolve => {
    return (location: Coordinate) => resolve(location)
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
      }).catch(err => {
        dispatch(setErrorMessage("Unable to contact server!"))
      })
    }).catch((err) => {
      console.error(err);
      dispatch(setErrorMessage("Unable to fetch current location!"));
    })
  }
};

// http://www.coding-ly.com/2018/11/11/typescript-redux-immutable-real-world-example/
export const fetchCurrentLocationWithThunk = () => {
  return async (dispatch: ThunkDispatch<ApplicationState, void, AnyAction>) => {
    const currentPosition = await getCurrentPosition();
    console.log('currentPosition fetched', currentPosition);
    dispatch(updateCurrentLocation(currentPosition));
    dispatch(updateMapLocation(currentPosition));
  };
};

export const fetchParkingSensorDataWithThunk = (currentLocation: Coordinate) => {
  return async (dispatch: ThunkDispatch<ApplicationState, void, AnyAction>) => {
    const parkingSensorData: any = await findAvailableParkings(currentLocation);
    dispatch(updateAvailableParkings(parkingSensorData));
  }
};