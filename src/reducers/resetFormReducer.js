import { RESET_REQUEST_SENT, RESET_FAILED } from '../constants/actionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';


export default function resetFormReducer(state = initialState.resetPageState, action) {

  switch (action.type) {
    case RESET_REQUEST_SENT:
      return objectAssign({}, state, { redirect: false, loading: false, error: null, request: action.request });

    case RESET_FAILED:
      return objectAssign({}, state, { redirect: false, loading: false, error: action.error, request: null });

    default:
      return state;
  }
}
