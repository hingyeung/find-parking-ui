import React from 'react';
import DisabledIcon from '@material-ui/icons/Accessible'
import styled from 'styled-components';

const StyledDisabledIcon = styled(DisabledIcon)`
  && {
    font-size: 3rem;
  }
  color: white;
  background-color: rgb(37, 79, 141);
  padding: 3px;
`;

export const DisabledParkingLabel: React.FunctionComponent = () => {
  return (
    <StyledDisabledIcon/>
  )
};
