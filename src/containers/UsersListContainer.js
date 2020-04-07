import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/adminActions';
import * as appActions from '../actions/appActions';
import UsersList from '../components/UsersList';
import _ from 'lodash';
import { gettext } from '../i18n/service';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';

export class UsersListContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.showUserInfo = this.showUserInfo.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.users = props.users;
  }

  componentDidMount(){
  }

  showUserInfo(user) {
    if (user.role === 'driver') {
      return this.props.router.push(`/driverInfo/${user.id}`);
    }
    if (user.role === 'dispatcher') {
      return this.props.router.push(`/editDispatcher/${user.id}`);
    }
    if(LoopbackHttp.isAdministrator){
      if (user.role === 'dispatcher-platform') {
        return this.props.router.push(`/editPlatform/${user.id}`);
      }
      if (user.role === 'operator') {
        return this.props.router.push(`/editOperator/${user.id}`);
      }
    }
  }

  deleteUser(user) {
    if(LoopbackHttp.isAdministrator){
      var role;

      if(user.role==='dispatcher')
        role='Dispatcher';
      else if(user.role==='dispatcher-platform')
        role='DispatcherPlatform';
      else if(user.role==='operator')
        role='Operator';
      else if(user.role==='driver')
        role='Driver';

      this.props.actions.deleteUser(role, user.id);
        _.pull(this.users, user);

      this.props.showMessage({
        message: user.firstName+ ' '+ gettext('HAS-BEEN-DELETED'),
        level: 'success'
      });

      this.forceUpdate();
    }
  }

  render() {
    const renderUsers = _(this.users)
      .sortBy((user) => Date.parse(user.createdAt)).value();
    return (
      <UsersList
        users={renderUsers}
        showUserInfo={this.showUserInfo}
        deleteUser={this.deleteUser}
      />
    );
  }
}




UsersListContainer.propTypes = {
  users: PropTypes.array,
  showMessage: PropTypes.func.isRequired,
  actions: PropTypes.object
};

function mapStateToProps(state) {
  return {
   users: state.appReducer.users
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
)(UsersListContainer);
