import { combineReducers } from 'redux';
import loginFormReducer from './loginFormReducer';
import resetFormReducer from './resetFormReducer';
import logoutPageReducer from './logoutPageReducer';
// import usersListReducer from './usersListReducer';
import orderCreationReducer from './orderCreationReducer';
import dashboardPageReducer from './dashboardPageReducer';
import createUserReducer from './createUserReducer';
import recipientReducer from './recipientReducer';
import driverInfoPageReducer from './driverInfoPageReducer';
import appReducer from './appReducer';
import fleetOwnerReducer from './fleetOwnerReducer';
import { onDemandReducer } from './onDemand/onDemandReducer';
import { routerReducer } from 'react-router-redux'
import { loadingBarReducer } from 'react-redux-loading-bar';

const rootReducer = combineReducers({
  loginFormReducer,
  logoutPageReducer,
  resetFormReducer,
  dashboardPageReducer,
  createUserReducer,
  orderCreationReducer,
  appReducer,
  driverInfoPageReducer,
  recipientReducer,
  fleetOwnerReducer,
  onDemand: onDemandReducer,
  routing: routerReducer,
  loadingBar: loadingBarReducer
});

export default rootReducer;
