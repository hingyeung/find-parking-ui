import React from 'react';
import styled from 'styled-components';

type HourParkingSignProps = {
  hours: number;
  className?: string;
  primaryColour?: string;
};

const HourParkingSign: React.FunctionComponent<HourParkingSignProps> = (props) => {
  return (
    <div className={props.className}>{Math.trunc(props.hours)}P</div>
  );
};

const StyledHourParkingSign = styled(HourParkingSign)`
  color: ${(props) => props.primaryColour};
  font-weight: bold;
  font-size: 3rem;
  
  @media (min-width: 420px) {
    font-size: 4rem;
  }
`;

export default StyledHourParkingSign;