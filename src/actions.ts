import { ApplicationState, Coordinate } from './types';
import { AnyAction } from 'redux';
import { getCurrentPosition } from './services/location_service';
import { ThunkDispatch } from 'redux-thunk';
import { createAction } from 'typesafe-actions';

export const UPDATE_CURRENT_LOCATION = 'UPDATE_CURRENT_LOCATION';
export const updateCurrentLocation = createAction(
  UPDATE_CURRENT_LOCATION,
  resolve => {
    return (coordinate: Coordinate) => resolve(coordinate);
  }
);

// http://www.coding-ly.com/2018/11/11/typescript-redux-immutable-real-world-example/
export const fetchCurrentLocationWithThunk = () => {
  return async (dispatch: ThunkDispatch<ApplicationState, void, AnyAction>) => {
    const currentPosition = await getCurrentPosition();
    console.log(currentPosition);
    dispatch(updateCurrentLocation(currentPosition));
  };
};
