import React from 'react';
import styled from 'styled-components';

type HourParkingSignProps = {
  hours: number;
  className?: string;
};

const HourParkingSign: React.FunctionComponent<HourParkingSignProps> = (props) => {
  return (
    <span className={props.className}>{Math.trunc(props.hours)}P</span>
  );
};

const StyledHourParkingSign = styled(HourParkingSign)`
  color: green;
  font-weight: bold;
`;

export default StyledHourParkingSign;