import * as types from '../constants/actionTypes';
import LoopbackHttp, { getUserType } from '../businessLogic/LoopbackHttp.js';
import { setLocale } from '../i18n/service';
import { showLoading, hideLoading } from 'react-redux-loading-bar'


const convertArrToObj = (arr) => {
  return arr.reduce(function (prev, curr) {
    prev[curr.id] = curr;
    return prev;
  }, {});
};

export function startSpinner() {
  return (dispatch) => {
    dispatch({
      type: types.START_SPINNER,
      loaded: false
    });
    dispatch({
      type: types.TIMEOUT_MES
    })
  };
}

export function subscribeOnServerEvents() {
  return {
    type: types.SUBSCRIBED
  };
}

export function endSpinner() {
  return {
    type: types.END_SPINNER,
    loaded: true
  };
}

export function setOrderForReturn(order) {
  return {
    type: types.ORDER_FOR_RETURN_ADDED,
    order: order
  };
}

export function setOrderForUpdate(order) {
  return {
    type: types.ORDER_FOR_UPDATE_ADDED,
    order: order
  };
}

export function setPointsForUpdate(pickUpPoints) {
  return {
    type: types.POINTS_FOR_UPDATE_ADDED,
    pickUpPoints: pickUpPoints
  };
}

export function removeOrderForUpdate() {
  return {
    type: types.ORDER_FOR_UPDATE_REMOVED,
  };
}

export function removeOrderForReturn() {
  return {
    type: types.ORDER_FOR_RETURN_REMOVED,
  };
}

export function saveCurrentPageOrderList(pageNumber) {
  return {
    type: types.SAVE_PAGE_ORDER_LIST,
    orderListPageNumber: pageNumber
  };
}

export function saveCurrentPageGroupageList(pageNumber) {
  return {
    type: types.SAVE_PAGE_GROUPAGE_LIST,
    groupageListPageNumber: pageNumber
  };
}

export function saveCurrentPageOrderHistoryList(pageNumber) {
  return {
    type: types.SAVE_PAGE_HISTORY_LIST,
    orderHistoryPageNumber: pageNumber
  };
}


export function getAccount() {
  return (dispatch) => {
    LoopbackHttp.getAccount()
      .then((data) => {
        dispatch({
          type: types.ACCOUNT_FETCHED,
          account: data
        });
      })
      .catch(() => {
      });
  };
}


export function getBills() {
  return (dispatch) => {
    LoopbackHttp.getBills()
      .then((data) => {
        dispatch({
          type: types.BILLS_FETCHED,
          bills: data
        });
      })
      .catch(() => {
      });
  };
}
export function getNearestDrivers(pickUpCoordinates, deliveryCoordinate) {
  console.log(pickUpCoordinates)
  console.log(deliveryCoordinate)
  return (dispatch) => {
    LoopbackHttp.getNearestDrivers(pickUpCoordinates, deliveryCoordinate)
      .then((data) => {
        dispatch({
          type: types.GET_NEAREST_DRIVERS,
          nearestDrivers: data
        })
      })
  };
}
export function getOrders() {
  startSpinner();
  return (dispatch) => {
    dispatch(showLoading());
    LoopbackHttp.getOrders()
      .then((data) => {
        dispatch({
          type: types.ORDERS_FETCHED,
          orders: data,
          historyView: false
        });
        dispatch(hideLoading());
      })
      .catch(() => {
        dispatch({
          type: types.ORDERS_FETCH_FAILED,
          historyView: false
        });
        dispatch(hideLoading());
      });
  };
}

export function getCountries() {
  return (dispatch) => {
    LoopbackHttp.getCountries()
      .then((data) => {
        dispatch({
          type: types.COUNTRYES_FETCHED,
          countries: data
        });
      })
      .catch(() => {
        dispatch({
          type: types.COUNTRYES_FETCH_FAILED,
        });
      });
  };
}

