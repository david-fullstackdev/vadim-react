import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/confirmationFormActions';
import ConfirmationForm from '../components/confirmationForm';
import LoopbackHttp from '../businessLogic/LoopbackHttp';
import { gettext } from '../i18n/service';
import * as appActions from '../actions/appActions';

export class ConfirmationContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.submit = this.submit.bind(this);
  }

  render() {
    return (
      <ConfirmationForm
        submit={this.submit}
        />
    );
  }
  submit(e) {
    e.preventDefault();
    const elems = Array.from(e.target.elements);
    this.props.actions.submit(elems, (request) => {
      request.then((data) => {
        if(data.status=='success'){
          this.props.actions.onConfirmationSuccess(data);
          return this.props.showMessage({
            message: 'Sent',
            level: 'error'
        });
        }
        else
          return this.props.showMessage({
            message: data.status,
            level: 'error'
        });
      })
      .catch((data) => {
        this.props.actions.onConfirmationFailed(data.message);
      });
    });

  }
}



ConfirmationContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  redirect: PropTypes.bool,
  history: PropTypes.object
};

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    appActions: bindActionCreators(appActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmationContainer);
