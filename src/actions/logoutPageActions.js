import * as types from '../constants/actionTypes';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';

export function logout() {
  return (dispatch) => {
    LoopbackHttp.logout();
    dispatch({
      type: types.LOGGED_OUT,
      redirect: Date.now()
    });
    //if any trouble
    // dispatch({
    //   type: types.LOGOUT_FAILED,
    //   redirect: false
    // });
    if(window)
      window.location.reload();
  };
}
