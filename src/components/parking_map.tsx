import React from 'react';
import { StaticMap, ViewState, ViewStateChangeInfo } from 'react-map-gl';
import DeckGL, { IconLayer } from 'deck.gl';
import LocateMeButton from './locate_me_button';
import FPSnackbar from './fp_snackbar';
import {
  ApplicationState,
  ClickedMapObject,
  ClickedMapObjectPayload,
  Coordinate,
  MapObjectPayload,
  ParkingRestriction,
  ParkingSpace
} from '../types';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {
  clearErrorMessage,
  clickParkingSpace,
  hoverOnParkingIcon,
  updateMapViewState
} from "../actions";
import ParkingMapAppBar from './parking_map_app_bar';
import ParkingInfoPanel from "./parking_info_panel";
import styled from 'styled-components';
import ParkingIconAtlas from '../assets/parking_icon_sprites.png';
import DisclaimerPopup from './disclaimer_popup';
import AboutPopup from './about_popup';
import {
  BTW_16_AND_60_PARKING_ICON,
  BTW_61_AND_120_PARKING_ICON,
  CURRENT_LOCATION_ICON,
  GTE_121_PARKING_ICON,
  LTE_15_PARKING_ICON,
  MAPBOX_TOKEN,
  PARKING_ICON_MAPPING,
  UNKNOWN_RESTRICTION_PARKING_ICON
} from '../constants';

type IParkingMapProps = {
  errorMessage?: string;
  availableParkingSpaces: any[] | [];
  mapStyle?: string;
  currentLocation?: Coordinate;
  clickedMapObject?: ClickedMapObject;
  onParkingSpaceClicked: (info: any) => void;
  onMapViewStateChange: (viewState: ViewStateChangeInfo) => void;
  hoverOnParkingIcon: (isHovering: boolean) => void;
  mapViewState: ViewState;
  hoveringOnParkingIcon: boolean;
  inAccessibleParkingMode: boolean;
  showLoadingZonesOnly: boolean;
  clearErrorMessage: () => void;
}

const doShowLoadingZonesOnly = (parkings: ClickedMapObjectPayload[], showLoadingZonesOnly: boolean) => {
  return parkings.filter(
    parking => {
      return showLoadingZonesOnly ?
        parking.currentRestriction && parking.currentRestriction.isLoadingZone :
        !parking.currentRestriction || !parking.currentRestriction.isLoadingZone;
    });
};

const doHandleAccessibleParkingMode = (parkings: ClickedMapObjectPayload[], inAccessibleMode: boolean) => {
  if (inAccessibleMode) {
    return parkings;
  }

  return parkings.filter(
    parking => {
      return !parking.currentRestriction || !parking.currentRestriction.isDisabledOnly;
    }
  )
};

const setDisplayDuration = (parkingRestriction: ParkingRestriction | undefined, inAccessibleParkingMode: boolean) => {
  if (!parkingRestriction) return undefined;

  return Object.assign({}, parkingRestriction, {
    ...parkingRestriction,
    displayDuration: inAccessibleParkingMode ? parkingRestriction.disabilityDuration : parkingRestriction.duration
  })
};

const processData = (inAccessibleParkingMode: boolean, showLoadingZonesOnly: boolean, parkingSpaces: ParkingSpace[]): ClickedMapObjectPayload[] => {
  let idx = 0;
  let parkingsToShow: ClickedMapObjectPayload[] = parkingSpaces.map((parkingSpace) => {
    return {
      position: [Number(parkingSpace.coordinate.longitude), Number(parkingSpace.coordinate.latitude)] as [number, number],
      bayId: parkingSpace.id,
      stMarkerId: parkingSpace.stMarkerId,
      currentRestriction: setDisplayDuration(parkingSpace.currentRestriction, inAccessibleParkingMode),
      index: idx++
    }
  });

  parkingsToShow = doHandleAccessibleParkingMode(parkingsToShow, inAccessibleParkingMode);
  parkingsToShow = doShowLoadingZonesOnly(parkingsToShow, showLoadingZonesOnly);
  return parkingsToShow;
};

