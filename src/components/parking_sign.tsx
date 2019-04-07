import { ApplicationState } from '../types';
import { connect } from 'react-redux';
import React from 'react';
import HourParkingSign from './hour_parking_sign';
import MinuteParkingSign from './minute_parking_sign';

type ParkingSignType = {
  minutes: number;
  className?: string;
};

const ParkingSign: React.FunctionComponent<ParkingSignType> = (props) => {
  if (!props.minutes) {
    return <span>U</span>;
  }

  if ((props.minutes % 60) == 0) {
    return <HourParkingSign hours={props.minutes / 60} />;
  } else {
    return <MinuteParkingSign minutes={props.minutes} />;
  }
};

const mapStateToProps = (state: ApplicationState) => {
  return {};
};

export default connect(mapStateToProps)(ParkingSign);