/* eslint-disable global-require */

const getAuthToken = () => localStorage.getItem('auth_token');
const setAuthToken = (token) => localStorage.setItem('auth_token', token);
const removeAuthToken = () => localStorage.removeItem('auth_token');
const setUserType = (userType) => {
  if (userType) {
    userType = userType.toLowerCase();
  }
  return localStorage.setItem('userType', userType)
};
export const getUserType = () => localStorage.getItem('userType');
const setUserId = (userId) => localStorage.setItem('userId', userId);
const setUserActive = (active) => localStorage.setItem('active', active);
const getUserActive = () => localStorage.getItem('active');
const getUserId = () => localStorage.getItem('userId');
const setDashboardType = (type) => localStorage.setItem('dashboardType', type);

let baseApiUrl = process.env.BASE_API;
let baseStreamsUrl = process.env.BASE_STREAMS;

function makeCall({ action, method, body, filter }) {
  let fetchOpts = {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': getAuthToken()
    },
    body: body
  };
  return fetch(`${baseApiUrl}${action}?access_token=${getAuthToken()}${filter ? filter : ''}`, fetchOpts);
}

function makeCallForCitiesTextSearch({ action, method, body, filter }) {
  let fetchOpts = {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': getAuthToken()
    },
    body: body
  };
  return fetch(`${baseApiUrl}${action}&access_token=${getAuthToken()}${filter ? filter : ''}`, fetchOpts);
}

function makeCallForStatistics({ action, method, body, filter }) {
  let fetchOpts = {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': getAuthToken()
    },
    body: body
  };
  return fetch(`${baseApiUrl}${action}&access_token=${getAuthToken()}${filter ? filter : ''}`, fetchOpts);
}

function returnMakeCall(resolve, reject, callOpts) {
  return makeCall(callOpts)
    .then((data) => {
      return data.json().then(function (json) {
        if (json.error) {
          return reject();
        }
        if (json) {
          if (callOpts.action == 'Auths/login') {
            if (json.user.active == false) {
              return reject();
            }
          }
          return resolve(json);
        }
      });
    })
    .catch(() => {
      return reject();
    });
}

function returnMakeCallForStatistics(resolve, reject, callOpts) {
  return makeCallForStatistics(callOpts)
    .then((data) => {
      return data.json().then(function (json) {
        if (json.error) {
          return reject();
        }
        if (json) {
          return resolve(json);
        }
      });
    })
    .catch(() => {
      return reject();
    });
}

function returnMakeCallForCitiesTextSearch(resolve, reject, callOpts) {
  return makeCallForCitiesTextSearch(callOpts)
    .then((data) => {
      return data.json().then(function (json) {
        if (json.error) {
          return reject();
        }
        if (json) {
          return resolve(json);
        }
      });
    })
    .catch(() => {
      return reject();
    });
}



function makeUnauthorizedCall({ action, method, body }) {
  let fetchOpts = {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'

    },
    body: body
  };
  return fetch(`${baseApiUrl}${action}`, fetchOpts);
}



function makeCallWithOpts(callOpts) {
  return new Promise(function (resolve, reject) {
    returnMakeCall(resolve, reject, callOpts);
  });
}

export default class LoopbackHttp {
  constructor() {

  }

  static sendLoginRequest({ email, password }) {
    const callOpts = {
      action: 'Auths/login',
      method: 'POST',
      body: JSON.stringify({ email, password })
    };
    return makeCallWithOpts(callOpts);
  }
  static sendResetRequest({ email }) {
    const callOpts = {
      action: 'Auths/resetPassword',
      method: 'POST',
      body: JSON.stringify({ email })
    };
    return makeCallWithOpts(callOpts);
  }

  static login(opts) {
    setAuthToken(opts.user.id);
    setUserId(opts.user.userId);
    setUserActive(opts.user.active);
    setUserType(opts.user.role);
    setDashboardType(opts.user.dashboardType);
  }

  static logout() {
    localStorage.removeItem('last_settings_tab');
    localStorage.removeItem('map_style');
    localStorage.removeItem('statistic_settings');
    setUserType("guest");
    removeAuthToken();
  }

  static requireLogin(nextState, replace) {
    if (!getAuthToken()) {
      replace('/login');
    }
  }

  static requireOperator(nextState, replace) {
    if (getUserType() !== 'operator') {
      replace('/');
    }
  }

  static requireFleet(nextState, replace) {
    if (getUserType() !== 'fleetowner') {
      replace('/');
    }
  }

  static requireAdministrator(nextState, replace) {
    if (getUserType() !== 'administrator') {
      replace('/');
    }
  }

