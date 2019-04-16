import React from 'react';
import { StaticMap, ViewState, ViewStateChangeInfo } from 'react-map-gl';
import DeckGL, { IconLayer, MapView, ScatterplotLayer } from 'deck.gl';
import LocateMeButton from './locate_me_button';
import {
  ApplicationState,
  ClickedMapObject,
  ClickedMapObjectPayload,
  Coordinate,
  MapObjectPayload, ParkingRestriction,
  ParkingSpace
} from '../types';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { clickParkingSpace, hoverOnParkingIcon, updateMapViewState } from "../actions";
import ParkingInfoPanel from "./parking_info_panel";
import styled from 'styled-components';
import ParkingUnknownRestrictionIcon from '../assets/round-local_parking-24px_unknown.svg';
import ParkingLTE15Icon from '../assets/round-local_parking-24px_lte_15.svg';
import ParkingBTW16AND60Icon from '../assets/round-local_parking-24px_btw_16_and_60.svg';
import ParkingBTW61AND120Icon from '../assets/round-local_parking-24px_btw_61_and_120.svg';
import ParkingGTE121Icon from '../assets/round-local_parking-24px_gte_121.svg';
import CurrentLocationIcon from '../assets/round-trip_origin-24px.svg';
import ParkingIcon from '../assets/round-local_parking-24px.svg';

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
  currentLocation?: Coordinate;
  clickedMapObject?: ClickedMapObject;
  onParkingSpaceClicked: (info: any) => void;
  onMapViewStateChange: (viewState: ViewStateChangeInfo) => void;
  hoverOnParkingIcon: (isHovering: boolean) => void;
  mapViewState: ViewState;
  hoveringOnParkingIcon: boolean;
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

const getParkingIconColour = (currentRestriction: ParkingRestriction | undefined) => {
  if (! currentRestriction) { return UNKNOWN_COLOUR; }

  if (currentRestriction.duration <= 15) return LTE_15_COLOUR_COLOUR;
  if (currentRestriction.duration > 15 && currentRestriction.duration <= 60) return BTW_16_AND_60_COLOUR;
  if (currentRestriction.duration > 61 && currentRestriction.duration <= 120) return BTW_61_AND_120_COLOUR;
  if (currentRestriction.duration > 121) return GTE_121_COLOUR;

  return UNKNOWN_COLOUR;
};

const buildIconLayer = (id: string, icon: string, data: ClickedMapObjectPayload[] | MapObjectPayload[], onClickFn: Function, onHoverOnParkingIconFn: Function, getColorFn: Function | undefined) => {
  return new IconLayer({
    id: id,
    getPosition: (d: any) => d.position,
    getRadius: (d: any) => 6,
    radiusMinPixels: 4,
    radiusMaxPixels: 10,
    opacity: 0.8,
    pickable: true,
    onClick: onClickFn,
    autoHighlight: true,
    // undefined info.object indicates hover-off
    onHover: (info: any, event: any) => {onHoverOnParkingIconFn(info.object !== undefined);},
    iconAtlas: icon,
    iconMapping: {
      marker: {
        x: 0,
        y: 0,
        width: 24,
        height: 24,
        // whether icon is treated as a transparency mask.
        // If true, user defined color is applied.
        // If false, original color from the image is applied.
        mask: true
      }
    },
    getColor: getColorFn || ((d: ClickedMapObjectPayload) => getParkingIconColour(d.currentRestriction)),
    getIcon: (d: ClickedMapObjectPayload) => 'marker',
    getSize: (d: ClickedMapObjectPayload) => 30,
    sizeScale: 1,
    data
  })
};

const _renderLayers = (props: IParkingMapProps) => {
  const {points, currentLocation, onParkingSpaceClicked} = props;
  const data = processData(points);
  const layers = [
    buildIconLayer(
      'parking-spaces',
      ParkingIcon,
      data,
      (info: any) => {
        props.onParkingSpaceClicked(info)
      },
      props.hoverOnParkingIcon,
      undefined
    )
  ];

  if (currentLocation) {
    layers.push(
      buildIconLayer(
        'current-location',
        CurrentLocationIcon,
        [{
          position: [currentLocation.longitude, currentLocation.latitude]
        }],
        (info: any) => {
          props.onParkingSpaceClicked(info)
        },
        () => {},
        () => [86, 131, 255]
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

const StyledDirectionPanel = styled(ParkingInfoPanel)`
  position: absolute;
  bottom: 100px;
  left: 5%;
  right: 5%;
  width: 80%;
  
  @media (min-width: 420px) {
    width: 45%;
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
            getCursor={() => {return props.hoveringOnParkingIcon ? 'pointer' : 'grab'}}
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
  return {
    points: state.parkingSensorData,
    mapStyle: state.mapStyle,
    currentLocation: state.currentLocation,
    clickedMapObject: state.clickedMapObject,
    mapViewState: state.mapViewState,
    hoveringOnParkingIcon: state.hoveringOnParkingIcon
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
    },
    hoverOnParkingIcon: (isHovering: boolean) => {
      dispatch(hoverOnParkingIcon(isHovering));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ParkingMap);