import { DATA_FETCHED } from '../constants/actionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';


export default function recipientReducer(state = initialState.recipientState, action) {

  switch (action.type) {

    case DATA_FETCHED:
      return objectAssign({}, state, {order: action.account.order, dispatcher: action.account.dispatcher, recipient: action.account.recipient});


    default:
      return state;
  }
}
