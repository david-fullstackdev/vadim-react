import * as types from '../constants/actionTypes';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';

export function createOrder(fields) {
  return (dispatch) => {
    LoopbackHttp.createOrder(fields)
      .then((data) => {
        dispatch({
          type: types.ORDER_CREATED,
          orderCreated: Date.now(),
          createdStuff: data
        });
      })
      .catch(() => {
        dispatch({
          type: types.ORDER_CREATION_FAILED
        });
      });
  };
}

export function createOrderByOperator(fields) {
  return (dispatch) => {
    LoopbackHttp.createOrderByOperator(fields)
      .then((data) => {
        dispatch({
          type: types.ORDER_CREATED,
          orderCreated: Date.now(),
          createdStuff: data
        });
      })
      .catch(() => {
        dispatch({
          type: types.ORDER_CREATION_FAILED
        });
      });
  };
}
