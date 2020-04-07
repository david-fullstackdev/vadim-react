import React, { PropTypes } from 'react';

import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';

import * as actions from '../actions/resetFormActions';

import ResetForm from '../components/ResetForm';

import LoopbackHttp from '../businessLogic/LoopbackHttp';

import { gettext } from '../i18n/service';

import * as appActions from '../actions/appActions';





export class ResetContainer extends React.Component {

  constructor(props, context) {

    super(props, context);

    this.submit = this.submit.bind(this);
    this.reset_close = this.reset_close.bind(this);

  }

  // AS: Move this to a middleware looking after user logged in

  componentDidMount() {

    // if (LoopbackHttp.isAuthenticated()) {

    //   this.props.router.push('/dispatcherDashboard');

    // }

  }

  // AS: Move this to a middleware looking after user logged in

  componentWillReceiveProps(nextProps) {

  }
  reset_close(e) {
    return this.props.router.replace('/login');
  }
  submit(e) {
    e.preventDefault();
    const elems = Array.from(e.target.elements);
    console.log(elems);
    let fields = elems.reduce((prev, curr) => {

      if (!curr.name) {
        return prev;
      }

      prev[curr.name] = curr.type === 'checkbox' ? curr.checked : curr.value;
      return prev;

    }, {});
    console.log(fields)
    this.props.actions.submit(fields, (request) => {
      request.then((data) => {
        if (data.status == 'success') {
          this.props.actions.onResetSuccess(data);
          this.props.showMessage({
            message: 'New password sent to your e-mail',
            level: 'success'
          });
          setTimeout(() => {
            return this.props.router.replace('/');
          }, 3000)
        }
        else
          return this.props.showMessage({
            title: 'Some error occured',
            message: 'Invalid credentials',
            level: 'error'
          });
      })
        .catch(error => {
          return this.props.showMessage({
            title: 'Some error occured',
            message: 'Invalid credentials',
            level: 'error'
          });
        });
    });

  }

  render() {
    return (
      <ResetForm
        submit={this.submit}
        reset_close={this.reset_close}
      />
    );
  }
}



ResetContainer.propTypes = {

  actions: PropTypes.object.isRequired,

  redirect: PropTypes.bool,

  history: PropTypes.object,

  showMessage: PropTypes.func.isRequired

};



function mapStateToProps(state) {

  return {

    error: state.resetFormReducer.error,

    request: state.resetFormReducer.request,

    loading: state.resetFormReducer.loading,

    redirect: state.resetFormReducer.redirect

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

)(ResetContainer);

