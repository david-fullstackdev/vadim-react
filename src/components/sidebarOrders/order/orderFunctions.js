import * as React from 'react';
import { formatOnlyTime } from '../../../businessLogic/deliveryTimeFormatter.js';
import { gettext } from '../../../i18n/service.js';
import { arrayToDictionary } from '../../../utils/array';

export function idDisplay(order) {
    return order.id.slice(order.id.length - 6, order.id.length);
}

function getTimespanInSeconds(date1, date2) {
    return Math.floor(Math.abs(date1.getTime() - date2.getTime()) / 1000);
}

function getTimeDiff(date, current) {
    var difference = getTimespanInSeconds(date, current);
    var minutes = Math.floor(difference / 60);
    return {
        minutes: minutes > 99 ? 99 : minutes,
        seconds: difference % 60
    };
}

export function getTimeDiffSince(date) {
    var current = new Date();
    var dateSince = new Date(date);
    return getTimeDiff(current, dateSince);
}

export function getTimeDiffBefore(date) {
    var current = new Date();
    var dateBefore = new Date(date);
    if (dateBefore < current) {
        return { minutes: 0, seconds: 0 };
    }

    return getTimeDiff(dateBefore, current);
}

export function getNewTimeColorClass(difference) {
    if (difference.minutes > 0 || difference.seconds > 15) {
        return 'red';
    }
    if (difference.seconds > 5) {
        return 'yellow';
    }
    return 'green';
}

export function deliveryTime(order) {
    return formatOnlyTime(order.deliveryTime);
}

const pickupStatuses = arrayToDictionary(["new", "assigned", "waitingForPickup"]);
export function deliveryIcon(order) {
    return pickupStatuses[order.orderStatus] ? 'pickup' : 'delivery';
}
export function deliveryIconTitle(order) {
    return pickupStatuses[order.orderStatus] ? 'Pickup Time' : 'Delivery Before';
}
const vehicleIcons = ['mot', 'sed', 'suv', 'van'];
export function vehicleIcon(order) {
    return vehicleIcons[order.vehicleType];
}

export function bagIcon(order) {
    const length = order.items && order.items.length || 0;
    return length > 9 ? 'bigBag' : 'bag';
}
