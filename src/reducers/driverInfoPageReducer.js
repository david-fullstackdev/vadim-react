import { DRIVER_SALARY_REQUEST_SENT, DRIVER_SALARY_REQUEST_SUCCESS, DRIVER_SALARY_REQUEST_FAIL, DRIVER_UPDATE_REQUEST_SENT, DRIVER_UPDATE_SUCCESS, DRIVER_UPDATE_FAIL } from '../constants/actionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';


export default function dashboardPageReducer(state = initialState.driverInfoPageState, action) {

  switch (action.type) {

    case DRIVER_SALARY_REQUEST_SENT:
      return objectAssign({}, state, {loading: true, error: null, salary: null, updatedDriver: null});

    case DRIVER_SALARY_REQUEST_SUCCESS:
      return objectAssign({}, state, {loading: false, error: null, salary: action.salary, updatedDriver: null});

    case DRIVER_SALARY_REQUEST_FAIL:
      return objectAssign({}, state, {loading: false, error: action.error, salary: null, updatedDriver: null});

    case DRIVER_UPDATE_REQUEST_SENT:
      return objectAssign({}, state, {loading: true, error: null, updatedDriver: null});

    case DRIVER_UPDATE_SUCCESS:
      return objectAssign({}, state, {loading: false, error: null, updatedDriver: action.updatedDriver});

    case DRIVER_UPDATE_FAIL:
      return objectAssign({}, state, {loading: false, error: action.error, updatedDriver: null});

    default:
      return state;
  }
}
