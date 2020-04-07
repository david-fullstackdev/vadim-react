import React, { PropTypes } from 'react';
import _ from 'lodash';
import OrdersGroup from './OrdersGroup';
import { gettext } from '../../i18n/service.js';
import { sameDay } from '../../utils/date';
import { arrayToDictionary } from '../../utils/array';
import { Modal } from 'react-bootstrap';
const newOrderStatuses = arrayToDictionary(['new']);
const inProgressOrderStatuses = arrayToDictionary(['assigned', 'onWayToDelivery', 'waitingForPickup', 'pickedUp', 'partlyPickedUp', 'waitingForReturn']);
const historyOrderStatuses = arrayToDictionary(['canceled', 'delivered', 'returned']);

function filterByStatus(orders, statuses) {
    return _(orders)
        .filter(order => statuses[order.orderStatus])
        .sortBy('createdAt', 'expectedPickUpTime')
        .reverse()
        .value();
}

export class SidebarOrdersComponent extends React.Component {
    render() {
        const { orders, actions, state, recipients, pickUpPoints, drivers } = this.props;

        const newOrders = filterByStatus(orders, newOrderStatuses);
        const inProgress = filterByStatus(orders, inProgressOrderStatuses);
        return (
            <div>
                <OrdersGroup title={gettext('ORDER.NEW-ORDERS')} orders={newOrders}
                    isOpen={state.newOrdersExpand.isOpen} toggle={actions.toggleNewOrders}
                    startDraggingOrder={this.props.startDraggingOrder}
                    draggingOrder={this.props.draggingOrder} pickUpPoints={pickUpPoints} 
                    recipients={recipients} drivers={drivers}>
                </OrdersGroup>
                <OrdersGroup title={gettext('ORDER.IN-PROGRESS')} orders={inProgress}
                    isOpen={state.inProgressOrdersExpand.isOpen} 
                    toggle={actions.toggleInProgressOrders} pickUpPoints={pickUpPoints} 
                    recipients={recipients} drivers={drivers}>
                </OrdersGroup>
            </div>
        );
    }
}
SidebarOrdersComponent.propTypes = {
    orders: PropTypes.array,
    recipients: PropTypes.array,
    pickUpPoints: PropTypes.array,
    drivers: PropTypes.array
};
