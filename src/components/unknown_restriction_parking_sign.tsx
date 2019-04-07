import React from 'react';
import styled from 'styled-components';

const UnknownRestrictionParkingSign: React.FunctionComponent<React.HTMLProps<HTMLButtonElement>> = props => {
  return (
    <span className={props.className}>?P</span>
  )
};

const StyledUnknownRestrictionParkingSign = styled(UnknownRestrictionParkingSign)`
  color: green;
  font-weight: bold;
`;

export default StyledUnknownRestrictionParkingSign;