const getParkingIconBaseOnRestriction = (currentRestriction: ParkingRestriction | undefined) => {
  if (! currentRestriction) { return UNKNOWN_RESTRICTION_PARKING_ICON; }

  if (currentRestriction.displayDuration <= 15) return LTE_15_PARKING_ICON;
  if (currentRestriction.displayDuration > 15 && currentRestriction.displayDuration <= 60) return BTW_16_AND_60_PARKING_ICON;
  if (currentRestriction.displayDuration > 61 && currentRestriction.displayDuration <= 120) return BTW_61_AND_120_PARKING_ICON;
  if (currentRestriction.displayDuration > 121) return GTE_121_PARKING_ICON;
};

const buildIconLayer = (id: string, icon: string, data: ClickedMapObjectPayload[] | MapObjectPayload[], onClickFn: Function, onHoverOnParkingIconFn: Function, getIcon: Function | undefined, getSize: Function | number) => {
  return new IconLayer({
    id: id,
    getPosition: (d: any) => d.position,
    getRadius: (d: any) => 6,
    radiusMinPixels: 4,
    radiusMaxPixels: 10,
    pickable: true,
    onClick: onClickFn,
    // undefined info.object indicates hover-off
    onHover: (info: any, event: any) => {onHoverOnParkingIconFn(info.object !== undefined);},
    // For whatever reason, I just couldn't get IconsLayer's auto packing iconAtlas feature working for me.
    // https://github.com/uber/deck.gl/blob/master/docs/layers/icon-layer.md#example-auto-packing-iconatlas
    // I have to fall back to pre-packed iconAtlas, which requires image sprite.
    // I also couldn't remove the transparency in the SVG, so I have to convert them to PNG before creating
    // the image sprite.
    iconAtlas: icon,
    iconMapping: PARKING_ICON_MAPPING,
    getIcon,
    getSize: getSize,
    data
  })
};

const _renderLayers = (props: IParkingMapProps) => {
  const {availableParkingSpaces, currentLocation, onParkingSpaceClicked, hoverOnParkingIcon, clickedMapObject} = props;
  const layers = [
    buildIconLayer(
      'parking-spaces',
      ParkingIconAtlas,
      availableParkingSpaces,
      (info: any) => onParkingSpaceClicked(info),
      hoverOnParkingIcon,
      (d: ClickedMapObjectPayload) => {
        return getParkingIconBaseOnRestriction(d.currentRestriction)
      },
      (d: ClickedMapObjectPayload) => {
        return (clickedMapObject !== undefined && clickedMapObject.object.bayId === d.bayId) ? 40: 30;
      }
    )
  ];

  if (currentLocation) {
    layers.push(
      buildIconLayer(
        'current-location',
        ParkingIconAtlas,
        [{
          position: [currentLocation.longitude, currentLocation.latitude]
        }],
        (info: any) => {
          props.onParkingSpaceClicked(info)
        },
        () => {},
        (d: ClickedMapObjectPayload) => CURRENT_LOCATION_ICON,
        30
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

const ParkingMap: React.FunctionComponent<IParkingMapProps> = (props) => {
    return (
      <div>
        <DisclaimerPopup title={'Attention'}>
          Please note that Parking Sensors are not operational on Public Holidays. Parking Sensors will show car parks as vacant when blocked by construction zones.
        </DisclaimerPopup>
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
          </DeckGL>
        </div>
        <StyledLocateMeButtonContainer>
          <LocateMeButton />
        </StyledLocateMeButtonContainer>
        <ParkingInfoPanel inAccessibleParkingMode={props.inAccessibleParkingMode}/>
        <ParkingMapAppBar/>
        <AboutPopup/>
        <FPSnackbar open={props.errorMessage !== undefined} onClose={props.clearErrorMessage} message={props.errorMessage}/>
      </div>
    )
};

const mapStateToProps = (state: ApplicationState) => {
  return {
    availableParkingSpaces: processData(
      state.inAccessibleParkingMode,
      state.showLoadingZonesOnly,
      state.parkingSensorData),
    mapStyle: state.mapStyle,
    currentLocation: state.currentLocation,
    clickedMapObject: state.clickedMapObject,
    mapViewState: state.mapViewState,
    hoveringOnParkingIcon: state.hoveringOnParkingIcon,
    inAccessibleParkingMode: state.inAccessibleParkingMode,
    showLoadingZonesOnly: state.showLoadingZonesOnly,
    errorMessage: state.errorMessage
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
    },
    clearErrorMessage: () => {
      dispatch(clearErrorMessage());
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ParkingMap);
