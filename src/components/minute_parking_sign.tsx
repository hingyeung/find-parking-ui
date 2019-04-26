import * as React from 'react';
import styled from 'styled-components';

type MinuteParkingSignProps = {
  minutes: number;
  className?: string;
  primaryColour?: string;
}

const StyledMinuteLabel = styled('span')`
  text-transform: uppercase;
  font-size: 1rem;
`;

const MinuteParkingSign: React.FunctionComponent<MinuteParkingSignProps> = props => {
  return (
    <div className={props.className}>{Math.trunc(props.minutes)}<StyledMinuteLabel>minute</StyledMinuteLabel></div>
  )
};

const StyledMinuteParkingSign = styled(MinuteParkingSign)`
  color: ${(props) => props.primaryColour};
  font-weight: bold;
  font-size: 3rem;
  
  @media (min-width: 420px) {
    font-size: 4rem;
  }
`;

export default StyledMinuteParkingSign