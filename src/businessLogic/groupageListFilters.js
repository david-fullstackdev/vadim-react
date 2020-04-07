import _ from 'lodash';
import moment from 'moment';

export function filterByGroupageOrOrderId(groupages, orders, id) {
  if(!id)
    return groupages;

  let filteredGroupages = _.filter(groupages, (groupage) => {

    let trueOrder = false;
    _.map(orders, ( order ) => {
      if(order.groupageId === groupage.id
        && order.id.indexOf(id) != -1) {
        trueOrder = true;
      }
    });

    return groupage.id.indexOf(id) != -1 || trueOrder;
  });

	return filteredGroupages;
}

export function filterByOrderCount(groupages, orders, count) {
  if(!count)
    return groupages;

  let filteredGroupages = _.filter(groupages, (groupage) => {

    let orderCount = 0;
    _.map(orders, ( order ) => {
      if(order.groupageId === groupage.id)
        orderCount++;
    });

      return orderCount === parseInt(count);
  });

	return filteredGroupages;
}

export function filterByDate(groupages, date) {
  if(!date)
    return groupages;


  let filteredGroupages = _.filter(groupages, (groupage) => {
    return moment(groupage.expectedPickUpTime.startTime).zone('+0300').format('L') === moment(parseInt(date)).zone('+0300').format('L');
  });

	return filteredGroupages;
}

export function filterByExpectedPickupTime(groupages, start, end) {
  if(!start || !end)
   return groupages;

  let filteredGroupages =  _.filter(groupages, (groupage) => {
    return moment(groupage.expectedPickUpTime.startTime).zone('+0300').format('HH:mm') >= start
             && moment(groupage.expectedPickUpTime.endTime).zone('+0300').format('HH:mm') <= end;
  });

  return filteredGroupages;
}

export function filterByDeliveryTime(groupages, orders, start, end) {
  // if(!start || !end)
   return groupages;

  // let filteredGroupages = _.filter(groupages, (groupage) => {
  //   let trueOrder = false;
  //   _.map(orders, ( order ) => {
  //     if(moment(order.deliveryTime).zone('+0300').format('HH:mm') >= start
  //        && moment(order.deliveryTime).zone('+0300').format('HH:mm') <= end)
  //       trueOrder = true;
  //   });
  //
  //   return trueOrder;
  // });
  //
  // return filteredGroupages;
}

export function filterByVehicle(groupages, orders, type) {
  if(!type)
    return groupages;

  let filteredGroupages = _.filter(groupages, (groupage) => {

    let vehicleType = 0;
    _.map(orders, ( order ) => {
      if(order.groupageId === groupage.id) {
        if(order.vehicleType > vehicleType)
          vehicleType = order.vehicleType;
      }
    });
    return vehicleType === type;
  });

	return filteredGroupages;
}

export function filterByStatus(groupages, status) {
  if(!status)
    return groupages;

  let filteredGroupages = _.filter(groupages, (groupage) => {
      return groupage.groupageStatus === status;
    });

	return filteredGroupages;
}

export function filterByDriver(groupages, users, driver) {
  if(!driver)
    return groupages;

    const driversByFirstName = _.filter(users, (user) => {
        return user.role === 'driver' && (user.firstName.toUpperCase().indexOf(driver.toUpperCase()) != -1
                                          || user.email.toUpperCase().indexOf(driver.toUpperCase()) != -1);
    });

    let filteredGroupages = _.filter(groupages, (groupage) => {
      let trueDriver = false;
      _.map(driversByFirstName, ( driver ) => {
        if(groupage.driverId === driver.id)
          trueDriver = true;
      });
      return trueDriver;
    });

    return filteredGroupages;

}

export function filterByDeliveryCommission(groupages, val) {
  if(!val)
    return groupages;

    let filteredOrders = _.filter(groupages, (groupage) => {
        return groupage.deliveryCommission === val;
    });

	return filteredOrders;
}
