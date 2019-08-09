import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { ApplicationState } from '../types';
import { connect } from 'react-redux';

type QueryProgressBarProps = {
    showProgressBar: boolean;
};

const QueryProgressBar: React.FunctionComponent<QueryProgressBarProps> = (props) => {
    return (
        props.showProgressBar ? <LinearProgress variant="query" /> : <div />
    );
};

const mapStateToProps = (state: ApplicationState) => {
    return {
        showProgressBar: state.isLoading
    };
};

export default connect(mapStateToProps)(QueryProgressBar);