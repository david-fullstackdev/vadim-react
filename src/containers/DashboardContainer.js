import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/dashboardPageActions';
import * as appActions from '../actions/appActions';
import * as fleetActions from '../actions/fleetOwnerActions';
import OrdersMap from '../components/maps/OrdersMap';
import DriverListComponent from '../components/driverList/DriverListComponent';

import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import OrdersList from '../components/orders/OperatorOrdersListComponent';
import { OrdersListActionBar } from '../components/orders/OrdersListActionBarComponent';
import { GroupagesList } from '../components/groupages/GroupagesListComponent';
import _ from 'lodash';
import { gettext } from '../i18n/service';
import expPikcupTimeValidator from '../businessLogic/groupValidation.js';


import { AssignToDriverModalComponent } from '../components/modals/driver.assign';

export class DashboardContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.groupageCreated = props.groupageCreated;
    this.orderUpdated = props.orderUpdated;
    this.groupageDestroyed = props.groupageDestroyed;
    this.orderListViewMode = props.orderListViewMode;

    this.dispatchersId = [];

    this.openModalForAssign = false;

    this.selectedDriverId = null;
    this.selectedDriver = undefined;
    this.selectedTeam = undefined;


    this.ordersSelectedOnTable = [];
    this.ordersSelectedOnMap = [];
    this.setOfLocationsToShowPopup = new Set();
    this.setOfDriverLocationIdsToShowPopup = new Set();

    _.bindAll(this, ['assignOrders', 'clearSelectedOrders',
    'saveCurrentPageGroupageList', 'saveCurrentPageOrderList', 'cancelOrder', 'changeOrderListViewMode',
    'ungroupSelectedOrders', 'groupSelectedOrders', 'handleGroupageSelectChange', 'handleOrderSelectChange',
    'onGroupageDetailLinkClick', 'onOrderDetailLinkClick', 'handleDriverMarkerClose', 'handleMarkerClose', 'onMapClick',
    'onDriverMarkerClick', 'onMarkerClick', 'closeAssignModal', 'assignOnDriver', 'createNewOrder', 'unassignSelectedOrders', 'unassignOrder',
    'passSelectedDriver', 'getSelectedDriver','dropOrdersToDriver', 'prepareUserList', 'getOperatorsFromUsers', 'getDispatchersFromUsers',
    'getDriversFromUsers', 'getDispatcherPlatformsFromUsers', 'closeAllInfoWindows', 'getSelectedTeam','dropOrdersToTeam', 'passSelectedTeam', 'changeDriverListViewMode']);


  }

  componentDidMount() {
    this.props.appActions.updateDriversLocations();
    this.updateDriversInterval = setInterval(this.props.appActions.updateDriversLocations.bind(this), 30000);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.account !== this.props.account) {
      this.props.appActions.startSpinner();
      this.props.appActions.getOperatorTeams(nextProps.account.id);
      this.props.fleetActions.getOperatorUsers(nextProps.account.id);
    }

    if(nextProps.company.id !== this.props.company.id) {
      this.props.appActions.startSpinner();
      this.props.fleetActions.getOperatorOrders();
    }

    if(nextProps.users[0] && (nextProps.users[0].dispatchers || nextProps.users[0].operators || nextProps.users[0].drivers)) {
      this.prepareUserList(nextProps.users);
      // // let disps = [];
      // // _.map(this.dispatchersId, (id, i) => {
      // //   if(i<10)
      // //     disps.push(id)
      // // })
      // this.props.fleetActions.getOperatorOrders(this.props.account.id, this.dispatchersId);
    }
  }

  changeDriverListViewMode(viewMode) {
    this.selectedDriver = undefined;
    this.selectedTeam = undefined;
    this.props.actions.changeDriverListViewMode(viewMode);
    this.forceUpdate();
  }

  componentWillUnmount() {
    clearInterval(this.updateDriversInterval);
  }

  closeAllInfoWindows() {
    this.setOfLocationsToShowPopup = new Set();
    this.setOfDriverLocationIdsToShowPopup = new Set();
    this.forceUpdate();
  }

  getDriversFromUsers(teams) {
    let drivers = [];
    _.map(teams, (team) => {
        _.map(team.drivers, (driver) => {
          driver.role = 'driver';
          ////it's team id
          driver.teamId = team.id;
          drivers.push(driver);
        });
    });

    return drivers;
  }

  getDispatcherPlatformsFromUsers(teams) {
    let platforms = [];
    _.map(teams, (team) => {
      _.map(team.dispatcherPlatforms, (platform) => {
        platform.role = 'dispatcherPlatform';
        ////it's team id
        platform.teamId = team.id;
        platforms.push(platform);
      });
    });

    return platforms;
  }

  getDispatchersFromUsers(teams) {
    let dispatchers = [];
    _.map(teams, (team) => {
        _.map(team.dispatchers, (dispatcher) => {
          dispatcher.role = 'dispatcher';
          ////it's team id
          dispatcher.teamId = team.id;
          dispatchers.push(dispatcher);
          this.dispatchersId.push(dispatcher.id.toString());
        });
    });

    return dispatchers;
  }

  getOperatorsFromUsers(teams) {
    let operators = [];
    _.map(teams, (team) => {
        _.map(team.operators, (operator) => {
          operator.role = 'operator';
          ////it's team id
          operator.teamId = team.id;
          operators.push(operator);
        });
    });

    return operators;
  }

  prepareUserList(teams) {
    let drivers = this.getDriversFromUsers(teams);
    let operators = this.getOperatorsFromUsers(teams);
    let dispatchers = this.getDispatchersFromUsers(teams);
    let platforms = this.getDispatcherPlatformsFromUsers(teams);
    this.props.fleetActions.addUsersToStore(drivers.concat(operators, dispatchers, platforms));
  }

  dropOrdersToTeam(teamId) {
    this.props.appActions.startSpinner();
    _.map(this.ordersSelectedOnTable, (order) => {
      this.props.actions.assignOnTeam({orderId: order.id, teamIds: [teamId]});
    });
    this.selectedTeam = undefined;
    this.clearSelectedOrders();
  }

  dropOrdersToDriver(driverId) {

    let driverForDrop = _.find(this.props.users, {role: 'driver', id: driverId});

    if(!driverForDrop || driverForDrop.driverStatus !== 'active')
      return this.props.showMessage({
        message: gettext('DRIVER-IS-NOT-ACTIVE'),
        level: 'error'
      });

    this.props.appActions.startSpinner();
    this.props.actions.assignOnDriver(driverId, _.map(this.ordersSelectedOnTable, order => order.id), localStorage.getItem('userType'));
    this.selectedDriver = undefined;
    this.clearSelectedOrders();
  }

  saveCurrentPageOrderList(pageNumber) {
    this.props.appActions.saveCurrentPageOrderList(pageNumber);
    this.forceUpdate();
  }

  passSelectedDriver(driver) {
    if(driver!== this.selectedDriver) {
      this.selectedDriver = driver;
      this.forceUpdate();
    }
  }

  passSelectedTeam(team) {
    if(team!== this.selectedTeam) {
      this.selectedTeam = team;
      this.forceUpdate();
    }
  }

  getSelectedTeam() {
    return this.selectedTeam;
  }

  getSelectedDriver() {
    return this.selectedDriver;
  }

  saveCurrentPageGroupageList(pageNumber) {

  }

  unassignSelectedOrders() {
    this.props.appActions.startSpinner();
    _.map(this.ordersSelectedOnTable, (order) => {
      if(order.orderStatus !== 'assigned' && order.orderStatus !== 'waitingForPickup') {
        return this.props.showMessage({
            message: gettext('CAN-UNASSIGN-ONLY'),
            level: 'error'
          });
      }
      this.unassignOrder(order.id)
    });
    this.props.appActions.endSpinner();
    this.ordersSelectedOnTable = [];
    this.forceUpdate();
  }

  unassignOrder(id) {
    this.props.actions.unassignOrder(id);
  }

  onMarkerClick(stringifiedLocation) {
    //showing only one popup on map
    this.setOfLocationsToShowPopup.clear();
    this.setOfLocationsToShowPopup.add(stringifiedLocation);
    this.forceUpdate();
  }

  onDriverMarkerClick(driverLocationId, driverId) {
    this.selectedDriverId = driverId;
    this.setOfDriverLocationIdsToShowPopup.clear();
    this.setOfDriverLocationIdsToShowPopup.add(driverLocationId);
    this.forceUpdate();
  }

  handleMarkerClose(stringifiedLocation) {
    this.setOfLocationsToShowPopup.delete(stringifiedLocation);
    this.forceUpdate();
  }

  handleDriverMarkerClose(driverLocationId) {
    this.selectedDriverId = undefined;
    this.setOfDriverLocationIdsToShowPopup.delete(driverLocationId);
    this.forceUpdate();
  }

  clearSelectedOrders() {
    this.ordersSelectedOnTable = [];
    this.ordersSelectedOnMap = [];
    this.forceUpdate();
  }

  onMarkerRightClick() {

  }

  onMapClick() {
  }

  createNewOrder(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.appActions.removeOrderForUpdate();
    this.props.router.push('/createNewOrder');
  }

  onOrderDetailLinkClick(order, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
      return this.props.router.push(`/orderDetails/${order.id}`);
  }

  onGroupageDetailLinkClick(groupage) {
  }

  cancelOrder(order) {
    this.props.actions.cancelOrder(order);
  }

  handleOrderSelectChange(order, e) {
    e.stopPropagation();
    const isSelected = this.ordersSelectedOnTable.includes(order);
    if (!isSelected) {
      this.ordersSelectedOnTable.push(order);
    } else {
      _.pull(this.ordersSelectedOnTable, order);
    }
    this.forceUpdate();
    return true;
  }

  handleGroupageSelectChange(groupage, e) {

  }

  changeOrderListViewMode(viewMode) {
    this.ordersSelectedOnTable = [];
    this.props.actions.changeOrderListViewMode(viewMode);
    this.forceUpdate();
  }

  assignOrders(event) {

  }

  groupSelectedOrders(event, isAssignWithoutGroup) {
  }

  groupOrAssignOrders(type) {

  }

  closeAssignModal() {
    this.openModalForAssign = false;
    this.setState({});
  }

  assignOnDriver(driverId) {

  }

  ungroupSelectedOrders() {

  }

  render() {
    const ordersForMap = _.filter(this.props.orders, (order) => {
      return !order.groupageId && (order.orderStatus === 'new' || order.orderStatus === 'assigned' || order.orderStatus === 'onWayToDelivery' || order.orderStatus === 'waitingForPickup') ;
    });

    const ordersForTable = _(this.props.orders)
      .filter((order) => order.orderStatus === 'new')
      .sortBy('createdAt', 'expectedPickUpTime').value();

    const ordersForInProgressTable = _(this.props.orders)
      .filter((order) => order.orderStatus === 'assigned'
                          || order.orderStatus === 'onWayToDelivery'
                          || order.orderStatus === 'waitingForPickup'
                          || order.orderStatus === 'pickedUp'
                          || order.orderStatus === 'partlyPickedUp'
                          || order.orderStatus === 'waitingForReturn'
                          || order.orderStatus === 'pickedUp')
      .sortBy('createdAt', 'expectedPickUpTime').value();

    const ordersForHistoryTable = _(this.props.orders)
      .filter((order) => order.orderStatus === 'canceled' || order.orderStatus === 'delivered' || order.orderStatus === 'returned')
      .sortBy('processedAt').value();

      let lowerProcessedAtTime = undefined;
      _.map(ordersForHistoryTable, (order, i) => {
        if(i === 1)
          lowerProcessedAtTime = order.processedAt;

        if(order.processedAt < lowerProcessedAtTime)
          lowerProcessedAtTime = order.processedAt;
      });

    const driverLocations = this.selectedDriver?_.filter(this.props.driversLocations, {driverId: this.selectedDriver.id}):this.props.driversLocations;
    const historyPageCount = Math.round(ordersForHistoryTable.length / 15);


      let table;
      switch (this.props.orderListViewMode) {
        case 'orders':
          table =
            (
              <div>
                <DriverListComponent
                  dispatchers={this.props.users.filter((user) => user.role === 'dispatcher')}
                  recipients={this.props.recipients}
                  ordersSelectedOnTable={this.ordersSelectedOnTable}
                  assignOnDriver={this.props.actions.assignOnDriver}
                  startSpinner={this.props.appActions.startSpinner}
                  clearSelectedOrders={this.clearSelectedOrders}
                  unassignOrder={this.unassignOrder}
                  passSelectedDriver={this.passSelectedDriver}
                  passSelectedTeam={this.passSelectedTeam}
                  selectedDriver={this.selectedDriver}
                  getSelectedDriver={this.getSelectedDriver}
                  dropOrdersToDriver={this.dropOrdersToDriver}
                  dropOrdersToTeam={this.dropOrdersToTeam}
                  startSpinner={this.props.appActions.startSpinner}
                  changeDriverListViewMode={this.props.actions.changeDriverListViewMode}
                  teams={this.props.teams}
                  getSelectedTeam={this.getSelectedTeam}/>
                <OrdersList
                  ordersSelectedOnTable={this.ordersSelectedOnTable}
                  orderListViewMode={this.props.orderListViewMode}
                  groupages={this.props.groupages}
                  orders={ordersForTable}
                  users={this.props.users}
                  handleOrderSelectChange={this.handleOrderSelectChange}
                  showOrderDetails={this.onOrderDetailLinkClick}
                  selectedOrders={this.ordersSelectedOnTable}
                  vehicles={this.props.vehicles}
                  recipients={this.props.recipients}
                  cancelOrder={this.cancelOrder}
                  loaded={this.props.loaded}
                  orderListPageNumber={this.props.orderListPageNumber}
                  saveCurrentPageOrderList={this.saveCurrentPageOrderList}
                  clearSelectedOrders={this.clearSelectedOrders}
                  company={this.props.company}/>
              </div>);
          break;
        case 'assignedOrders':
          table =
            (<OrdersList
              orderListViewMode={this.props.orderListViewMode}
              orders={ordersForInProgressTable}
              users={this.props.users}
              handleOrderSelectChange={this.handleOrderSelectChange}
              showOrderDetails={this.onOrderDetailLinkClick}
              selectedOrders={this.ordersSelectedOnTable}
              vehicles={this.props.vehicles}
              recipients={this.props.recipients}
              cancelOrder={this.cancelOrder}
              loaded={this.props.loaded}
              orderListPageNumber={this.props.orderListPageNumber}
              saveCurrentPageOrderList={this.saveCurrentPageOrderList}
              clearSelectedOrders={this.clearSelectedOrders}
              company={this.props.company}/>);
          break;
        case 'orderHistory':
          table =
            (<OrdersList
              orderListViewMode={this.props.orderListViewMode}
              orders={ordersForHistoryTable}
              users={this.props.users}
              handleOrderSelectChange={this.handleOrderSelectChange}
              showOrderDetails={this.onOrderDetailLinkClick}
              selectedOrders={this.ordersSelectedOnTable}
              vehicles={this.props.vehicles}
              recipients={this.props.recipients}
              cancelOrder={this.cancelOrder}
              loaded={this.props.loaded}
              orderListPageNumber={this.props.orderListPageNumber}
              saveCurrentPageOrderList={this.saveCurrentPageOrderList}
              clearSelectedOrders={this.clearSelectedOrders}
              company={this.props.company}
              historyPageCount={historyPageCount}
              addSomeOrdersToHistory={this.props.fleetActions.addSomeOrdersToHistory}
              account={this.props.account}
              startSpinner={this.props.appActions.startSpinner}
              lowerProcessedAtTime={lowerProcessedAtTime}/>);
            break;
          }
    const someOrdersSelected = !!this.ordersSelectedOnTable.length;
    return (
      <div>
        <OrdersMap
          router={this.props.router}
          defaultZoom={10}
          onMapClick={this.onMapClick}
          onMarkerClick={this.onMarkerClick}
          nearestDrivers={this.props.nearestDrivers}
          getNearestDrivers={this.props.appActions.getNearestDrivers}
          onDriverMarkerClick={this.onDriverMarkerClick}
          onMarkerRightClick={this.onMarkerRightClick}
          onOrderDetailLinkClick={this.onOrderDetailLinkClick}
          handleOrderSelectChange={this.handleOrderSelectChange}
          allPickUpPoints={this.props.pickUpPoints}
          orders={this.selectedDriver?_.filter(ordersForMap, {driverId: this.selectedDriver.id}):ordersForMap}
          driversLocations={driverLocations}
          groupages={[]}
          selectedOrders={this.ordersSelectedOnTable}
          recipients={this.props.recipients}
          users={this.props.users}
          setOfLocationsToShowPopup={this.setOfLocationsToShowPopup}
          setOfDriverLocationIdsToShowPopup={this.setOfDriverLocationIdsToShowPopup}
          handleMarkerClose={this.handleMarkerClose}
          handleDriverMarkerClose={this.handleDriverMarkerClose}
          closeAllInfoWindows={this.closeAllInfoWindows}
          polygon={this.selectedTeam?this.selectedTeam.polygon:undefined}/>

        <OrdersListActionBar
          orderListViewMode={this.props.orderListViewMode}
          changeOrderListViewMode={this.changeOrderListViewMode}
          groupSelectedOrders={this.groupSelectedOrders}
          ungroupSelectedOrders={this.ungroupSelectedOrders}
          someOrdersSelected={someOrdersSelected}
          assignOrders={this.assignOrders}
          unassignOrders={this.unassignSelectedOrders}
          selectedOrders={this.ordersSelectedOnTable}
          account={this.props.account}
          createNewOrder={this.createNewOrder}
          account={this.props.account}/>

        <DragDropContextProvider backend={HTML5Backend}>
          {table}
        </DragDropContextProvider>
      </div>
    );
  }
}




DashboardContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  appActions: PropTypes.object,
  userActions: PropTypes.object,
  history: PropTypes.object,
  pickUpPoints: PropTypes.object,
  orders: PropTypes.array,
  groupages: PropTypes.array,
  users: PropTypes.array,
  orderCreated: PropTypes.number,
  groupageCreated: PropTypes.number,
  groupageDestroyed: PropTypes.number,
  orderUpdated: PropTypes.number,
  updatedOrder: PropTypes.object,
  orderListViewMode: PropTypes.string,
  showMessage: PropTypes.func,
  vehicles: PropTypes.array.isRequired,
  recipients: PropTypes.array.isRequired,
  driversLocations: PropTypes.array.isRequired,
  countries: PropTypes.array,
  cities: PropTypes.array,
  loaded: PropTypes.bool,
  orderListPageNumber: PropTypes.number,
  groupageListPageNumber: PropTypes.number
};

function mapStateToProps(state) {
  return {
    orders: state.appReducer.orders,
    pickUpPoints: state.appReducer.pickUpPoints,
    groupages: state.appReducer.groupages,
    users: state.appReducer.users,
    account: state.appReducer.account,
    nearestDrivers: state.appReducer.nearestDrivers,
    newGroupage: state.dashboardPageReducer.newGroupage,
    groupageCreated: state.dashboardPageReducer.groupageCreated,
    groupageDestroyed: state.dashboardPageReducer.groupageDestroyed,
    orderUpdated: state.dashboardPageReducer.orderUpdated,
    updatedOrder: state.dashboardPageReducer.updatedOrder,
    orderListViewMode: state.dashboardPageReducer.orderListViewMode,
    driversLocations: state.appReducer.driversLocations,
    vehicles: state.appReducer.vehicles,
    recipients: state.appReducer.recipients,
    countries: state.appReducer.countries,
    cities: state.appReducer.cities,
    loaded: state.appReducer.loaded,
    orderListPageNumber: state.appReducer.orderListPageNumber,
    groupageListPageNumber: state.appReducer.groupageListPageNumber,
    drivers: state.appReducer.users.filter((user) => (user.role === 'driver' && user.driverStatus === 'active')),
    company: state.appReducer.company,
    teams: state.appReducer.teams
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    appActions: bindActionCreators(appActions, dispatch),
    fleetActions: bindActionCreators(fleetActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardContainer);
