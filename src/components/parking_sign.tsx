import { ApplicationState } from '../types';
import { connect } from 'react-redux';
import React from 'react';
import HourParkingSign from './hour_parking_sign';
import MinuteParkingSign from './minute_parking_sign';
import UnknownRestrictionParkingSign from './unknown_restriction_parking_sign';
import styled from 'styled-components';
import ParkingSignTimeRange from './parking_sign_timerange';
import { LoadingZoneLabel } from './loading_zone_label';

export enum ParkingSignType {
  LOADING_ZONE_SIGN_TYPE = 'LOADING_ZONE_SIGN_TYPE',
  NORMAL_PARKING_SIGN_TYPE = 'NORMAL_PARKING_SIGN_TYPE',
  DISABLED_ONLY_SIGN_TYPE = 'DISABLED_ONLY_SIGN_TYPE'
}

export enum ParkingSignColour {
  LOADING_ZONE_SIGN_PRIMARY_COLOUR = 'rgb(218, 55, 50)',
  NORMAL_PARKING_SIGN_PRIMARY_COLOUR = 'green'
}

const getPrimaryColourForParkingSignType = (parkingSignType?: string) => {
  switch (parkingSignType) {
    case ParkingSignType.LOADING_ZONE_SIGN_TYPE:
      return ParkingSignColour.LOADING_ZONE_SIGN_PRIMARY_COLOUR;
    case ParkingSignType.NORMAL_PARKING_SIGN_TYPE:
      return ParkingSignColour.NORMAL_PARKING_SIGN_PRIMARY_COLOUR;
    default:
      return ParkingSignColour.NORMAL_PARKING_SIGN_PRIMARY_COLOUR;
  }
};

type ParkingSignProps = {
  minutes: number | string;
  className?: string;
  timeRangeDesc?: string;
  signType?: string;
};

const ParkingSignWrapper = styled('div')`
  text-align: center;
`;

const ParkingSign: React.FunctionComponent<ParkingSignProps> = (props) => {
  if (!props.minutes || typeof props.minutes === 'string') {
    return (
      <ParkingSignWrapper className={props.className}>
        <UnknownRestrictionParkingSign/>
      </ParkingSignWrapper>
    );
  }

  if ((props.minutes % 60) == 0) {
    return (
      <ParkingSignWrapper className={props.className}>
        <HourParkingSign primaryColour={getPrimaryColourForParkingSignType(props.signType)} hours={props.minutes / 60} />
        {props.signType === ParkingSignType.LOADING_ZONE_SIGN_TYPE && <LoadingZoneLabel/>}
        <ParkingSignTimeRange timeRangeDesc={props.timeRangeDesc}/>
      </ParkingSignWrapper>
    );
  } else {
    return (
      <ParkingSignWrapper className={props.className}>
        <MinuteParkingSign primaryColour={getPrimaryColourForParkingSignType(props.signType)} minutes={props.minutes} />
        {props.signType === ParkingSignType.LOADING_ZONE_SIGN_TYPE && <LoadingZoneLabel/>}
        <ParkingSignTimeRange timeRangeDesc={props.timeRangeDesc}/>
      </ParkingSignWrapper>
    );
  }
};

const mapStateToProps = (state: ApplicationState) => {
  return {};
};

export default connect(mapStateToProps)(ParkingSign);