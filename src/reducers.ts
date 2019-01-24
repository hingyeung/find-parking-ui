import { clickParkingSpace, updateAvailableParkings, updateCurrentLocation } from './actions';
import { ApplicationState } from './types';
import { getType } from "typesafe-actions";

const initialState: ApplicationState = {
  parkingSensorData: [],
  mapStyle: 'mapbox://styles/mapbox/light-v9'
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
    default:
      console.log('Unknown action', action.type);
      return state;
  }
}

export default findParkingApp;