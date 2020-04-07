import React, {Component, PropTypes} from 'react';
import { Checkbox, Image, FormControl } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';
import Spinner from 'react-spinner';
import DateTimeField from 'react-bootstrap-datetimepicker';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import {Table, Tr, Td, Th, Thead} from 'reactable';

import { gettext, getStatus } from '../../i18n/service';
import { parseExpectedPickUpTimeDate, parseExpectedPickUpTimeOnlyTime } from '../../businessLogic/expectedPickUpTimeParser.js';
import {formatOnlyTime} from '../../businessLogic/deliveryTimeFormatter.js';
import formatUserName from '../../businessLogic/userNameFormatter.js';
import formatCamelCase from '../../businessLogic/formatCamelCase.js';
import createExpectedDeliveryTimeWindow from '../../businessLogic/createExpectedDeliveryTimeWindow.js';
import formatId from '../../businessLogic/formatId.js';
import getCurLang from '../../businessLogic/getCurLang.js';
import {firstToUpper} from '../../businessLogic/stringMethods.js';
import * as Filters from '../../businessLogic/groupageListFilters.js';

import './GroupagesListComponent.scss';
import '../../styles/dispatcherDashboardPageStyles.scss';

const getLength = (f) => String(_.get(f, 'length') || 0);
const checkIfGroupageIsSelected = (groupageOrders, selectedOrders) => {
  if (!groupageOrders || !groupageOrders.length) {
    return false;
  }
  return _.every(groupageOrders, (order) => _.includes(selectedOrders, order));
};

export class GroupagesList extends Component {

  constructor(props) {
    super(props);
    this.groupages = props.groupages;


    this.parseExpectedDeliveryTime = this.parseExpectedDeliveryTime.bind(this);
    this.getGroupageDispatcherName = this.getGroupageDispatcherName.bind(this);
    this.getGroupageDriverName = this.getGroupageDriverName.bind(this);

    this.handleVehicleFilterChange = this.handleVehicleFilterChange.bind(this);
    this.handleStatusFilterChange = this.handleStatusFilterChange.bind(this);
    this.handlePickUpTimeFilterChange = this.handlePickUpTimeFilterChange.bind(this);
    this.handleDeliveryTimeFilterChange = this.handleDeliveryTimeFilterChange.bind(this);
    this.handleDiliveryCostFilterChange = this.handleDiliveryCostFilterChange.bind(this);
    this.handleDriverFilterChange = this.handleDriverFilterChange.bind(this);
    this.handleDateFilterChange = this.handleDateFilterChange.bind(this);

    this.handleGroupageOrOrderNumber = this.handleGroupageOrOrderNumber.bind(this);
    this.handleNumberOfOrders = this.handleNumberOfOrders.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);

    this.toggleOpenExpectedTime - this.toggleOpenExpectedTime.bind(this);
    this.toggleOpenDeliveryTime - this.toggleOpenDeliveryTime.bind(this);

    this.state = {
      openExpectedStartTime: false,
      openExpectedEndTime: false,
      openDeliveryStartTime: false,
      openDeliveryEndTime: false,

      orderType: undefined,
      groupageOrOrderNumber: undefined,
      orderCount: undefined,
      vehicleType: undefined,
      date: undefined,
      startPickUpTime: undefined,
      endPickUpTime: undefined,
      startDeliveryTime: undefined,
      endDeliveryTime: undefined,
      status: undefined,
      driver: undefined,
      deliveryCost: undefined
    };

