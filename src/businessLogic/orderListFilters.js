import _ from 'lodash';
import moment from 'moment';

export function filterByDate(orders, date) {
  if(!date)
    return orders;


  let filteredOrders = _.filter(orders, (order) => {
    return moment(order.expectedPickUpTime.startTime).zone('+0300').format('L') === moment(parseInt(date)).zone('+0300').format('L');
  });

	return filteredOrders;
}

export function filterByDateOrderHistory(orders, date) {
  if(!date)
    return _.filter(orders, (order) => {
      return order.orderStatus === 'canceled' || order.orderStatus === 'delivered' || order.orderStatus === 'returned';
    });


  let filteredOrders = _.filter(orders, (order) => {
    return moment(order.processedAt).zone('+0300').format('L') === moment(parseInt(date)).zone('+0300').format('L')
      && (order.orderStatus === 'canceled' || order.orderStatus === 'delivered' || order.orderStatus === 'returned');
  });

	return filteredOrders;
}

export function filterByExpectedPickupTime(orders, start, end) {
  let filteredOrders = _.filter(orders, (order) => {
    return moment(order.expectedPickUpTime.startTime).zone('+0300').format('HH:mm') >= start
             && moment(order.expectedPickUpTime.endTime).zone('+0300').format('HH:mm') <= end;
  });

  if(start && end)
	 return filteredOrders;
  else
    return orders;
}

export function filterByDeliveryTime(orders, start, end) {
  let filteredOrders = _.filter(orders, (order) => {
    return moment(order.deliveryTime).zone('+0300').format('HH:mm') >= start
             && moment(order.deliveryTime).zone('+0300').format('HH:mm') <= end;
  });

  if(start && end)
	 return filteredOrders;
  else
    return orders;
}

export function filterByOrderType(orders, type) {
  if(!type)
    return orders;

  if(type === 'regular')
    return _.filter(orders, (order) => {
      return !order.express && !order.isOutOfCity;
  });
  else
    return _.filter(orders, (order) => {
      return order[type];
  });
}

export function filterByOrderId(orders, id) {
  if(!id)
    return orders;

  let filteredOrders = _.filter(orders, (order) => {
    return order.id.toUpperCase().indexOf(id.toUpperCase()) != -1;
  });

	return filteredOrders;
}

export function filterByItemCount(orders, count) {
  if(!count)
    return orders;

  let filteredOrders = _.filter(orders, (order) => {
    return order.items.length === count;
  });

	return filteredOrders;
}

export function filterByVehicleType(orders, type) {
  if(!type)
    return orders;

  let filteredOrders = _.filter(orders, (order) => {
    return order.vehicleType === type;
  });

	return filteredOrders;
}

export function filterByDeliveryCommission(orders, val) {
  if(!val)
    return orders;

  let filteredOrders = _.filter(orders, (order) => {
    return order.deliveryCommission === val;
  });

	return filteredOrders;
}

export function filterByCodAmount(orders, val) {
  if(!val)
    return orders;

  let filteredOrders = _.filter(orders, (order) => {
    return order.cashOnDelivery && order.cashOnDeliveryAmount === val;
  });

	return filteredOrders;
}

export function filterByDispatcher(orders, val, dispatchers) {
  if(!val)
    return orders;

  const dispatchersByName = _.filter(dispatchers, (user) => {
      return user.role === 'dispatcher'
              && (user.firstName.toUpperCase().indexOf(val.toUpperCase()) != -1
              || user.email.toUpperCase().indexOf(val.toUpperCase()) != -1
              || (user.shopName && user.shopName.toUpperCase().indexOf(val.toUpperCase()) != -1));
  });


  let filteredOrders = _.filter(orders, (order) => {
    let trueOrder = false;

    _.map(dispatchersByName, ( dispatcher ) => {
      if(dispatcher.id === order.dispatcherId)
        trueOrder = true;
    });

    return trueOrder;
  });

  	return filteredOrders;
}

export function filterByDriver(orders, users, driver) {
  if(!driver)
    return orders;

    const driversByFirstName = _.filter(users, (user) => {
        return user.role === 'driver' && (user.firstName.toUpperCase().indexOf(driver.toUpperCase()) != -1
                                        ||user.email.toUpperCase().indexOf(driver.toUpperCase()) != -1);
    });


    let filteredOrders = _.filter(orders, (order) => {
      let trueGroup = false;

      _.map(driversByFirstName, ( driver ) => {
          if(order.driverId === driver.id)
            trueGroup = true;
      });

      return trueGroup;
    });
  	return filteredOrders;
}

export function filterByStatus(orders, status) {
  if(!status)
    return orders;

  let filteredOrders = _.filter(orders, (order) => {
    return order.orderStatus === status;
  });

	return filteredOrders;
}

export function filterCreatedBy(orders, name) {
  if(!name)
    return orders;

  let filteredOrders = _.filter(orders, (order) => {
    return order.createdBy && order.createdBy.companyName && order.createdBy.companyName.toUpperCase().indexOf(name.toUpperCase()) !== -1
  });

	return filteredOrders;
}
