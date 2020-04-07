import {ORDER_CREATED, ORDER_CREATION_FAILED, PICKUPPOINTS_FETCHED} from '../constants/actionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';


export default function orderCreationReducer(state = initialState.orderCreationState, action) {

  switch (action.type) {
    case ORDER_CREATED:
      return objectAssign({}, state, {orderCreated: action.orderCreated, createdStuff: action.createdStuff});

    case ORDER_CREATION_FAILED:
      return state;

    case PICKUPPOINTS_FETCHED:
      return objectAssign({}, state, {dispatcherPickUpPoints: action.pickUpPoints});

    default:
      return state;
  }
}
