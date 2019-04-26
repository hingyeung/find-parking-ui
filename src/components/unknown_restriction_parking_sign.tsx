import React from 'react';
import styled from 'styled-components';
import { ParkingSignColour } from './parking_sign';

const UnknownRestrictionParkingSign: React.FunctionComponent<React.HTMLProps<HTMLButtonElement>> = props => {
  return (
    <span className={props.className}>?P</span>
  )
};

const StyledUnknownRestrictionParkingSign = styled(UnknownRestrictionParkingSign)`
  color: ${(props) => ParkingSignColour.NORMAL_PARKING_SIGN_PRIMARY_COLOUR};
  font-weight: bold;
  font-size: 3rem;
  
  @media (min-width: 420px) {
    font-size: 4rem;
  }
`;

export default StyledUnknownRestrictionParkingSign;