import React, { Component, PropTypes } from 'react';
import { Button, Tabs, Tab } from 'react-bootstrap';
import { gettext } from '../../i18n/service.js';
import LoopbackHttp from '../../businessLogic/LoopbackHttp.js';

export class OrdersListActionBar extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const groupButtonClassName = this.props.orderListViewMode === 'orders' ? '' : 'hidden';
    const unAssignButtonClassName = this.props.orderListViewMode === 'assignedOrders' && this.props.selectedOrders  && this.props.selectedOrders.length > 0
              ? '' : 'hidden';

    return (
      <div>
        <Tabs
          activeKey={this.props.orderListViewMode}
          id="orderListViewModeTabs"
          className="orderListViewModeTabs"
          onSelect={this.props.changeOrderListViewMode}
          style={{
            float: "left"
          }}>
          <Tab eventKey={'orders'} title={gettext('ORDER.NEW-ORDERS')} />
          <Tab eventKey={'assignedOrders'} title={gettext('ORDER.IN-PROGRESS')} />
          <Tab eventKey={'orderHistory'} title={gettext('ORDER.HISTORY')} />
        </Tabs>

        <div className="groupButtonsContainer" >
          {!LoopbackHttp.isOperator || (LoopbackHttp.isOperator && this.props.account.canCreateOrders)?
            <Button
            className={groupButtonClassName}
            bsStyle="success"
            onClick={this.props.createNewOrder}>{gettext('NEW-ORDER')}
          </Button> : '' }
          <Button
            className={unAssignButtonClassName}
            bsStyle="success"
            onClick={() => this.props.unassignOrders()}>{gettext('UNASIGN-ORDER')}
          </Button>
        </div>
      </div>
    );
  }
}


OrdersListActionBar.propTypes = {
  orderListViewMode: PropTypes.string,
  changeOrderListViewMode: PropTypes.func,
  groupSelectedOrders: PropTypes.func,
  ungroupSelectedOrders: PropTypes.func,
  someOrdersSelected: PropTypes.bool,
  assignOrders: PropTypes.func
};
