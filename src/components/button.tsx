import React from 'react';
import { getCurrentPosition } from '../services/location_service';
import {Coordinate} from '../types';

interface ButtonProps {
  onClick(currentPosition: Coordinate): void;
}

export default (props: ButtonProps) => {
  async function getCurrentLocation(e: React.MouseEvent<HTMLElement>) {
    const currentPosition = await getCurrentPosition();
    console.log(currentPosition);
    props.onClick(currentPosition);
  }

  return (
    <button onClick={getCurrentLocation}>click me</button>
  )
}
