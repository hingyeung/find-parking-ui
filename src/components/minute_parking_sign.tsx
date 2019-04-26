import * as React from 'react';
import styled from 'styled-components';

type MinuteParkingSignProps = {
  minutes: number;
  className?: string;
  primaryColour?: string;
}

const StyledMinuteLabel = styled('span')`
  text-transform: uppercase;
  font-size: 30%;
`;

const MinuteParkingSign: React.FunctionComponent<MinuteParkingSignProps> = props => {
  return (
    <div className={props.className}>{Math.trunc(props.minutes)}<StyledMinuteLabel>minutes</StyledMinuteLabel></div>
  )
};

const StyledMinuteParkingSign = styled(MinuteParkingSign)`
  color: ${(props) => props.primaryColour};
  font-weight: bold;
`;

export default StyledMinuteParkingSign