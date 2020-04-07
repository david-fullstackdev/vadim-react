import React, { PropTypes } from 'react';

function pinImageName(order) {
    switch (order.orderStatus) {
        case 'new':
        case 'waitingForPickup':
        case 'assigned':
            return 'pickup';
        case 'pickedUp':
        case 'onWayToDelivery':
        case 'waitingForReturn':
            return 'delivery';
        default:
            return 'delivery';
    }
}

export function OrderPin({ order }) {
    const name = pinImageName(order);
    const title = (name.charAt(0).toUpperCase() + name.slice(1)) + ' Point';
    return <img className='pin-icon' src={`./side_pin_${name}.svg`} title={title}/>;
}