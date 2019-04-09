import { ApplicationState } from '../types';
import { connect } from 'react-redux';
import React from 'react';
import HourParkingSign from './hour_parking_sign';
import MinuteParkingSign from './minute_parking_sign';
import UnknownRestrictionParkingSign from './unknown_restriction_parking_sign';
import styled from 'styled-components';

type ParkingSignType = {
  minutes: number | string;
  className?: string;
};

const ParkingSign: React.FunctionComponent<ParkingSignType> = (props) => {
  if (!props.minutes || typeof props.minutes === 'string') {
    return (
      <div className={props.className}>
        <UnknownRestrictionParkingSign/>
      </div>
    );
  }

  if ((props.minutes % 60) == 0) {
    return (
      <div className={props.className}>
        <HourParkingSign hours={props.minutes / 60} />
      </div>
    );
  } else {
    return (
      <div className={props.className}>
        <MinuteParkingSign minutes={props.minutes} />
      </div>
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