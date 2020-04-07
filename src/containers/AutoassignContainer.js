import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActions from '../actions/adminActions';
import * as actions from '../actions/appActions';

import Switcher from 'react-switcher';
import { gettext } from '../i18n/service.js';


export class AutoassignContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillReceiveProps(nextProps) {
    // if(nextProps.company.id && nextProps.company.autoAssign !== this.props.company.autoAssign)
      // this.props.actions.endSpinner();
  }


  render() {
    return (
      <div>
        <Switcher
          on={this.props.company.autoAssign}
          onClick={() => {
            // this.props.actions.startSpinner();
            this.props.adminActions.updateCompany(this.props.company.id, {autoAssign: !this.props.company.autoAssign});
          }}>
        </Switcher>
      </div>
    );
  }
}

AutoassignContainer.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    company: state.appReducer.company
  };
}

function mapDispatchToProps(dispatch) {
  return {
    adminActions: bindActionCreators(adminActions, dispatch),
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoassignContainer);
