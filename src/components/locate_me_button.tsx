import React from 'react';
import { ApplicationState } from '../types';
import { connect } from "react-redux";
import { fetchCurrentLocationAndAvailableParkingsWithThunk } from '../actions';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import Fab from '@material-ui/core/Fab';
import MyLocationIcon from '@material-ui/icons/MyLocation';


type LocateMeButtonProps = {
  fetchCurrentLocation: () => void;
}

const LocateMeButton: React.FunctionComponent<LocateMeButtonProps & React.HTMLProps<HTMLButtonElement>> = (props) => {
  return (
    <Fab color="primary" aria-label="Locate me" onClick={(e) => props.fetchCurrentLocation()}>
      <MyLocationIcon/>
    </Fab>
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