export function getStatistics(startTime, endTime, userId) {
  return (dispatch) => {
    LoopbackHttp.getStatistics(startTime, endTime, userId)
      .then((data) => {
        dispatch({
          type: types.STATISTIC_FETCHED,
          statistic: data
        });
      })
      .catch((e) => {
        dispatch({
          type: types.STATISTIC_FETCH_FAILED,
        });
      });
  };
}

export function getCompany(id) {
  return (dispatch) => {
    getUserType() === 'fleetowner'
      ? LoopbackHttp.getCompanyByFleet(id)
        .then((data) => {
          dispatch({
            type: types.COMPANY_FETCHED,
            company: data
          });
        })
        .catch(() => {
          dispatch({
            type: types.COMPANY_FETCH_FAILED,
          });
        })
      : LoopbackHttp.getCompany(id)
        .then((data) => {
          dispatch({
            type: types.COMPANY_FETCHED,
            company: data
          });
        })
        .catch(() => {
          dispatch({
            type: types.COMPANY_FETCH_FAILED,
          });
        })
  };
}

export function getActiveDrivers($companyId) {
  return (dispatch) => {
    LoopbackHttp.getCompanyWithDrivers($companyId)
      .then((data) => {
        dispatch({
          type: types.COMPANY_WITH_DRIVERS_FETCHED,
          company: data
        })
      })
      .catch(() => {
        dispatch({
          type: types.COMPANY_WITH_DRIVERS_FETCH_FAILED
        });
      });
  }
}

export function getTeams(id) {
  return (dispatch) => {
    LoopbackHttp.getTeams(id)
      .then((data) => {
        dispatch({
          type: types.TEAMS_FETCHED,
          teams: data
        });
      })
      .catch(() => {
        dispatch({
          type: types.TEAMS_FETCH_FAILED,
        });
      });
  };
}

export function getOperatorTeams(id) {
  return (dispatch) => {
    LoopbackHttp.getOperatorTeams(id)
      .then((data) => {
        dispatch({
          type: types.TEAMS_FETCHED,
          teams: data
        });
      })
      .catch(() => {
        dispatch({
          type: types.TEAMS_FETCH_FAILED,
        });
      });
  };
}

export function getCoefficients() {
  return (dispatch) => {
    LoopbackHttp.getCoefficients()
      .then((data) => {
        dispatch({
          type: types.COEFFICIENTS_FETCHED,
          coefficients: data
        });
      })
      .catch(() => {
        dispatch({
          type: types.COEFFICIENTS_FETCH_FAILED,
        });
      });
  };
}

export function getCities() {
  return (dispatch) => {
    LoopbackHttp.getCities()
      .then((data) => {
        dispatch({
          type: types.CITYES_FETCHED,
          cities: data
        });
      })
      .catch(() => {
        dispatch({
          type: types.CITYES_FETCH_FAILED,
        });
      });
  };
}

export function getOrder(orderId) {
  return (dispatch) => {
    LoopbackHttp.getOrder(orderId)
      .then((data) => {
        dispatch({
          type: types.ORDER_FETCHED,
          orders: data,
          historyView: false
        });
      })
      .catch(() => {
        dispatch({
          type: types.ORDER_FETCH_FAILED,
          historyView: false
        });
      });
  };
}

export function getGroupages() {
  return (dispatch) => {
    LoopbackHttp.getGroupages()
      .then((data) => {
        dispatch({
          type: types.GROUPAGES_FETCHED,
          groupages: data
        });
      })
      .catch(() => {
        dispatch({
          type: types.GROUPAGES_FETCH_FAILED
        });
      });
  };
}

export function getPickUpPoints() {
  return (dispatch) => {
    LoopbackHttp.getPickUpPoints({ isDispatcher: false })
      .then((data) => {
        dispatch({
          type: types.PICKUPPOINTS_FETCHED,
          pickUpPoints: convertArrToObj(data)
        });
      });
  };
}

export function getPickUpPoint(id) {
  return (dispatch) => {
    LoopbackHttp.getPickUpPoint(id)
      .then((data) => {
        dispatch({
          type: types.PICKUPPOINT_FETCHED,
          pickUpPoint: data
        });
      });
  };
}

