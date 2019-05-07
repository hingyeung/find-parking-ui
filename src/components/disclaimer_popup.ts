import { ApplicationState } from '../types';
import { Dispatch } from 'redux';
import { closeDisclaimerPopupAlert } from '../actions';
import { connect } from 'react-redux';
import SimpleTextPopupAlert from './simple_text_popup';

const mapStateToProps = (state: ApplicationState) => {
  return {
    showPopupAlert: state.showDisclaimerPopup
  }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    closePopupAlert: () => {dispatch(closeDisclaimerPopupAlert())}
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SimpleTextPopupAlert);