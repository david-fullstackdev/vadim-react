import React, {Component, PropTypes} from 'react';
import { Image, Button, FormControl } from 'react-bootstrap';
import DateTimeField from 'react-bootstrap-datetimepicker';
import _ from 'lodash';
import TimePicker from 'rc-time-picker';
import {Table, Thead, Th, Tr, Td} from 'reactable';
import moment from 'moment';

import { gettext, getStatus } from '../../i18n/service.js';
import { parseExpectedPickUpTimeDate, parseExpectedPickUpTimeOnlyTime } from '../../businessLogic/expectedPickUpTimeParser.js';
import { formatOnlyTime } from '../../businessLogic/deliveryTimeFormatter.js';
import formatUserName from '../../businessLogic/userNameFormatter.js';
import getCurLang from '../../businessLogic/getCurLang.js';
import {firstToUpper} from '../../businessLogic/stringMethods.js';
import {getDashboardButtonStyle} from '../../businessLogic/getButtonStyle.js';
import * as Filters from '../../businessLogic/orderListFilters.js';


import './OperatorOrdersListComponent.scss';
import '../../styles/dispatcherDashboardPageStyles.scss';

const columns = [
  {
    id: 'orderId',
    title: gettext('ORDER-#'),
    render: (order, props) =>
      <div>
        <Button
          onClick={(e) => props.showOrderDetails(order, e)}
          className={getDashboardButtonStyle(order)}>
          {order.id.slice(order.id.length - 5, order.id.length)}
        </Button>
      </div>
  },
  {
    id: 'expectedPickUpTime',
    title: gettext('EXPECTED-PICKUP-TIME'),
    render: (order) => parseExpectedPickUpTimeOnlyTime(order.expectedPickUpTime)
  },
  {
    id: 'deliveryTime',
    title: gettext('DELIVERY-TIME'),
    render: (order) => {
      if(order.express)
        return <strong className="express">{gettext('EXPRESS-DELIVERY')+'!'}</strong>;
      if(order.isOutOfCity)
        return <strong className="isOutOfCity">{gettext('OUT-OF-CITY')+'!'}</strong>;
      else
        return formatOnlyTime(order.deliveryTime);
    }
  },
  {
    id: 'date',
    title: gettext('DATE'),
    render: (order) => parseExpectedPickUpTimeDate(order.expectedPickUpTime)
  },
  {
    id: 'vehicleType',
    title: gettext('VEHICLE-TYPE'),
    render: (order, props) => {
      const vehicle = _.find(props.vehicles, {size: +order.vehicleType}) || {};
      return ( <Image alt={vehicle.type} src={vehicle.icon}/> );
    }
  },
  {
    id: 'Dispatcher',
    title: gettext('DISPATCHER'),
    render: (order, props) => {
      const dispatcher = _.find(props.users, {id: order.dispatcherId});
      if (!dispatcher) {
        return '';
      }
      return dispatcher.shopName;
    }
  },
  {
    id: 'orderStatus',
    title: gettext('STATUS'),
    render: (order) => getStatus(order.orderStatus)
  },
  {
    id: 'items.length',
    title: gettext('#-OF-ITEMS'),
    render: (order) => _.get(order.items, 'length')
  },
  {
    id: 'driver.name',
    title: gettext('DRIVER'),
    render: (order, props) => {
        const groupage = _.find(props.groupages, {id: order.groupageId});
        if (!groupage || !groupage.driverId) {
          return gettext('STATUS.UNASSIGNED');
        }
        const driver = _.find(props.users, {id: groupage.driverId});
        return formatUserName(driver);
    }
  }

];

export class OperatorOrdersHistoryListComponent extends Component {
  constructor(props) {
    super(props);

    this.handleVehicleFilterChange = this.handleVehicleFilterChange.bind(this);
    this.handleStatusFilterChange = this.handleStatusFilterChange.bind(this);
    this.handleOrdersCountFilterChange = this.handleOrdersCountFilterChange.bind(this);
    this.handleDriverFilterChange = this.handleDriverFilterChange.bind(this);
    this.handleDispatcherFilterChange = this.handleDispatcherFilterChange.bind(this);
    this.handleOrderIdFilterChange = this.handleOrderIdFilterChange.bind(this);
    this.handlePickUpTimeFilterChange = this.handlePickUpTimeFilterChange.bind(this);
    this.handleDeliveryTimeFilterChange = this.handleDeliveryTimeFilterChange.bind(this);
    this.handleDateFilterChange = this.handleDateFilterChange.bind(this);
    this.handleOrderTypeChange = this.handleOrderTypeChange.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);


