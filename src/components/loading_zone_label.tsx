import React from 'react';
import styled from 'styled-components';
import { ParkingSignColour } from './parking_sign';

const StyledLoadingZoneLabel = styled('div')`
  background-color: ${(props) => ParkingSignColour.LOADING_ZONE_SIGN_PRIMARY_COLOUR};
  color: white;
  border-radius: 5px;
  font-size: 0.8rem;
  text-transform: uppercase;
  padding: 4px;
  letter-spacing: 0.075;
  margin: 5px 0;
  
  @media (min-width: 420px) {
    font-size: 1rem;
  }
`;

export const LoadingZoneLabel: React.FunctionComponent = () => {
  return <StyledLoadingZoneLabel>Loading Zone</StyledLoadingZoneLabel>;
};