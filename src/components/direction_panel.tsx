import React from "react";
import { ApplicationState, ClickedMapObject, Coordinate } from "../types";
import { connect } from "react-redux";
import { Grid, Paper } from '@material-ui/core';
import styled from 'styled-components';

import ParkingSign from './parking_sign';
import DirectionButton from './DirectionButton';

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
  padding: 25px;
`;

const currentRestrictionExists = (clickedMapObject: ClickedMapObject) => {
  return clickedMapObject.object && clickedMapObject.object.currentRestriction;
};

const DirectionPanel: React.FunctionComponent<DirectionPanelProps & React.HTMLProps<HTMLDivElement>> = (props) => {
  if (! props.clickedMapObject) {
    return <div/>
  }

  const duration = currentRestrictionExists(props.clickedMapObject) ?
    props.clickedMapObject.object.currentRestriction.duration :
    'Unknown Restriction';

  const endTime = currentRestrictionExists(props.clickedMapObject) ?
    props.clickedMapObject.object.currentRestriction.endTime :
    undefined;

  return (
    <PaperSC className={props.className}>
      {/*<Typography variant={'title'}>*/}
        <Grid container justify="center" alignItems="center">
          <Grid item xs={2}>
            <ParkingSign minutes={duration}/>
          </Grid>
          {endTime &&
            <Grid item xs={5}>
              (until {endTime}
            </Grid>
          }
          <Grid item xs={endTime ? 5 : 10}>
            {props.originCoordinate && props.clickedMapObject && buildDirectionButton(props.originCoordinate, props.clickedMapObject)}
          </Grid>
        </Grid>
      {/*</Typography>*/}
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