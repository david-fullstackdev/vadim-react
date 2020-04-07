import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import OrdersMap from '../components/maps/OrdersMap';
import OrdersList from '../components/orders/OperatorOrdersListComponent';
import { OrdersListActionBar } from '../components/orders/OrdersListActionBarComponent';
import { DriverListContent } from '../components/driverList/DriverListComponent';
import * as actions from '../actions/dashboardPageActions';
import * as appActions from '../actions/appActions';
import * as fleetActions from '../actions/fleetOwnerActions';
import * as onDemandActions from '../actions/onDemandActions';
import moment from 'moment';
import { gettext } from '../i18n/service';
import { Tabs, Tab } from 'react-bootstrap';
import { Button, Alert } from 'react-bootstrap';

import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { RightSidebar } from '../components/sidebar/RightSidebar';
import { SidebarOrdersComponent } from '../components/sidebarOrders/SidebarOrdersComponent';

export class OnDemandContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.setOfLocationsToShowPopup = new Set();
    this.setOfDriverLocationIdsToShowPopup = new Set();
    this.ordersSelectedOnTable = [];
    this.selectedDriver = undefined;
    this.selectedTeam = undefined;

    this.operatorsId = [];
    this.dispatchersId = [];
    this.fleetsId = [];

    this.state = {
      draggingOrder: undefined
    };
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
    _.bindAll(this, ['createNewOrder', 'getPickUpPoints', 'getDriversFromUsers', 'getDispatchersFromUsers', 'getOperatorsFromUsers',
      'prepareUserList', 'unassignSelectedOrders', 'unassignOrder', 'changeOrderListViewMode', 'clearSelectedOrders', 'toggleCategoryModal', 'changeCategoryState',
      'handleOrderSelectChange', 'passSelectedDriver', 'passSelectedTeam', 'getSelectedDriver', 'dropOrdersToDriver', 'onDriverMarkerClick', 'onMarkerClick',
      'handleMarkerClose', 'handleDriverMarkerClose', 'getDispatcherPlatformsFromUsers', 'closeAllInfoWindows', 'getSelectedTeam', 'dropOrdersToTeam',
      'changeDriverListViewMode', 'onOrderDetailLinkClick', 'startDraggingOrder']);

  }

  componentDidMount() {
    this.props.appActions.updateDriversLocations();
    this.props.fleetActions.getTodayOrders(this.props.company.id);
  }
  changeCategoryState(category, value) {
    this.showOrderOption[category] = value
    this.forceUpdate();
  }
  toggleCategoryModal() {
    this.showModal=this.showModal?false:true;
    this.forceUpdate();
  }
  componentWillReceiveProps(nextProps) {

    if (nextProps.company.id !== this.props.company.id) {
      this.fleetsId.push(this.props.account.id);
      this.props.appActions.getTeams(nextProps.company.id);
      this.props.fleetActions.getUsers(nextProps.company.id);
      this.props.fleetActions.getTodayOrders(nextProps.company.id);
    }

    if (nextProps.users[0] && (nextProps.users[0].dispatchers || nextProps.users[0].operators || nextProps.users[0].drivers)) {
      this.prepareUserList(nextProps.users);
    }
  }

  closeAllInfoWindows() {
    this.props.appActions.removeNearestDrivers(); 
    this.setOfLocationsToShowPopup = new Set();
    this.setOfDriverLocationIdsToShowPopup = new Set();
    this.forceUpdate();
  }

  startDraggingOrder(order) {
    console.log(order, 'catched')
    this.setState({draggingOrder: order});
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

  unassignSelectedOrders() {
    this.props.appActions.startSpinner();
    _.map(this.ordersSelectedOnTable, (order) => {
      if (order.orderStatus !== 'assigned' && order.orderStatus !== 'waitingForPickup') {
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
    if (driver !== this.selectedDriver) {
      this.selectedDriver = driver;
      this.forceUpdate();
    }
  }

  passSelectedTeam(team) {
    if (team !== this.selectedTeam) {
      this.selectedTeam = team;
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
    this.setState({draggingOrder: undefined});
    this.forceUpdate();
  }

  dropOrdersToDriver(driverId) {
    let driver = _.find(this.props.users, {id: driverId});

    if (driver.cashOnDelivery >= this.props.company.cashOnDeliveryCap) {
      return this.props.showMessage({
        message: gettext('DRIVER-CANT-RECIEVE-MORE-ORDERS'),
        level: 'error'
      });
    }
    
    this.props.appActions.startSpinner();
    this.props.actions.assignOnDriver(driverId, this.state.draggingOrder.id, localStorage.getItem('userType'));
    this.selectedDriver = undefined;
    this.clearSelectedOrders();
  }

  dropOrdersToTeam(teamId) {
    this.props.appActions.startSpinner();
    _.map(this.ordersSelectedOnTable, (order) => {
      this.props.actions.assignOnTeam({ orderId: order.id, teamsIds: [teamId] });
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
    // const someOrdersSelected = !!this.ordersSelectedOnTable.length;

    const { onDemand, onDemandActions } = this.props;

    return (
      <div>
        {this.props.account.isBlocked ?
          <Alert bsStyle="danger" className="pay_div" onDismiss={this.handleAlertDismiss}>
            <h4>Company is blocked!</h4>
            <Button onClick={() => this.props.router.push('/pay')}>{gettext('PAY')}</Button>
          </Alert> : ''}
        <DragDropContextProvider backend={HTML5Backend}>
          <div>
            <LeftSidebar width="304px" isOpen={onDemand.leftSidebar.isOpen} toggle={onDemandActions.toggleLeftSidebar} >
              <SidebarOrdersComponent
              orders={this.props.orders}
              recipients={this.props.recipients}
              pickUpPoints={this.props.pickUpPoints}
              drivers={this.props.users.filter((user) => user.role === 'driver')} 
              actions={onDemandActions}
              draggingOrder={this.state.draggingOrder}
              startDraggingOrder={this.startDraggingOrder}
              state={onDemand}/>
            </LeftSidebar>
            <RightSidebar width="304px" isOpen={onDemand.rightSidebar.isOpen} toggle={onDemandActions.toggleRightSidebar}>
              <div className="driver-list-pad">
                <DriverListContent
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
                  draggingOrder={this.state.draggingOrder}
                  dropOrdersToTeam={this.dropOrdersToTeam}
                  startSpinner={this.props.appActions.startSpinner}
                  showMessage={this.props.showMessage}
                  driverListViewMode={this.props.driverListViewMode}
                  changeDriverListViewMode={this.props.actions.changeDriverListViewMode}
                  teams={this.props.teams} />
              </div>
            </RightSidebar>
          </div>
        </DragDropContextProvider>
        <OrdersMap
          defaultZoom={10}
          getNearestDrivers={this.props.appActions.getNearestDrivers}
          users={this.props.users}
          orders={this.props.orders}
          selectedOrders={this.ordersSelectedOnTable}
          allPickUpPoints={this.props.pickUpPoints}
          driversLocations={this.props.driversLocations}
          setOfLocationsToShowPopup={this.setOfLocationsToShowPopup}
          setOfDriverLocationIdsToShowPopup={this.setOfDriverLocationIdsToShowPopup}
          company={this.props.company}
          showOrderOption={this.showOrderOption}
          changeCategoryState={this.changeCategoryState}
          toggleCategoryModal={this.toggleCategoryModal}
          showModal={this.showModal}
          recipients={this.props.recipients}
          onDriverMarkerClick={this.onDriverMarkerClick}
          onMarkerClick={this.onMarkerClick}
          handleMarkerClose={this.handleMarkerClose}
          nearestDrivers={this.props.nearestDrivers}
          handleDriverMarkerClose={this.handleDriverMarkerClose}
          closeAllInfoWindows={this.closeAllInfoWindows}
          onOrderDetailLinkClick={this.onOrderDetailLinkClick}
          handleOrderSelectChange={this.handleOrderSelectChange}
          polygon={this.selectedTeam && this.selectedTeam.polygon}
          selectedDriver={this.selectedDriver}
          fullSize={true} />
      </div>
    );
  }
}

OnDemandContainer.propTypes = {
  actions: PropTypes.object,
  appActions: PropTypes.object,
  account: PropTypes.object,
  orders: PropTypes.array,
  orderListViewMode: PropTypes.string,
  driversLocations: PropTypes.array,
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
    nearestDrivers: state.appReducer.nearestDrivers,
    onDemand: state.onDemand
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    appActions: bindActionCreators(appActions, dispatch),
    fleetActions: bindActionCreators(fleetActions, dispatch),
    onDemandActions: bindActionCreators(onDemandActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnDemandContainer);
