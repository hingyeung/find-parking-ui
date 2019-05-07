import React from "react";
import { ApplicationState, ClickedMapObject, Coordinate, ParkingRestriction } from "../types";
import { connect } from "react-redux";
import { Paper } from '@material-ui/core';
import styled from 'styled-components';

import ParkingSign, { ParkingSignType } from './parking_sign';
import DirectionButton from './direction_button';

type DirectionPanelProps = {
  clickedMapObject?: ClickedMapObject,
  originCoordinate?: Coordinate,
  inAccessibleParkingMode: boolean
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

const PaperSC = styled(Paper)`
  padding: 10px;
  @media (min-width: 768px) {
    padding: 15px;
  }
  // display: flex;
  // flex-wrap: nowrap;
  // align-items: center;
`;

const Title = styled('div')`
  text-align: center;
  font-weight: bold;
  color: grey;
`;

const InfoPanel = styled('div')`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;

const LeftPanel = styled('div')`
  flex-grow: 1;
  flex-basis: 25%
`;

const RightPanel = styled('div')`
  flex-grow: 2;
  text-align: center;
`;

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
      <Title>{props.clickedMapObject.object.stMarkerId}</Title>
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

export default connect(mapStateToProps)(ParkingInfoPanel);