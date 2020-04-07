import React, { Component, PropTypes } from 'react';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';

import { gettext } from '../i18n/service.js';
import { formatCashOn } from '../businessLogic/formatCashOnDelivery.js';
import { parseExpectedPickUpTimeDate, parseExpectedPickUpTimeOnlyTime } from '../businessLogic/expectedPickUpTimeParser.js';
import { formatOnlyTime } from '../businessLogic/deliveryTimeFormatter.js';
import getCommissionAndCurrency from '../businessLogic/getCommissionAndCurrency.js';
import { getDashboardButtonStyle } from '../businessLogic/getButtonStyle.js';
import formatCamelCase from '../businessLogic/formatCamelCase.js';
import setOrderStatusColor from '../businessLogic/setOrderStatusColor.js';
import moment from 'moment';


export const columnsNewOrders = [
  {
    id: 'id',
    title: gettext('ORDER-#'),
    render: (order) => (
      <div>
        <Link to={`/orderDetails/${order.id}`}
          className={getDashboardButtonStyle(order)}>
          {order.id.slice(order.id.length - 5, order.id.length)}
        </Link>
      </div>
    )
  },
  {
    id: 'items',
    title: gettext('#-OF-ITEMS'),
    render: (order) => _.uniq(order.items).length
  },
  {
    id: 'vehicleType',
    title: gettext('VEHICLE-TYPE'),
    render: (order, props) => {
      const vehicle = _.find(props.vehicles, { size: +order.vehicleType }) || {};
      return (<Image alt={vehicle.type} src={vehicle.icon} />);
    }
  },
  {
    id: 'expectedPickUpTime',
    title: gettext('PICKUP-TIME'),
    render: (order) => parseExpectedPickUpTimeOnlyTime(order.expectedPickUpTime)
  },
  {
    id: 'deliveryTime',
    title: gettext('DELIVERY-TIME'),
    render: (order) => {
      if (order.express)
        return <strong className="express">{gettext('EXPRESS-DELIVERY') + '!'}</strong>;
      if (order.isOutOfCity)
        return <strong className="isOutOfCity">{gettext('OUT-OF-CITY') + '!'}</strong>;
      else
        return formatOnlyTime(order.deliveryTime);
    }
  },
  {
    id: 'date',
    title: gettext('DATE'),
    render: (order) => parseExpectedPickUpTimeDate(order.expectedPickUpTime)
  },
  {
    id: 'deliveryCommission',
    title: gettext('DELIVERY-COST'),
    render: (order, props) => order.deliveryCommission + ' ' + props.company.currency
  },
  {
    id: 'cashOnDeliveryAmount',
    title: gettext('CASH-ON-DELIVERY'),
    render: (order) => formatCashOn(order.cashOnDelivery, order.cashOnDeliveryAmount)
  },
  {
    id: 'by',
    title: gettext('CREATED-BY'),
    render: (order, props) => {
      if(!order.createdBy)
        return 'Can not get';
      else {
        return order.createdBy.companyName;
      }
    }
  }
];


