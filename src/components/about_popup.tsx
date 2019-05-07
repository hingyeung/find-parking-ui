import { ApplicationState } from '../types';
import { Dispatch } from 'redux';
import { closeAboutPopupAlert } from '../actions';
import React from 'react';
import { connect } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText as MuiDialogContentText, DialogTitle } from '@material-ui/core';
import { GithubIcon } from './svg_icons';
import styled from 'styled-components';
import Author from './author';
import Link from '@material-ui/core/Link';

type AboutPopupProps = {
  closePopupAlert: () => void;
  showPopupAlert: boolean;
}

const DialogContentText = styled(MuiDialogContentText)`
  && { margin-bottom: 1rem; }
`;

const AboutPopup: React.FunctionComponent<AboutPopupProps> = (props) => {
  return (
    <Dialog open={props.showPopupAlert}>
      <DialogTitle>About</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This website helps you find on-street parkings in Melbourne CBD using real time parking bay
          sensor data provided by <Link href="https://data.melbourne.vic.gov.au/" rel="nofollow" target="_blank">City of Melbourne Open Data Platform</Link>.
        </DialogContentText>
        <DialogContentText>
          The parking bay sensor data on this website updates every 2 minutes between 6am to 11pm everyday. Sensor data is updated at reduced frequency between 11pm to 6am. Parking Sensors are not operational on Public Holidays. Parking Sensors will show car parks as vacant when blocked by construction zones.
        </DialogContentText>
        <Author/>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.closePopupAlert} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
};

const mapStateToProps = (state: ApplicationState) => {
  return {
    showPopupAlert: state.showAboutPopup
  }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    closePopupAlert: () => {
      dispatch(closeAboutPopupAlert())
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(AboutPopup);
