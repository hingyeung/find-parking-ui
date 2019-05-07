import React from 'react';
import { Snackbar as MuiSnackbar, SnackbarContent as MuiSnackbarContent} from '@material-ui/core';
import styled from 'styled-components';
import { SnackbarProps } from '@material-ui/core/Snackbar';

const StyledSnackbarContent = styled(MuiSnackbarContent)`
  && {
    background-color: ${props => 'rgb(205, 41, 41)'};
    justify-content: center;
  }
`;

const Snackbar: React.FunctionComponent<SnackbarProps> = (props) => {
  return (
    <MuiSnackbar {...props}>
      <StyledSnackbarContent message={<span>{props.message}</span>}/>
    </MuiSnackbar>
  );
};

Snackbar.defaultProps = {
  autoHideDuration: 5000, anchorOrigin: {vertical: 'bottom', horizontal: 'center'}
};

export default Snackbar;