export const columnsProgress = [
  {
    id: 'id',
    title: gettext('ORDER-#'),
    render: (order) => (
      <div>
        <Link to={`/orderDetails/${order.id}`}
          className={getDashboardButtonStyle(order)}>
          {order.id.slice(order.id.length - 5, order.id.length)}
        </Link>
      </div>
    )
  },
  {
    id: 'items',
    title: gettext('#-OF-ITEMS'),
    render: (order) => _.uniq(order.items).length
  },
  {
    id: 'vehicleType',
    title: gettext('VEHICLE-TYPE'),
    render: (order, props) => {
      const vehicle = _.find(props.vehicles, { size: +order.vehicleType }) || {};
      return (<Image alt={vehicle.type} src={vehicle.icon} />);
    }
  },
  {
    id: 'expectedPickUpTime',
    title: gettext('PICKUP-TIME'),
    render: (order) => parseExpectedPickUpTimeOnlyTime(order.expectedPickUpTime)
  },
  {
    id: 'deliveryTime',
    title: gettext('DELIVERY-TIME'),
    render: (order) => {
      if (order.express)
        return <strong className="express">{gettext('EXPRESS-DELIVERY') + '!'}</strong>;
      if (order.isOutOfCity)
        return <strong className="isOutOfCity">{gettext('OUT-OF-CITY') + '!'}</strong>;
      else
        return formatOnlyTime(order.deliveryTime);
    }
  },
  {
    id: 'date',
    title: gettext('DATE'),
    render: (order) => parseExpectedPickUpTimeDate(order.expectedPickUpTime)
  },
  {
    id: 'deliveryCommission',
    title: gettext('DELIVERY-COST'),
    render: (order, props) => order.deliveryCommission + ' ' + props.company.currency
  },
  {
    id: 'cashOnDeliveryAmount',
    title: gettext('CASH-ON-DELIVERY'),
    render: (order) => formatCashOn(order.cashOnDelivery, order.cashOnDeliveryAmount)
  },
  {
    id: 'by',
    title: gettext('CREATED-BY'),
    render: (order, props) => {
      if(!order.createdBy)
        return 'Can not get';
      else {
        return order.createdBy.companyName;
      }
    }
  },
  {
    id: 'status',
    title: gettext('STATUS'),
    render: (order, props) => {
      return formatCamelCase(order.orderStatus);
    }
  },
  {
    id: 'driver',
    title: gettext('DRIVER'),
    render: (order, props) => {
      const driver = _.find(props.users, { id: order.driverId, role: 'driver' });

      if (driver) {
        return driver.firstName;
      }
    }
  }
];

export const columnsHistory = [
  {
    id: 'id',
    title: gettext('ORDER-#'),
    render: (order) => (
      <div>
        <Link to={`/orderDetails/${order.id}`}
          className={getDashboardButtonStyle(order)}>
          {order.id.slice(order.id.length - 5, order.id.length)}
        </Link>
      </div>
    )
  },
  {
    id: 'items',
    title: gettext('#-OF-ITEMS'),
    render: (order) => _.uniq(order.items).length
  },
  {
    id: 'vehicleType',
    title: gettext('VEHICLE-TYPE'),
    render: (order, props) => {
      const vehicle = _.find(props.vehicles, { size: +order.vehicleType }) || {};
      return (<Image alt={vehicle.type} src={vehicle.icon} />);
    }
  },
  {
    id: 'expectedPickUpTime',
    title: gettext('PICKUP-TIME'),
    render: (order) => parseExpectedPickUpTimeOnlyTime(order.expectedPickUpTime)
  },
  {
    id: 'deliveryTime',
    title: gettext('DELIVERY-TIME'),
    render: (order) => {
      if (order.express)
        return <strong className="express">{gettext('EXPRESS-DELIVERY') + '!'}</strong>;
      if (order.isOutOfCity)
        return <strong className="isOutOfCity">{gettext('OUT-OF-CITY') + '!'}</strong>;
      else
        return formatOnlyTime(order.deliveryTime);
    }
  },
  {
    id: 'date',
    title: gettext('DATE'),
    render: (order) => order.processedAt?moment(order.processedAt).format('MM/DD/YYYY'):'Can not get'
  },
  {
    id: 'deliveryCommission',
    title: gettext('DELIVERY-COST'),
    render: (order, props) => order.deliveryCommission + ' ' + props.company.currency
  },
  {
    id: 'cashOnDeliveryAmount',
    title: gettext('CASH-ON-DELIVERY'),
    render: (order) => formatCashOn(order.cashOnDelivery, order.cashOnDeliveryAmount)
  },
  {
    id: 'by',
    title: gettext('CREATED-BY'),
    render: (order, props) => {
      if(!order.createdBy)
        return 'Can not get';
      else {
        return order.createdBy.companyName;
      }
    }
  },
  {
    id: 'status',
    title: gettext('STATUS'),
    render: (order, props) => {
      return formatCamelCase(order.orderStatus);
    }
  },
  {
    id: 'driver',
    title: gettext('DRIVER'),
    render: (order, props) => {
      const driver = _.find(props.users, { id: order.driverId, role: 'driver' });

      if (driver) {
        return driver.firstName;
      }
    }
  }
];
