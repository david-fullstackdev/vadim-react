import { LOGGED_OUT, LOGOUT_FAILED } from '../constants/actionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';


export default function logoutPageReducer(state = initialState.logoutPageState, action) {

  switch (action.type) {
    case LOGGED_OUT:
      return objectAssign({}, state, { redirect: action.redirect });

    case LOGOUT_FAILED:
      return objectAssign({}, state, { redirect: action.redirect });

    default:
      return state;
  }
}
