import styled from 'styled-components';
import React from 'react';
import { Typography } from '@material-ui/core';

const LegendWrapper = styled('div')`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

type LegendItemProps = {
  icon: string;
  desc: string;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
const UnstyledLegendItem: React.FunctionComponent<LegendItemProps> = (props) => {
  return (
    <div className={props.className}>
  <img src={props.icon}/>
  <Typography variant="body1" inline={true}>
    {props.desc}
  </Typography>
  </div>
);
};
const LegendItem = styled(UnstyledLegendItem)`
  flex: 1 0 40%;
  img {
    vertical-align: text-bottom;
    margin-right: 1rem;
  }
`;

export {LegendWrapper, LegendItem};