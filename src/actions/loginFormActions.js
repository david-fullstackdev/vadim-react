import * as types from '../constants/actionTypes';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';

export function submit(credentials, callback) {
  const request = LoopbackHttp.sendLoginRequest(credentials);
  if (typeof callback === 'function') {
    callback(request);
  }
  return {
    type: types.LOGIN_REQUEST_SENT,
    request: request
  };
}

export function onLoginSuccess(authOpts) {
  LoopbackHttp.login(authOpts);
  return {
    type: types.LOGGED_IN
  };
}

export function onLoginFailed(error) {
  return {
    type: types.LOGIN_FAILED,
    error: error
  };
}

export function resetState() {
  return {
    type: types.RESET_LOGIN_STATE
  };
}
