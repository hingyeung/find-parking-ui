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
      <div className={props.className + ' icon'}></div>
      <div className={props.className + ' desc'}>
        <Typography variant="body1" inline={true}>
          {props.desc}
        </Typography>
      </div>
    </div>
);
};
const LegendItem = styled(UnstyledLegendItem)`
  display: flex;
  margin: 1px 0;
  flex: 0 0 90%;
  @media (min-width: 420px) {
    margin: 2px 0;
    flex: 1 0 40%;
  }
  
  .icon {
    align-items: center;
    flex: 0 0 24px;
    background: url(${(props) => props.icon}) no-repeat center;
  }
  .desc {
    padding-left: 0.5rem;
  }
`;

export {LegendWrapper, LegendItem};