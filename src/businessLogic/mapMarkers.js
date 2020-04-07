import _ from 'lodash';


export const markerIcons = {
  unassigned: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
  assigned: 'https://maps.google.com/mapfiles/marker_green.png',
  deliveryPoint: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  carIcon: './img_icon_cars.png',
  highlighted: 'https://mt.google.com/vt/icon/name=icons/spotlight/spotlight-ad.png',
  waitingForPickup: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
  onWayToDelivery : 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png'
};

export const checkIfOrderIsAssignedToDriver = (order) => {
  return order.orderStatus === 'assigned';
};

export const checkIfOrderWaitingForPickupToDriver = (order) => {
  return order.orderStatus === 'waitingForPickup';
};

export const checkIfOrderOnWayToDeliveryToDriver = (order) => {
  return order.orderStatus === 'onWayToDelivery';
};

export const findMarkerWithSameLocation = (location, markers) => {
  if (!markers.length) {
    return false;
  }
  return _.find(markers, {position: location});
};

export const checkIfOrderIsSelectedOnTable = (order, selectedOrders) => {
  if (!selectedOrders || !selectedOrders.length) {
    return false;
  }
  return _.includes(selectedOrders, order);
};

const checkIfOrderIsBroken = (order) => {
  return !order.items || order.orderStatus === 'delivered' || order.orderStatus === 'canceled' || order.orderStatus === 'returned';
};


export const calculateMarkerOpacity = (marker, selectedOrders) => {
  if (!selectedOrders.length ||
     _.some( _.map(marker.orders, (o) => checkIfOrderIsSelectedOnTable(o.order, selectedOrders) )) ) {
    return 1;
  }

  return 0.3;
};

export const createNewMarker = (gpsLocation, address, markers, order, markerType, item, icon, selectedOrders) => {
  const markerWithSameLocation = findMarkerWithSameLocation(gpsLocation, markers);
  if (!markerWithSameLocation) {
    let newMarker = {
      orders: [{
        order,
        markerType,
        item
      }],
      position: gpsLocation,
      address: address,
      markerType,
      isSelected: checkIfOrderIsSelectedOnTable(order, selectedOrders),
      icon
    };
    newMarker.opacity = calculateMarkerOpacity(newMarker, selectedOrders);

    markers.push(newMarker);
  } else {
    markerWithSameLocation.orders.push({
      order,
      markerType,
      item
    });
    if (icon === markerIcons.highlighted) {
      markerWithSameLocation.icon = icon;
      markerWithSameLocation.opacity = 1;
      markerWithSameLocation.isSelected = true;
    }
  }
};

export const createOrderIcon = (order, selectedOrders) => {
  if (checkIfOrderIsSelectedOnTable(order, selectedOrders)) {
    return markerIcons.highlighted;
  } else {
    if (checkIfOrderIsAssignedToDriver(order)) {
      return markerIcons.assigned;
    } else if (checkIfOrderOnWayToDeliveryToDriver(order)) {
      return markerIcons.onWayToDelivery;
    } else if (checkIfOrderWaitingForPickupToDriver(order)) {
      return markerIcons.waitingForPickup;
    } else {
      return markerIcons.unassigned;
    }
  }
};

export const buildMapMarkersList = (orders, recipients, pickupPoints, selectedOrders) => {
  let markers = [];
  if (pickupPoints) {
    orders.forEach((order) => {
      if (checkIfOrderIsBroken(order)) {
        return;
      }
      const orderIcon = createOrderIcon(order, selectedOrders);
      _.forEach(order.items, (item) => {
        const pickUpPoint = pickupPoints[item.pickupPointId];
        if (!pickUpPoint) {
          return false;
        }
        createNewMarker(pickUpPoint.gpsLocation, pickUpPoint.address, markers, order, 'pickupPoint', item, orderIcon, selectedOrders);
      });
      const recipient = _.find(recipients, {id: order.recipientId});
      const deliveryPointIcon = orderIcon === markerIcons.highlighted ? orderIcon : markerIcons.deliveryPoint;
      if (recipient) {
        const {gpsLocation, deliveryPoint} = recipient;
        createNewMarker(gpsLocation, deliveryPoint, markers, order, 'deliveryPoint', null, deliveryPointIcon,  selectedOrders);
      }
    });
  }
  return markers;
};

export const showTeam = (markers, polygonFromTeam, map) => {
  var bounds = new window.google.maps.LatLngBounds();
  _.forEach(polygonFromTeam, (m) => {
        bounds.extend(new window.google.maps.LatLng(m.lat, m.lng));
  });

  let polyPoints = [];
  _.forEach(polygonFromTeam, (point) => {
    polyPoints.push(new google.maps.LatLng(point.lat, point.lng));
  });

  var polygon = new google.maps.Polygon({paths: polyPoints});
    _.forEach(markers, (marker) => {
      if(marker && marker.position) {
        let point = new google.maps.LatLng(marker.position.lat, marker.position.lng);

      if (!google.maps.geometry.poly.containsLocation(point, polygon)) {
        marker.hide = true;
        }
      }
    });
    if ( map ) {
      map.fitBounds(bounds);
    }
};
