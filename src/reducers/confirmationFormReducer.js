import {CONFIRMATION_REQUEST_SENT} from '../constants/actionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';


export default function confirmationFormReducer(state = initialState.loginPageState, action) {

  switch (action.type) {
    case CONFIRMATION_REQUEST_SENT:
      return objectAssign({}, state, { redirect: false, loading: true, error: null, request: action.request });

    case CONFIRMATION_SUCCESS:
      return objectAssign({}, state, { redirect: true, loading: false, error: null, request: null });

    case CONFIRMATION_FAILED:
      return objectAssign({}, state, { redirect: false, loading: false, error: action.error, request: null });

    default:
      return state;
  }
}
