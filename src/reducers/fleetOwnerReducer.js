import {ORDER_LIST_VIEW_MODE_CHANGED, DRIVERS_LOCATION_UPDATED} from '../constants/actionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';


export default function fleetOwnerReducer(state = initialState.fleetOwnerState, action) {
  switch (action.type) {

    case ORDER_LIST_VIEW_MODE_CHANGED:
      return objectAssign({}, state, {orderListViewMode: action.orderListViewMode});

    case DRIVERS_LOCATION_UPDATED:
      return objectAssign({}, state, {driversLocations: action.driversLocations});

    default:
      return state;
  }
}