  static requireDispatcher(nextState, replace) {
    if (getUserType() !== 'dispatcher') {
      replace('/');
    }
  }

  static isAuthenticated() {
    return !!getAuthToken();
  }

  static getAccount() {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `${getUserType()}s/${getUserId()}`,
        method: 'GET'
      };
      return makeCall(callOpts)
        .then((data) => {
          return data.json().then((json) => {
            if (json.error) {
              setUserType("guest");
              removeAuthToken();
              return reject();
            }
            if (json) {
              return resolve(json);
            }
          });
        })
        .catch((error) => {
        });
    });
  }

  static getDriversGroupages(driverId) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Drivers/${driverId}/groupages`,
        method: 'GET',
        filter: `&filter={"where":{"groupageStatus":{"inq": ["waitingForPickUp","pickedUp","rejectedOnWay"] } } }`
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getDispatcher(orderId) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Recipients/getDispatcher/${orderId}`,
        method: 'GET'
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }
  static getNearestDrivers(pickUpCoordinates, deliveryCoordinate) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Orders/getNearestDrivers`,
        method: 'POST',
        body: JSON.stringify({ 'pickUpCoordinates': [JSON.parse(pickUpCoordinates)], 'deliveryCoordinate': JSON.parse(pickUpCoordinates) })
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }
  static getCompanyByFleet(id) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `FleetOwners/${id}/company`,
        method: 'GET'
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getCompany(id) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Companies/${id}`,
        method: 'GET'
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getTeams(id) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Companies/${id}/teams`,
        method: 'GET'
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getOperatorTeams(id) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Operators/${id}/teams`,
        method: 'GET'
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getUsers() {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: 'Operators/getAllUsers',
        method: 'GET'
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getCompanyUsers(companyId) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Companies/${companyId}/teams`,
        method: 'GET',
        filter: `&filter={"include":["drivers","operators", "dispatcherPlatforms", { "dispatchers": "pickUpPoints" }]}`
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getOperatorUsers(operatorId) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Operators/${operatorId}/teams`,
        method: 'GET',
        filter: `&filter={"include":["drivers","operators", "dispatcherPlatforms", "dispatchers"]}`
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getCoefficients() {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: 'Administrators/getAllCoefficient',
        method: 'GET'
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getCountries() {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: 'Countries',
        method: 'GET'
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getCities() {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: 'Cities',
        method: 'GET'
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }


  static getRecipients() {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: 'Recipients',
        method: 'GET'
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getRecipient(mobile) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: 'Recipients',
        method: 'GET',
        filter: `&filter={"where":{"mobile":"${mobile}"}}`
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getOrder(orderId) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Orders/${orderId}`,
        method: 'GET',
        filter: `&filter={"include":"items"}`
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getOrders() {
    return new Promise((resolve, reject) => {
      const dispatcherIdFilter = `${this.isDispatcher ? `,"where":{"dispatcherId": "${getUserId()}"}` : ``}`;
      const callOpts = {
        action: 'Orders',
        method: 'GET',
        filter: `&filter={"include":"items"${dispatcherIdFilter}}`
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getBills() {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: 'FleetOwners/getBills',
        method: 'GET'
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getOperatorOrders() {

    return new Promise((resolve, reject) => {
      const callOpts = {
        action: 'Operators/getOrders',
        method: 'GET',
        filter: `&filter={"include":"items"}`
      };

      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static addSomeOrdersToHistory(companyId, endTime) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: 'Orders',
        method: 'GET',
        filter: `&filter={"include":"items","where": {"and":[{"companyId":"${companyId}"}, {"processedAt": { "between": [${endTime - 500000000}, ${endTime}]}}]}}`
      };

      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getFleetOrders(companyId) {
    var dt = new Date();
    dt.setHours(dt.getHours() - 400);

    return new Promise((resolve, reject) => {
      const callOpts = {
        action: 'Orders',
        method: 'GET',
        // filter: `&filter={"include":"items","where": {"and":[{"companyId":"${companyId}"}, {"deliveryTime": { "gt": ${dt.valueOf()}}}]}}`
        filter: `&filter={"include":"items","where":{"companyId":"${companyId}"}}`
      };

      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getTodayOrders(companyId) {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    var today = date.getTime();
    var tomorrow = today + 86400000;
    const filter = `&filter={"include":"items","where": {"and":[{"companyId":"${companyId}"}, {"createdAt": { "between": [${today}, ${tomorrow}]}}]}}`;
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: 'Orders',
        method: 'GET',
        filter: filter
      };

      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getGroupages() {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: 'Groupages',
        method: 'GET',
        filter: '&filter={"where":{"groupageStatus": {"neq": "rejected"}}}'
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getPickUpPoints() {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: 'PickUpPoints',
        method: 'GET',
        filter: this.isDispatcher ? `&filter={"where":{"dispatcherId":"${getUserId()}"}}` : ''
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getPickUpPoint(id) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: 'PickUpPoints',
        method: 'GET',
        filter: `&filter={"where":{"id":"${id}"}}`
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }


  static createPickUpPoint(fields) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: 'PickUpPoints',
        method: 'POST',
        body: JSON.stringify(fields)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static addCompany(company) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: 'OutOfCityDeliveries',
        method: 'POST',
        body: JSON.stringify(company)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static updateCompany(id, company) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Companies/${id}`,
        method: 'PUT',
        body: JSON.stringify(company)
      };

      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static updatePickUpPoint(pickUpPoint) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `PickUpPoints/${pickUpPoint.id}`,
        method: 'PUT',
        body: JSON.stringify(pickUpPoint)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static deletePickUpPoint(pickUpPoint) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `PickUpPoints/${pickUpPoint.id}`,
        method: 'DELETE',
        body: JSON.stringify(pickUpPoint)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static updateCoefficient(coefficient) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Administrators/updateCoefficient`,
        method: 'PUT',
        body: JSON.stringify(coefficient)
      };

      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static deleteCountry(country) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Countries/${country.id}`,
        method: 'DELETE',
        body: JSON.stringify(country)
      };

      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static deleteCompany(company) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `OutOfCityDeliveries/${company.id}`,
        method: 'DELETE'
      };

      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static deleteCity(city) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Cities/${city.id}`,
        method: 'DELETE',
        body: JSON.stringify(city)
      };

      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static createUser({ userType, fields }) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `${userType}s`,
        method: 'POST',
        body: JSON.stringify(fields)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static createDriver(fields) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Drivers`,
        method: 'POST',
        body: JSON.stringify(fields)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static createUserWithTeam(teamId, userType, fields) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Teams/${teamId}/${userType}s`,
        method: 'POST',
        body: JSON.stringify(fields)
      };
      return makeCall(callOpts)
        .then((data) => {
          return data.json().then(function (json) {
            if (json.error) {
              return reject(json.error);
            }
            if (json) {
              if (userType === 'dispatcher')
                json.role = userType;
              return resolve(json);
            }
          });
        })
        .catch((data) => {
          return reject();
        });
    });
  }

  ////for fleetowner
  static removeUser(teamId, userType, userId) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Teams/${teamId}/${userType}s/${userId}`,
        method: 'DELETE'
      };
      return makeCall(callOpts)
        .then((data) => {
          return resolve();
        })
        .catch(() => {
          return reject();
        });
    });
  }

  static updateUserWithTeam(teamId, userType, fields) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Teams/${teamId}/${userType}s/${fields.id}`,
        method: 'PUT',
        body: JSON.stringify(fields)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static deleteUser(role, id) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `${role}s/${id}`,
        method: 'DELETE',
        body: JSON.stringify(id)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static deleteOrder(id) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Orders/${id}`,
        method: 'DELETE',
        body: JSON.stringify(id)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }


  static CreateDispatcherPlatform({ fields }) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: 'Administrators/createDispatcherPlatform',
        method: 'POST',
        body: JSON.stringify(fields)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static createOrder(fields) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Dispatchers/createOrder`,
        method: 'POST',
        body: JSON.stringify(fields)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static createFleetOrder(userType, fields) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `${userType}s/createOrder`,
        method: 'POST',
        body: JSON.stringify(fields)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static updateOrderAndLog(fields) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Orders/updateAndLog`,
        method: 'POST',
        body: JSON.stringify(fields)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static createOrderByOperator(fields) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Operators/createOrder`,
        method: 'POST',
        body: JSON.stringify(fields)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static addCountry(country) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Countries`,
        method: 'POST',
        body: JSON.stringify(country)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static updateCountry(id, country) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Countries/${id}`,
        method: 'PUT',
        body: JSON.stringify(country)
      };

      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static addCity(city) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Cities`,
        method: 'POST',
        body: JSON.stringify(city)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static updateCity(id, city) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Cities/${id}`,
        method: 'PUT',
        body: JSON.stringify(city)
      };

      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static createGroupage(fields) {
    var type = getUserType() === 'operator' ? 'Operators' : 'Administrators';
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `${type}/createGroupage`,
        method: 'POST',
        body: JSON.stringify({ orders: fields })
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static destroyGroupage(groupageId) {
    var type = getUserType() === 'operator' ? 'Operators' : 'Administrators';
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `${type}/rejectGroupage`,
        method: 'POST',
        body: JSON.stringify({ groupageId })
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static assignGroupage(groupageId, driverId) {

    const callOpts = {
      action: `Groupages/status/assigned`,
      method: 'POST',
      body: JSON.stringify({ groupageId, driverId })
    };

    return makeDefaultCall(callOpts);
  }

  static unassignGroupage(groupageId) {

    const callOpts = {
      action: `Operators/unassignGroupage`,
      method: 'POST',
      body: JSON.stringify({ groupageId })
    };

    return makeDefaultCall(callOpts);

  }

  static updateRecipient(recipientId, fields) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Recipients/${recipientId}`,
        method: 'PUT',
        body: JSON.stringify(fields)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }
  static resentSMSForActive() {

    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: '/Auths/sendSmsForActivate?userID=' + getUserId(),
        method: 'GET',
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }
  static resentSMS(orderId) {

    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Sms/resend`,
        method: 'POST',
        body: JSON.stringify({ orderId })
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static assignOnDriver(driverId, ordersId, userType) {
    const callOpts = {
      action: `${userType}s/assignOrderToDriver`,
      method: 'POST',
      body: JSON.stringify({
        ordersId,
        driverId
      })
    };
    return makeDefaultCall(callOpts)
  }

  static assignOnTeam(fields) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Teams/autoAssignOnDriver`,
        method: 'POST',
        body: JSON.stringify(fields)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static unAssignOrder(orderId) {
    const callOpts = {
      action: `Orders/makeNew`,
      method: 'POST',
      body: JSON.stringify({ orderId })
    };
    return makeDefaultCall(callOpts)
  }


  static updateOrderFromRecipient(orderId, recipientId, fields) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Recipients/${recipientId}/orders/${orderId}`,
        method: 'PUT',
        body: JSON.stringify(fields)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static cancelOrder(order) {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Orders/status/canceled`,
        method: 'POST',
        body: JSON.stringify({ orderId: order.id ? order.id : order, dispatcherId: order.dispatcherId ? order.dispatcherId : getUserId() })
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getDriversLocation() {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `DriverGpsLocations`,
        method: 'GET'
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static addAvatar(userId, userType, body) {
    const formData = new FormData();
    formData.set('image', body);
    formData.set('userId', userId);
    formData.set('userType', userType);

    let fetchOpts = {
      method: 'POST',
      headers: {
        'enctype': 'multipart/form-data'
      },
      body: formData
    };
    return fetch(`${baseApiUrl}uploadAvatar2`, fetchOpts)
      .then((data) => {
        return data.json().then(function (json) {
          if (json.error) {
            return json;
          }
          if (json) {
            return json;
          }
        });
      })
      .catch(() => {
        return false;
      });
  }

  static getCompanies() {
    return new Promise(function (resolve, reject) {
      const callOpts = {
        action: `Companies`,
        method: 'GET'
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }


  static updateDriver(accountId, account) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Drivers/${accountId}`,
        method: 'PUT',
        body: JSON.stringify(account)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static updateDispatcher(accountId, account) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Dispatchers/${accountId}`,
        method: 'PUT',
        body: JSON.stringify(account)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static updateAdministrator(accountId, account) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Administrators/${accountId}`,
        method: 'PUT',
        body: JSON.stringify(account)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static updatePlatform(accountId, account) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `DispatcherPlatforms/${accountId}`,
        method: 'PUT',
        body: JSON.stringify(account)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static updateOperator(accountId, account) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Operators/${accountId}`,
        method: 'PUT',
        body: JSON.stringify(account)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getStatistics(startTime, endTime, userId) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: userId
          ? `Orders/getStatistics?startTime=${startTime}&endTime=${endTime}&userId=${userId}`
          : `Orders/getStatistics?startTime=${startTime}&endTime=${endTime}`,
        method: 'GET'
      };

      returnMakeCallForStatistics(resolve, reject, callOpts);
    });
  }

  static getGroupageGpsLog(groupageId) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Groupages/${groupageId}/gpsLogs`,
        method: 'GET'
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static updateUserProfile(id, fields) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `${getUserType()}s/${id}`,
        method: 'PUT',
        body: JSON.stringify(fields)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static createTeam(companyId, fields) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Companies/${companyId}/teams`,
        method: 'POST',
        body: JSON.stringify(fields)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static updateTeam(teamId, fields) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Teams/${teamId}`,
        method: 'PUT',
        body: JSON.stringify(fields)
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static deleteTeam(teamId) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Teams/${teamId}`,
        method: 'DELETE'
      };
      return makeCall(callOpts)
        .then((data) => {
          return resolve();
        })
        .catch(() => {
          return reject();
        });
    });
  }

  static addToTeam(teamId, role, userId) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Teams/${teamId}/${role}s/rel/${userId}`,
        method: 'PUT'
      };
      returnMakeCall(resolve, reject, callOpts);
    });
  }

  static removeFromTeam(teamId, role, userId) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Teams/${teamId}/${role}s/rel/${userId}`,
        method: 'DELETE'
      };
      return makeCall(callOpts)
        .then((data) => {
          return resolve();
        })
        .catch(() => {
          return reject();
        });
    });
  }

  static getDriverSalaryForDateSpan(driverId, startDate, endDate) {
    const callOpts = {
      action: `Operators/driverSalary`,
      method: 'GET',
      filter: `&driverId=${driverId}&startTime=${startDate}&endTime=${endDate}`
    };
    return makeCall(callOpts);
  }

  static addNewCard(fields) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `FleetOwners/${fields.fleetOwnerId}/cards`,
        method: 'POST',
        body: JSON.stringify(fields)
      };
      return returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getFleets() {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `FleetOwners`,
        method: 'GET'
      };
      return returnMakeCall(resolve, reject, callOpts);
    });
  }

  static updateFleet(fields) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `FleetOwners/${fields.id}`,
        method: 'PUT',
        body: JSON.stringify(fields)
      };
      return returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getCards(id) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `FleetOwners/${id}/cards`,
        method: 'GET'
      };
      return returnMakeCall(resolve, reject, callOpts);
    });
  }

  static purchase(body, billId) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `FleetOwners/payfortPurchase`,
        method: 'POST',
        body: JSON.stringify({ body, billId })
      };
      return returnMakeCall(resolve, reject, callOpts);
    });
  }

  static updateBill(fields) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `FleetOwners/updateBill`,
        method: 'POST',
        body: JSON.stringify(fields)
      };
      return returnMakeCall(resolve, reject, callOpts);
    });
  }

  static resetDriverCashOnDelivery(id) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `/Drivers/${id}/clearCap`,
        method: 'POST'
      };
      return returnMakeCall(resolve, reject, callOpts);
    });
  }

  static deleteCard(fleetId, cardId) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `FleetOwners/${fleetId}/cards/${cardId}`,
        method: 'DELETE'
      };
      return returnMakeCall(resolve, reject, callOpts);
    });
  }

  static createFleet(fields) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `FleetOwners/registrate`,
        method: 'POST',
        body: JSON.stringify(fields)
      };
      return returnMakeCall(resolve, reject, callOpts);
    });
  }

  static createCompany(fields) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Companies`,
        method: 'PUT',
        body: JSON.stringify(fields)
      };
      return returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getCitiesByText(text, countryId) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Cities/fullTextSearch?text=${text}&countryId=${countryId}`,
        method: 'GET'
      };
      return returnMakeCallForCitiesTextSearch(resolve, reject, callOpts);
    });
  }

  static fetchCityForInfo(cityId) {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Cities/${cityId}`,
        method: 'GET'
      };
      return returnMakeCall(resolve, reject, callOpts);
    });
  }

  static getDriversCount() {
    return new Promise((resolve, reject) => {
      const callOpts = {
        action: `Drivers/getCount`,
        method: 'GET'
      };
      return returnMakeCall(resolve, reject, callOpts);
    });
  }

  static get isDispatcher() {
    return getUserType() === 'dispatcher';
  }

  static isUserActive() {
    return getUserActive();
  }
  static get isOperator() {
    return getUserType() === 'operator';
  }

  static get isAdministrator() {
    return getUserType() === 'administrator';
  }

  static get isFleet() {
    return getUserType() === 'fleetowner';
  }

  static get userId() {
    return getUserId();
  }

  static subscribeOnServerEvents() {
    if (!!window.EventSource)
      return new EventSource(`${baseStreamsUrl}${getUserType()}s/streamUpdates?userId=${getUserId()}&access_token=${getAuthToken()}`);
    else {
      console.log('already connected')
    }
  }

  static configure({ streamsUrl, apiUrl }) {
    if (streamsUrl) {
      baseStreamsUrl = streamsUrl;
    }
    if (apiUrl) {
      baseApiUrl = apiUrl;
    }

  }
}


function makeDefaultCall(callOpts) {
  return new Promise((resolve, reject) => {
    returnMakeCall(resolve, reject, callOpts);
  })
}
