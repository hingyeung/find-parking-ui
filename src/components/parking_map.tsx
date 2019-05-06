import React from 'react';
import { StaticMap, ViewState, ViewStateChangeInfo } from 'react-map-gl';
import DeckGL, { IconLayer, MapView, ScatterplotLayer } from 'deck.gl';
import LocateMeButton from './locate_me_button';
import LoadingZoneIcon from '@material-ui/icons/LocalShipping';
import AccessibleIcon from '@material-ui/icons/Accessible';
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
  clickParkingSpace,
  hoverOnParkingIcon,
  resetClickedMapObject,
  toggleAccessibleMode,
  toggleShowLoadingZonesOnly,
  updateMapViewState
} from "../actions";
import ParkingInfoPanel from "./parking_info_panel";
import styled from 'styled-components';
import ParkingIconAtlas from '../assets/parking_icon_sprites.png';
import { AppBar, Hidden, IconButton, SvgIcon, Toolbar, Typography } from '@material-ui/core';
import PopupAlert from './popup_alert';
import { GithubIcon } from './svg_icons';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAccessToken;
const UNKNOWN_RESTRICTION_PARKING_ICON = 'unknown',
  LTE_15_PARKING_ICON = 'lte_15',
  BTW_16_AND_60_PARKING_ICON = 'btw_16_60',
  BTW_61_AND_120_PARKING_ICON = 'btw_61_120',
  GTE_121_PARKING_ICON = 'gte_121',
  CURRENT_LOCATION_ICON = 'current_loc';
const PARKING_ICON_MAPPING = {
  [BTW_16_AND_60_PARKING_ICON]: {
    x: 0,
    y: 0,
    width: 24,
    height: 24,
    // whether icon is treated as a transparency mask.
    // If true, user defined color is applied.
    // If false, original color from the image is applied.
    mask: false
  },
  [BTW_61_AND_120_PARKING_ICON]: {
    x: 24,
    y: 0,
    width: 24,
    height: 24,
    mask: false
  },
  [GTE_121_PARKING_ICON]: {
    x: 48,
    y: 0,
    width: 24,
    height: 24,
    mask: false
  },
  [LTE_15_PARKING_ICON]: {
    x: 72,
    y: 0,
    width: 24,
    height: 24,
    mask: false
  },
  [CURRENT_LOCATION_ICON]: {
    x: 96,
    y: 0,
    width: 24,
    height: 24,
    mask: false
  },
  [UNKNOWN_RESTRICTION_PARKING_ICON]: {
    x: 120,
    y: 0,
    width: 24,
    height: 24,
    mask: false
  }
};

type IParkingMapProps = {
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
  toggleShowLoadingZonesOnly: () => void;
  toggleAccessibleMode: () => void;
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
      currentRestriction: setDisplayDuration(parkingSpace.currentRestriction, inAccessibleParkingMode),
      index: idx++
    }
  });

  parkingsToShow = doHandleAccessibleParkingMode(parkingsToShow, inAccessibleParkingMode);
  parkingsToShow = doShowLoadingZonesOnly(parkingsToShow, showLoadingZonesOnly);
  return parkingsToShow;
};

const renderTooltip = (props: IParkingMapProps) => {
  return props.clickedMapObject && (
    <div className="toolTip" style={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: props.clickedMapObject.pointerX, top: props.clickedMapObject.pointerY}}>
      {props.clickedMapObject.object.bayId}
    </div>
  )
};

const getParkingIcon = (currentRestriction: ParkingRestriction | undefined) => {
  if (! currentRestriction) { return UNKNOWN_RESTRICTION_PARKING_ICON; }

  if (currentRestriction.displayDuration <= 15) return LTE_15_PARKING_ICON;
  if (currentRestriction.displayDuration > 15 && currentRestriction.displayDuration <= 60) return BTW_16_AND_60_PARKING_ICON;
  if (currentRestriction.displayDuration > 61 && currentRestriction.displayDuration <= 120) return BTW_61_AND_120_PARKING_ICON;
  if (currentRestriction.displayDuration > 121) return GTE_121_PARKING_ICON;
};

