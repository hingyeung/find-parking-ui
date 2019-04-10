import React from 'react';
import styled from 'styled-components';

type ParkingSignTimeRangeProps = {
  timeRangeDesc?: string;
};

const StyledParkingSignTimeRange = styled('div')`
  font-size: 25%;
`;

const ParkingSignTimeRange: React.FunctionComponent<ParkingSignTimeRangeProps> = props => {
  return (
    <StyledParkingSignTimeRange>{props.timeRangeDesc}</StyledParkingSignTimeRange>
  )
};

export default ParkingSignTimeRange;