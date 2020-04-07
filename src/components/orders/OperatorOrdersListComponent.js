import React, { Component, PropTypes } from 'react';
import { Checkbox, Image, FormControl } from 'react-bootstrap';
import { Link } from 'react-router';
import DateTimeField from 'react-bootstrap-datetimepicker';
import _ from 'lodash';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import { Table, Tr, Td, Th, Thead } from 'reactable';

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
import formatCamelCase from '../../businessLogic/formatCamelCase.js';
import setOrderStatusColor from '../../businessLogic/setOrderStatusColor.js';

import { DragSource } from 'react-dnd';
import {ItemTypes} from '../../constants/actionTypes';
import { createDragPreview } from 'react-dnd-text-dragpreview';

import { columnsNewOrders, columnsProgress, columnsHistory } from '../../constants/orderListColumns';

import './OperatorOrdersListComponent.scss';
import '../../styles/dispatcherDashboardPageStyles.scss';


var dragPreviewStyle = {
  backgroundColor: 'rgb(68, 67, 67)',
  color: 'white',
  fontSize: 15,
  paddingTop: 4,
  paddingRight: 7,
  paddingBottom: 6,
  paddingLeft: 7
}

const orderSource = {
  beginDrag(props) {
    return {
      selectedOrders: props.selectedOrders,
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

function formatDragMessage(numOrders) {
  const noun = numOrders === 1 ? 'order' : 'orders'
  return `Moving ${numOrders} ${noun}`
}

export class OrdersList extends Component {
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
    this.handleOrderStatusChange = this.handleOrderStatusChange.bind(this);
    this.handleCreatedByChange = this.handleCreatedByChange.bind(this);
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
      orderStatus: undefined,
      createdBy: undefined
    };

    this.baseState = this.state;
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  componentDidMount() {
    this.dragPreview = createDragPreview(formatDragMessage(this.props.selectedOrders.length), dragPreviewStyle)
    this.props.connectDragPreview(this.dragPreview)
  }

  componentDidUpdate(prevProps) {
    this.dragPreview = createDragPreview(formatDragMessage(this.props.selectedOrders.length), dragPreviewStyle, this.dragPreview)
  }

  handleResetFilter() {
    this.pickUpStartTimeInput.setValue('');
    this.pickUpEndTimeInput.setValue('');
    this.deliveryStartTimeInput.setValue('');
    this.deliveryEndTimeInput.setValue('');
    this.baseState.date = undefined;
    this.props.clearSelectedOrders();
    this.setState(this.baseState);
  }

  handleOrderIdChange(id) {
    this.setState({orderNumber: id});
  }

  handleCreatedByChange(name) {
    this.setState({createdBy: name});
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
    if (type === 'startPickUpTime' && timeVal!=='') {
      this.setState({
        openExpectedStartTime: false,
        startPickUpTime: timeVal._d.getHours() + ':00'
      });
    }

    if (type === 'endPickUpTime' && timeVal!=='') {
      this.setState({
        openExpectedEndTime: false,
        endPickUpTime: timeVal._d.getHours() + ':00'
      });
    }
  }

  handleOrderTypeChange(type) {
    if (!type || type === gettext('ALL')) {
      this.setState({orderType: undefined});
      return true;
    }

    this.setState({orderType: type});
  }

  handleOrderStatusChange(status) {
    if (status === gettext('ALL')) {
      this.setState({orderStatus: undefined});
      return true;
    }

    this.setState({orderStatus: status});
  }

  handleOrderCostChange(val) {
    this.setState({deliveryCost: parseInt(val)});
  }

  handleOrderCashAmount(val) {
    this.setState({codAmount: parseInt(val)});
  }

  handleDeliveryTimeFilterChange(timeVal, type) {
    if (type === 'startDeliveryTime' && timeVal!=='') {
      this.setState({
        openDeliveryStartTime: false,
        startDeliveryTime: timeVal._d.getHours() + ':00'
      });
    }

    if (type === 'endDeliveryTime' && timeVal!=='') {
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
    const { isDragging, connectDragSource } = this.props;
    const { handleOrderSelectChange, selectedOrders } = this.props;

    var orders = Filters.filterByStatus(this.props.orders, this.state.orderStatus);
      orders = this.props.orderListViewMode!=='orderHistory'
                ?Filters.filterByDate(orders, this.state.date)
                :Filters.filterByDateOrderHistory(orders, this.state.date);
      orders = Filters.filterByExpectedPickupTime(orders, this.state.startPickUpTime, this.state.endPickUpTime);
      orders = Filters.filterByOrderType(orders, this.state.orderType);
      orders = Filters.filterByDeliveryTime(orders, this.state.startDeliveryTime, this.state.endDeliveryTime);
      orders = Filters.filterByVehicleType(orders, this.state.vehicleType);
      orders = Filters.filterByDeliveryCommission(orders, this.state.deliveryCost);
      orders = Filters.filterByCodAmount(orders, this.state.codAmount);
      orders = Filters.filterCreatedBy(orders, this.state.createdBy);
      orders = Filters.filterByOrderId(orders, this.state.orderNumber);
      orders = Filters.filterByItemCount(orders, this.state.itemsCount);
      orders = Filters.filterByDriver(orders, this.props.users, this.state.driver);



    const vehiclesFilter = _.map(this.props.vehicles, (vehicle) => (
      <option key={`vehicle_${vehicle.type}`} value={vehicle.size}>
        {firstToUpper(vehicle.type)}
      </option>
    ));

    let columnsForThisTableType;

    if(this.props.orderListViewMode==='orders')
      columnsForThisTableType = columnsNewOrders;
    else if(this.props.orderListViewMode==='assignedOrders')
      columnsForThisTableType = columnsProgress;
    else if(this.props.orderListViewMode==='orderHistory')
      columnsForThisTableType = columnsHistory;

    const tableRows = _(orders).sortBy('orderCreatedTime').reverse()
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
        return (
          <Tr
            key={`order_${id}`}
            className={className}
            onClick={(e) => handleOrderSelectChange(order, e)}>

            {_.map(columnsForThisTableType, (c, i) => (
              <Td key={i} column={c.title} className={order.express ? 'red_border' : ''}>
                {c.id === 'status'
                  ?<span style={setOrderStatusColor(order.orderStatus)}>{c.render(order, this.props)}</span>
                  :<span>{c.render(order, this.props)}</span>
                }
              </Td> ))
            }

          </Tr>
        );
      })
      .value();
    return this.props.connectDragSource(
      <div className="dispatcherDashboardPageOrdersTableContainer">
        <Table
          dir={getCurLang() === 'ar' ? 'rtl' : 'ltr'}
          className="dispatcherDashboardPageOrdersTable"
          itemsPerPage={15}
          previousPageLabel={gettext('NAV-PREVIOUS')}
          nextPageLabel={gettext('NAV-NEXT')}
          pageButtonLimit={5}
          noDateText={gettext('NOTHING-TO-SHOW')}
          onPageChange={(e) =>{
            if(this.props.historyPageCount && (this.props.historyPageCount - e) <= 1) {
              this.props.startSpinner();
              this.props.addSomeOrdersToHistory(this.props.company.id, this.props.lowerProcessedAtTime)
            }
          }}>

          <Thead>
            <Th column={gettext('ORDER-#')}>
              <label title={gettext('ORDER-#')}>{gettext('ORDER-#')}</label>
              <div className="order_filter">
                <FormControl
                  componentClass="select"
                  className="order_type_select"
                  onChange={(e) => this.handleOrderTypeChange(e.target.value)}>
                    <option value={gettext('ALL')}>  {gettext('ALL')}  </option>
                    <option value="isOutOfCity"> {firstToUpper(gettext('OUT-OF-CITY'))} </option>
                    <option value="express"> {firstToUpper(gettext('EXPRESS-DELIVERY'))} </option>
                    <option value="regular"> {firstToUpper(gettext('REGULAR'))} </option>
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
                  <option value={gettext('ALL')}>  {gettext('ALL')}  </option>
                  {vehiclesFilter}
              </FormControl>
            </Th>
            <Th column={gettext('PICKUP-TIME')}>
              <label title={gettext('PICKUP-TIME')}>{gettext('PICKUP-TIME')}</label>
              <TimePicker
                className="xxx"
                showMinute={false}
                ref={(input) => { this.pickUpStartTimeInput = input; }}
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
                ref={(input) => { this.pickUpEndTimeInput = input; }}
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
                ref={(input) => { this.deliveryStartTimeInput = input; }}
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
                ref={(input) => { this.deliveryEndTimeInput = input; }}
                onClick={() => this.toggleOpenDeliveryTime('end')}
                open={this.state.openDeliveryEndTime}
                onOpen={() =>this.setState({ openDeliveryEndTime: true })}
                onChange={(event) => this.handleDeliveryTimeFilterChange(event, 'endDeliveryTime')}
              />
            </Th>
            <Th column={gettext('DATE')}>
              <label title={gettext('DATE')}>{this.props.orderListViewMode!=='orderHistory'?gettext('PICKUP-DATE'):gettext('PROCESSED-DATE')}</label>
              <DateTimeField
                mode="date"
                viewMode="days"
                name="endDeliveryTime"
                inputFormat="MM/DD/YYYY"
                defaultText={this.state.date ? moment(this.state.date).zone('+0300').format('L') : ''}
                value={this.state.date ? moment(this.state.date).zone('+0300').format('L') : ''}
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
            <Th column={gettext('CREATED-BY')}>
              <label title={gettext('CREATED-BY')}>{gettext('CREATED-BY')}</label>
              <input type="text" className="form-control" name="dispatcherId"
                onChange={(e) => this.handleCreatedByChange(e.target.value)} onClick={this.stopPropagation}
                value={this.state.createdBy?this.state.createdBy:''}/>
            </Th>
            <Th className={this.props.orderListViewMode==='orders'?'display_none':''} column={gettext('STATUS')}>
              <label title={gettext('STATUS')}>{gettext('STATUS')}</label>
              <FormControl
                componentClass="select"
                onChange={(e) => this.handleOrderStatusChange(e.target.value)}
                className={this.props.orderListViewMode === 'orders' || this.props.orderListViewMode === 'assignedOrders'
                            ?'visibility_hidden':'order_type_select'}>
                <option value={gettext('ALL')}>  {gettext('ALL')}  </option>
                {
                  _.map(_.uniqBy(this.props.orders, 'orderStatus'), function (item) {
                    return <option value={item.orderStatus}>{formatCamelCase(gettext('STATUS.'+item.orderStatus.toUpperCase()))}</option>;
                  })
                }
              </FormControl>
            </Th>
            <Th className={this.props.orderListViewMode==='orders'?'display_none':''} column={gettext('DRIVER')}>
              <label title={gettext('DRIVER')}>{gettext('DRIVER')}</label>
              <input type="text" className="form-control" name="driver"
                value={this.state.driver?this.state.driver:''}
                onChange={(e) => this.setState({driver: e.target.value})}/>
            </Th>
            <Th column='' className='reset_btn_container'>
              <button className="remove_filter_btn"
                onClick={() => this.handleResetFilter()}>
                {gettext('CLEAR')}
              </button>
            </Th>
          </Thead>

          {tableRows}

        </Table>
      </div>
    );
  }
}



OrdersList.propTypes = {
  users: PropTypes.array,
  orders: PropTypes.array,
  recipients: PropTypes.array,
  groupages: PropTypes.array,
  showOrderDetails: PropTypes.func,
  handleOrderSelectChange: PropTypes.func,
  selectedOrders: PropTypes.array.isRequired,
  vehicles: PropTypes.array.isRequired,
  deleteOrder: PropTypes.func,
  cancelOrder: PropTypes.func,
  loaded: PropTypes.bool,
  orderListPageNumber: PropTypes.number,
  saveCurrentPageOrderList: PropTypes.func,

  connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
};

export default DragSource(ItemTypes.ORDER, orderSource, collect)(OrdersList);
