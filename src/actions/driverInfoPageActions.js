import * as types from '../constants/actionTypes';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';

export function getDriverSalaryForDateSpan(driverId, startDate, endDate, callback) {
  const request = LoopbackHttp.getDriverSalaryForDateSpan(driverId, startDate, endDate, callback);
  if (typeof callback === 'function') {
    callback(request);
  }
  return {
    type: types.DRIVER_SALARY_REQUEST_SENT
  };
}

export function onDriverSalaryFetchSuccess(salary) {
  return {
    type: types.DRIVER_SALARY_REQUEST_SUCCESS,
    salary: salary
  };
}

export function onDriverSalaryFetchFail(error) {
  return {
    type: types.DRIVER_SALARY_REQUEST_FAIL,
    error: error
  };
}

export function updateDriver(driverId, fields, callback) {
  const request = LoopbackHttp.updateDriver(driverId, fields);
  if (typeof callback === 'function') {
    callback(request);
  }
  return {
    type: types.DRIVER_UPDATE_REQUEST_SENT
  };
}

export function onDriverUpdateSuccess(driver) {
  return {
    type: types.DRIVER_UPDATE_SUCCESS,
    updatedDriver: driver
  };
}

export function onDriverUpdateFail(error) {
  return {
    type: types.DRIVER_UPDATE_FAIL,
    error: error
  };
}
