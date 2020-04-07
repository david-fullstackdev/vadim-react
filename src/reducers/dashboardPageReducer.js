import { MAP_MARKER_SHOW_INFO, MAP_MARKER_HIDE_INFO, DATE_FILTER_SET, DRIVER_LIST_VIEW_MODE_CHANGED, GROUPAGE_ASSIGNED, GROUPAGE_UNASSIGNED, GROUPAGE_ASSIGN_FAILED, GROUPAGE_CREATED, GROUPAGE_DESTROYED, RESENT_SMS, ORDER_UPDATED, ORDER_CANCELED, ORDER_LIST_VIEW_MODE_CHANGED, GROUPAGE_GPS_LOGS_FETCHED, ASSIGN_ON_DRIVER } from '../constants/actionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';


export default function dashboardPageReducer(state = initialState.dashboardState, action) {
  let newSetOfItemIdsWithShowInfo;

  switch (action.type) {

    case GROUPAGE_ASSIGNED:
      return objectAssign({}, state, { groupageAssigned: action.groupageAssigned, groupage: action.groupage });

    case GROUPAGE_UNASSIGNED:
      return objectAssign({}, state, { groupageUnassigned: action.groupageUnassigned, loaded: action.loaded });

    case GROUPAGE_ASSIGN_FAILED:
      return state;

    case RESENT_SMS:
      return state;

    case MAP_MARKER_SHOW_INFO:
      newSetOfItemIdsWithShowInfo = new Set(state.setOfItemIdsWithShowInfo);
      newSetOfItemIdsWithShowInfo.add(action.itemId);
      return objectAssign({}, state, { setOfItemIdsWithShowInfo: newSetOfItemIdsWithShowInfo });

    case MAP_MARKER_HIDE_INFO:
      newSetOfItemIdsWithShowInfo = new Set(state.setOfItemIdsWithShowInfo);
      newSetOfItemIdsWithShowInfo.delete(action.itemId);
      return objectAssign({}, state, { setOfItemIdsWithShowInfo: newSetOfItemIdsWithShowInfo });

    case DATE_FILTER_SET:
      return objectAssign({}, state, { dateFilter: action.dateFilter });

    case GROUPAGE_CREATED:
      return objectAssign({}, state, { newGroupage: action.newGroupage, groupageCreated: action.groupageCreated, loaded: action.loaded });

    case GROUPAGE_DESTROYED:
      return objectAssign({}, state, { groupageDestroyed: action.groupageDestroyed, loaded: action.loaded });

    case ORDER_UPDATED:
      return objectAssign({}, state, { orderUpdated: action.orderUpdated, updatedOrder: action.updatedOrder });

    case ORDER_CANCELED:
      return objectAssign({}, state, { orderCanceled: action.orderCanceled });

    case ORDER_LIST_VIEW_MODE_CHANGED:
      return objectAssign({}, state, { orderListViewMode: action.orderListViewMode });

    case GROUPAGE_GPS_LOGS_FETCHED:
      return objectAssign({}, state, { gpsLogs: action.gpsLogs });



    default:
      return state;
  }
}
