import React from "react";
import { ApplicationState, ClickedMapObject, Coordinate } from "../types";
import { connect } from "react-redux";
import { Fab, Paper, Typography } from '@material-ui/core';
import styled from 'styled-components';
import NavigationIcon from '@material-ui/icons/Navigation';

type NavigationControlProps = {
  clickedMapObject?: ClickedMapObject,
  originCoordinate?: Coordinate
};

const getCurrentDurationDisplayText = (clickedMapObject: ClickedMapObject) => {
  return clickedMapObject.object && clickedMapObject.object.currentRestriction ?
    clickedMapObject.object.currentRestriction.duration + ' minutes' :
    'unknown restriction';
};

const buildNavLink = (originCoordinate: Coordinate, clickedMapObject: ClickedMapObject) => {
  const originLat = originCoordinate.latitude,
    originLng = originCoordinate.longitude,
    destLat = clickedMapObject.object.position[1],
    destLng = clickedMapObject.object.position[0],
    navLinkUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;

  return (
    <Fab size="small" color="primary" rel="noreferrer" target="_blank" href={navLinkUrl}><NavigationIcon/></Fab>
  )
};

const PaperSC = styled(Paper)`
  padding: 25px;
`;

const NavigationControl: React.FunctionComponent<NavigationControlProps & React.HTMLProps<HTMLDivElement>> = (props) => {
  if (! props.clickedMapObject) {
    return <div/>
  }

  return (
    <PaperSC className={props.className}>
      <Typography variant={'title'}>
        Parking Bay {props.clickedMapObject.object.bayId} ({getCurrentDurationDisplayText(props.clickedMapObject)}) {props.originCoordinate && props.clickedMapObject && buildNavLink(props.originCoordinate, props.clickedMapObject)}
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