import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/appActions';
import PlatformEditComponent from '../components/accounts/PlatformEditComponent';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';
import objectAssign from 'object-assign';
import _ from 'lodash';
import { gettext } from '../i18n/service';

export class PatformEditContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    if (!props.account) {
      return this.props.showMessage({
        message: gettext('CANNOT-GET-USER'),
        level: 'error'
      });
    }
    this.isAdministrator = LoopbackHttp.isAdministrator;
    this.saveChanges = this.saveChanges.bind(this);


    if (!Object.keys(this.props.account).length) {
      this.props.showMessage({
        message: gettext('CANNOT-GET-DATA-FROM-SERVER'),
        level: 'error',
        position: 'tc',
        autoDismiss: 0
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountUpdated !== this.accountUpdated) {
      this.accountUpdated = nextProps.accountUpdated;
      this.props.showMessage({
        message: gettext('ACCOUNT-CHANGES-SAVED'),
        level: 'success'
      });
    }
  }

  saveChanges(e) {
    e.preventDefault();

    const fields = _.reduce(e.target.elements, (_fields, elem) => {
      _fields[elem.name] = elem.value;
      return _fields;
    }, {});

    if (fields.password && fields.confirmPassword !== fields.password) {
      return this.props.showMessage({
        message: gettext('CONFIRM-NEW-PASSWORD'),
        level: 'error'
      });
    }


    let newAccount = objectAssign({}, this.props.account);
    _.forEach(Object.keys(newAccount), (key) => {
      if (!fields[key]) {
        return;
      }
      newAccount[key] = fields[key];
    });

    const accountId = newAccount.id;
    delete newAccount.id;

    this.props.actions.updatePlatform(accountId, newAccount);

  }

  render() {
    if (!Object.keys(this.props.account).length) {
      return (
        <div>{ gettext('CANNOT-GET-USER') }</div>
      );
    }

    return (
      <PlatformEditComponent
        fields={this.props.account}
        saveChanges={this.saveChanges}
      />
    );
  }
}


PatformEditContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  createUserActions: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  accountUpdated: PropTypes.number.isRequired,
  showMessage: PropTypes.func.isRequired
};

function mapStateToProps(state, props) {
  const account = props.params.platformId ?
    _.find(state.appReducer.users, {id: props.params.platformId}) :
    state.appReducer.account;
  return {
    account: account,
    accountUpdated: state.appReducer.accountUpdated
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
)(PatformEditContainer);
