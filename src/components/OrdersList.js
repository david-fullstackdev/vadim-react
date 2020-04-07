/* eslint-disable no-var */
import React, {PropTypes} from 'react';
// import { Link } from 'react-router';
import { Table, Button, Tabs, Tab } from 'react-bootstrap';
import DateTimeField from 'react-bootstrap-datetimepicker';
import {parseExpectedPickUpTime} from '../businessLogic/expectedPickUpTimeParser.js';
import {formatTime} from '../businessLogic/deliveryTimeFormatter.js';
import { gettext, getStatus } from '../i18n/service.js';

const compareGroupageId = (a1, b1) => {
    let a = a1.groupageId || '', b = b1.groupageId || '';
    let ax = [], bx = [];

    a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]); });
    b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]); });

    while(ax.length && bx.length) {
        let an = ax.shift();
        let bn = bx.shift();
        let nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
        if(nn) return nn;
    }
    return ax.length - bx.length;
};

const stopPropagation = (e) => e.stopPropagation();

export default function OrdersList(props) {
  let orders = (props.isDispatcher && props.dateFilter) ?
      props.orders.filter((order) => new Date(order.expectedPickUpTime).toDateString() === props.dateFilter || new Date(order.deliveryTime).toDateString() === props.dateFilter) :
      props.orders;
  if (props.orderListViewMode === 'orders') {
    orders = orders.filter((n) => !n.groupageId);
  }
  let groupageIds = {};
  let filledGroupageIds = {};
  if (!props.isDispatcher && (props.orderListViewMode === 'groupages' || props.orderListViewMode === 'showAll')) {
    orders = orders.filter((order) => order.groupageId) //todo remove this filter and fix logic
    .sort(compareGroupageId);
    orders.forEach((order) => {
      if (!groupageIds[order.groupageId]) {
        groupageIds[order.groupageId] = 0;
        filledGroupageIds[order.groupageId] = 0;
      }
      groupageIds[order.groupageId]++;
    });
  }
  return (
    <div className="ordersListContainer">
      {props.isDispatcher ?
        <h3 className="orderListHeader">
          { gettext('ORDER.ORDER-LIST-HEADER') }
        </h3>
        :
        null
      }
      {props.isDispatcher ?
        <DateTimeField
          mode="date"
          defaultText={new Date(props.dateFilter).toLocaleDateString()}
          onChange={props.onDateFilterChange}
          showToday={true}
          inputProps={{
            className: 'dateFilterInput form-control'
          }}
        />
        :
        null
      }
      {(!props.isDispatcher && !props.isHistory) ?
        <Tabs activeKey={props.orderListViewMode} id="orderListViewModeTabs" className="orderListViewModeTabs" onSelect={props.changeOrderListViewMode}>
          <Tab eventKey={'showAll'} title="ShowAll"/>
          <Tab eventKey={'groupages'} title="Groupages"/>
          <Tab eventKey={'orders'} title="Orders"/>
        </Tabs>
        :
        null
      }
      {(props.isDispatcher || props.isHistory) ?
        null
        :
        <div className="groupButtonsContainer">
          <Button bsStyle="success" onClick={props.groupSelectedOrders}>{ gettext('GROUPAGE.GROUP') }</Button>
          <Button bsStyle="success" onClick={props.ungroupSelectedOrders}>{ gettext('GROUPAGE.UNGROUP') }</Button>
        </div>
      }

      <Table hover>
        <thead>
          <tr>
            {
              (props.isDispatcher || props.isHistory) ?
              null :
              <th>{' '}</th>
            }
            {(props.isDispatcher || props.orderListViewMode === 'orders') ?
              null :
              <th>{ gettext('GROUPAGE-#') }</th>
            }
            <th>{ gettext('ORDER-#') }</th>
            {props.isDispatcher ?
              <th>{ gettext('#-OF-ITEMS') }</th>
              :
              null
            }
            {props.isDispatcher ?
              <th>{ gettext('ORDER.ORDER-TIME') }</th>
              :
              null
            }
            <th>{ gettext('EXPECTED-PICKUP-TIME') }</th>
            <th>{ gettext('DELIVERY-TIME') }</th>
            <th>{ gettext('DISPATCHER') }</th>
            <th>{ gettext('STATUS') }</th>
            {props.isDispatcher ?
              null
              :
              <th>{ gettext('#-OF-ITEMS') }</th>
            }
            {props.isDispatcher ?
              null :
              <th>{ gettext('DRIVER') }</th>
            }
          </tr>
        </thead>
        <tbody>
          {
            orders.map((order) => {
              if (props.orderListViewMode === 'groupages' && !order.groupageId) {
                return false;
              }
              const dispatcher = props.users.filter((user) => user.id === order.dispatcherId)[0];
              if (!props.isDispatcher) {
                var shouldHighlight = (props.setOfItemIdsWithShowInfo && order.items) ? order.items.some((item) => props.setOfItemIdsWithShowInfo.has(item.id)) : false;
                var groupage = order.groupageId ? props.groupages.filter((groupage) => groupage.id === order.groupageId)[0] : null;
                var driver = groupage ? props.users.filter((user) => user.id === groupage.driverId)[0] : null;
                if (props.orderListViewMode === 'groupages' || props.orderListViewMode === 'showAll') {
                  filledGroupageIds[order.groupageId]++;
                  var shouldHide = (!order.groupageId || groupageIds[order.groupageId] === 1) ? false : Math.round(groupageIds[order.groupageId] / 2) !== filledGroupageIds[order.groupageId];
                  var isLastInGroupage = filledGroupageIds[order.groupageId] === groupageIds[order.groupageId];
                }
              }
              return (
                <tr
                  key={order.id}
                  onClick={(e) => {props.showOrderDetails(e, order);}}
                  className={`${shouldHighlight ? 'highlighted' : ''} orderRow ${isLastInGroupage ? ' lastInGroupage' : ''}`}
                  >
                  {(props.isDispatcher || props.isHistory) ?
                    null :
                    <td className={`${shouldHide ? 'hiddenText' : ''}`}>
                      <input type="checkbox" className="orderSelectCheckbox" onClick={stopPropagation} onChange={(e) => props.handleOrderSelectChange(e, order)}/>
                    </td>
                  }
                  {(props.isDispatcher || props.orderListViewMode === 'orders') ?
                    null :
                    <td className={`${shouldHide ? 'hiddenText' : 'blackText'}`}>
                      {order.groupageId ? order.groupageId.slice(order.groupageId.length - 5, order.groupageId.length) : '- -'}
                    </td>
                  }
                  <td className="blackText">
                    {order.id.slice(order.id.length - 5, order.id.length)}
                  </td>
                  {props.isDispatcher ?
                    <td>
                      {order.items ? order.items.length : 0}
                    </td>
                    :
                    null
                  }
                  {props.isDispatcher ?
                    <td className="blackText">
                      {formatTime(order.orderCreatedTime)}
                    </td>
                    :
                    null
                  }
                  <td className={`${shouldHide ? 'hiddenText' : ''}`}>
                    {order.expectedPickUpTime ? parseExpectedPickUpTime(order.expectedPickUpTime) : ''}
                  </td>
                  <td>
                    {formatTime(order.deliveryTime)}
                  </td>
                  <td className="blackText">
                    {dispatcher ? `${dispatcher.firstName}` : ''}
                  </td>
                  <td className={`${shouldHide ? 'hiddenText' : ''}`}>
                    {getStatus(order.orderStatus)}
                  </td>
                  {props.isDispatcher ?
                    null
                    :
                    <td className="blackText">
                      {order.items ? order.items.length : 0}
                    </td>
                  }
                  {props.isDispatcher ?
                    null :
                    <td className={`${shouldHide ? 'hiddenText' : 'blackText'}`}>
                      {driver ? `${driver.firstName}` : <span className="warningText">{ gettext('STATUS.UNASSIGNED') }</span>}
                    </td>
                  }
                </tr>
              );
            })}
          </tbody>
        </Table>
        {props.isDispatcher ?
          <Button bsStyle="success"
            onClick={props.createNewOrder}
            className="createOrderBtn"
            >
            + { gettext('ORDER.CREATE-NEW-ORDER') }
          </Button>
          :
          null
        }

      </div>
  );
}




OrdersList.propTypes = {
  isDispatcher: PropTypes.bool,
  isHistory: PropTypes.bool,
  historyView: PropTypes.bool,
  onDateFilterChange: PropTypes.func,
  orders: PropTypes.array,
  groupages: PropTypes.array,
  users: PropTypes.array,
  dateFilter: PropTypes.string,
  showOrderDetails: PropTypes.func,
  handleOrderSelectChange: PropTypes.func,
  setOfItemIdsWithShowInfo: PropTypes.instanceOf(Set),
  orderListViewMode: PropTypes.string,
  changeOrderListViewMode: PropTypes.func,
  groupSelectedOrders: PropTypes.func,
  ungroupSelectedOrders: PropTypes.func,
  createNewOrder: PropTypes.func
};
