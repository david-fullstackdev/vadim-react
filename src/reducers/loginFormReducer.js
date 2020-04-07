import { LOGIN_REQUEST_SENT, LOGGED_IN, LOGIN_FAILED, RESET_LOGIN_STATE } from '../constants/actionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';


export default function loginFormReducer(state = initialState.loginPageState, action) {

  switch (action.type) {
    case LOGIN_REQUEST_SENT:
      return objectAssign({}, state, { redirect: false, loading: true, error: null, request: action.request });

    case LOGGED_IN:
      return objectAssign({}, state, { redirect: true, loading: false, error: null, request: null });

    case LOGIN_FAILED:
      return objectAssign({}, state, { redirect: false, loading: false, error: action.error, request: null });

    case RESET_LOGIN_STATE:
      return objectAssign({}, state, { redirect: false, loading: false, error: null, request: null });

    default:
      return state;
  }
}
