import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/dashboardPageActions';
import * as appActions from '../actions/appActions';
import * as fleetActions from '../actions/fleetOwnerActions';
import * as adminActions from '../actions/adminActions';

import OrdersMap from '../components/maps/OrdersMap';
import OrdersList from '../components/orders/OperatorOrdersListComponent';
import {OrdersListActionBar} from '../components/orders/OrdersListActionBarComponent';

import {GroupagesList} from '../components/groupages/GroupagesListComponent';
import _ from 'lodash';
import { gettext } from '../i18n/service';
import expPikcupTimeValidator from '../businessLogic/groupValidation.js';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';

import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DriverListComponent from '../components/driverList/DriverListComponent';

// import parseExpectedPickUpTime from '../businessLogic/expectedPickUpTimeParser.js';


export class AdminDashboardContainer extends React.Component {
  constructor(props, context) {
    super(props, context);


    this.setOfLocationsToShowPopup = new Set();
    this.setOfDriverLocationIdsToShowPopup = new Set();
    this.ordersSelectedOnTable = [];
    this.selectedDriver = undefined;
    this.driverShowType = 'all';
    this.operatorsId = [];
    this.dispatchersId = [];
    this.fleetsId = [];

    this.showModal = false;
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
    this.deleteOrder = this.deleteOrder.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.saveCurrentPageOrderList = this.saveCurrentPageOrderList.bind(this);
    this.saveCurrentPageGroupageList = this.saveCurrentPageGroupageList.bind(this);

    _.bindAll(this, ['getPickUpPoints', 'getDriversFromUsers', 'getDispatchersFromUsers', 'getOperatorsFromUsers', 'toggleCategoryModal', 'changeCategoryState',
                    'prepareUserList', 'unassignSelectedOrders', 'driverShowFilterUpdate', 'unassignOrder', 'changeOrderListViewMode', 'clearSelectedOrders',
                    'handleOrderSelectChange', 'passSelectedDriver', 'getSelectedDriver', 'dropOrders', 'onDriverMarkerClick', 'onMarkerClick',
                    'handleMarkerClose', 'handleDriverMarkerClose', 'closeAllInfoWindows']);
  }

  toggleCategoryModal() {
    this.showModal=this.showModal?false:true;
    this.forceUpdate();
  }
  componentDidMount() {
    this.props.appActions.updateDriversLocations();
    this.updateDriversInterval = setInterval(this.props.appActions.updateDriversLocations.bind(this), 30000);
  }

  changeCategoryState(category, value) {
    this.showOrderOption[category] = value
    this.forceUpdate();
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.company.id !== this.props.company.id) {
      this.fleetsId.push(this.props.account.id);
      this.props.appActions.getTeams(nextProps.company.id);
      this.props.fleetActions.getUsers(nextProps.company.id);
      // this.props.fleetActions.getFleetOrders(nextProps.company.id);
      this.props.adminActions.getCompanies();
      this.props.adminActions.getFleets();
      this.props.appActions.endSpinner();
    }

