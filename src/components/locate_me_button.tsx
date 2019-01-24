import React from 'react';
import { ApplicationState } from '../types';
import { connect } from "react-redux";
import { fetchCurrentLocationAndAvailableParkingsWithThunk } from '../actions';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';


type LocateMeButtonProps = {
  fetchCurrentLocation: () => void;
}

const LocateMeButton: React.FunctionComponent<LocateMeButtonProps> = (props) => {
  return (
    <button onClick={(e) => props.fetchCurrentLocation()}>click me</button>
  )
};

const mapStateToProps = (state: ApplicationState) => {
  return {};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<ApplicationState, void, AnyAction>) => ({
  // https://github.com/reduxjs/redux/issues/1676#issuecomment-215413478
  fetchCurrentLocation: () => dispatch(fetchCurrentLocationAndAvailableParkingsWithThunk())
});

export default connect(mapStateToProps, mapDispatchToProps)(LocateMeButton);