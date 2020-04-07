import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/loginFormActions';
import LoginForm from '../components/LoginForm';
import LoopbackHttp from '../businessLogic/LoopbackHttp';
import { gettext } from '../i18n/service';
import * as appActions from '../actions/appActions';
export class LoginContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.submit = this.submit.bind(this);
    this.reset_password = this.reset_password.bind(this);
    this.props.appActions.showHeaderInfo(false);
  }
  // AS: Move this to a middleware looking after user logged in
  componentDidMount() {
    // if (LoopbackHttp.isAuthenticated()) {
    //   this.props.router.push('/dispatcherDashboard');
    // }
  }
  // AS: Move this to a middleware looking after user logged in
  componentWillReceiveProps(nextProps) {
    if (nextProps.redirect) {
      // Redirect to a proper url depending on user type
      if (localStorage.getItem('auth_token') === 'undefined') {
        this.props.appActions.endSpinner();
        this.props.showMessage({
          message: gettext('INVALID-CREDS'),
          level: 'error'
        });
      }
      setTimeout(() => {
        this.props.actions.resetState();
      }, 0);
      if (LoopbackHttp.isDispatcher) {
        if (LoopbackHttp.isUserActive()) {
          return this.props.router.replace('/dispatcherDashboard');
        }
        else {
          return this.props.router.replace('/confirmation');
        }
      } else if (LoopbackHttp.isOperator) {
        return this.props.router.replace('/dashboard');
      } else if (LoopbackHttp.isAdministrator) {
        return this.props.router.replace('/admindashboard');
      } else if (LoopbackHttp.isFleet) {
        // return this.props.router.replace('/fleetOwnerDashboard');
        if (localStorage.getItem('dashboardType') === 'onDemand')
          this.props.router.replace('/onDemandDashboard');
        else
          return this.props.router.replace('/fleetOwnerDashboard');
      }
    }
    if (nextProps.error) {
      this.props.showMessage({
        title: gettext('ERROR-OCCURED'),
        message: nextProps.error,
        level: 'error',
        autoDismiss: 10
      });
    }
    if (nextProps.loading) {
      //todo maybe show spinner or something
    }
  }
  reset_password(e) {
    console.log('reset');
    return this.props.router.replace('/reset');
  }
  submit(e) {
    e.preventDefault();
    const elems = Array.from(e.target.elements);
    let fields = elems.reduce((prev, curr) => {
      if (!curr.name) {
        return prev;
      }
      prev[curr.name] = curr.type === 'checkbox' ? curr.checked : curr.value;
      return prev;
    }, {});
    this.props.actions.submit(fields, (request) => {
      request.then((data) => {
        if (typeof data.user !== 'string') {
          this.props.actions.onLoginSuccess(data);
          this.props.appActions.showHeaderInfo(true);
        }
        else
          return this.props.showMessage({
            message: data.user,
            level: 'error'
          });
      })
        .catch((data) => {
          this.props.actions.onLoginFailed('Invalid credentials');
        });
    });
  }
  render() {
    return (
      <LoginForm
        submit={this.submit}
        reset_password={this.reset_password}
      />
    );
  }
}
LoginContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  redirect: PropTypes.bool,
  history: PropTypes.object,
  showMessage: PropTypes.func.isRequired
};
function mapStateToProps(state) {
  return {
    error: state.loginFormReducer.error,
    request: state.loginFormReducer.request,
    loading: state.loginFormReducer.loading,
    redirect: state.loginFormReducer.redirect
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
)(LoginContainer);
