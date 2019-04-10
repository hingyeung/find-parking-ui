import React from "react";
import { ApplicationState, ClickedMapObject, Coordinate } from "../types";
import { connect } from "react-redux";
import { Grid, Paper } from '@material-ui/core';
import styled from 'styled-components';

import ParkingSign from './parking_sign';
import DirectionButton from './direction_button';

type DirectionPanelProps = {
  clickedMapObject?: ClickedMapObject,
  originCoordinate?: Coordinate
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
`;

const PanelGrid = styled(Grid)`
  min-height: 4.5rem;
  text-align: center;
`;

const currentRestrictionExists = (clickedMapObject: ClickedMapObject) => {
  return clickedMapObject.object && clickedMapObject.object.currentRestriction;
};

const convertHHMMSSToHHMM = (hhmmss: string): string => {
  const hhmmMatched = hhmmss.match(/(\d{1,2}:\d{1,2}):\d{1,2}/);
  return hhmmMatched ? hhmmMatched[1] : hhmmss;
};

const DirectionPanel: React.FunctionComponent<DirectionPanelProps & React.HTMLProps<HTMLDivElement>> = (props) => {
  if (! props.clickedMapObject) {
    return <div/>
  }

  const duration = currentRestrictionExists(props.clickedMapObject) ?
    props.clickedMapObject.object.currentRestriction.duration :
    'Unknown Restriction';

  let parkingSignTimeRangeDesc;
  if (currentRestrictionExists(props.clickedMapObject)) {
    const startTimeInHHMM = convertHHMMSSToHHMM(props.clickedMapObject.object.currentRestriction.startTime);
    const endTimeInHHMM = convertHHMMSSToHHMM(props.clickedMapObject.object.currentRestriction.endTime);
    parkingSignTimeRangeDesc = `${startTimeInHHMM} - ${endTimeInHHMM}`;
  }

  return (
    <PaperSC className={props.className}>
        <PanelGrid container justify="space-between" alignItems="center">
          <Grid container item xs={4} direction="column" justify="center" alignItems="center">
            <ParkingSign minutes={duration} timeRangeDesc={parkingSignTimeRangeDesc}/>
          </Grid>
          <Grid item xs={8} justify="center">
            {props.originCoordinate && props.clickedMapObject && buildDirectionButton(props.originCoordinate, props.clickedMapObject)}
          </Grid>
        </PanelGrid>
    </PaperSC>
  )
};

const mapStateToProps = (state: ApplicationState) => {
  return {
    clickedMapObject: state.clickedMapObject,
    originCoordinate: state.currentLocation
  }
};

export default connect(mapStateToProps)(DirectionPanel);