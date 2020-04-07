import React, {PropTypes} from 'react';
import { Col, Row } from 'react-bootstrap';
import {parseExpectedPickUpTime} from '../../businessLogic/expectedPickUpTimeParser.js';
import {formatTime} from '../../businessLogic/deliveryTimeFormatter.js';
import formatId from '../../businessLogic/formatId.js';
import './OperatorOrderDetailsComponent.scss';
import _ from 'lodash';
import { gettext, formatRequiredVehicleType, getStatus } from '../../i18n/service.js';
import { formatCashOn } from '../../businessLogic/formatCashOnDelivery.js';

const renderItems = (order, pickUpPoints) => {
  return _.map(order.items, (item) => {
    const point = pickUpPoints[item.pickupPointId] ?
      pickUpPoints[item.pickupPointId] :
      gettext('CANNOT-GET-PICKUP-POINT');
    return (
      <span key={item.id}>
        <h4>{ gettext('ITEM.ITEM-#') } {formatId(item.id)}</h4><br/>
        <span className="description">{ gettext('PICKUP-POINT') }: </span>{point.address}<br/>
        { point.contactName?
        <div><span className="description">{gettext('PICKUP-POINT-CONTACT')}: </span>{point.contactName}</div>
        : '' }
        { point.phone?
        <div><span className="description">{gettext('PHONE')}: </span>{point.phone}</div>
        : '' }
        <span className="description">{ gettext('PACKING-LIST') }: </span><pre>{item.packingList}</pre><br/>
      </span>
    );
  });
};

export default function OperatorOrderDetailsComponent({recipients, pickUpPoints, order, users, vehicles}) {
  const recipient = _.find(recipients, {id: order.recipientId}) || {};
  const dispatcher = _.find(users, {id: order.dispatcherId}) || {};
  const requiredVehicle = _.find(vehicles, {size: +order.vehicleType}) || {};
  const items = renderItems(order, pickUpPoints);
  const platform = (order.createdByPlatformId)
    ? _.find(users, {id: order.createdByPlatformId})
    : undefined;
  return (
    <Row className="OperatorOrderDetailsComponent" >
      <h3 className="OrderHeader">{ gettext('ORDER-#') } {formatId(order.id)}</h3>
        <Col sm={4}>
          {items}
          <span className="description">{ gettext('STATUS') }: </span>{getStatus(order.orderStatus)}<br/>
          <span className="description">{ gettext('PICKUP-TIME') }: </span>{parseExpectedPickUpTime(order.expectedPickUpTime)}<br/>
          <span className="description">{ gettext('DELIVERY-TIME') }: </span> {order.express
                                                                                ?<strong className="express">{gettext('EXPRESS-DELIVERY')+'!'}</strong>
                                                                                :formatTime(order.deliveryTime) }<br/>
          <span className="description">{ gettext('ORDER.ORDERED') }: </span>{formatTime(order.orderCreatedTime, 'orderCreatedTime')}<br/>
          <span className="description">{ gettext('REQUIRED-VEHICLE') }: </span>{ formatRequiredVehicleType(requiredVehicle.type) }<br/>
          <span className="description">{ gettext('CASH-ON-DELIVERY') }: </span>{formatCashOn(order.cashOnDelivery, order.cashOnDeliveryAmount) }<br/>
        </Col>

        <Col sm={4}>
          <h4>Recipient</h4>
          <span className="description">{ gettext('NAME') }: </span>{recipient.firstName}<br/>
          <span className="description">{ gettext('ADDRESS') }: </span>{recipient.deliveryPoint}<br/>
          <span className="description">{ gettext('MOBILE') }: </span>{recipient.mobile}<br/>
        </Col>

        <Col sm={4}>
          <h4>Dispatcher</h4>
          {platform ?
            <div><span className="description">{gettext('SUBMITTED-BY-PLATFORM')+ ': '}</span>{platform.name}<br/></div>
            : ''
          }
          <span className="description">{ gettext('DISPATCHER.SHOP-NAME') }: </span>{dispatcher.shopName}<br/>
          <span className="description">{ gettext('NAME') }: </span>{`${dispatcher.firstName}`}<br/>
          <span className="description">{ gettext('MOBILE') }: </span>{dispatcher.mobile}<br/>
          <span className="description">{ gettext('PHONE') }: </span>{dispatcher.phone}<br/>
          <span className="description">{ gettext('DRIVER-COMMISSION') }: </span>{order.driverReward} {dispatcher.currency}
          <span className="description">{ gettext('COMPANY-COMMISSION') }: </span>{order.companyProceeds} {dispatcher.currency}
          <span className="description">{ gettext('TOTAL-DELIVERY-COMMISSION') }: </span>{order.deliveryCommission} {dispatcher.currency}

        </Col>
    </Row>
  );
}




OperatorOrderDetailsComponent.propTypes = {
  groupages: PropTypes.array,
  pickUpPoints: PropTypes.object,
  recipients: PropTypes.array,
  users: PropTypes.array,
  vehicles: PropTypes.array.isRequired,
  order: PropTypes.object
};
