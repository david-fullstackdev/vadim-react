import * as types from '../constants/actionTypes';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';
import objectAssign from 'object-assign';

export function assignGroupage(groupageId, driverId) {
  return (dispatch) => {
    LoopbackHttp.assignGroupage(groupageId, driverId)
      .then((data) => {
        dispatch({
          type: types.GROUPAGE_ASSIGNED,
          groupageAssigned: Date.now(),
          groupage: data.status.groupage
        });
      })
      .catch(() => {
        dispatch({
          type: types.GROUPAGE_ASSIGN_FAILED
        });
      });
  };
}

export function unassignGroupage(groupageId) {
  return (dispatch) => {
    LoopbackHttp.unassignGroupage(groupageId)
      .then(() => {
        dispatch({
          type: types.GROUPAGE_UNASSIGNED,
          groupageUnassigned: Date.now()
        });
      })
      .catch(() => {

      });
  };
}

export function cancelOrder(order) {
  return (dispatch) => {
    LoopbackHttp.cancelOrder(order)
      .then(() => {
        dispatch({
          type: types.ORDER_CANCELED,
          orderCanceled: Date.now()
        });
      })
      .catch(() => {

      });
  };
}

export function showMarkerInfo(itemId, show) {
  return {
    type: show ? types.MAP_MARKER_SHOW_INFO : types.MAP_MARKER_HIDE_INFO,
    itemId
  };
}

export function setDateFilter(dateFilter) {
  return {
    type: types.DATE_FILTER_SET,
    dateFilter
  };
}

export function createGroupage(orderIds) {
  return (dispatch) => {
    LoopbackHttp.createGroupage(orderIds)
      .then((data) => {
        dispatch({
          type: types.GROUPAGE_CREATED,
          newGroupage: data,
          groupageCreated: Date.now(),
          loaded: true
        });
      })
      .catch(() => {

      });
  };
}

export function destroyGroupage(groupageId) {
  return (dispatch) => {
    LoopbackHttp.destroyGroupage(groupageId)
      .then(() => {
        dispatch({
          type: types.GROUPAGE_DESTROYED,
          groupageDestroyed: Date.now(),
          loaded: true
        });
      })
      .catch(() => {

      });
  };
}

export function updateOrder(orderId, order, fields) {
  let newOrder = objectAssign({}, order, fields);
  delete newOrder.selected;
  delete newOrder.items;
  return (dispatch) => {
    LoopbackHttp.updateOrder(orderId, newOrder)
      .then((data) => {
        dispatch({
          type: types.ORDER_UPDATED,
          orderUpdated: Date.now(),
          updatedOrder: data
        });
      })
      .catch(() => {

      });
  };
}

export function changeOrderListViewMode(viewMode) {
  return {
    type: types.ORDER_LIST_VIEW_MODE_CHANGED,
    orderListViewMode: viewMode || 'orders'
  };
}

export function changeDriverListViewMode(viewMode) {
  return {
    type: types.DRIVER_LIST_VIEW_MODE_CHANGED,
    driverListViewMode: viewMode || 'drivers'
  };
}

export function getGroupageGpsLog(groupageId) {
  return (dispatch) => {
    LoopbackHttp.getGroupageGpsLog(groupageId)
      .then((data) => {
        dispatch({
          type: types.GROUPAGE_GPS_LOGS_FETCHED,
          gpsLogs: data
        });
      })
      .catch(() => {

      });
  };
}

export function resentSMS(orderId) {
  return (dispatch) => {
    LoopbackHttp.resentSMS(orderId)
      .then(() => {
        dispatch({
          type: types.RESENT_SMS
        });
      })
      .catch(() => {

      });
  };
}

export function assignOnDriver(driverId, orders, userType) {
  return (dispatch) => {
    LoopbackHttp.assignOnDriver(driverId, orders, userType)
      .then(() => {
        dispatch({
          type: types.ASSIGN_ON_DRIVER,
          loaded: true
        });
      })
      .catch(() => {

      });
  };
}

export function unassignOrder(orderId) {
  return (dispatch) => {
    LoopbackHttp.unAssignOrder(orderId)
      .then(() => {
        dispatch({
          type: types.UNASSIGN_ORDER,
          data: data
        });
      })
      .catch(() => {

      });
  };
}

export function assignOnTeam(fields) {
  return (dispatch) => {
    LoopbackHttp.assignOnTeam(fields)
      .then(() => {
        dispatch({
          type: types.ASSIGN_ON_DRIVER,
          loaded: true
        });
      })
      .catch(() => {

      });
  };
}
