import * as types from '../constants/actionTypes';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';

export function getDispatcher(orderId) {
  return (dispatch) => {
    LoopbackHttp.getDispatcher(orderId)
      .then((data) => {
        dispatch({
          type: types.DATA_FETCHED,
          account: data
        });
      })
      .catch(() => {
        //todo handle error properly
      });
  };
}

export function updateOrderFromRecipient(orderId, recipientId, fields) {
  return (dispatch) => {
    LoopbackHttp.updateOrderFromRecipient(orderId, recipientId, fields)
      .then((data) => {
        dispatch({
          type: types.ORDER_UPDATED_RECIPIENT,
          orderUpdated: Date.now(),
          updatedOrder: data
        });
      })
      .catch(() => {
        //todo handle error properly
      });
  };
}

export function updateRecipient(recipientId, fields) {
  return (dispatch) => {
    LoopbackHttp.updateRecipient(recipientId, fields)
      .then((data) => {
        dispatch({
          type: types.RECIPIENT_UPDATED,
          account: data
        });
      })
      .catch(() => {
        //todo handle error properly
      });
  };
}