// export function removePickUpPoint(pickUpPoint) {
//   return (dispatch) => {
//     LoopbackHttp.updatePickUpPoint(objectAssign({}, pickUpPoint, {valid: false}))
//       .then((data) => {
//         dispatch({
//           type: types.PICKUPPOINT_REMOVED,
//           pickUpPointRemoved: Date.now(),
//           removedPickUpPoint: data
//         });
//       })
//       .catch((err) => {
//         //todo handle error properly
//         console.error(err);
//       });
//   };
// }

export function deletePickUpPoint(pickUpPoint) {
  return (dispatch) => {
    LoopbackHttp.deletePickUpPoint(pickUpPoint)
      .then((data) => {
        dispatch({
          type: types.PICKUPPOINT_REMOVED,
          pickUpPointRemoved: Date.now(),
          removedPickUpPoint: data
        });
      })
      .catch(() => {
      });
  };
}

export function updateOrderAndLog(fields) {
  return (dispatch) => {
    LoopbackHttp.updateOrderAndLog(fields)
      .then((data) => {
        dispatch({
          type: types.ORDER_UPDATED_LOGGED,
          order: data
        });
      })
      .catch(() => {
        dispatch({
          type: types.ORDER_UPDATING_FAILED
        });
      });
  };
}

export function deleteLocalPickUpPoint(pickUpPoint) {
  return {
    type: types.LOCAL_POINT_REMOVED,
    pickUpPoint: pickUpPoint
  };
}

export function getUsers() {
  return (dispatch) => {
    LoopbackHttp.getUsers()
      .then((data) => {
        dispatch({
          type: types.USERS_FETCHED,
          users: data.users
        });
      })
      .catch(() => {
        dispatch({
          type: types.USERS_FETCH_FAILED
        });
      });
  };
}


export function getRecipients() {
  return (dispatch) => {
    LoopbackHttp.getRecipients()
      .then((data) => {
        dispatch({
          type: types.RECIPIENTS_FETCHED,
          recipients: data
        });
      })
      .catch(() => {

      });
  };
}
export function getRecipient(mobile) {
  return (dispatch) => {
    LoopbackHttp.getRecipient(mobile)
      .then((data) => {
        dispatch({
          type: types.RECIPIENT_FETCHED,
          fetched_recipient: data
        });
      })
      .catch((e) => {
      });
  };
}
export function addNewOrderToStore(order) {
  return {
    type: types.LOCAL_ORDER_ADDED,
    order: order
  };
}

export function updateLocalOrder(order, fields) {
  return {
    type: types.LOCAL_ORDER_UPDATED,
    order: order,
    fields: fields ? fields : {}
  };
}

export function addNewTeamToStore(team) {
  return {
    type: types.LOCAL_TEAM_ADDED,
    team: team
  };
}

export function updateLocalTeam(team, fields) {
  return {
    type: types.LOCAL_TEAM_UPDATED,
    team: team,
    fields: fields ? fields : {}
  };
}

export function updateLocalRecipient(recipient, fields) {
  return {
    type: types.LOCAL_RECIPIENT_UPDATED,
    recipient: recipient,
    fields: fields ? fields : {}
  };
}

export function addNewGroupageToStore(groupage) {
  return {
    type: types.LOCAL_GROUPAGE_ADDED,
    groupage: groupage
  };
}

export function updateLocalGroupage(groupage) {
  return {
    type: types.LOCAL_GROUPAGE_UPDATED,
    groupage: groupage
  };
}

export function addNewUserToStore(user) {
  return {
    type: types.LOCAL_USER_ADDED,
    user: user
  };
}

export function updateLocalUser(user) {
  return {
    type: types.LOCAL_USER_UPDATED,
    user: user
  };
}

export function addNewRecipientToStore(recipient) {
  return {
    type: types.LOCAL_RECIPIENT_ADDED,
    recipient: recipient
  };
}

export function addNewPickUpPointToStore(pickUpPoint) {
  return {
    type: types.LOCAL_PICKUPPOINT_ADDED,
    pickUpPoint: pickUpPoint
  };
}

