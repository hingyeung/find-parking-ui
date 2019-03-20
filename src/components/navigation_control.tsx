import React from "react";
import { ApplicationState, ClickedMapObject, Coordinate } from "../types";
import { connect } from "react-redux";

type NavigationControlProps = {
  clickedMapObject?: ClickedMapObject,
  originCoordinate?: Coordinate
};

const getCurrentDurationDisplayText = (clickedMapObject: ClickedMapObject) => {
  return clickedMapObject.object && clickedMapObject.object.currentRestriction ?
    clickedMapObject.object.currentRestriction.duration + ' minutes' :
    'Unknown restriction';
};

const buildNavLink = (originCoordinate: Coordinate, clickedMapObject: ClickedMapObject) => {
  const originLat = originCoordinate.latitude,
    originLng = originCoordinate.longitude,
    destLat = clickedMapObject.object.position[1],
    destLng = clickedMapObject.object.position[0],
    navLinkUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;

    return <a target="_blank" className={'navigation-link'} href={navLinkUrl}>Navigate to parking bay {clickedMapObject.object.bayId} ({getCurrentDurationDisplayText(clickedMapObject)})</a>
};

const NavigationControl: React.FunctionComponent<NavigationControlProps> = (props) => {
  return (
    <div>
      {props.originCoordinate && props.clickedMapObject && buildNavLink(props.originCoordinate, props.clickedMapObject)}
    </div>
  )
};

const mapStateToProps = (state: ApplicationState) => {
  return {
    clickedMapObject: state.clickedMapObject,
    originCoordinate: state.currentLocation
  }
};

export default connect(mapStateToProps)(NavigationControl);