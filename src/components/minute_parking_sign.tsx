import * as React from 'react';
import styled from 'styled-components';

type MinuteParkingSignProps = {
  minutes: number;
  className?: string;
}

const StyledMinuteLabel = styled('span')`
  text-transform: uppercase;
  font-size: 75%;
`;

const MinuteParkingSign: React.FunctionComponent<MinuteParkingSignProps> = props => {
  return (
    <span className={props.className}>{Math.trunc(props.minutes)}<StyledMinuteLabel>minute</StyledMinuteLabel></span>
  )
};

const StyledMinuteParkingSign = styled(MinuteParkingSign)`
  color: green;
  font-weight: bold;
`;

export default StyledMinuteParkingSign