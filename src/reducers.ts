import React from 'react';
import { getCurrentPosition } from './services/location_service';
import { UPDATE_CURRENT_LOCATION } from './actions';
import parkingSensorData from  './data/parking_sensor_data.json'
import { ApplicationState } from './types';
import { combineReducers } from 'redux';

const initialState: ApplicationState = {
  parkingSensorData: processData(),
  mapStyle: 'mapbox://styles/mapbox/light-v9'
};

function processData() {
  return parkingSensorData.map((parking) => {
    return {
      position: [Number(parking.coordinates.lng), Number(parking.coordinates.lat)],
      bayId: parking.bay_id
    }
  });
}

function findParkingApp(state: ApplicationState = initialState, action: any) {
  switch (action.type) {
    case UPDATE_CURRENT_LOCATION:
      return Object.assign({}, state, {currentLocation: action.payload});
    default:
      return state;
  }
}

export default findParkingApp;