    if(nextProps.users[0] && (nextProps.users[0].dispatchers || nextProps.users[0].operators || nextProps.users[0].drivers)) {
      this.prepareUserList(nextProps.users);
    }
  }

  componentWillUnmount() {
    clearInterval(this.updateDriversInterval);
  }

  closeAllInfoWindows() {
    this.setOfLocationsToShowPopup = new Set();
    this.setOfDriverLocationIdsToShowPopup = new Set();
    this.forceUpdate();
  }

  clearSelectedOrders() {
    this.ordersSelectedOnTable = [];
    this.ordersSelectedOnMap = [];
    this.forceUpdate();
  }

  dropOrders(driverId) {
    // if(!this.ordersSelectedOnTable.every( (val, i, arr) => val == arr[0])) {
    //   return this.props.showMessage({
    //     message: gettext('ORDERS-SHOULD-HAVE-ONE-VEH-TYPE'),
    //     level: 'error'
    //   });
    // }
    this.props.appActions.startSpinner();
    this.props.actions.assignOnDriver(driverId, _.map(this.ordersSelectedOnTable, order => order.id), localStorage.getItem('userType'));
    this.selectedDriver = undefined;
    this.clearSelectedOrders();
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

  passSelectedDriver(driver) {
    this.selectedDriver = driver;
  }

  getSelectedDriver() {
    return this.selectedDriver;
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
  driverShowFilterUpdate(val) {
    if(val!== this.driverShowType) {
      this.driverShowType=val;
      this.forceUpdate();
    }
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

  prepareUserList(users) {
    let drivers = this.getDriversFromUsers(users);
    let operators = this.getOperatorsFromUsers(users);
    let dispatchers = this.getDispatchersFromUsers(users);
    this.props.fleetActions.addUsersToStore(drivers.concat(operators, dispatchers));
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

  onOrderDetailLinkClick(order, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (order.groupageId) {
      return this.props.router.push(`/groupageDetails/${order.groupageId}`);
    } else {
      return this.props.router.push(`/orderDetails/${order.id}`);
    }
  }

  onGroupageDetailLinkClick(groupage) {
    return this.props.router.push(`/groupageDetails/${groupage.id}`);
  }

  deleteOrder(order) {
    if(LoopbackHttp.isAdministrator){
      const isSelected = this.ordersSelectedOnTable.includes(order);
      if (isSelected) {
        _.pull(this.ordersSelectedOnTable, order);
      }

      this.props.adminActions.deleteOrder(order);
      _.pull(this.props.orders, order);

    this.props.showMessage({
      message: order.id+ ' '+ gettext('HAS-BEEN-DELETED'),
      level: 'success'
    });

    this.forceUpdate();
    }
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

  changeOrderListViewMode(viewMode) {
    this.props.actions.changeOrderListViewMode(viewMode);
  }

  saveCurrentPageOrderList(pageNumber) {
    this.props.appActions.saveCurrentPageOrderList(pageNumber);
    this.forceUpdate();
  }

  saveCurrentPageGroupageList(pageNumber) {
    this.props.appActions.saveCurrentPageGroupageList(pageNumber);
    this.forceUpdate();
  }



  render() {

    const ordersForTable = _(this.props.orders)
      .filter((order) => order.orderStatus === 'new' )
      .sortBy('createdAt', 'expectedPickUpTime').value();

    const ordersForMap = _.filter(this.props.orders, (order) => {
        //return order.orderStatus === 'new' || order.orderStatus === 'assigned'  ;
        return order.orderStatus === (this.showOrderOption.unassigned==true?'new':'demo') || order.orderStatus === (this.showOrderOption.assigned==true?'assigned':'demo') ;
    });

    const ordersForInProgressTable = _(this.props.orders)
      
     .filter((order) => order.orderStatus === (this.showOrderOption.assigned==true?'assigned':'demo')
                          || order.orderStatus === (this.showOrderOption.onWayToDelivery==true?'onWayToDelivery':'demo')
                          || order.orderStatus === (this.showOrderOption.waitingForPickup==true?'waitingForPickup':'demo')
                          || order.orderStatus === (this.showOrderOption.partlyPickedUp==true?'partlyPickedUp':'demo')
                          || order.orderStatus === (this.showOrderOption.waitingForReturn==true?'waitingForReturn':'demo'))
      .sortBy('createdAt', 'expectedPickUpTime').value();

    const ordersForHistoryTable = _(this.props.orders)
      .filter((order) => order.orderStatus === 'canceled' || order.orderStatus === 'delivered' || order.orderStatus === 'returned')
      .sortBy('createdAt', 'expectedPickUpTime').value();

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
                selectedDriver={this.selectedDriver}
                getSelectedDriver={this.getSelectedDriver}
                dropOrders={this.dropOrders}
                startSpinner={this.props.appActions.startSpinner}
                showMessage={this.props.showMessage}
                driverShowFilterUpdate={this.driverShowFilterUpdate}
                driverShowType={this.driverShowType}
                />
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
            orders={ordersForHistoryTable}
            users={this.props.users}
            vehicles={this.props.vehicles}
            selectedOrders={this.ordersSelectedOnTable}
            clearSelectedOrders={this.clearSelectedOrders}
            handleOrderSelectChange={this.handleOrderSelectChange}
            company={this.props.company}/>);
          break;
        }



    // const someOrdersSelected = !!this.ordersSelectedOnTable.length;

    return (
        <div>
          <OrdersMap
            defaultZoom={10}
            users={this.props.users}
            orders={ordersForMap}
            groupages={{}}
            nearestDrivers={this.props.nearestDrivers}
            selectedOrders={{}}
            changeCategoryState={this.changeCategoryState}
            showOrderOption={this.showOrderOption}
            allPickUpPoints={this.props.pickUpPoints}
            driversLocations={this.props.driversLocations}
            setOfLocationsToShowPopup={this.setOfLocationsToShowPopup}
            setOfDriverLocationIdsToShowPopup={this.setOfDriverLocationIdsToShowPopup}
            company={this.props.company}
            toggleCategoryModal={this.toggleCategoryModal}
            showModal={this.showModal}
            onDriverMarkerClick={this.onDriverMarkerClick}
            onMarkerClick={this.onMarkerClick}
            handleMarkerClose={this.handleMarkerClose}
            getNearestDrivers={this.props.appActions.getNearestDrivers}
            driverShowType={this.driverShowType}
            handleDriverMarkerClose={this.handleDriverMarkerClose}
            closeAllInfoWindows={this.closeAllInfoWindows}/>

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




AdminDashboardContainer.propTypes = {
  actions: PropTypes.object,
  appActions: PropTypes.object,
  account: PropTypes.object,
  orders: PropTypes.array,
  groupages: PropTypes.array,
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
    groupages: state.appReducer.groupages,
    orderListViewMode: state.dashboardPageReducer.orderListViewMode,
    driversLocations: state.appReducer.driversLocations,
    pickUpPoints: state.appReducer.pickUpPoints,
    vehicles: state.appReducer.vehicles,
    users: state.appReducer.users,
    company: state.appReducer.company,
    recipients: state.appReducer.recipients,
    fleets: state.appReducer.fleets,
    nearestDrivers: state.appReducer.nearestDrivers,
    companies: state.appReducer.companies
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    appActions: bindActionCreators(appActions, dispatch),
    fleetActions: bindActionCreators(fleetActions, dispatch),
    adminActions: bindActionCreators(adminActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminDashboardContainer);
