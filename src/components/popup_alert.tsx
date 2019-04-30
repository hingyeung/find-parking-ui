import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { ApplicationState } from '../types';
import { Dispatch } from 'redux';
import { closePopupAlert } from '../actions';
import { connect } from 'react-redux';

type PopupAlertProps = {
  title: string;
  closePopupAlert: () => void;
  showPopupAlert: boolean;
}

const PopupAlert: React.FunctionComponent<PopupAlertProps> = (props) => {
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

const mapStateToProps = (state: ApplicationState) => {
  return {
    showPopupAlert: state.showPopupAlert
  }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    closePopupAlert: () => {dispatch(closePopupAlert())}
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(PopupAlert);