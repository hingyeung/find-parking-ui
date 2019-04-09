import React from 'react';
import { StaticMap, ViewState, ViewStateChangeInfo } from 'react-map-gl';
import DeckGL, { IconLayer, MapView, ScatterplotLayer } from 'deck.gl';
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
import { clickParkingSpace, updateMapViewState } from "../actions";
import DirectionPanel from "./direction_panel";
import styled from 'styled-components';
import ParkingUnknownRestrictionIcon from '../assets/round-local_parking-24px_unknown.svg';
import ParkingLTE15Icon from '../assets/round-local_parking-24px_lte_15.svg';
import ParkingBTW16AND60Icon from '../assets/round-local_parking-24px_btw_16_and_60.svg';
import ParkingBTW61AND120Icon from '../assets/round-local_parking-24px_btw_61_and_120.svg';
import ParkingGTE121Icon from '../assets/round-local_parking-24px_gte_121.svg';
import CurrentLocationIcon from '../assets/round-trip_origin-24px.svg';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;

type IParkingMapProps = {
  points: any[] | [];
  mapStyle?: string;
  currentLocation?: Coordinate;
  clickedMapObject?: ClickedMapObject;
  onParkingSpaceClicked: (info: any) => void;
  onMapViewStateChange: (viewState: ViewStateChangeInfo) => void;
  mapViewState: ViewState;
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

const buildScatterplotLayer = (id: string, icon: string, data: ClickedMapObjectPayload[] | MapObjectPayload[], onClickFn: Function) => {
  return new IconLayer({
    id: id,
    getPosition: (d: any) => d.position,
    getRadius: (d: any) => 6,
    radiusMinPixels: 4,
    radiusMaxPixels: 10,
    opacity: 0.8,
    pickable: true,
    onClick: onClickFn,
    iconAtlas: icon,
    iconMapping: {
      marker: {
        x: 0,
        y: 0,
        width: 24,
        height: 24
      }
    },
    getIcon: (d: any) => 'marker',
    getSize: (d: any) => 30,
    sizeScale: 1,
    data
  })
};

const _renderLayers = (props: IParkingMapProps) => {
  const {points, currentLocation, onParkingSpaceClicked} = props;
  const data = processData(points);
  const layers = [
    buildScatterplotLayer(
      'parking-spaces-lte-15',
      ParkingLTE15Icon,
      data.filter(d => {
        return d.currentRestriction && d.currentRestriction.duration <= 15;
      }),
      (info: any) => {
        props.onParkingSpaceClicked(info)
      }
    ),
    buildScatterplotLayer(
      'parking-spaces-btw-16-and-60',
      ParkingBTW16AND60Icon,
      data.filter(d => {
        return d.currentRestriction && d.currentRestriction.duration > 15 && d.currentRestriction.duration <= 60;
      }),
      (info: any) => {
        props.onParkingSpaceClicked(info)
      }
    ),
    buildScatterplotLayer(
      'parking-spaces-btw-61-and-120',
      ParkingBTW61AND120Icon,
      data.filter(d => {
        return d.currentRestriction && d.currentRestriction.duration > 61 && d.currentRestriction.duration <= 120;
      }),
      (info: any) => {
        props.onParkingSpaceClicked(info)
      }
    ),
    buildScatterplotLayer(
      'parking-spaces-gte-121',
      ParkingGTE121Icon,
      data.filter(d => {
        return d.currentRestriction && d.currentRestriction.duration > 121;
      }),
      (info: any) => {
        props.onParkingSpaceClicked(info)
      }
    ),
    buildScatterplotLayer(
      'parking-spaces-unknown',
      ParkingUnknownRestrictionIcon,
      data.filter(d => {
        return !d.currentRestriction;
      }),
      (info: any) => {
        props.onParkingSpaceClicked(info)
      }
    )
  ];

  if (currentLocation) {
    layers.push(
      buildScatterplotLayer(
        'current-location',
        CurrentLocationIcon,
        [{
          position: [currentLocation.longitude, currentLocation.latitude]
        }],
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

const StyledDirectionPanel = styled(DirectionPanel)`
  position: absolute;
  bottom: 100px;
  left: 5%;
  // right: 5%;
  width: 80%;
  
  @media (min-width: 420px) {
    // right: auto;
    width: 40%;
  }
`;

const ParkingMap: React.FunctionComponent<IParkingMapProps> = (props) => {
    return (
      <div>
        <div id="parking-map-wrapper">
          <DeckGL
            onViewStateChange={props.onMapViewStateChange}
            controller={true}
            layers={_renderLayers(props)}
            viewState={props.mapViewState}
          >
            <StaticMap
              mapboxApiAccessToken={MAPBOX_TOKEN}
              mapStyle={props.mapStyle}
              width="100vw" height="100vh"
            />
            {renderTooltip(props)}
          </DeckGL>
        </div>
        <StyledLocateMeButtonContainer>
          <LocateMeButton />
        </StyledLocateMeButtonContainer>
        <StyledDirectionPanel/>
      </div>
    )
};

const mapStateToProps = (state: ApplicationState) => {
  const mapViewState = {...state.mapViewState};
  if (state.currentLocation) {
    mapViewState.latitude = state.currentLocation.latitude;
    mapViewState.longitude = state.currentLocation.longitude;
  }
  return {
    points: state.parkingSensorData,
    mapStyle: state.mapStyle,
    currentLocation: state.currentLocation,
    clickedMapObject: state.clickedMapObject,
    mapViewState: mapViewState
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
    },
    onMapViewStateChange: (viewState: ViewStateChangeInfo) => {
      dispatch(updateMapViewState(viewState.viewState));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ParkingMap);