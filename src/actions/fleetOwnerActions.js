import * as types from '../constants/actionTypes';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';
// import { addBillingCall } from '../businessLogic/addBiling';
import { showLoading, hideLoading } from 'react-redux-loading-bar'


export function createOrder(userType, fields) {
  return (dispatch) => {
    LoopbackHttp.createFleetOrder(userType, fields)
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

export function getUsers(companyId) {
  return (dispatch) => {
    dispatch(showLoading());
    LoopbackHttp.getCompanyUsers(companyId)
      .then((data) => {
        dispatch({
          type: types.USERS_FETCHED,
          users: data
        });
        dispatch(hideLoading());
      })
      .catch(() => {
        dispatch({
          type: types.USERS_FETCH_FAILED
        });
      });
  };
}

export function getOperatorUsers(operatorId) {
  return (dispatch) => {
    LoopbackHttp.getOperatorUsers(operatorId)
      .then((data) => {
        dispatch({
          type: types.USERS_FETCHED,
          users: data
        });
      })
      .catch(() => {
        dispatch({
          type: types.USERS_FETCH_FAILED
        });
      });
  };
}

export function createUser(teamId, userType, fields) {
  return (dispatch) => {
    LoopbackHttp.createUserWithTeam(teamId, userType, fields)
      .then((data) => {
        dispatch({
          type: types.USER_CREATED,
          createdUser: data
        });
      })
      .catch((data) => {
        dispatch({
          type: types.USER_CREATION_FAILED,
          error: data
        });
      });
  };
}

export function createDriver(fields) {
  return (dispatch) => {
    LoopbackHttp.createDriver(fields)
      .then((data) => {
        dispatch({
          type: types.USER_CREATED,
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

export function updateUser(teamId, userType, fields) {
  return (dispatch) => {
    LoopbackHttp.updateUserWithTeam(teamId, userType, fields)
      .then((data) => {
        dispatch({
          type: types.LOCAL_USER_UPDATED,
          user: data
        });
      })
      .catch(() => {

      });
  };
}

export function removeUser(teamId, userType, userId) {
  return (dispatch) => {
    LoopbackHttp.removeUser(teamId, userType, userId)
      .then((data) => {
        dispatch({
          type: types.USER_DELETED
        });
      });
  };
}

export function createTeam(companyId, fields) {
  return (dispatch) => {
    LoopbackHttp.createTeam(companyId, fields)
      .then((data) => {
        dispatch({
          type: types.TEAM_CREATED,
          team: data
        });
      })
  };
}

export function updateTeam(teamId, fields) {
  return (dispatch) => {
    LoopbackHttp.updateTeam(teamId, fields)
      .then((data) => {
        dispatch({
          type: types.TEAM_UPDATED,
          team: data
        });
      })
  };
}

export function deleteTeam(teamId) {
  return (dispatch) => {
    LoopbackHttp.deleteTeam(teamId)
      .then((data) => {
        dispatch({
          type: types.TEAM_DELETED,
          teamToDelete: teamId
        });
      })
  };
}

export function addToTeam(teamId, role, userId) {
  return (dispatch) => {
    LoopbackHttp.addToTeam(teamId, role, userId)
      .then((data) => {
        dispatch({
          type: types.USER_ADDED_TO_TEAM,
          status: data
        });
      })
  };
}

export function removeFromTeam(teamId, role, userId) {
  return (dispatch) => {
    LoopbackHttp.removeFromTeam(teamId, role, userId)
      .then((data) => {
        dispatch({
          type: types.USER_REMOVED_FROM_TEAM
        });
      })
  };
}

export function updateUserProfile(id, fields) {
  return (dispatch) => {
    LoopbackHttp.updateUserProfile(id, fields)
      .then((data) => {
        dispatch({
          type: types.ACCOUNT_UPDATED,
          account: data
        });
      })
  };
}

export function addPickupPointsToStore(points) {
  return {
    type: types.PICKUP_POINTS_SAVED,
    pickUpPoints: points
  };
}

export function addUsersToStore(users) {
  return {
    type: types.USERS_SAVED,
    users: users,
    loaded: true
  };
}

export function addBilling(form) {
  return (dispatch) => {
    addBillingCall(form)
      .then((data) => {
        dispatch({
          type: types.ADD_BILLING
        });
      })
  };
}

export function getOperatorOrders() {

  return (dispatch) => {
    dispatch(showLoading());
    LoopbackHttp.getOperatorOrders()
      .then((data) => {
        dispatch({
          type: types.ORDERS_FETCHED,
          orders: data
        });
        dispatch(hideLoading());
      })
      .catch(() => {
        dispatch({
          type: types.ORDERS_FETCH_FAILED
        });
        dispatch(hideLoading());
      });
  };
}

export function addSomeOrdersToHistory(companyId, endTime) {
  return (dispatch) => {
    dispatch(showLoading());
    LoopbackHttp.addSomeOrdersToHistory(companyId, endTime)
      .then((data) => {
        dispatch({
          type: types.ORDERS_ADDED_TO_HISTORY,
          orders: data
        });
        dispatch(hideLoading());
      })
      .catch(() => {
        dispatch({
          type: types.ADDING_ORDERS_TO_HISTORY_FAILDED
        });
      });
  };
}

export function getFleetOrders(companyId) {
  return (dispatch) => {
    dispatch(showLoading());
    LoopbackHttp.getFleetOrders(companyId)
      .then((data) => {
        dispatch({
          type: types.ORDERS_FETCHED,
          orders: data
        });
        dispatch(hideLoading());
      })
      .catch((data) => {
        dispatch({
          type: types.ORDERS_FETCH_FAILED
        });
        dispatch(hideLoading());
      });
  };
}

export function getTodayOrders(companyId) {
  return (dispatch) => {
    dispatch(showLoading());
    LoopbackHttp.getTodayOrders(companyId)
      .then((data) => {
        dispatch({
          type: types.ORDERS_FETCHED,
          orders: data
        });
        dispatch(hideLoading());
      })
      .catch((data) => {
        dispatch({
          type: types.ORDERS_FETCH_FAILED
        });
        dispatch(hideLoading());
      });
  };
}

export function addNewCard(fields) {

  return (dispatch) => {
    LoopbackHttp.addNewCard(fields)
      .then((data) => {
        dispatch({
          type: types.CARD_ADDED,
          card: data
        });
      })
      .catch(() => {
        dispatch({
          type: types.CARD_FAILED
        });
      });
  };
}

export function getCards(id) {
  return (dispatch) => {
    LoopbackHttp.getCards(id)
      .then((data) => {
        dispatch({
          type: types.CARDS_FETCHED,
          cards: data
        });
      })
      .catch(() => {
      });
  };
}


export function deleteCard(fleetId, cardId) {
  return (dispatch) => {
    LoopbackHttp.deleteCard(fleetId, cardId)
      .then((data) => {
        dispatch({
          type: types.CARD_DELETED,
          cardId: cardId
        });
      })
      .catch(() => {
      });
  };
}

export function purchase(body, billId) {
  return (dispatch) => {
    LoopbackHttp.purchase(body, billId)
      .then((data) => {
        dispatch({
          type: types.PURCHASE_SUCCEED,
          response: data
        });
      })
      .catch((data) => {
        dispatch({
          type: types.PURCHASE_NOT_SUCCEED
        });
      });
  };
}

export function updateBill(fields) {
  return (dispatch) => {
    LoopbackHttp.updateBill(fields)
      .then((data) => {
        dispatch({
          type: types.BILL_UPDATED,
          response: data
        });
      })
      .catch(() => {

      });
  };
}
export function resetCashOnDelivery(id) {
  return (dispatch) => {
    LoopbackHttp.resetDriverCashOnDelivery(id)
      .then((data) => {
        dispatch({
          type: types.RESET_CASH_ON_DELIVERY,
          response: data
        });
      })
      .catch(() => {

      });
  };
}
