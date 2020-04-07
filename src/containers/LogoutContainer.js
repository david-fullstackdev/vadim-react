import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/logoutPageActions';

export class LogoutContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    this.props.actions.logout();
    this.props.router.push('/login');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.redirect) {
      this.props.router.push('/login');
    }
  }

  render() {
    return null;
  }
}



LogoutContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  history: PropTypes.object
};

function mapStateToProps(state) {
  return {
   redirect: state.logoutPageReducer.redirect
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogoutContainer);