const buildIconLayer = (id: string, icon: string, data: ClickedMapObjectPayload[] | MapObjectPayload[], onClickFn: Function, onHoverOnParkingIconFn: Function, getIcon: Function | undefined) => {
  return new IconLayer({
    id: id,
    getPosition: (d: any) => d.position,
    getRadius: (d: any) => 6,
    radiusMinPixels: 4,
    radiusMaxPixels: 10,
    pickable: true,
    onClick: onClickFn,
    autoHighlight: true,
    // undefined info.object indicates hover-off
    onHover: (info: any, event: any) => {onHoverOnParkingIconFn(info.object !== undefined);},
    iconAtlas: icon,
    iconMapping: PARKING_ICON_MAPPING,
    getIcon,
    getSize: (d: ClickedMapObjectPayload) => 30,
    sizeScale: 1,
    data
  })
};

const _renderLayers = (props: IParkingMapProps) => {
  const {availableParkingSpaces, currentLocation, onParkingSpaceClicked} = props;
  const layers = [
    buildIconLayer(
      'parking-spaces',
      ParkingIconAtlas,
      availableParkingSpaces,
      (info: any) => {
        props.onParkingSpaceClicked(info)
      },
      props.hoverOnParkingIcon,
      (d: ClickedMapObjectPayload) => getParkingIcon(d.currentRestriction)
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
        (d: ClickedMapObjectPayload) => CURRENT_LOCATION_ICON
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

const StyledParkingInfoPanel = styled(ParkingInfoPanel)`
  position: absolute;
  bottom: 20px;
  left: 5%;
  right: 5%;
  width: 80%;

  @media (min-width: 420px) and (max-width: 768px) {
    width: 45%;
  }

  @media (min-width: 769px) {
    width: 30%;
  }

  @media (min-height: 415px) {
    bottom: 100px;
  }
`;

type StyledIconButtonProps = {
  selected: boolean;
};

const StyledIconButton = styled(IconButton)`
// https://medium.com/sipios/use-styled-components-with-material-ui-react-e0759f9a15ce
  && {
    ${(props: StyledIconButtonProps) => {
    if (props.selected) {
      return `
        color: white;
        `
      } else {
        return `
          color: rgba(0, 0, 0, 0.5);
        `
      }
    }}
  }
`;

const StyledTitleWrapper = styled('div')`
  flex-grow: 1;
`;

const StyledToolbar = styled(Toolbar)`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const ParkingMap: React.FunctionComponent<IParkingMapProps> = (props) => {
    return (
      <div>
        <PopupAlert title={'Attention'}>
          Please note that Parking Sensors are not operational on Public Holidays. Parking Sensors will show car parks as vacant when blocked by construction zones.
        </PopupAlert>
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
        <StyledParkingInfoPanel inAccessibleParkingMode={props.inAccessibleParkingMode}/>
        <AppBar position="fixed" color="primary">
          <StyledToolbar>
            <StyledTitleWrapper>
              <Typography component="h1" variant="h5" color="inherit">
                CBD Parking Finder
              </Typography>
              <Typography component="h2" variant="subtitle2" color="inherit">
                <Hidden xsDown>Find available parking spaces in Melbourne CBD</Hidden>
              </Typography>
            </StyledTitleWrapper>
            <StyledIconButton selected={props.inAccessibleParkingMode} onClick={props.toggleAccessibleMode}>
              <AccessibleIcon/>
            </StyledIconButton>
            <StyledIconButton selected={props.showLoadingZonesOnly} onClick={props.toggleShowLoadingZonesOnly}>
              <LoadingZoneIcon/>
            </StyledIconButton>
            <StyledIconButton selected={false}>
              <GithubIcon/>
            </StyledIconButton>
          </StyledToolbar>
        </AppBar>
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
    showLoadingZonesOnly: state.showLoadingZonesOnly
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
    toggleShowLoadingZonesOnly: () => {
      dispatch(toggleShowLoadingZonesOnly());
    },
    toggleAccessibleMode: () => {
      dispatch(toggleAccessibleMode());
      dispatch(resetClickedMapObject());
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ParkingMap);
