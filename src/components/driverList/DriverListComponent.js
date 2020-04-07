import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Panel, PageHeader, Button, ListGroup, ListGroupItem, FormControl, Row, Glyphicon, Tabs, Tab, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';
import { gettext } from '../../i18n/service';
import getCurLang from '../../businessLogic/getCurLang.js';
import {parseExpectedPickUpTime} from '../../businessLogic/expectedPickUpTimeParser.js';
import { DropTarget } from 'react-dnd';
import { ItemTypes, carIcon } from '../../constants/actionTypes';
import { Scrollbars } from 'react-custom-scrollbars';
import getTooltip from '../../businessLogic/getTooltip';
import * as orderFunctions from '../sidebarOrders/order/orderFunctions';
import './DriverListComponent.scss';
import {DriverCodImg} from '../DriverCodImg';

const orderTarget = {
  drop(props) {
    if (props.getSelectedDriver() && props.getSelectedDriver().id) {
      props.dropOrdersToDriver(props.getSelectedDriver().id)
      return { dropped: true };
    } else if (props.getSelectedTeam() && props.getSelectedTeam().id) {
      props.dropOrdersToTeam(props.getSelectedTeam().id)
      return { dropped: true };
    } else {
      return { dropped: false };
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}

class DriverList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.clickedDriver = undefined;
    this.clickedTeam = undefined;

    _.bindAll(this, ['clickOnDriver', 'renderDrivers', 'handleDriverShowType', 'searchInDrivers', 'getDriverOrders', 'ifHaveSelectedOrders',
      'dragToDriver', 'renderTeams', 'clickOnTeam', 'dragToTeam', 'renderCashOnDeliveryImg']);

    this.state = {
      searchFilter: '',
      driverTypeFilter: '',
      isShow: false
    }

  }

  clickOnDriver(driver, type) {
    if (this.clickedDriver && driver.id === this.clickedDriver.id) {
      this.clickedDriver = undefined;
      this.props.passSelectedDriver(undefined);

      return false
    }
    this.props.passSelectedDriver(driver);
    this.clickedDriver = driver;
    this.forceUpdate();
  }

  clickOnTeam(team) {
    if (this.clickedTeam && team.id === this.clickedTeam.id) {
      this.clickedTeam = undefined;
      this.props.passSelectedTeam(undefined);
      this.forceUpdate();

      return false
    }
    this.props.passSelectedTeam(team);
    this.clickedTeam = team;
    this.forceUpdate();
  }

  dragToDriver(driver) {
    if (driver === this.clickedDriver)
      return false;
    this.props.passSelectedDriver(driver);
    if (this.clickedDriver && (this.clickedDriver.id === driver.id)) {
      return true;
    }
    else {
      this.clickedDriver = driver;
    }
    this.forceUpdate();
  }

  dragToTeam(team) {
    if (team === this.clickedTeam)
      return false;
    this.props.passSelectedTeam(team);
    if (this.clickedTeam && (this.clickedTeam.id === team.id)) {
      return true;
    }
    else {
      this.clickedTeam = team;
    }
    this.forceUpdate();
  }

  searchInDrivers(val) {
    this.setState({ searchFilter: val });
  }
  handleDriverShowType(val) {
    this.setState({driverTypeFilter: val});
  }
  getDriverOrders(driverId) {
    return _.filter(this.props.orders, (order) => {
      return order.driverId === driverId && order.orderStatus !== 'canceled'
        && order.orderStatus !== 'returned' && order.orderStatus !== 'delivered';
    });
  }

  ifHaveSelectedOrders(drivers, vehicles) {
    return _.filter(drivers, (driver) => {
      return _.includes(vehicles, driver.vehicleType);
    });
  }

  renderCashOnDeliveryImg(driver, company) {
    if (driver.cashOnDelivery) {
      if (driver.cashOnDelivery < company.cashOnDeliveryCap) {
        const persent = company.cashOnDeliveryCap - (company.cashOnDeliveryCap * 0.1);
        if (driver.cashOnDelivery >= persent) {
          let tooltip = gettext('DRIVER-CAP-WARNING-TOOLTIP');
          try {
            tooltip = tooltip.replace('{$COMPANY.CASHONDELIVERYCAP}', company.cashOnDeliveryCap);
            tooltip = tooltip.replace('{$DRIVER.CASHONDELIVERY}', driver.cashOnDelivery);
          }
          catch (error) { console.log(error) }
          return (
            <OverlayTrigger placement="top" overlay={getTooltip(tooltip)}>
              <img className="driver_warn_icon" alt="warning" src="./warning2.png" />
            </OverlayTrigger>
          )
        }
      } else if (driver.cashOnDelivery >= company.cashOnDeliveryCap) {
        const tooltip = gettext('DRIVER-CAP-DANGER-TOOLTIP');
        return (
          <OverlayTrigger placement="top" overlay={getTooltip(tooltip)}>
            <img className="driver_warn_icon" alt="danger" src="./danger2.png" />
          </OverlayTrigger>
        )
      }
    }

  }
  renderPickupRow(order) {
    return _.map(order.items, (item, i) => {
      const pickUpPoint = _.find(this.props.pickUpPoints, {id: item.pickupPointId});
      const endTime = moment(order.expectedPickUpTime.endTime).zone('+0300').format('HH:mm');
      return (
        <Row className="order_details_row media bottom-border order-list-item">
          <div className="media-left">
            <img className='pin-icon media-object' src={`./side_pin_pickup.svg`} />
          </div>
          <div className="media-body">
            <p className="fontsize-12">{pickUpPoint ? ' ' + pickUpPoint.address : ''}</p>
            {parseExpectedPickUpTime(order.expectedPickUpTime)}
          </div>
        </Row>
      )
    })
  }
  renderDrivers(driversToShowInList) {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;

    return _.map(driversToShowInList, (driver, i) => {
      const driverVehicle = _.find(this.props.vehicles, { size: +driver.vehicleType }) || {};
      let maxDeliveryTime = 0;
      const driverOrders = _.map(this.getDriverOrders(driver.id), (order) => {
        const dispatcher = _.find(this.props.dispatchers, { id: order.dispatcherId });
        const recipient = _.find(this.props.recipients, { id: order.recipientId });
        const deliveryTime  = moment(order.deliveryTime).zone('+0300').format('HH:mm');
        if (maxDeliveryTime < order.deliveryTime) {
          maxDeliveryTime = order.deliveryTime;
        }
        if (order.orderStatus !== 'new')
          return (
            <div className="driver_order">
              <Row className="order_details_row order-list-item top-border order-info">
                <div className="media">
                  <div className="media-body">
                    <Link to={`/orderDetails/${order.id}`}><span className="order_id_label"># {order.id.slice(order.id.length - 5, order.id.length)}</span></Link>
                    <span className="item_count_label"><img src={`./side_${orderFunctions.bagIcon(order)}.svg`} /><span>{order.items.length}</span></span>
                    { order.cashOnDelivery ? <img src={`./side_cacheOnDelivery.svg`} />:'' }
                  </div>
                  <div className="media-right">
                  {
                    order.orderStatus === 'assigned' || order.orderStatus === 'waitingForPickup' ?
                      <Button bsStyle="success"
                        style={{ float: 'right' }}
                        onClick={() => {
                          this.props.startSpinner();
                          this.props.unassignOrder(order.id);
                        }}>
                        {gettext('UNASSIGN')}
                      </Button> : ''
                  }
                  </div>
                </div>
              </Row>
              {this.renderPickupRow(order)}
              <Row className="order_details_row media bottom-border order-list-item">
                <div className="media-left">
                  <img className='pin-icon' src={`./side_pin_delivery.svg`} />
                </div>
                <div className="media-body">
                  <p className="fontsize-12">{recipient ? ' ' + recipient.deliveryPoint : ''}</p>
                  {deliveryTime}
                </div>
              </Row>
              
            </div>
          )
      });

      let className = 'display_none';
      let triangle = 'driver_down_triangle';

      if (this.clickedDriver && (driver.id === this.clickedDriver.id)) {
        className = 'driver_orders';
        triangle = 'driver_up_triangle';
      }

      const { company } = this.props;
      const icon = className=='driver_orders' ? 'chevron-down' : 'menu-right';
      const maxDeliveryTimeLabel = moment(maxDeliveryTime).zone('+0300').format('HH:mm');
      
      const jobCount = _.filter(this.getDriverOrders(driver.id), function(obj) {
          return obj.orderStatus !== 'new';
      }).length;
      
      return (
        <div>
          <ListGroupItem key={i}
            onClick={() => this.clickOnDriver(driver)}
            onDragOver={() => { this.dragToDriver(driver); this.props.passSelectedDriver(driver); }}
            onDragLeave={() => {
              this.clickedDriver = undefined;
              this.setState({});
            }}>
            <div className="driver_info">
              <div className="driver-detail media">
                <div className="media-left">
                  <span className={"glyphicon glyphicon-" + icon}></span>
                </div>
                <div className="media-body">
                  <div className="driver-avatar">
                    <img src="https://lh3.googleusercontent.com/nywb7or_1xcfwmhcssqT3k8vZh9EyhWVYqh1UEpfM5YZTZAJzkjsNu5il4f933aoKkk=w300-rw" width="36"/>
                  </div>
                  <div className="driver-avatar">
                    <p>{driver.firstName}</p>
                    {jobCount > 0 ? (jobCount + ' ' + gettext('Jobs') + ', till ' + maxDeliveryTimeLabel) : gettext('Driver is free')}
                  </div>
                </div>
                <div className="media-right">
                  <img alt={driverVehicle.type} src={driverVehicle.icon} height="20" />
                  {this.renderCashOnDeliveryImg(driver, company)}
                </div>
              </div>
              <div className={className}>
                {driverOrders.length > 0 ? driverOrders : gettext('DRIVER-HAVENT-ORDERS')}
              </div>
            </div>
          </ListGroupItem>
        </div>
      );
    });
  }

  renderTeams(driversToShowInList, teams) {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;

    return _.map(teams, (team, i) => {

      let className = 'display_none';
      if (this.clickedTeam && (team.id === this.clickedTeam.id)) {
        className = 'driver_orders';
      }

      let drivers = _.filter(driversToShowInList, { teamId: team.id });

      drivers = _.map(drivers, (driver, i) => {
        const driverVehicle = _.find(this.props.vehicles, { size: +driver.vehicleType }) || {};
        return (
          <div className="driver_info">
            <div className="liner" />

            <div><span className={driver.driverStatus === 'active' ? 'active_driver' : 'inactive_driver'}>&#x25CF; </span>{driver.firstName}</div>
            <img className="driver_info_vehicle margin_top_em" alt={driverVehicle.type} src={driverVehicle.icon} />
          </div>
        )
      });


      return (
        <div>
          <ListGroupItem key={i}
            onClick={() => this.clickOnTeam(team)}
            onDragOver={() => { this.dragToTeam(team); this.props.passSelectedTeam(team); }}
            onDragLeave={() => {
              this.clickedTeam = undefined;
              this.setState({});
            }}>
            <div className="driver_info bold_text">
              {team.name}
            </div>
            <span className="badge">{drivers.length + ' ' + gettext('DRIVERS')}</span>

            <div className={className}>
              {drivers.length > 0 ? drivers : gettext('NO-DRIVERS')}
            </div>
          </ListGroupItem>
        </div>
      );
    });

  }


  render() {

    let driversToShowInList = _.filter(this.props.drivers, (driver) => {
      return driver.driverStatus === 'active' && (driver.firstName.toUpperCase().indexOf(this.state.searchFilter.toUpperCase()) != -1
        || driver.email.toUpperCase().indexOf(this.state.searchFilter.toUpperCase()) != -1);
    });
    driversToShowInList = _.uniqBy(driversToShowInList, 'id');

    if (this.state.driverTypeFilter === "fulltime") {
      driversToShowInList = _.filter(driversToShowInList, (driver) => {
        return driver.isFullTime;
      });
    }

    if (this.state.driverTypeFilter === "freelancer") {
      driversToShowInList = _.filter(driversToShowInList, (driver) => {
        return !driver.isFullTime;
      });
    }

    if (this.props.ordersSelectedOnTable.length > 0) {
      let higherVehicleInSelectedOrders = 0;
      _.map(this.props.ordersSelectedOnTable, (order) => {
        if (order.vehicleType > higherVehicleInSelectedOrders)
          higherVehicleInSelectedOrders = order.vehicleType;
      });

      driversToShowInList = _.filter(driversToShowInList, (driver) => {
        return driver.vehicleType >= higherVehicleInSelectedOrders;
      });
    }

    let teamsToShowInList = _.filter(this.props.teams, (team) => {
      return team.name && team.name.toUpperCase().indexOf(this.state.searchFilter.toUpperCase()) != -1;
    });
    return this.props.connectDropTarget(
      <div>
        <Tabs
          activeKey={this.props.driverListViewMode}
          onSelect={(e) => {
            this.clickedDriver = undefined;
            this.clickedTeam = undefined;
            this.props.changeDriverListViewMode(e);
          }}
          id="driverListTab"
          className="driverListTabs">
          <Tab eventKey={'drivers'} title={gettext('DRIVERS')} />
          <Tab eventKey={'teams'} title={gettext('TEAMS')} />
        </Tabs>
        <div className="search_input">
          <FormControl placeholder={gettext('SEARCH')} type="text" onChange={(e) => this.searchInDrivers(e.target.value)} />
          <FormControl
            componentClass="select"
            className="driver_select_show"
            onChange={(e) => this.handleDriverShowType(e.target.value)}>
            <option value='all' select>  {gettext('ALL')}  </option>
            <option value='fulltime'> {gettext('FULL-TIME-DRIVER')} </option>
            <option value='freelancer'> {gettext('FREELANCER-DRIVER')} </option>
          </FormControl>
        </div>
        <Scrollbars className="rightside-list" style={{ height: '100%' }} trackHorizontal={false} renderView={props => <div {...props} className="view"/>}>
          <div className="scrolling_list">
            <ListGroup>
              {this.props.driverListViewMode === 'drivers' ?
                this.renderDrivers(driversToShowInList) : this.renderTeams(this.props.drivers, teamsToShowInList)
              }
            </ListGroup>
          </div>
        </Scrollbars>
      </div>
    );
  }
}

class DriverListComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isShow: false
    }
  }

  render() {
    return (
      <div>
        <div className={this.state.isShow ? 'dash_driver_list' : 'hidden'}>
          <div className="close_driverlist_btn">
            <Button onClick={() => { this.setState({ isShow: false }); this.props.passSelectedDriver(undefined); this.clickedDriver = undefined; }}>X</Button>
          </div>
          <DriverListContent {...this.props} />
        </div>
        <div className='show_driver_list'>
          <button className={!this.state.isShow ? 'btn btn-success show_btn' : 'hidden'}
            onClick={() => this.setState({ isShow: true })}>
            <img src={carIcon} />
          </button>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    drivers: state.appReducer.users.filter((user) => user.role === 'driver'),
    groupages: state.appReducer.groupages,
    groupageAssigned: state.dashboardPageReducer.groupageAssigned,
    groupage: state.dashboardPageReducer.groupage,
    orders: state.appReducer.orders,
    vehicles: state.appReducer.vehicles,
    loaded: state.appReducer.loaded,
    driverListViewMode: state.appReducer.driverListViewMode,
    company: state.appReducer.company,
    pickUpPoints: state.appReducer.pickUpPoints
  };
}

DriverList.propTypes = DriverListComponent.propTypes = {
  appActions: PropTypes.object,
  groupages: PropTypes.array,
  params: PropTypes.object,
  drivers: PropTypes.array,
  history: PropTypes.object,
  groupageAssigned: PropTypes.number,
  groupage: PropTypes.object,
  orders: PropTypes.array.isRequired,
  vehicles: PropTypes.array.isRequired,
  loaded: PropTypes.bool,
  pickUpPoints: PropTypes.array
};



export default DropTarget(ItemTypes.ORDER, orderTarget, collect)
  (connect(mapStateToProps)(DriverListComponent));


export const DriverListContent = DropTarget(ItemTypes.ORDER, orderTarget, collect)(
  connect(mapStateToProps)(DriverList)
);
