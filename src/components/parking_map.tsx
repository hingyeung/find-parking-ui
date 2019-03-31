import React from 'react';
import { StaticMap } from 'react-map-gl';
import DeckGL, { MapView, ScatterplotLayer } from 'deck.gl';
import LocateMeButton from './locate_me_button';
import {
  ApplicationState,
  ClickedMapObject,
  ClickedMapObjectPayload,
  Coordinate,
  MapObjectPayload,
  ParkingSpace
} from '../types';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { clickParkingSpace } from "../actions";
import NavigationControl from "./navigation_control";
import styled from 'styled-components';

const INITIAL_VIEW_STATE = {
  longitude: 144.96332,
  latitude: -37.814,
  zoom: 15,
  minZoom: 5,
  maxZoom: 30,
  pitch: 0,
  bearing: 0
};

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;
const LTE_15_COLOUR_COLOUR = [230, 25, 75] as [number, number, number];
const BTW_16_AND_60_COLOUR = [245, 130, 48] as [number, number, number];
const BTW_61_AND_120_COLOUR = [240, 50, 230] as [number, number, number];
const GTE_121_COLOUR = [60, 180, 75] as [number, number, number];
const UNKNOWN_COLOUR = [128, 128, 128] as [number, number, number];
const CURRENT_LOC_COLOUR = [74, 137, 243] as [number, number, number];

type IParkingMapProps = {
  points: any[] | [];
  mapStyle?: string;
  currentLocation?: Coordinate,
  clickedMapObject?: ClickedMapObject,
  onParkingSpaceClicked: (info: any) => void
}

const processData = (parkingSpaces: ParkingSpace[]): ClickedMapObjectPayload[] => {
  let idx = 0;
  return parkingSpaces.map((parkingSpace) => {
    return {
      position: [Number(parkingSpace.coordinate.longitude), Number(parkingSpace.coordinate.latitude)] as [number, number],
      bayId: parkingSpace.id,
      currentRestriction: parkingSpace.currentRestriction,
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

const buildScatterplotLayer = (id: string, data: ClickedMapObjectPayload[] | MapObjectPayload[], color: [number, number, number], onClickFn: Function) => {
  return new ScatterplotLayer({
    id: id,
    getPosition: (d: any) => d.position,
    getColor: (d: any) => color,
    getRadius: (d: any) => 6,
    radiusMinPixels: 4,
    radiusMaxPixels: 10,
    opacity: 0.8,
    pickable: true,
    onClick: onClickFn,
    data
  })
};

const _renderLayers = (props: IParkingMapProps) => {
  const {points, currentLocation, onParkingSpaceClicked} = props;
  const data = processData(points);
  const layers = [
    buildScatterplotLayer(
      'parking-spaces-lte-15',
      data.filter(d => {
        return d.currentRestriction && d.currentRestriction.duration <= 15;
      }),
      LTE_15_COLOUR_COLOUR,
      (info: any) => {
        props.onParkingSpaceClicked(info)
      }
    ),
    buildScatterplotLayer(
      'parking-spaces-btw-16-and-60',
      data.filter(d => {
        return d.currentRestriction && d.currentRestriction.duration > 15 && d.currentRestriction.duration <= 60;
      }),
      BTW_16_AND_60_COLOUR,
      (info: any) => {
        props.onParkingSpaceClicked(info)
      }
    ),
    buildScatterplotLayer(
      'parking-spaces-btw-61-and-120',
      data.filter(d => {
        return d.currentRestriction && d.currentRestriction.duration > 61 && d.currentRestriction.duration <= 120;
      }),
      BTW_61_AND_120_COLOUR,
      (info: any) => {
        props.onParkingSpaceClicked(info)
      }
    ),
    buildScatterplotLayer(
      'parking-spaces-gte-121',
      data.filter(d => {
        return d.currentRestriction && d.currentRestriction.duration > 121;
      }),
      GTE_121_COLOUR,
      (info: any) => {
        props.onParkingSpaceClicked(info)
      }
    ),
    buildScatterplotLayer(
      'parking-spaces-unknown',
      data.filter(d => {
        return !d.currentRestriction;
      }),
      UNKNOWN_COLOUR,
      (info: any) => {
        props.onParkingSpaceClicked(info)
      }
    )
  ];

  if (currentLocation) {
    layers.push(
      buildScatterplotLayer(
        'parking-spaces-unknown',
        [{
          position: [currentLocation.longitude, currentLocation.latitude]
        }],
        CURRENT_LOC_COLOUR,
        (info: any) => {
          props.onParkingSpaceClicked(info)
        }
      )
    )
  }
  return layers;
};

const StyledLocateMeButtonContainer = styled('div')`
  position: absolute;
  bottom: 25px;
  right: 25px;
`;

const StyledNavigationControl = styled(NavigationControl)`
  position: absolute;
  bottom: 100px;
  left: 5%;
  right: 5%;
  
  @media (min-width: 420px) {
    right: auto;
  }
`;

const ParkingMap: React.FunctionComponent<IParkingMapProps> = (props) => {
    return (
      <div>
        <div id="parking-map-wrapper">
          <DeckGL
            initialViewState={INITIAL_VIEW_STATE}
            controller
            layers={_renderLayers(props)}
          >
            <MapView id="map">
              <StaticMap
                mapboxApiAccessToken={MAPBOX_TOKEN}
                mapStyle={props.mapStyle}
                width="100vw" height="100vh"
              />
            </MapView>
            {renderTooltip(props)}
          </DeckGL>
        </div>
        <StyledLocateMeButtonContainer>
          <LocateMeButton />
        </StyledLocateMeButtonContainer>
        <StyledNavigationControl/>
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