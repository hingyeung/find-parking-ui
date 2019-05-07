import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

type PopupAlertProps = {
  title: string;
  closePopupAlert: () => void;
  showPopupAlert: boolean;
}

const SimpleTextPopupAlert: React.FunctionComponent<PopupAlertProps> = (props) => {
  return (
    <Dialog open={props.showPopupAlert}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.closePopupAlert} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
};

export default SimpleTextPopupAlert;
