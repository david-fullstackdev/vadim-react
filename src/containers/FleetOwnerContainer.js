import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import OrdersMap from '../components/maps/OrdersMap';
import OrdersList from '../components/orders/OperatorOrdersListComponent';
import {OrdersListActionBar} from '../components/orders/OrdersListActionBarComponent';
import DriverListComponent from '../components/driverList/DriverListComponent';
import * as actions from '../actions/dashboardPageActions';
import * as appActions from '../actions/appActions';
import * as fleetActions from '../actions/fleetOwnerActions';
import moment from 'moment';
import { gettext } from '../i18n/service';
import { Tabs, Tab} from 'react-bootstrap';
import {Button, Alert } from 'react-bootstrap';

import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

export class FleetOwnerContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.setOfLocationsToShowPopup = new Set();
    this.setOfDriverLocationIdsToShowPopup = new Set();
    this.ordersSelectedOnTable = [];
    this.selectedDriver = undefined;
    this.selectedTeam = undefined;
    this.driverShowType = 'all';
    this.showOrderOption = {
      assigned: true,
      unassigned: true, 
      deliveryPoint: true, 
      waitingForPickup: true, 
      onWayToDelivery:true,
      pickedUp: true,
      partlyPickedUp: true,
      waitingForReturn: true,
    };
    this.showModal = false;
    this.operatorsId = [];
    this.dispatchersId = [];
    this.fleetsId = [];

    _.bindAll(this, ['createNewOrder', 'getPickUpPoints', 'getDriversFromUsers', 'getDispatchersFromUsers', 'getOperatorsFromUsers',
                    'prepareUserList', 'unassignSelectedOrders', 'unassignOrder', 'changeOrderListViewMode', 'clearSelectedOrders', 'toggleCategoryModal', 'changeCategoryState',
                    'handleOrderSelectChange', 'passSelectedDriver', 'passSelectedTeam', 'driverShowFilterUpdate', 'getSelectedDriver', 'dropOrdersToDriver', 'onDriverMarkerClick', 'onMarkerClick',
                    'handleMarkerClose', 'handleDriverMarkerClose', 'getDispatcherPlatformsFromUsers', 'closeAllInfoWindows', 'getSelectedTeam','dropOrdersToTeam',
                    'changeDriverListViewMode', 'onOrderDetailLinkClick']);

  }

  componentDidMount() {
    this.props.appActions.updateDriversLocations();
  }

  componentWillReceiveProps(nextProps) {

    if(nextProps.company.id !== this.props.company.id) {
      this.fleetsId.push(this.props.account.id);
      this.props.appActions.getTeams(nextProps.company.id);
      this.props.fleetActions.getUsers(nextProps.company.id);
      this.props.fleetActions.getFleetOrders(nextProps.company.id);
    }

    if(nextProps.users[0] && (nextProps.users[0].dispatchers || nextProps.users[0].operators || nextProps.users[0].drivers)) {
      this.prepareUserList(nextProps.users);
    }
  }

  changeCategoryState(category, value) {
    this.showOrderOption[category] = value
    this.forceUpdate();
  }
  closeAllInfoWindows() {
    this.setOfLocationsToShowPopup = new Set();
    this.setOfDriverLocationIdsToShowPopup = new Set();
    this.forceUpdate();
  }

  onMarkerClick(stringifiedLocation) {
    //showing only one popup on map
    this.setOfLocationsToShowPopup.clear();
    this.setOfLocationsToShowPopup.add(stringifiedLocation);
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

  toggleCategoryModal() {
    this.showModal=this.showModal?false:true;
    this.forceUpdate();
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
    this.props.appActions.startSpinner();
    this.props.actions.unassignOrder(id);
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
  driverShowFilterUpdate(val) {
    if(val!== this.driverShowType) {
      this.driverShowType=val;
      this.forceUpdate();
    }
  }
  getSelectedDriver() {
    return this.selectedDriver;
  }

  getSelectedTeam() {
    return this.selectedTeam;
  }

  changeOrderListViewMode(viewMode) {
    this.ordersSelectedOnTable = [];
    this.props.actions.changeOrderListViewMode(viewMode);
    this.forceUpdate();
  }

  changeDriverListViewMode(viewMode) {
    this.selectedDriver = undefined;
    this.selectedTeam = undefined;
    this.props.actions.changeDriverListViewMode(viewMode);
    this.forceUpdate();
  }

  createNewOrder(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.appActions.removeOrderForUpdate();
    this.props.router.push('/createNewOrder');
  }

  getPickUpPoints(users) {
    let pickUpPoints = [];
    _.map(users, (user) => {
      _.map(user.dispatchers, (dispatcher) => {
        _.map(dispatcher.pickUpPoints, (pickUpPoint) => {
          pickUpPoints.push(pickUpPoint);
        });
      });
    });
    this.props.fleetActions.addPickupPointsToStore(pickUpPoints);
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
        this.dispatchersId.push(dispatcher.id);
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
        this.operatorsId.push(operator.id);

      });
    });

    return operators;
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

  onDriverMarkerClick(driverLocationId, driverId) {
    this.selectedDriverId = driverId;
    this.setOfDriverLocationIdsToShowPopup.clear();
    this.setOfDriverLocationIdsToShowPopup.add(driverLocationId);
    this.forceUpdate();
  }

  prepareUserList(users) {
    let drivers = this.getDriversFromUsers(users);
    let operators = this.getOperatorsFromUsers(users);
    let dispatchers = this.getDispatchersFromUsers(users);
    let platforms = this.getDispatcherPlatformsFromUsers(users);
    this.props.fleetActions.addUsersToStore(drivers.concat(operators, dispatchers, platforms));
  }

  clearSelectedOrders() {
    this.ordersSelectedOnTable = [];
    this.ordersSelectedOnMap = [];
    this.forceUpdate();
  }

  dropOrdersToDriver(driverId) {
    this.props.appActions.startSpinner();
    this.props.actions.assignOnDriver(driverId, _.map(this.ordersSelectedOnTable, order => order.id), localStorage.getItem('userType'));
    this.selectedDriver = undefined;
    this.clearSelectedOrders();
  }

  dropOrdersToTeam(teamId) {
    this.props.appActions.startSpinner();
    _.map(this.ordersSelectedOnTable, (order) => {
      this.props.actions.assignOnTeam({orderId: order.id, teamsIds: [teamId]});
    });
    this.selectedTeam = undefined;
    this.clearSelectedOrders();
  }

  onOrderDetailLinkClick(order, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    return this.props.router.push(`/orderDetails/${order.id}`);
  }

  render() {
   
    const ordersForTable = _(this.props.orders)
      .filter((order) => order.orderStatus === 'new')
      .sortBy('createdAt', 'expectedPickUpTime').value();

    const ordersForMap = _.filter(this.props.orders, (order) => {
        return order.orderStatus === (this.showOrderOption.unassigned==true?'new':'demo') || order.orderStatus === (this.showOrderOption.assigned==true?'assigned':'demo') || order.orderStatus === (this.showOrderOption.onWayToDelivery==true?'onWayToDelivery':'demo') || order.orderStatus === (this.showOrderOption.waitingForPickup==true?'waitingForPickup':'demo') ;
    });

    const ordersForInProgressTable = _(this.props.orders)
      .filter((order) => order.orderStatus === (this.showOrderOption.assigned==true?'assigned':'demo')
                          || order.orderStatus === (this.showOrderOption.onWayToDelivery==true?'onWayToDelivery':'demo')
                          || order.orderStatus === (this.showOrderOption.waitingForPickup==true?'waitingForPickup':'demo')
                          || order.orderStatus === (this.showOrderOption.pickedUp==true?'pickedUp':'demo')
                          || order.orderStatus === (this.showOrderOption.partlyPickedUp==true?'partlyPickedUp':'demo')
                          || order.orderStatus === (this.showOrderOption.waitingForReturn==true?'waitingForReturn':'demo'))
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
                  getSelectedTeam={this.getSelectedTeam}
                  dropOrdersToDriver={this.dropOrdersToDriver}
                  dropOrdersToTeam={this.dropOrdersToTeam}
                  startSpinner={this.props.appActions.startSpinner}
                  showMessage={this.props.showMessage}
                  driverShowFilterUpdate={this.driverShowFilterUpdate}
                  driverListViewMode={this.props.driverListViewMode}
                  driverShowType={this.driverShowType}
                  changeDriverListViewMode={this.props.actions.changeDriverListViewMode}
                  teams={this.props.teams}/>
              </div>
              <OrdersList
                orderListViewMode={this.props.orderListViewMode}
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
              </div>
            );
        break;
      case 'assignedOrders':
        table =
          (<OrdersList
            orderListViewMode={this.props.orderListViewMode}
            orders={ordersForInProgressTable}
            users={this.props.users}
            vehicles={this.props.vehicles}
            selectedOrders={this.ordersSelectedOnTable}
            clearSelectedOrders={this.clearSelectedOrders}
            handleOrderSelectChange={this.handleOrderSelectChange}
            company={this.props.company}/>);
        break;
      case 'orderHistory':
        table =
          (<OrdersList
            orderListViewMode={this.props.orderListViewMode}
            orders={ordersForHistoryTable}
            users={this.props.users}
            vehicles={this.props.vehicles}
            selectedOrders={this.ordersSelectedOnTable}
            clearSelectedOrders={this.clearSelectedOrders}
            handleOrderSelectChange={this.handleOrderSelectChange}
            company={this.props.company}
            historyPageCount={historyPageCount}
            historyPageCount={historyPageCount}
            addSomeOrdersToHistory={this.props.fleetActions.addSomeOrdersToHistory}
            company={this.props.company}
            lowerProcessedAtTime={lowerProcessedAtTime}
            startSpinner={this.props.appActions.startSpinner}/>);
          break;
        }

    // const someOrdersSelected = !!this.ordersSelectedOnTable.length;
    return (
        <div>
          {this.props.account.isBlocked?
            <Alert bsStyle="danger" className="pay_div" onDismiss={this.handleAlertDismiss}>
              <h4>Company is blocked!</h4>
              <Button onClick={() => this.props.router.push('/pay')}>{gettext('PAY')}</Button>
            </Alert>: ''}
            <OrdersMap
              defaultZoom={10}
              users={this.props.users}
              showOrderOption={this.showOrderOption}
              changeCategoryState={this.changeCategoryState}
              nearestDrivers={this.props.nearestDrivers}
              orders={this.selectedDriver?_.filter(ordersForMap, {driverId: this.selectedDriver.id}):ordersForMap}
              selectedOrders={this.ordersSelectedOnTable}
              allPickUpPoints={this.props.pickUpPoints}
              driversLocations={driverLocations}
              toggleCategoryModal={this.toggleCategoryModal}
              showModal={this.showModal}
              setOfLocationsToShowPopup={this.setOfLocationsToShowPopup}
              setOfDriverLocationIdsToShowPopup={this.setOfDriverLocationIdsToShowPopup}
              company={this.props.company}
              recipients={this.props.recipients}
              onDriverMarkerClick={this.onDriverMarkerClick}
              onMarkerClick={this.onMarkerClick}
              driverShowType={this.driverShowType}
              handleMarkerClose={this.handleMarkerClose}
              getNearestDrivers={this.props.appActions.getNearestDrivers}
              handleDriverMarkerClose={this.handleDriverMarkerClose}
              closeAllInfoWindows={this.closeAllInfoWindows}
              onOrderDetailLinkClick={this.onOrderDetailLinkClick}
              handleOrderSelectChange={this.handleOrderSelectChange}
              polygon={this.selectedTeam?this.selectedTeam.polygon:undefined}
              selectedDriver={this.selectedDriver}/>

            <OrdersListActionBar
              orderListViewMode={this.props.orderListViewMode}
              changeOrderListViewMode={this.changeOrderListViewMode}
              createNewOrder={this.createNewOrder}
              unassignOrders={this.unassignSelectedOrders}
              selectedOrders={this.ordersSelectedOnTable}
              account={this.props.account}/>

            <DragDropContextProvider backend={HTML5Backend}>
              {table}
            </DragDropContextProvider>
        </div>
    );
  }
}

FleetOwnerContainer.propTypes = {
  actions: PropTypes.object,
  appActions: PropTypes.object,
  account: PropTypes.object,
  orders: PropTypes.array,
  orderListViewMode: PropTypes.string,
  driversLocations: PropTypes.array,
  pickUpPoints: PropTypes.array,
  vehicles: PropTypes.array,
  users: PropTypes.array
};

function mapStateToProps(state) {
  return {
    account: state.appReducer.account,
    orders: state.appReducer.orders,
    orderListViewMode: state.dashboardPageReducer.orderListViewMode,
    driversLocations: state.appReducer.driversLocations,
    pickUpPoints: state.appReducer.pickUpPoints,
    vehicles: state.appReducer.vehicles,
    users: state.appReducer.users,
    company: state.appReducer.company,
    recipients: state.appReducer.recipients,
    cards: state.appReducer.cards,
    teams: state.appReducer.teams,
    nearestDrivers: state.appReducer.nearestDrivers
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
)(FleetOwnerContainer);
