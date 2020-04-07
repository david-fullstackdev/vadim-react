import React, { Component, PropTypes } from 'react';
import { Checkbox, Image, FormControl } from 'react-bootstrap';
import { Link } from 'react-router';
import DateTimeField from 'react-bootstrap-datetimepicker';
import _ from 'lodash';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import { Table, Tr, Td, Th, Thead } from 'reactable';
import {connect} from 'react-redux';
import { gettext } from '../../i18n/service.js';
import { formatCashOn } from '../../businessLogic/formatCashOnDelivery.js';
import getCurLang from '../../businessLogic/getCurLang.js';
import LoopbackHttp from '../../businessLogic/LoopbackHttp.js';
import { firstToUpper } from '../../businessLogic/stringMethods.js';
import { parseExpectedPickUpTimeDate, parseExpectedPickUpTimeOnlyTime } from '../../businessLogic/expectedPickUpTimeParser.js';
import { formatOnlyTime } from '../../businessLogic/deliveryTimeFormatter.js';
import getCommissionAndCurrency from '../../businessLogic/getCommissionAndCurrency.js';
import { getDashboardButtonStyle } from '../../businessLogic/getButtonStyle.js';
import * as Filters from '../../businessLogic/orderListFilters.js';



import './OperatorOrdersListComponent.scss';
import '../../styles/dispatcherDashboardPageStyles.scss';




const columns = [
  {
    id: 'id',
    title: gettext('ORDER-#'),
    render: (order) => (
      <div>
        <Link to={`/orderDetails/${order.id}`}
          className={getDashboardButtonStyle(order)}>
          {order.id.slice(order.id.length - 5, order.id.length)}
        </Link>
      </div>
    )
  },
  {
    id: 'items',
    title: gettext('#-OF-ITEMS'),
    render: (order) => _.get(order.items, 'length')
  },
  {
    id: 'vehicleType',
    title: gettext('VEHICLE-TYPE'),
    render: (order, props) => {
      const vehicle = _.find(props.vehicles, { size: +order.vehicleType }) || {};
      return (<Image alt={vehicle.type} src={vehicle.icon} />);
    }
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
      if (order.express)
        return <strong className="express">{gettext('EXPRESS-DELIVERY') + '!'}</strong>;
      if (order.isOutOfCity)
        return <strong className="isOutOfCity">{gettext('OUT-OF-CITY') + '!'}</strong>;
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
    id: 'deliveryCommission',
    title: gettext('DELIVERY-COST'),
    render: (order, props) => order.deliveryCommission + ' ' + getCommissionAndCurrency(order.dispatcherId, props.users)
  },
  {
    id: 'cashOnDeliveryAmount',
    title: gettext('CASH-ON-DELIVERY'),
    render: (order) => formatCashOn(order.cashOnDelivery, order.cashOnDeliveryAmount)
  },
  {
    id: 'dispatcherId',
    title: gettext('DISPATCHER'),
    render: (order, props) => {
      const dispatcher = _.find(props.users, { id: order.dispatcherId });
      if (!dispatcher) {
        return '';
      }
      return (order.platform)
        ? order.platform.name + ' ' + gettext('ON-BEHALF') + ' ' + dispatcher.shopName
        : dispatcher.shopName;
    }
  }
];

