import React from 'react';
import { getCurrentPosition } from '../services/location_service';

interface ButtonProps {
  onClick(e: React.MouseEvent<HTMLElement>): void;
}

export default (props: ButtonProps) => {
  async function getCurrentLocation(e: React.MouseEvent<HTMLElement>) {
    const currentPosition = await getCurrentPosition();
    console.log(currentPosition);
    props.onClick(e);
  }

  return (
    <button onClick={getCurrentLocation}>click me</button>
  )
}
