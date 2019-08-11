import React from 'react';
import QueryProgressBar from './progress_bar';
import LoadingZoneIcon from '@material-ui/icons/LocalShipping';
import AccessibleIcon from '@material-ui/icons/Accessible';
import ContactIcon from '@material-ui/icons/ContactSupport';
import { AppBar, Hidden, Typography, IconButton, Toolbar } from '@material-ui/core';
import styled from 'styled-components';
import { ApplicationState } from '../types';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {
  openAboutPopup,
  resetClickedMapObject,
  toggleAccessibleMode,
  toggleShowLoadingZonesOnly,
} from "../actions";

interface IParkingMapAppBarProps {
  inAccessibleParkingMode: boolean;
  showLoadingZonesOnly: boolean;
  showAboutPopup: () => void;
  toggleAccessibleMode: () => void;
  toggleShowLoadingZonesOnly: () => void;
}

const AboutIconButton = styled(IconButton)`
  && {
    color: #EEE;
  }
`;

const StyledTitleWrapper = styled('div')`
  flex-grow: 1;
`;

const StyledToolbar = styled(Toolbar)`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const ToggleIconButton = styled(IconButton)`
// https://medium.com/sipios/use-styled-components-with-material-ui-react-e0759f9a15ce
  && {
    ${(props: ToggleIconButtonProps) => {
    if (props.selected) {
      return `
        color: white;
        `
      } else {
        return `
          color: rgba(255, 255, 255, 0.2);
        `
      }
    }}
  }
`;

type ToggleIconButtonProps = {
  selected: boolean;
};

const ParkingMapAppBar: React.FunctionComponent<IParkingMapAppBarProps> = (props) => {
  return (
    <div>
    <AppBar position="fixed" color="primary">
          <StyledToolbar>
            <StyledTitleWrapper>
              <Typography component="h1" variant="h5" color="inherit">
                Melbourne CBD On-street Parking Finder
              </Typography>
              <Typography component="h2" variant="subtitle2" color="inherit">
                <Hidden xsDown>Find available on-street parking spaces in Melbourne CBD</Hidden>
              </Typography>
            </StyledTitleWrapper>
            <ToggleIconButton selected={props.inAccessibleParkingMode} onClick={props.toggleAccessibleMode}>
              <AccessibleIcon/>
            </ToggleIconButton>
            <ToggleIconButton selected={props.showLoadingZonesOnly} onClick={props.toggleShowLoadingZonesOnly}>
              <LoadingZoneIcon/>
            </ToggleIconButton>
            <AboutIconButton onClick={props.showAboutPopup}>
              <ContactIcon/>
            </AboutIconButton>
          </StyledToolbar>
          <QueryProgressBar/>
        </AppBar>
        </div>
  );
};

const mapStateToProps = (state: ApplicationState) => {
  return {
    inAccessibleParkingMode: state.inAccessibleParkingMode,
    showLoadingZonesOnly: state.showLoadingZonesOnly
  }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    toggleShowLoadingZonesOnly: () => {
      dispatch(toggleShowLoadingZonesOnly());
    },
    showAboutPopup: () => {
      dispatch(openAboutPopup());
    },
    toggleAccessibleMode: () => {
      dispatch(toggleAccessibleMode());
      dispatch(resetClickedMapObject());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ParkingMapAppBar);