export class FleetOrderListComponent extends Component {
  constructor(props) {
    super(props);

    this.handleVehicleFilterChange = this.handleVehicleFilterChange.bind(this);
    this.handlePickUpTimeFilterChange = this.handlePickUpTimeFilterChange.bind(this);
    this.handleDeliveryTimeFilterChange = this.handleDeliveryTimeFilterChange.bind(this);
    this.handleDateFilterChange = this.handleDateFilterChange.bind(this);
    this.handleOrderTypeChange = this.handleOrderTypeChange.bind(this);
    this.handleOrderCostChange = this.handleOrderCostChange.bind(this);
    this.handleOrderCashAmount = this.handleOrderCashAmount.bind(this);
    this.handleDispatcherChange = this.handleDispatcherChange.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);
    this.handleOrderIdChange = this.handleOrderIdChange.bind(this);
    this.handleItemCount = this.handleItemCount.bind(this);

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
      date: new Date().setHours(0, 0, 0, 0),
      startPickUpTime: undefined,
      endPickUpTime: undefined,
      startDeliveryTime: undefined,
      endDeliveryTime: undefined,
      deliveryCost: undefined,
      codAmount: undefined,
      dispatcher: undefined
    };

    this.baseState = this.state;
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  handleResetFilter() {
    this.baseState.date = undefined;
    // this.props.clearSelectedOrders();
    this.setState(this.baseState);
  }

  handleOrderIdChange(id) {
    this.setState({orderNumber: id});
  }

  handleDateFilterChange(date) {

    if (date === 'Invalid date' || !date) {
      this.setState({date: undefined});
      return true;
    }

    this.setState({date: date});
  }

  handleItemCount(count) {
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

  handleOrderTypeChange(type) {
    if (type === gettext('ALL')) {
      this.setState({orderType: undefined});
      return true;
    }

    this.setState({orderType: type});
  }

  handleOrderCostChange(val) {
    this.setState({deliveryCost: parseInt(val)});
  }

  handleOrderCashAmount(val) {
    this.setState({codAmount: parseInt(val)});
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

  handleDispatcherChange(val) {
    this.setState({dispatcher: val});
  }

  render() {
    const { handleOrderSelectChange, selectedOrders } = this.props;

    const correctOrders = _.filter(this.props.orders, (order) => {
      return order && order.expectedPickUpTime;
    });

      var orders = Filters.filterByDate(correctOrders, this.state.date);
        orders = Filters.filterByExpectedPickupTime(orders, this.state.startPickUpTime, this.state.endPickUpTime);
        orders = Filters.filterByOrderType(orders, this.state.orderType);
        orders = Filters.filterByDeliveryTime(orders, this.state.startDeliveryTime, this.state.endDeliveryTime);
        orders = Filters.filterByVehicleType(orders, this.state.vehicleType);
        orders = Filters.filterByDeliveryCommission(orders, this.state.deliveryCost);
        orders = Filters.filterByCodAmount(orders, this.state.codAmount);
        orders = Filters.filterByDispatcher(orders, this.state.dispatcher, this.props.users);
        orders = Filters.filterByOrderId(orders, this.state.orderNumber);
        orders = Filters.filterByItemCount(orders, this.state.itemsCount);



    const vehiclesFilter = _.map(this.props.vehicles, (vehicle) => (
      <option key={`vehicle_${vehicle.type}`} value={vehicle.size}>
        {firstToUpper(vehicle.type)}
      </option>
    ));
    const tableRows = _(orders).sortBy('express', 'orderCreatedTime').reverse()
      .map((order) => {
        const { id } = order;
        const isOrderSelected = _.includes(selectedOrders, order);
        const className = isOrderSelected ? 'highlighted' : '';
        const platform = (order.createdByPlatformId)
          ? _.find(this.props.users, { id: order.createdByPlatformId })
          : undefined;
        if (platform) {
          order['platform'] = platform;
        }

        return !order.groupageId && (
          <Tr
            key={`order_${id}`}
            onClick={(e) => handleOrderSelectChange(order, e)}
            className={className}
          >
            <Td column=" ">
              <Checkbox
                checked={isOrderSelected}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={(e) => handleOrderSelectChange(order, e)} />
            </Td>
            {_.map(columns, (c, i) => (
              <Td key={i} column={c.title} className={order.express ? 'red_border' : ''}>
                <span>{c.render(order, this.props)}</span>
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
      <div className="dispatcherDashboardPageOrdersTableContainer">
        <Table
          dir={getCurLang() === 'ar' ? 'rtl' : 'ltr'}
          className="dispatcherDashboardPageOrdersTable"
          itemsPerPage={15}
          previousPageLabel={gettext('NAV-PREVIOUS')}
          nextPageLabel={gettext('NAV-NEXT')}
          pageButtonLimit={5}
          noDateText={gettext('NOTHING-TO-SHOW')}
          onPageChange={(pageNumber) => this.props.saveCurrentPageOrderList(pageNumber)}
          currentPage={this.props.orderListPageNumber || 0}>

          <Thead>
            <Th column={gettext('ORDER-#')}>
              <label title={gettext('ORDER-#')}>{gettext('ORDER-#')}</label>
              <div className="order_filter">
                <FormControl
                  componentClass="select"
                  className="order_type_select"
                  onChange={(e) => this.handleOrderTypeChange(e.target.value)}>
                  <option value={gettext('ALL')} select>  {gettext('ALL')}  </option>
                  <option value="isOutOfCity"> {firstToUpper(gettext('OUT-OF-CITY'))} </option>
                  <option value="express"> {firstToUpper(gettext('EXPRESS-DELIVERY'))} </option>
                </FormControl>
                <input type="text" className="form-control" name="id"
                  onChange={(e) =>this.handleOrderIdChange(e.target.value)} onClick={this.stopPropagation}
                  value={this.state.orderNumber?this.state.orderNumber:''}/>
              </div>
            </Th>
            <Th column={gettext('#-OF-ITEMS')}>
              <label title={gettext('#-OF-ITEMS')}>{gettext('#-OF-ITEMS')}</label>
              <input type="text" className="form-control" name="items"
                onChange={(e) =>this.handleItemCount(e.target.value)} onClick={this.stopPropagation}
                value={this.state.itemsCount?this.state.itemsCount:''}/>
            </Th>
            <Th column={gettext('VEHICLE-TYPE')}>
              <label title={gettext('VEHICLE-TYPE')}>{gettext('VEHICLE-TYPE')}</label>
              <FormControl
                componentClass="select"
                onChange={(e) => this.handleVehicleFilterChange(e.target.value)}>
                  <option selected>  {gettext('ALL')}  </option>
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
                onChange={(event) => {this.handlePickUpTimeFilterChange(event, 'startPickUpTime');}}
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
                mode="date"
                viewMode="days"
                name="endDeliveryTime"
                inputFormat="MM/DD/YYYY"
                defaultText={this.state.date ? moment(this.state.date).zone('+0300').format('L') : ''}
                inputProps={{
                  name: "reportsDateFilterEnd",
                  className: "form-control filter_input"
                }}
                onChange={(event) => {
                  this.handleDateFilterChange(event);
                }} />
            </Th>
            <Th column={gettext('DELIVERY-COST')}>
              <label title={gettext('DELIVERY-COST')}>{gettext('DELIVERY-COST')}</label>
              <input type="text" className="form-control" name="deliveryCommission"
                onChange={(e) => this.handleOrderCostChange(e.target.value)} onClick={this.stopPropagation}
                value={this.state.deliveryCost?this.state.deliveryCost:''}/>
            </Th>
            <Th column={gettext('CASH-ON-DELIVERY')}>
              <label title={gettext('CASH-ON-DELIVERY')}>{gettext('CASH-ON-DELIVERY')}</label>
              <input type="text" className="form-control" name="cashOnDeliveryAmount"
                onChange={(e) => this.handleOrderCashAmount(e.target.value)} onClick={this.stopPropagation}
                value={this.state.codAmount?this.state.codAmount:''}/>
            </Th>
            <Th column={gettext('DISPATCHER')}>
              <label title={gettext('DISPATCHER')}>{gettext('DISPATCHER')}</label>
              <input type="text" className="form-control" name="dispatcherId"
                onChange={(e) => this.handleDispatcherChange(e.target.value)} onClick={this.stopPropagation}
                value={this.state.dispatcher?this.state.dispatcher:''}/>
            </Th>
            <Th column=''>
              <button className="remove_filter_btn"
                onClick={() => this.handleResetFilter()}>
                x
              </button>
            </Th>
          </Thead>

          {tableRows}

        </Table>
      </div>
    );
  }
}



FleetOrderListComponent.propTypes = {
  users: PropTypes.array,
  orders: PropTypes.array,
};

function mapStateToProps(state) {
  return {
    orders: state.appReducer.orders,
    users: state.appReducer.users
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FleetOrderListComponent);