    this.toggleOpenExpectedTime - this.toggleOpenExpectedTime.bind(this);
    this.toggleOpenDeliveryTime - this.toggleOpenDeliveryTime.bind(this);

    this.state = {
      openExpectedStartTime: false,
      openExpectedEndTime: false,
      openDeliveryStartTime: false,
      openDeliveryEndTime: false,

      orderType: undefined,
      orderNumber: undefined,
      itemsCount: undefined,
      vehicleType: undefined,
      date: undefined,
      startPickUpTime: undefined,
      endPickUpTime: undefined,
      startDeliveryTime: undefined,
      endDeliveryTime: undefined,
      deliveryCost: undefined,
      codAmount: undefined,
      dispatcher: undefined,
      driver: undefined,
      status: undefined
    };

    this.baseState = this.state;
  }

  handleOrdersCountFilterChange(count) {
    this.setState({itemsCount: parseInt(count)});
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

  handleResetFilter() {
    this.baseState.date = undefined;
    this.setState(this.baseState);
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

  handleOrderIdFilterChange(number) {
    this.setState({orderNumber: number});
  }

  handleDispatcherFilterChange(dispatcher) {
      this.setState({dispatcher: dispatcher});
  }


  handleDriverFilterChange(driver) {
    this.setState({driver: driver});
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

  handleDateFilterChange(date) {
    if (date === 'Invalid date' || !date) {
      this.setState({date: undefined});
      return true;
    }

    this.setState({date: date});
  }

  handleOrderTypeChange(type) {
    if (type === gettext('ALL')) {
      this.setState({orderType: undefined});
      return true;
    }

    this.setState({orderType: type});
  }


  render() {
    const vehiclesFilter = _.map(this.props.vehicles, (vehicle) => (
      <option key={`vehicle_${vehicle.type}`} value={vehicle.size}>
        {firstToUpper(vehicle.type)}
      </option>
    ));
      var orders = Filters.filterByDate(this.props.orders, this.state.date);
        orders = Filters.filterByOrderType(orders, this.state.orderType);
        orders = Filters.filterByOrderId(orders, this.state.orderNumber);
        orders = Filters.filterByExpectedPickupTime(orders, this.state.startPickUpTime, this.state.endPickUpTime);
        orders = Filters.filterByDeliveryTime(orders, this.state.startDeliveryTime, this.state.endDeliveryTime);
        orders = Filters.filterByVehicleType(orders, this.state.vehicleType);
        orders = Filters.filterByDispatcher(orders, this.state.dispatcher, this.props.users);
        orders = Filters.filterByItemCount(orders, this.state.itemsCount);
        orders = Filters.filterByDriver(orders, this.props.groupages, this.props.users, this.state.driver);
        orders = Filters.filterByStatus(orders, this.state.status);






    const tableRows = _(orders).sortBy('orderCreatedTime').reverse()
      .map((order) => {
        const {id} = order;
        return (
          <Tr
            key={`order_${id}`}
            >
            {_.map(columns, c => (
                <Td column={c.title}>
                  {c.render(order, this.props)}
                </Td>
              )
            )}
            <Td column=''>
            </Td>
          </Tr>
        );
      })
      .value();
    return (
      <Table
        dir = {getCurLang()==='ar'?'rtl':'ltr'}
        className="dispatcherDashboardPageOrdersTable"
        itemsPerPage={15}
        pageButtonLimit={5}
        previousPageLabel={gettext('NAV-PREVIOUS')}
        nextPageLabel={gettext('NAV-NEXT')}
        noDateText={ gettext('NOTHING-TO-SHOW') }
        onPageChange={(pageNumber) => this.props.saveCurrentPageOrderHistoryList(pageNumber)}
        currentPage={this.props.orderHistoryPageNumber || 0}>
        <Thead>
          <Th column={gettext('ORDER-#')}>
            <label title={gettext('ORDER-#')}>{gettext('ORDER-#')}</label>
            <div className="order_filter">
              <FormControl
                componentClass="select"
                className="order_type_select"
                onChange={(e) => this.handleOrderTypeChange(e.target.value)}>
                  { !this.state.orderNumber? <option selected>  {gettext('ALL')}  </option> : '' }
                  <option value="isOutOfCity"> { firstToUpper(gettext('OUT-OF-CITY')) } </option>
                  <option value="express"> { firstToUpper(gettext('EXPRESS-DELIVERY')) } </option>
              </FormControl>
              <input type="text" className="form-control" name="id" onChange={(e)=>this.handleOrderIdFilterChange(e.target.value)}
                value={this.state.orderNumber?this.state.dispatcher:''}/>
            </div>
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
          <Th column={gettext('DELIVERY-TIME')}>
            <label title={gettext('DELIVERY-TIME')}>{gettext('DELIVERY-TIME')}</label>
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
              maxDate={moment().zone('+0300')}
              name="endDeliveryTime"
              inputFormat="MM/DD/YYYY"
              dateTime={moment(this.state.date).zone('+0300').format('x')}
              defaultText={this.state.date ? moment(this.state.date).zone('+0300').format('L') : ''}
              value={this.state.date ? moment(this.state.date).zone('+0300').format('L') : ''}
              inputProps={{
                name: "reportsDateFilterEnd",
                className: "form-control filter_input"
              }}
              onChange={(event) =>  {
                this.handleDateFilterChange(event);
              }}/>
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
          <Th column={gettext('DISPATCHER')}>
            <label title={gettext('DISPATCHER')}>{gettext('DISPATCHER')}</label>
            <input type="text" className="form-control" name="dispatcherId" onChange={(e) => this.handleDispatcherFilterChange(e.target.value)}
              value={this.state.dispatcher?this.state.dispatcher:''}/>
          </Th>
          <Th column={gettext('STATUS')}>
            <label title={gettext('STATUS')}>{gettext('STATUS')}</label>
            <FormControl
              componentClass="select"
              onChange={(e) => this.handleStatusFilterChange(e.target.value)}>
                { !this.state.status? <option selected>  {gettext('ALL')}  </option> : '' }
                <option value="canceled"> { firstToUpper(gettext('STATUS.CANCELED')) } </option>
                <option value="delivered"> { firstToUpper(gettext('STATUS.DELIVERED')) } </option>
                <option value="returned"> { firstToUpper(gettext('STATUS.RETURNED')) } </option>
            </FormControl>
          </Th>
          <Th column={gettext('#-OF-ITEMS')}>
            <label title={gettext('#-OF-ITEMS')}>{gettext('#-OF-ITEMS')}</label>
            <input type="text" className="form-control" name="items" onChange={(e)=>this.handleOrdersCountFilterChange(e.target.value)}
              value={this.state.itemsCount?this.state.itemsCount:''}/>
          </Th>
          <Th column={gettext('DRIVER')}>
            <label title={gettext('DRIVER')}>{gettext('DRIVER')}</label>
            <input type="text" className="form-control" name="driver" onChange={(e)=>this.handleDriverFilterChange(e.target.value)}
              value={this.state.driver?this.state.driver:''}/>
          </Th>
          <Th column=''  className='reset_btn_container'>
            <button className="remove_filter_btn"
              onClick={() => this.handleResetFilter()}>
                {gettext('CLEAR')}
            </button>
          </Th>
        </Thead>
        {tableRows}
      </Table>
    );
  }
}



OperatorOrdersHistoryListComponent.propTypes = {
  users: PropTypes.array,
  orders: PropTypes.array,
  groupages: PropTypes.array,
  showOrderDetails: PropTypes.func,
  vehicles: PropTypes.array.isRequired,
  orderHistoryPageNumber: PropTypes.number,
  saveCurrentPageOrderHistoryList: PropTypes.func,
};