export function updateLocalPickUpPoint(pickUpPoint) {
  return {
    type: types.LOCAL_PICKUPPOINT_UPDATED,
    pickUpPoint: pickUpPoint
  };
}

export function updateDispatcher(accountId, fields) {
  return (dispatch) => {
    LoopbackHttp.updateDispatcher(accountId, fields)
      .then((data) => {
        dispatch({
          type: types.ACCOUNT_UPDATED,
          account: data,
          accountUpdated: Date.now()
        });
      })
      .catch(() => {
      });
  };
}

export function updateDriver(accountId, fields) {
  return (dispatch) => {
    LoopbackHttp.updateDriver(accountId, fields)
      .then((data) => {
        dispatch({
          type: types.DRIVER_UPDATED,
          driver: data
        });
      })
      .catch(() => {
      });
  };
}

export function acceptTerms(id) {
  let fields = {
    isAccepted: true
  };
  return (dispatch) => {
    LoopbackHttp.updateDispatcher(id, fields)
      .then((data) => {
        dispatch({
          type: types.ACCOUNT_UPDATED,
          account: data,
        });
      })
      .catch(() => {

      });
  };
}


export function addAvatar(userId, userType, body) {
  return (dispatch) => {
    LoopbackHttp.addAvatar(userId, userType, body)
      .then((data) => {
        dispatch({
          type: types.AVATAR_ADDED,
          user: data
        });
      })
      .catch(() => {
      });
  };
}


export function getCompanies() {
  return (dispatch) => {
    LoopbackHttp.getCompanies()
      .then((data) => {
        dispatch({
          type: types.COMPANIES_FETCHED,
          companies: data
        });
      })
      .catch(() => {
      });
  };
}

export function updatePlatform(accountId, fields) {
  return (dispatch) => {
    LoopbackHttp.updatePlatform(accountId, fields)
      .then((data) => {
        dispatch({
          type: types.ACCOUNT_UPDATED,
          account: data,
          accountUpdated: Date.now()
        });
      })
      .catch(() => {
      });
  };
}

export function updateOperator(accountId, fields) {
  return (dispatch) => {
    LoopbackHttp.updateOperator(accountId, fields)
      .then((data) => {
        dispatch({
          type: types.ACCOUNT_UPDATED,
          account: data,
          accountUpdated: Date.now()
        });
      })
      .catch(() => {
      });
  };
}

export function updateOrder(orderId, fields) {
  return (dispatch) => {
    LoopbackHttp.updateOrder(orderId, fields)
      .then((data) => {
        dispatch({
          type: types.ORDER_UPDATED,
          account: data,
          accountUpdated: Date.now()
        });
      })
      .catch(() => {
      });
  };
}



export function updateDriversLocations() {
  return (dispatch) => {
    LoopbackHttp.getDriversLocation()
      .then((data) => {
        dispatch({
          type: types.DRIVERS_LOCATION_UPDATED,
          driversLocations: data
        });
      });
  };
}

export function getCitiesByText(text, countryId) {
  return (dispatch) => {
    LoopbackHttp.getCitiesByText(text, countryId)
      .then((data) => {
        dispatch({
          type: types.CITYES_FETCHED,
          cities: data
        });
      });
  };
}

export function fetchCityForInfo(cityId) {
  return (dispatch) => {
    LoopbackHttp.fetchCityForInfo(cityId)
      .then((data) => {
        dispatch({
          type: types.CITY_FETCHED,
          city: data
        });
      });
  };
}

export function setUserLocale(locale) {
  setLocale(locale);
  window.location.reload(true);
  return {
    type: 'USER:LANGUAGE_UPDATE',
    locale
  };
}

export function showHeaderInfo(action) {
  return {
    type: 'SHOW_HEADER_INFO',
    show: action
  };
}


export function getDriversCount() {
  return (dispatch) => {
    LoopbackHttp.getDriversCount()
      .then((data) => {
        dispatch({
          type: types.GET_DRIVERS_COUNT,
          count: data.count || 0
        });
      });
  };
}
