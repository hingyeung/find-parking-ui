import React from 'react';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import DirectionIcon from '@material-ui/icons/Directions';

type DirectionButtonProps = {
  className?: string;
  directionLink: string;
}
const DirectionButton: React.FunctionComponent<DirectionButtonProps> = props => {
  return <Button className={props.className} size="small" variant={'outlined'} color="primary" rel="noreferrer" target="_blank" href={props.directionLink}><DirectionIcon/>&nbsp;&nbsp;Directions</Button>
};

const StyledDirectionButton = styled(DirectionButton)`
  background-color: blue;
`;

export default StyledDirectionButton;