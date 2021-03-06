import React from "react";
import { ApplicationState, ClickedMapObject, Coordinate, ParkingRestriction } from "../types";
import { connect } from "react-redux";
import { Paper, Typography } from '@material-ui/core';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import ParkingSign, { ParkingSignType } from './parking_sign';
import DirectionButton from './direction_button';
import { Dispatch } from 'redux';
import { resetClickedMapObject } from '../actions';

const PaperSC = styled(Paper)`
  padding: 8px;
`;

const Title = styled('div')`
  text-align: center;
  border-bottom: rgba(0, 0, 0, 0.12) solid 1px;
  .close-button {
    top: 0;
    right: 0;
    position: absolute;
  }
`;

const InfoPanel = styled('div')`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  flex-direction: column;
  @media (min-width: 420px) {
    flex-direction: row;
  }
`;

const LeftPanel = styled('div')`
  flex-grow: 1;
  flex-basis: 25%
`;

const RightPanel = styled('div')`
  flex-grow: 2;
  text-align: center;
  margin: 0.5rem 0;
`;

type DirectionPanelProps = {
  clickedMapObject?: ClickedMapObject,
  originCoordinate?: Coordinate,
  inAccessibleParkingMode: boolean,
  onClose: () => void
};

const buildDirectionButton = (originCoordinate: Coordinate, clickedMapObject: ClickedMapObject) => {
  const originLat = originCoordinate.latitude,
    originLng = originCoordinate.longitude,
    destLat = clickedMapObject.object.position[1],
    destLng = clickedMapObject.object.position[0],
    directionLinkUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;

  return (
    <DirectionButton directionLink={directionLinkUrl}/>
  )
};

const currentRestrictionExists = (clickedMapObject: ClickedMapObject) => {
  return clickedMapObject.object && clickedMapObject.object.currentRestriction;
};

const convertHHMMSSToHHMM = (hhmmss: string): string => {
  const hhmmMatched = hhmmss.match(/(\d{1,2}:\d{1,2}):\d{1,2}/);
  return hhmmMatched ? hhmmMatched[1] : hhmmss;
};

const getSignType = (parkingRestriction: ParkingRestriction, inAccessibleParkingMode: boolean) => {
  if (parkingRestriction.isDisabledOnly ||
    (inAccessibleParkingMode && parkingRestriction.duration !== parkingRestriction.disabilityDuration)) {
    return ParkingSignType.DISABLED_ONLY_SIGN_TYPE;
  }
  if (parkingRestriction.isLoadingZone) { return ParkingSignType.LOADING_ZONE_SIGN_TYPE; }

  return ParkingSignType.NORMAL_PARKING_SIGN_TYPE;
};

const ParkingInfoPanel: React.FunctionComponent<DirectionPanelProps & React.HTMLProps<HTMLDivElement>> = (props) => {
  if (! props.clickedMapObject) {
    return <div/>
  }

  let duration, signType, parkingSignTimeRangeDesc;
  if (currentRestrictionExists(props.clickedMapObject)) {
    const startTimeInHHMM = convertHHMMSSToHHMM(props.clickedMapObject.object.currentRestriction.startTime);
    const endTimeInHHMM = convertHHMMSSToHHMM(props.clickedMapObject.object.currentRestriction.endTime);
    parkingSignTimeRangeDesc = `${startTimeInHHMM} - ${endTimeInHHMM}`;
    duration = props.clickedMapObject.object.currentRestriction.displayDuration;
    signType = getSignType(props.clickedMapObject.object.currentRestriction, props.inAccessibleParkingMode);
  } else {
    duration = 'Unknown Restriction';
  }

  return (
    <PaperSC className={props.className}>
      <Title>
        <Typography variant="h6" inline>
          {props.clickedMapObject.object.stMarkerId}
        </Typography>
        <IconButton className="close-button" aria-label="Close" onClick={props.onClose}>
          <CloseIcon/>
        </IconButton>
      </Title>
      <InfoPanel>
        <LeftPanel>
          <ParkingSign signType={signType} minutes={duration} timeRangeDesc={parkingSignTimeRangeDesc}/>
        </LeftPanel>
        <RightPanel>
          {props.originCoordinate &&
            props.clickedMapObject &&
            buildDirectionButton(props.originCoordinate, props.clickedMapObject)}
        </RightPanel>
      </InfoPanel>
    </PaperSC>
  )
};

const mapStateToProps = (state: ApplicationState) => {
  return {
    clickedMapObject: state.clickedMapObject,
    originCoordinate: state.currentLocation
  }
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onClose: () => {
    dispatch(resetClickedMapObject());
  }
});

const ConnectedParkingInfoPanel = connect(mapStateToProps, mapDispatchToProps)(ParkingInfoPanel);

export default styled(ConnectedParkingInfoPanel)`
  position: absolute;
  bottom: 20px;
  left: 5%;
  width: 60%;

  @media (min-width: 420px) and (max-width: 768px) {
    width: 45%;
  }

  @media (min-width: 769px) {
    width: 35%;
  }
`;