import _ from 'lodash';
import moment from 'moment';

export default function createExpectedDeliveryTimeWindow(orders) {
  if (!orders) {
    return 'no orders';
  }
  const sortedOrders = _(orders)
    .sortBy((order) => order.deliveryTime)
    .value();
  if (sortedOrders.length === 1) {
    return moment(sortedOrders[0].deliveryTime).zone('+0300').format('HH:mm');
  }
  if (moment(sortedOrders[0].deliveryTime).zone('+0300').format('HH') === moment(sortedOrders[sortedOrders.length - 1].deliveryTime).zone('+0300').format('HH')) {
    return moment(sortedOrders[0].deliveryTime).zone('+0300').format('HH:mm');
  }
  return `${moment.utc(sortedOrders[0].deliveryTime).zone('+0300').format('HH:mm')} - ${moment(sortedOrders[sortedOrders.length - 1].deliveryTime).zone('+0300').format('HH:mm')}`;
}
