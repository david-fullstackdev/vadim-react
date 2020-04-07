import React, { PropTypes } from 'react';
import * as orderFunctions from './orderFunctions';
import { gettext } from '../../../i18n/service.js';

function getNewTimeColorClass(diff) {
    if (diff.minutes > 0 || diff.seconds > 15) {
        return 'red';
    }
    if (diff.seconds > 5) {
        return 'yellow';
    }
    return 'green';
}

function padNumber(number) {
    return (number > 9 ? '' : '0') + number;
}

function renderDiff(diff) {
    if(diff)
      return `${padNumber(diff.minutes)}:${padNumber(diff.seconds)}`;
    else return 0;
}

export class NewOrderTimer extends React.Component {
    render() {
        const diff = orderFunctions.getTimeDiffSince(this.props.order.createdAt);
        return <span className={getNewTimeColorClass(diff)}>{renderDiff(diff)}</span>;
    }
}

export class InProgressDeliveryTimer extends React.Component {
    render() {
        const diff = orderFunctions.getTimeDiffBefore(this.props.order.deliveryTime);
        return <span className="blue" title={gettext('Time left to deliver the order')}>{renderDiff(diff)}</span>;
    }
}

export class InProgressPickupTimer extends React.Component {
    render() {
        const diff = this.props.order.expectedPickUpTime?orderFunctions.getTimeDiffBefore(this.props.order.expectedPickUpTime.endTime):undefined;
        return <span className="purple" title={gettext('Time left to pick up the order')}>{renderDiff(diff)}</span>;
    }
}

const timer = {
    methods: [],
    startTimer: function () {
        this.methods.forEach(method => method());
        setTimeout(() => this.startTimer(), 500);
    },
    subscribe: function (method) {
        if (!this.timer) {
            this.startTimer();
        }
        this.methods.push(method);
    },
    unsubscribe: function (method) {
        const index = this.methods.indexOf(method);
        if (index !== -1) {
            this.methods.splice(index, 1);
        }
    }
}

export class OrderTimer extends React.Component {
    componentDidMount() {
        this.method = () => this.setState({});
        timer.subscribe(this.method);
    }

    componentWillUnmount() {
        timer.unsubscribe(this.method);
    }

    render() {
        switch (this.props.order.orderStatus) {
            case 'new':
                return <NewOrderTimer order={this.props.order} />;
            case 'assigned':
            case 'waitingForPickup':
                return <InProgressPickupTimer order={this.props.order} />;
            case 'pickedUp':
            case 'waitingForReturn':
            case 'onWayToDelivery':
                return <InProgressDeliveryTimer order={this.props.order} />;
            default:
                return false;
        }
    }
}
