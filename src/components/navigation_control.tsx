import React from "react";
import { ApplicationState, ClickedMapObject, Coordinate } from "../types";
import { connect } from "react-redux";
import { Button, Fab, Paper, Typography } from '@material-ui/core';
import styled from 'styled-components';

import ParkingSign from './parking_sign';
import StyledDirectionButton from './DirectionButton';

type NavigationControlProps = {
  clickedMapObject?: ClickedMapObject,
  originCoordinate?: Coordinate
};

const buildNavLink = (originCoordinate: Coordinate, clickedMapObject: ClickedMapObject) => {
  const originLat = originCoordinate.latitude,
    originLng = originCoordinate.longitude,
    destLat = clickedMapObject.object.position[1],
    destLng = clickedMapObject.object.position[0],
    navLinkUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;

  return (
    <StyledDirectionButton directionLink={navLinkUrl}/>
  )
};

const PaperSC = styled(Paper)`
  padding: 25px;
`;

const NavigationControl: React.FunctionComponent<NavigationControlProps & React.HTMLProps<HTMLDivElement>> = (props) => {
  if (! props.clickedMapObject) {
    return <div/>
  }

  const duration = props.clickedMapObject.object && props.clickedMapObject.object.currentRestriction ?
    props.clickedMapObject.object.currentRestriction.duration :
    undefined;

  return (
    <PaperSC className={props.className}>
      <Typography variant={'title'}>
        <ParkingSign minutes={duration}/> {props.originCoordinate && props.clickedMapObject && buildNavLink(props.originCoordinate, props.clickedMapObject)}
      </Typography>
    </PaperSC>
  )
};

const mapStateToProps = (state: ApplicationState) => {
  return {
    clickedMapObject: state.clickedMapObject,
    originCoordinate: state.currentLocation
  }
};

export default connect(mapStateToProps)(NavigationControl);