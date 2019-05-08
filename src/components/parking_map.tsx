import React from 'react';
import { StaticMap, ViewState, ViewStateChangeInfo } from 'react-map-gl';
import DeckGL, { IconLayer, MapView, ScatterplotLayer } from 'deck.gl';
import LocateMeButton from './locate_me_button';
import LoadingZoneIcon from '@material-ui/icons/LocalShipping';
import AccessibleIcon from '@material-ui/icons/Accessible';
import ContactIcon from '@material-ui/icons/ContactSupport';
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
  openAboutPopup,
  resetClickedMapObject, setPickedParkingBayId,
  toggleAccessibleMode,
  toggleShowLoadingZonesOnly,
  updateMapViewState
} from "../actions";
import ParkingInfoPanel from "./parking_info_panel";
import styled from 'styled-components';
import ParkingIconAtlas from '../assets/parking_icon_sprites.png';
import { AppBar, Hidden, IconButton, Toolbar, Typography } from '@material-ui/core';
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
  pickedParkingBayId?: string;
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
  toggleShowLoadingZonesOnly: () => void;
  toggleAccessibleMode: () => void;
  showAboutPopup: () => void;
  clearErrorMessage: () => void;
  setPickedParkingBayId: (pickedParkingBayId: string) => void;
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
  const {availableParkingSpaces, currentLocation, onParkingSpaceClicked, setPickedParkingBayId, pickedParkingBayId, hoverOnParkingIcon} = props;
  const layers = [
    buildIconLayer(
      'parking-spaces',
      ParkingIconAtlas,
      availableParkingSpaces,
      (info: any) => {
        setPickedParkingBayId(info.object.bayId);
        onParkingSpaceClicked(info);
      },
      hoverOnParkingIcon,
      (d: ClickedMapObjectPayload) => {
        // if (props.pickedParkingBayId !== undefined && props.pickedParkingBayId === d.bayId) return LTE_15_PARKING_ICON;
        return getParkingIconBaseOnRestriction(d.currentRestriction)
      },
      (d: ClickedMapObjectPayload) => {
        return (pickedParkingBayId !== undefined && pickedParkingBayId === d.bayId) ? 40 : 30;
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

type ToggleIconButtonProps = {
  selected: boolean;
};

const ToggleIconButton = styled(IconButton)`
// https://medium.com/sipios/use-styled-components-with-material-ui-react-e0759f9a15ce
  && {
    ${(props: ToggleIconButtonProps) => {
    if (props.selected) {
      return `
        color: white;
        `
      } else {
        return `
          color: rgba(255, 255, 255, 0.2);
        `
      }
    }}
  }
`;

const AboutIconButton = styled(IconButton)`
  && {
    color: #EEE;
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
            <ToggleIconButton selected={props.inAccessibleParkingMode} onClick={props.toggleAccessibleMode}>
              <AccessibleIcon/>
            </ToggleIconButton>
            <ToggleIconButton selected={props.showLoadingZonesOnly} onClick={props.toggleShowLoadingZonesOnly}>
              <LoadingZoneIcon/>
            </ToggleIconButton>
            <AboutIconButton onClick={props.showAboutPopup}>
              <ContactIcon/>
            </AboutIconButton>
          </StyledToolbar>
        </AppBar>
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
    errorMessage: state.errorMessage,
    pickedParkingBayId: state.pickedParkingBayId
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
    showAboutPopup: () => {
      dispatch(openAboutPopup());
    },
    toggleAccessibleMode: () => {
      dispatch(toggleAccessibleMode());
      dispatch(resetClickedMapObject());
    },
    clearErrorMessage: () => {
      dispatch(clearErrorMessage());
    },
    setPickedParkingBayId: (pickedParkingBayId: string) => {
      if (pickedParkingBayId !== undefined) {
        dispatch(setPickedParkingBayId(pickedParkingBayId));
      }
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ParkingMap);
