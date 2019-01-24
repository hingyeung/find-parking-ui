import React from 'react';
import { StaticMap } from 'react-map-gl';
import DeckGL, { MapView, ScatterplotLayer } from 'deck.gl';
import LocateMeButton from './locate_me_button';
import { ApplicationState, ClickedMapObject, Coordinate, ParkingSpace } from '../types';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { clickParkingSpace } from "../actions";
import NavigationControl from "./navigation_control";

const INITIAL_VIEW_STATE = {
  longitude: 144.96332,
  latitude: -37.814,
  zoom: 15,
  minZoom: 5,
  maxZoom: 16,
  pitch: 0,
  bearing: 0
};

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;

type IParkingMapProps = {
  points: any[] | [];
  mapStyle?: string;
  currentLocation?: Coordinate,
  clickedMapObject?: ClickedMapObject,
  onParkingSpaceClicked: (info: any) => void
}

const processData = (parkingSpaces: ParkingSpace[]) => {
  let idx = 0;
  return parkingSpaces.map((parkingSpace) => {
    return {
      position: [Number(parkingSpace.coordinate.longitude), Number(parkingSpace.coordinate.latitude)],
      bayId: parkingSpace.id,
      index: idx++
    }
  });
};

const renderTooltip = (props: IParkingMapProps) => {
  return props.clickedMapObject && (
    <div className="toolTip" style={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: props.clickedMapObject.pointerX, top: props.clickedMapObject.pointerY}}>
      {props.clickedMapObject.object.bayId}
    </div>
  )
};

const _renderLayers = (props: IParkingMapProps) => {
  const {points, currentLocation, onParkingSpaceClicked} = props;
  const data = processData(points);
  const layers = [
    new ScatterplotLayer({
      id: 'parking-spaces',
      getPosition: (d: any) => d.position,
      getColor: (d: any) => [0, 153, 0],
      getRadius: (d: any) => 15,
      opacity: 0.5,
      pickable: true,
      onClick: (info: any) => { props.onParkingSpaceClicked(info) },
      data
    })
  ];

  if (currentLocation) {
    layers.push(
      new ScatterplotLayer({
        id: 'current-location',
        getPosition: (d: any) => d.position,
        getColor: (d: any) => [255, 0, 0],
        getRadius: (d: any) => 10,
        opacity: 0.5,
        pickable: true,
        radiusMinPixels: 0.25,
        radiusMaxPixels: 30,
        data: [{
          position: [currentLocation.longitude, currentLocation.latitude]
        }]
      })
    )
  }
  return layers;
};

const ParkingMap: React.FunctionComponent<IParkingMapProps> = (props) => {
    return (
      <div>
        <div id="parking-map-wrapper">
          <DeckGL
            initialViewState={INITIAL_VIEW_STATE}
            controller
            layers={_renderLayers(props)}
          >
            <MapView id="map" width="75%">
              <StaticMap
                mapboxApiAccessToken={MAPBOX_TOKEN}
                mapStyle={props.mapStyle}
                width="100vw" height="100vh"
              />
            </MapView>
            {renderTooltip(props)}
          </DeckGL>
        </div>
        <LocateMeButton />
        <NavigationControl/>
      </div>
    )
};

const mapStateToProps = (state: ApplicationState) => {
  return {
    points: state.parkingSensorData,
    mapStyle: state.mapStyle,
    currentLocation: state.currentLocation,
    clickedMapObject: state.clickedMapObject
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onParkingSpaceClicked: (info: any) => {
      const clickedMapObj: ClickedMapObject = {
        object: info.object,
        pointerX: info.x,
        pointerY: info.y
      };
      dispatch(clickParkingSpace(clickedMapObj));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ParkingMap);