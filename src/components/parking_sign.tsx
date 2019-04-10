import { ApplicationState } from '../types';
import { connect } from 'react-redux';
import React from 'react';
import HourParkingSign from './hour_parking_sign';
import MinuteParkingSign from './minute_parking_sign';
import UnknownRestrictionParkingSign from './unknown_restriction_parking_sign';
import styled from 'styled-components';
import ParkingSignTimeRange from './parking_sign_timerange';

type ParkingSignType = {
  minutes: number | string;
  className?: string;
  timeRangeDesc?: string;
};

const ParkingSignWrapper = styled('div')`
  text-align: center;
`;

const ParkingSign: React.FunctionComponent<ParkingSignType> = (props) => {
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
        <HourParkingSign hours={props.minutes / 60} />
        <ParkingSignTimeRange timeRangeDesc={props.timeRangeDesc}/>
      </ParkingSignWrapper>
    );
  } else {
    return (
      <ParkingSignWrapper className={props.className}>
        <MinuteParkingSign minutes={props.minutes} />
        <ParkingSignTimeRange timeRangeDesc={props.timeRangeDesc}/>
      </ParkingSignWrapper>
    );
  }
};

const StyledParkingSign = styled(ParkingSign)`
  font-size: 300%;
`;

const mapStateToProps = (state: ApplicationState) => {
  return {};
};

export default connect(mapStateToProps)(StyledParkingSign);