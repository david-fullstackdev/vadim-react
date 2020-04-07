import * as types from '../constants/actionTypes';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';

export function submit(credentials, callback) {
  const request = LoopbackHttp.resentSMSForActive();
  if (typeof callback === 'function') {
    callback(request);
  }
  return {
    type: types.CONFIRMATION_REQUEST_SENT,
    request: request
  };
}

export function onConfirmationSuccess(authOpts) {
  return {
    type: types.CONFIRMATION_SUCCESS
  };
}

export function onConfirmationFailed(error) {
  return {
    type: types.CONFIRMATION_FAILED,
    error: error
  };
}