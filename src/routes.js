import React from 'react';
import { Route, IndexRoute } from 'react-router';

import { default as App } from './containers/App';
import HomePage from './components/HomePage';
import RecipientComponent from './components/recipient/RecipientComponent';
import AboutPage from './components/AboutPage.js';
import NotFoundPage from './components/NotFoundPage.js';

import { default as LoginContainer } from './containers/LoginContainer.js';
import { default as ResetContainer } from './containers/ResetContainer.js';
import { default as LogoutContainer } from './containers/LogoutContainer.js';
import { default as ConfirmationContainer } from './containers/ConfirmationContainer.js';
import { default as UsersListContainer } from './containers/UsersListContainer.js';
import { default as AdminDashboardContainer } from './containers/AdminDashboardContainer.js';
import { default as DashboardContainer } from './containers/DashboardContainer.js';
import { default as DispatcherDashboardContainer } from './containers/DispatcherDashboardContainer.js';
import { default as OrderDetailsContainer } from './containers/OrderDetailsContainer.js';
import { default as OrderCreationContainer } from './containers/OrderCreationContainer.js';
import { default as FleetOrderCreationContainer } from './containers/FleetOrderCreationContainer.js';
import { default as GroupageDetailsContainer } from './containers/GroupageDetailsContainer.js';
import { default as GroupageAssignmentContainer } from './containers/GroupageAssignmentContainer.js';
import { default as UserCreationContainer } from './containers/UserCreationContainer.js';
import { default as OrderHistoryContainer } from './containers/OrderHistoryContainer.js';
import { default as DispatcherEditContainer } from './containers/DispatcherEditContainer.js';
import { default as PlatformEditContainer } from './containers/PlatformEditContainer.js';
import { default as OperatorEditContainer } from './containers/OperatorEditContainer.js';
import { default as DriverInfoPageContainer } from './containers/DriverInfoPageContainer.js';
import { default as RecipientContainer } from './containers/RecipientContainer.js';
import { default as AdminSettingsContainer } from './containers/AdminSettingsContainer.js';
import { default as SettingsContainer } from './containers/SettingsContainer.js';

import { default as ReportsContainer } from './containers/ReportsContainer.js';
import { default as FleetOwnerContainer } from './containers/FleetOwnerContainer.js';
import { default as UpdateOrderContainer } from './containers/UpdateOrderContainer.js';
import { default as ReturnOrderContainer } from './containers/FleetOrderCreationContainer';
import { default as FleetReturnOrderContainer } from './containers/ReturnOrderContainer.js';
import { default as FleetOwnerBilingContainer } from './containers/FleetOwnerrBillingContainer';
import { default as OnDemandContainer } from './containers/OnDemandContainer';

import { default as AddCardComponent } from './components/cards/AddCardComponent.js';
import { default as PayComponent } from './components/cards/PayComponent.js';


import LoopbackHttp from './businessLogic/LoopbackHttp.js';
import {checkForTokenizationResponse} from './businessLogic/pay.js';

checkForTokenizationResponse();

const getIndexComponent = () => {

  const isDispatcher = LoopbackHttp.isDispatcher;
  const isOperator = LoopbackHttp.isOperator;
  const isAdministrator = LoopbackHttp.isAdministrator;
  const isDispatcherActive = LoopbackHttp.isUserActive();
  const isFleet = LoopbackHttp.isFleet;
    if (isDispatcher) {
      if(!isDispatcherActive){
        return ConfirmationContainer;
      }
      return DispatcherDashboardContainer;
    } else if (isOperator) {
      return DashboardContainer;
    } else if (isAdministrator) {
      return AdminDashboardContainer;
    } else if (isFleet) {
      let dashType = localStorage.getItem('dashboardType');
        if(dashType==='onDemand')
          return OnDemandContainer;
        else
          return FleetOwnerContainer;
    } else if(LoopbackHttp.requireLogin){
      return LoginContainer;
    }
}


export const appRoutes =(
  <Route path="/" component={App}>

    <Route path="login" component={LoginContainer} />
    <Route path="logout" component={LogoutContainer} />
    <Route path="reset" component={ResetContainer} />
    <Route path="confirmation" component={ConfirmationContainer} />
    <IndexRoute component={getIndexComponent()} />

    <Route onEnter={LoopbackHttp.requireLogin}>
      <Route onEnter={LoopbackHttp.requireOperator}>
        <Route path="dashboard" component={DashboardContainer} />
        <Route path="driverInfo/:driverId" component={DriverInfoPageContainer} />
        <Route path="users" component={UsersListContainer} />
        <Route path="createUser/:userType" component={UserCreationContainer} />
        <Route path="ordersHistory" component={OrderHistoryContainer} />
        <Route path="editDispatcher/:dispatcherId" component={DispatcherEditContainer} />
        <Route path="editPlatform/:platformId" component={PlatformEditContainer} />
        <Route path="editOperator/:operatorId" component={OperatorEditContainer} />
      </Route>

      <Route onEnter={LoopbackHttp.requireAdministrator}>
        <Route path="admindashboard" component={AdminDashboardContainer} />
        <Route path="settings" component={AdminSettingsContainer} />
        <Route path="driverInfo/:driverId" component={DriverInfoPageContainer} />
        <Route path="users" component={UsersListContainer} />
        <Route path="createUser/:userType" component={UserCreationContainer} />
        <Route path="ordersHistory" component={OrderHistoryContainer} />
        <Route path="editDispatcher/:dispatcherId" component={DispatcherEditContainer} />
        <Route path="editPlatform/:platformId" component={PlatformEditContainer} />
        <Route path="editOperator/:operatorId" component={OperatorEditContainer} />
      </Route>

      <Route onEnter={LoopbackHttp.requireFleet}>
        <Route path="fleetOwnerDashboard" component={FleetOwnerContainer} />
        <Route path="onDemandDashboard" component={OnDemandContainer} />
      </Route>

      <Route onEnter={LoopbackHttp.requireDispatcher}>
        <Route path="dispatcherDashboard" component={DispatcherDashboardContainer} />
        <Route path="editProfile" component={DispatcherEditContainer} />
      </Route>
    </Route>

    <Route path="fleetSettings" component={SettingsContainer} />
    <Route path="addCard" component={AddCardComponent} />
    <Route path="pay" component={PayComponent} />

    <Route path="createOrder" component={OrderCreationContainer} />
    <Route path="createNewOrder" component={FleetOrderCreationContainer} />
    <Route path="returnFleetOrder" component={FleetOrderCreationContainer} />
    <Route path="updateOrder" component={FleetOrderCreationContainer} />
    <Route path="orderDetails/:orderId" component={OrderDetailsContainer} />
    <Route path="returnOrder" component={ReturnOrderContainer} />
    <Route path="logout" component={LogoutContainer} />
    <Route path="reports" component={ReportsContainer} />
    <Route path="*" onEnter={NotFoundPage} />

  </Route>
);

export const recipientRoutes =(
   <Route path="/" component={App}>
     <Route path="recipient/:orderId" component={RecipientContainer} />
     <Route component={RecipientContainer}>
       <IndexRoute component={RecipientComponent} />
     </Route>
   </Route>
);
