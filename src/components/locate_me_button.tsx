import React from 'react';
import { ApplicationState } from '../types';
import { connect } from "react-redux";
import { fetchCurrentLocationWithThunk } from '../actions';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';


export interface LocateMeButtonProps {
  fetchCurrentLocation: () => void;
}

const LocateMeButton: React.FunctionComponent<LocateMeButtonProps> = (props) => {
  return (
    <button onClick={(e) => props.fetchCurrentLocation()}>click me</button>
  )
};

const mapStateToProps = (state: ApplicationState) => {
};

const mapDispatchToProps = (dispatch: ThunkDispatch<ApplicationState, void, AnyAction>) => ({
  fetchCurrentLocation: () => dispatch(fetchCurrentLocationWithThunk())
});

export default connect(mapStateToProps, mapDispatchToProps)(LocateMeButton);