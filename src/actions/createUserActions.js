import * as types from '../constants/actionTypes';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';
 
export function createUser(userType, fields) {
  const opts = { userType, fields };
  return (dispatch) => {
    LoopbackHttp.createUser(opts)
      .then((data) => {
        dispatch({
          type: types.USER_CREATED,
          userCreated: Date.now(),
          createdUser: data
        });
      })
      .catch(() => {
        dispatch({
          type: types.USER_CREATION_FAILED
        });
      });
  };
}

export function CreateDispatcherPlatform(fields) {
  const opts = {fields};
  return (dispatch) => {
    LoopbackHttp.CreateDispatcherPlatform(opts)
      .then((data) => {
        dispatch({
          type: types.USER_CREATED,
          userCreated: Date.now(),
          createdUser: data
        });
      })
      .catch(() => {
        dispatch({
          type: types.USER_CREATION_FAILED
        });
      });
  };
}

export function createDefaultPickUpPoint(fields) {
  return (dispatch) => {
    LoopbackHttp.createPickUpPoint(fields)
      .then((data) => {
        dispatch({
          type: types.PICKPOINT_CREATED,
          pickUpPointCreated: Date.now(),
          createdPickUpPoint: data
        });
      })
      .catch(() => {
        //todo handle this
      });
  };
}

export function updatePickUpPoint(point) {
  return (dispatch) => {
    LoopbackHttp.updatePickUpPoint(point)
      .then((data) => {
        dispatch({
          type: types.PICKPOINT_UPDATED,
          updatedPickUpPoint: data
        });
      })
      .catch(() => {
        //todo handle this
      });
  };
}
