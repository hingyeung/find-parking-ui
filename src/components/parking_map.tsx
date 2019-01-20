import React, { Component } from 'react';
import { StaticMap } from 'react-map-gl';
import DeckGL, {MapView, ScatterplotLayer} from 'deck.gl';
import parkingData from '../data/parking_sensor_data.json';
import LocateMeButton from './locate_me_button';
import {Coordinate} from '../types';

interface IParkingMapState {
  clickedObject: any;
  pointerX?: number | undefined;
  pointerY?: number | undefined;
  points: any[];
  style: string;
  currentLocation?: Coordinate | undefined;
}

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

export default class ParkingMap extends Component {
  state: IParkingMapState = {
    clickedObject: undefined,
    points: [],
    style: 'mapbox://styles/mapbox/light-v9',
  };

  constructor(props: {}) {
    super(props);
  }

  componentDidMount() {
    this._processData();
  }

  _renderTooltip() {
    const state = this.state || {};
    const {clickedObject, pointerX, pointerY} = state;
    return clickedObject && (
      <div className="toolTip" style={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: pointerX, top: pointerY}}>
        { clickedObject.bayId }
      </div>
    );
  }

  _renderLayers(props: {data: any[]}, currentLocation: Coordinate | undefined) {
    const {data} = props;
    const layers = [
      new ScatterplotLayer({
        id: 'parking-spaces',
        getPosition: (d: any) => d.position,
        getColor: (d: any) => [0, 153, 0],
        getRadius: (d: any) => 10,
        opacity: 0.5,
        pickable: true,
        radiusMinPixels: 0.25,
        radiusMaxPixels: 30,
        onClick: (info: any) => this.setState({
          clickedObject: info.object,
          pointerX: info.x,
          pointerY: info.y
        }),
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
  }

  _processData() {
    const points = parkingData.map((parking) => {
      return {
        position: [Number(parking.coordinates.lng), Number(parking.coordinates.lat)],
        bayId: parking.bay_id
      }
    });
    this.setState({
      points
    });
  }

  render() {
    return (
      <div>
        <div id="parking-map-wrapper">
          <DeckGL
            initialViewState={INITIAL_VIEW_STATE}
            controller
            layers={this._renderLayers({data: this.state.points}, this.state.currentLocation)}
          >
            <MapView id="map" width="75%">
              <StaticMap
                mapboxApiAccessToken={MAPBOX_TOKEN}
                mapStyle={this.state.style}
                width="100vw" height="100vh"
              />
            </MapView>
               { this._renderTooltip() }
          </DeckGL>
        </div>
        <LocateMeButton />
      </div>
    )
  }
}