    this.baseState = this.state;
  }

  parseExpectedDeliveryTime(orders) {
    if (!orders || !orders[0]) {
      return gettext('GROUPAGE.NO-ORDERS-IN-GROUPAGE');
    }
    return formatOnlyTime(orders[0].deliveryTime);
  }

  toggleOpenExpectedTime(type) {
    if(type==='start')
      this.setState({
        openExpectedStartTime: !this.state.openExpectedStartTime
      });
    else
    this.setState({
      openExpectedEndTime: !this.state.openExpectedEndTime
    });
  }

  handleResetFilter() {
    this.baseState.date = undefined;
    this.setState(this.baseState);
  }

  toggleOpenDeliveryTime(type) {
    if(type==='start')
      this.setState({
        openDeliveryStartTime: !this.state.openDeliveryStartTime
      });
    else
    this.setState({
      openDeliveryEndTime: !this.state.openDeliveryEndTime
    });
  }

  handleGroupageOrOrderNumber(id) {
    this.setState({groupageOrOrderNumber: id});
  }

  handleNumberOfOrders(count) {
    this.setState({orderCount: parseInt(count)});
  }


  handleDateFilterChange(date) {
    if (date === 'Invalid date' || !date) {
      this.setState({date: undefined});
      return true;
    }

    this.setState({date: date});
  }

  handleDiliveryCostFilterChange(val) {
    this.setState({deliveryCost: parseInt(val)});
  }

  handleDriverFilterChange(driver) {
    this.setState({driver: driver});
  }

  handlePickUpTimeFilterChange(timeVal, type) {
    if (type === 'startPickUpTime') {
      this.setState({
        openExpectedStartTime: false,
        startPickUpTime: timeVal._d.getHours() + ':00'
      });
    }

    if (type === 'endPickUpTime') {
      this.setState({
        openExpectedEndTime: false,
        endPickUpTime: timeVal._d.getHours() + ':00'
      });
    }
  }

  handleDeliveryTimeFilterChange(timeVal, type) {
    if (type === 'startDeliveryTime') {
      this.setState({
        openDeliveryStartTime: false,
        startDeliveryTime: timeVal._d.getHours() + ':00'
      });
    }

    if (type === 'endDeliveryTime') {
      this.setState({
        openDeliveryEndTime: false,
        endDeliveryTime: timeVal._d.getHours() + ':00'
      });
    }
  }


  handleVehicleFilterChange(type) {
    if (type === gettext('ALL')) {
      this.setState({vehicleType: undefined});
      return true;
    }

    this.setState({vehicleType: parseInt(type)});
  }

  handleStatusFilterChange(status) {
    if(status === gettext('ALL')) {
      this.setState({status: undefined});
      return true;
    }

    this.setState({status: status});
  }

  getGroupageDispatcherName(orders) {
    if (!orders || !orders[0]) {
      return gettext('DISPATCHER.NO-SUCH-DISPATCHER');
    }
    const dispatcher = _.find(this.props.users, {id: orders[0].dispatcherId});
    if (!dispatcher) {
      return gettext('DISPATCHER.NO-SUCH-DISPATCHER');
    }
    return formatUserName(dispatcher);
  }

  getGroupageDriverName(driverId) {
    const driver = _.find(this.props.users, {id: driverId});
    if (!driver) {
      return gettext('STATUS.UNASSIGNED');
    }
    return formatUserName(driver);
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  render() {
    const {orders, handleGroupageSelectChange, selectedOrders, vehicles} = this.props;
    const vehiclesFilter = _.map(vehicles, (vehicle) => (
      <option key={`vehicle_${vehicle.type}`} value={vehicle.size}>
        {firstToUpper(vehicle.type)}
      </option>
    ));

    var groupages = Filters.filterByDate(this.props.groupages, this.state.date);
        groupages = Filters.filterByGroupageOrOrderId(groupages,this.props.orders, this.state.groupageOrOrderNumber);
        groupages = Filters.filterByOrderCount(groupages,this.props.orders, this.state.orderCount);
        groupages = Filters.filterByVehicle(groupages,this.props.orders, this.state.vehicleType);
        groupages = Filters.filterByStatus(groupages, this.state.status);
        groupages = Filters.filterByExpectedPickupTime(groupages, this.state.startPickUpTime, this.state.endPickUpTime);
        groupages = Filters.filterByDeliveryTime(groupages, this.props.orders, this.state.startDeliveryTime, this.state.endDeliveryTime);
        groupages = Filters.filterByDriver(groupages, this.props.users, this.state.driver);
        groupages = Filters.filterByDeliveryCommission(groupages, this.state.deliveryCost);






    const ordersById = _(orders).filter('groupageId').groupBy('groupageId').value();

    const groupagesRows = _(groupages).map((groupage) => {
      const {id, expectedPickUpTime, groupageStatus, driverId} = groupage;
      const groupageOrders = ordersById[id];
      if(!groupageOrders)
        return '';
      let isExpress = false;
        _.map(groupageOrders, (order) => {
          if(order.express)
            isExpress = true;
        });

      // const renderGroupageStatus = formatCamelCase(groupageStatus === gettext('STATUS.PICKED-UP') ? gettext('STATUS.ON-WAY-TO-DELIVERY') : getStatus(groupageStatus));
      const renderGroupageStatus = formatCamelCase(getStatus(groupageStatus));

      const orderWithTheBiggestVehicleType = _(groupageOrders).maxBy((order) => order.vehicleType);
      if (orderWithTheBiggestVehicleType) {
        var vehicleType = orderWithTheBiggestVehicleType.vehicleType;
        var vehicle = _.find(vehicles, {size: +vehicleType}) || {};
      }
      if (!vehicle) {
        vehicle = {};
      }
      const isGroupageSelected = checkIfGroupageIsSelected(groupageOrders, selectedOrders);
      const className = isGroupageSelected ? 'highlighted' : '';
      return  (
        <Tr
          key={`groupage_${id}`}
          onClick={(e) => handleGroupageSelectChange(groupage, e)}
          className={className}>
          <Td column=" ">
            {formatId(id)}
            <Checkbox
              checked={isGroupageSelected}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => handleGroupageSelectChange(groupage, e)}/>
          </Td>
          <Td column={ gettext('GROUPAGE-#') }>
            <Link to={`/groupageDetails/${groupage.id}`} className={isExpress?'btn btn-danger express-btn dashboard_button':'btn btn-success btn-order-detail dashboard_button'}>
              {formatId(id)}
            </Link>
          </Td>
          <Td column={ gettext('ORDER.#-OF-ORDERS') }>
            {getLength(groupageOrders)}
          </Td>
          <Td column={ gettext('VEHICLE-TYPE') }>
            <Image alt={vehicle.type} src={vehicle.icon} />
          </Td>
          <Td column={ gettext('EXPECTED-PICKUP-TIME') }>
            {parseExpectedPickUpTimeOnlyTime(expectedPickUpTime)}
          </Td>
          <Td column={ gettext('EXPECTED-DELIVERY-TIME') }>
            {createExpectedDeliveryTimeWindow(groupageOrders)}
          </Td>
          <Td column={ gettext('DATE') }>
            {parseExpectedPickUpTimeDate(expectedPickUpTime)}
          </Td>
          <Td column={ gettext('DELIVERY-COST') }>
            {groupage.deliveryCommission}
          </Td>
          <Td column={ gettext('STATUS') }>

            {renderGroupageStatus}
          </Td>
          <Td column={ gettext('DRIVER') }>
            {this.getGroupageDriverName(driverId)}
          </Td>
          <Td column=''>

          </Td>
        </Tr>
      );
    }).value();
    return (
      <div className="dispatcherDashboardPageOrdersTableContainer">

        <div className={this.props.loaded?"spinner":"spinnerActive"}>
          <Spinner />
        </div>
        <Table
          dir = {getCurLang()==='ar'?'rtl':'ltr'}
          className="dispatcherDashboardPageOrdersTable"
          itemsPerPage={15}
          pageButtonLimit={5}
          previousPageLabel={gettext('NAV-PREVIOUS')}
          nextPageLabel={gettext('NAV-NEXT')}
          noDateText={gettext('NOTHING-TO-SHOW')}
          onPageChange={(pageNumber) => this.props.saveCurrentPageGroupageList(pageNumber)}
          currentPage={this.props.groupageListPageNumber || 0}>

      		<Thead>
      			<Th column={gettext('GROUPAGE-#')}>
    					<label title={gettext('GROUPAGE-#')}>{gettext('GROUPAGE-#')}</label>
              <input type="text" className="form-control" name="id"
                onChange={(e) => this.handleGroupageOrOrderNumber(e.target.value)} onClick={this.stopPropagation}
                value={this.state.groupageOrOrderNumber?this.state.groupageOrOrderNumber:''}/>
      			</Th>
      			<Th column={gettext('ORDER.#-OF-ORDERS')}>
    					<label title={gettext('ORDER.#-OF-ORDERS')}>{gettext('ORDER.#-OF-ORDERS')}</label>
              <input type="text" className="form-control" name="items"
                onChange={(e) => this.handleNumberOfOrders(e.target.value)} onClick={this.stopPropagation}
                value={this.state.orderCount?this.state.orderCount:''}/>
      			</Th>
      			<Th column={gettext('VEHICLE-TYPE')}>
    					<label title={gettext('VEHICLE-TYPE')}>{gettext('VEHICLE-TYPE')}</label>
              <FormControl
                componentClass="select"
                onChange={(e) => this.handleVehicleFilterChange(e.target.value)}>
                  { !this.state.vehicleType? <option selected>  {gettext('ALL')}  </option> : '' }

                  {vehiclesFilter}
              </FormControl>
      			</Th>
      			<Th column={gettext('EXPECTED-PICKUP-TIME')}>
    					<label title={gettext('EXPECTED-PICKUP-TIME')}>{gettext('EXPECTED-PICKUP-TIME')}</label>
              <TimePicker
                className="xxx"
                showMinute={false}
                showSecond={false}
                onClick={() => this.toggleOpenExpectedTime('start')}
                open={this.state.openExpectedStartTime}
                onOpen={() =>this.setState({ openExpectedStartTime: true })}
                 onChange={(event) => this.handlePickUpTimeFilterChange(event, 'startPickUpTime')}
               />
               -
               <TimePicker
                 className="xxx"
                 showMinute={false}
                 showSecond={false}
                 onClick={() => this.toggleOpenExpectedTime('end')}
                 open={this.state.openExpectedEndTime}
                 onOpen={() =>this.setState({ openExpectedEndTime: true })}
                  onChange={(event) => this.handlePickUpTimeFilterChange(event, 'endPickUpTime')}
                />
      			</Th>
      			<Th column={gettext('EXPECTED-DELIVERY-TIME')}>
    					<label title={gettext('EXPECTED-DELIVERY-TIME')}>{gettext('EXPECTED-DELIVERY-TIME')}</label>
              <TimePicker
                className="xxx"
                showMinute={false}
                showSecond={false}
                onClick={() => this.toggleOpenDeliveryTime('start')}
                open={this.state.openDeliveryStartTime}
                onOpen={() =>this.setState({ openDeliveryStartTime: true })}
                 onChange={(event) => this.handleDeliveryTimeFilterChange(event, 'startDeliveryTime')}
               />
               -
               <TimePicker
                 className="xxx"
                 showMinute={false}
                 showSecond={false}
                 onClick={() => this.toggleOpenDeliveryTime('end')}
                 open={this.state.openDeliveryEndTime}
                 onOpen={() =>this.setState({ openDeliveryEndTime: true })}
                  onChange={(event) => this.handleDeliveryTimeFilterChange(event, 'endDeliveryTime')}
                />
      			</Th>
            <Th column={gettext('DATE')}>
              <label title={gettext('DATE')}>{gettext('DATE')}</label>
              <DateTimeField
                mode="Date"
                viewMode="days"
                name="endDeliveryTime"
                inputFormat="MM/DD/YYYY"
                dateTime={moment(this.state.date).zone('+0300').format('x')}
                defaultText={this.date?moment(this.date).zone('+0300').format('L'):''}
                inputProps={{
                  name: "reportsDateFilterEnd",
                  className: "form-control filter_input"
                }}
                onChange={(event) =>  {
                  this.handleDateFilterChange(event);
                }}/>
            </Th>
      			<Th column={gettext('STATUS')}>
    					<label title={gettext('STATUS')}>{gettext('STATUS')}</label>
              <FormControl
                componentClass="select"
                onChange={(e) => this.handleStatusFilterChange(e.target.value)}>
                  { !this.state.status ? <option selected>  {gettext('ALL')}  </option> : '' }
                  <option value="done"> { firstToUpper(gettext('STATUS.DONE')) } </option>
                  <option value="unassigned"> { firstToUpper(gettext('STATUS.UNASSIGNED')) } </option>
                  <option value="assigned"> { firstToUpper(gettext('STATUS.ASSIGNED')) } </option>
                  <option value="rejected"> { firstToUpper(gettext('STATUS.REJECTED')) } </option>
                  <option value="pickedUp"> { firstToUpper(gettext('STATUS.PICKED-UP')) } </option>
              </FormControl>
      			</Th>
      			<Th column={gettext('DRIVER')}>
    					<label title={gettext('DRIVER')}>{gettext('DRIVER')}</label>
              <input type="text" className="form-control" name="driver" onChange={(e) => this.handleDriverFilterChange(e.target.value)}
                value={this.state.driver?this.state.driver:''}/>
      			</Th>
      			<Th column={gettext('DELIVERY-COST')}>
    					<label title={gettext('DELIVERY-COST')}>{gettext('DELIVERY-COST')}</label>
              <input type="text" className="form-control" name="deliveryCommission"
                onChange={(e)=>this.handleDiliveryCostFilterChange(e.target.value)}
                value={this.state.deliveryCost?this.state.deliveryCost:''}/>
      			</Th>
            <Th column='' className='reset_btn_container'>
              <button className="remove_filter_btn"
                onClick={() => this.handleResetFilter()}>
                  {gettext('CLEAR')}
              </button>
            </Th>

          </Thead>

          {groupagesRows}

        </Table>
      </div>
    );
  }
}


GroupagesList.propTypes = {
  loaded: PropTypes.bool,
  users: PropTypes.array,
  groupages: PropTypes.array,
  orders: PropTypes.array,
  showGroupageDetails: PropTypes.func,
  handleGroupageSelectChange: PropTypes.func,
  selectedOrders: PropTypes.array.isRequired,
  vehicles: PropTypes.array.isRequired,
  groupageListPageNumber: PropTypes.number,
  saveCurrentPageGroupageList: PropTypes.func,
  startSpinner: PropTypes.func,
  endSpinner: PropTypes.func
};
