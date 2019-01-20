import React from 'react';
import { getCurrentPosition } from './services/location_service';
import { UPDATE_CURRENT_LOCATION } from './actions';

const initialState = {};

function findParkingApp(state = initialState, action: any) {
  if (typeof state === 'undefined') {
    return initialState;
  }

  // if action === update_current_location (may need thunk for async operation)
  // async function getCurrentLocation(e: React.MouseEvent<HTMLElement>) {
  //   const currentPosition = await getCurrentPosition();
  //   console.log(currentPosition);
  // }
  switch (action.type) {
    case UPDATE_CURRENT_LOCATION:
      return { state, currentLocation: action.payload };
    default:
      return state;
  }
}

export default findParkingApp;