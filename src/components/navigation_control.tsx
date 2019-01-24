import React from "react";
import { ApplicationState, ClickedMapObject, Coordinate } from "../types";
import { connect } from "react-redux";

type NavigationControlProps = {
  clickedMapObject?: ClickedMapObject,
  originCoordinate?: Coordinate
};

const buildNavUrl = (originLat: number, originLng: number, destLat: number, destLng: number) => {
  return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;
};

const NavigationControl: React.FunctionComponent<NavigationControlProps> = (props) => {
  if (props.originCoordinate && props.clickedMapObject) {
    const navLinkUrl = buildNavUrl(
      props.originCoordinate.latitude, props.originCoordinate.longitude,
      props.clickedMapObject.object.position[1], props.clickedMapObject.object.position[0]);

    return (
      <a target="_blank" className={'navigation-link'} href={navLinkUrl}>Navigate to parking bay {props.clickedMapObject.object.bayId}</a>
    )
  } else {
    return (<div></div>);
  }
};

const mapStateToProps = (state: ApplicationState) => {
  return {
    clickedMapObject: state.clickedMapObject,
    originCoordinate: state.currentLocation
  }
};

export default connect(mapStateToProps)(NavigationControl);