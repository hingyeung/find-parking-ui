import { UPDATE_AVAILABLE_PARKINGS, UPDATE_CURRENT_LOCATION } from './actions';
import { ApplicationState } from './types';

const initialState: ApplicationState = {
  parkingSensorData: [],
  mapStyle: 'mapbox://styles/mapbox/light-v9'
};

function findParkingApp(state: ApplicationState = initialState, action: any) {
  console.debug('ACTION', action.type, action.payload);
  switch (action.type) {
    case UPDATE_CURRENT_LOCATION:
      return Object.assign({}, state, {currentLocation: action.payload});
    case UPDATE_AVAILABLE_PARKINGS:
      return Object.assign({}, state, {parkingSensorData: action.payload});
    default:
      console.log('Unknown action', action.type);
      return state;
  }
}

export default findParkingApp;