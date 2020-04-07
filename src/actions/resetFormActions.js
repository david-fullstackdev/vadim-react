import * as types from '../constants/actionTypes';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';

export function submit(credentials, callback) {
  const request = LoopbackHttp.sendResetRequest(credentials);
  if (typeof callback === 'function') {
    callback(request);
  }
  return {
    type: types.RESET_REQUEST_SENT,
    request: request
  };
}

export function onResetSuccess(authOpts) {
  return {
    type: types.RESET_SUCCESS
  };
}

export function onResetFailed(error) {
  return {
    type: types.RESET_FAILED,
    error: error
  };
}
