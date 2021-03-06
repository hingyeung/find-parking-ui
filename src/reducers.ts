import {
  clearErrorMessage,
  clickParkingSpace, closeAboutPopupAlert, closeDisclaimerPopupAlert,
  hoverOnParkingIcon, openAboutPopup,
  resetClickedMapObject, setErrorMessage,
  toggleAccessibleMode,
  toggleShowLoadingZonesOnly,
  updateAvailableParkings,
  updateCurrentLocation,
  updateMapLocation,
  updateMapViewState,
  isFetchingParkingData
} from './actions';
import { ApplicationState } from './types';
import { getType } from "typesafe-actions";

const INITIAL_VIEW_STATE = {
  longitude: 144.96332,
  latitude: -37.814,
  zoom: 17,
  minZoom: 5,
  maxZoom: 30,
  pitch: 0,
  bearing: 0
};

const initialState: ApplicationState = {
  parkingSensorData: [],
  mapStyle: 'mapbox://styles/mapbox/light-v9',
  mapViewState: INITIAL_VIEW_STATE,
  hoveringOnParkingIcon: false,
  inAccessibleParkingMode: false,
  showLoadingZonesOnly: false,
  showDisclaimerPopup: true,
  showAboutPopup: false,
  isLoading: false
};

function findParkingApp(state: ApplicationState = initialState, action: any) {
  console.debug('ACTION', action.type, action.payload);
  switch (action.type) {
    case getType(updateCurrentLocation):
      return Object.assign({}, state, {currentLocation: action.payload});
    case getType(updateAvailableParkings):
      return Object.assign({}, state, {parkingSensorData: action.payload});
    case getType(clickParkingSpace):
      return Object.assign({}, state, {clickedMapObject: action.payload});
    case getType(updateMapViewState):
      return Object.assign({}, state, {mapViewState: action.payload});
    case getType(updateMapLocation):
      return Object.assign({}, state, {
        mapViewState: {
          ...state.mapViewState,
          latitude: action.payload.latitude,
          longitude: action.payload.longitude
        }
      });
    case getType(hoverOnParkingIcon):
      return Object.assign({}, state, {hoveringOnParkingIcon: action.payload});
    case getType(toggleShowLoadingZonesOnly):
      return Object.assign({}, state, {showLoadingZonesOnly: !state.showLoadingZonesOnly});
    case getType(toggleAccessibleMode):
      return Object.assign({}, state, {inAccessibleParkingMode: !state.inAccessibleParkingMode});
    case getType(resetClickedMapObject):
      return Object.assign({}, state, {clickedMapObject: undefined});
    case getType(closeDisclaimerPopupAlert):
      return Object.assign({}, state, {showDisclaimerPopup: false});
    case getType(openAboutPopup):
      return Object.assign({}, state, {showAboutPopup: true});
    case getType(closeAboutPopupAlert):
      return Object.assign({}, state, {showAboutPopup: false});
    case getType(setErrorMessage):
      return Object.assign({}, state, {errorMessage: action.payload});
    case getType(clearErrorMessage):
      return Object.assign({}, state, {errorMessage: undefined});
    case getType(isFetchingParkingData):
      return Object.assign({}, state, {isLoading: action.payload});
    default:
      console.log('Unknown action', action.type);
      return state;
  }
}

export default findParkingApp;