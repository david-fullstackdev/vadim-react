import React, { PropTypes } from 'react';
import { PageHeader, ListGroup, ListGroupItem, Col, Row, FormControl, ControlLabel } from 'react-bootstrap';
import { gettext } from '../../i18n/service.js';
import { connect } from 'react-redux';
import _ from 'lodash';
import getCurLang from '../../businessLogic/getCurLang.js';
import OrderCreationComponent from './components/OrderCreationComponent';
import OrderReturningComponent from './components/OrderReturningComponent';
import OrderUpdatingComponent from './components/OrderUpdatingComponent';
import moment from 'moment';
import LoopbackHttp, { getUserType } from '../../businessLogic/LoopbackHttp.js';
import * as Validation from '../../businessLogic/fieldValidation.js';
import isEmpty from '../../businessLogic/isObjectEmpty.js';

import './OrderActionComponent.scss';


const extractExpectedPickUpTime = (fields, props) => {
  let zero = ':00';
  let orderDate = moment(fields.orderDate).format('MM/DD/YY');
  const expectedPickUpTime = {
    startTime: Date.parse(`${orderDate} ${fields.startPickUpTimePickerVal}${zero}`),
    endTime: Date.parse(`${orderDate} ${fields.endPickUpTimePickerVal}${zero}`)
  };
  if (!fields.isExpressDelivery && (isNaN(expectedPickUpTime.startTime) || isNaN(expectedPickUpTime.endTime))) {
    return props.showMessage({
      message: gettext('SELECT-PICKUP-TIME'),
      level: 'error'
    });
  }
  return expectedPickUpTime;
};

export default class OrderActionComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.isSelectVehicle = false;

    _.bindAll(this, ['renderPickUpPoints', 'createOrder', 'validateUniquePickupPoints', 'createFloatingPropertyInItems', 'updateOrder']);
  }

  renderPickUpPoints(points) {
    return _.map(points, (point) => (
      <option
        key={point.id}
        value={point.id}>
        {point.title}
      </option>
    ));
  }

  validateUniquePickupPoints(items) {
    let valid = true;
    if (_.uniqBy(items, 'pickupPointId').length !== items.length) {
      valid = false;
      this.props.showMessage({
        message: gettext('ITEM-MUST-HAVE-UNIQUE-PICKUP-POINT'),
        level: 'error'
      });
    }
    return valid;
  }

  createFloatingPropertyInItems(orderForUpdate) {

    let items = [];
    _.map(orderForUpdate.items, (item) => {
      let floating = _.find(this.props.pickUpPoints, { id: item.pickupPointId, title: 'Floating' });
      if (floating !== undefined) {
        item.isFloating = true;
        item.pickupPointId = floating;
        items.push(item);
      }
      else {
        item.isFloating = false;
        items.push(item);
      }
    });

    return items;

  }

  createOrder(fields) {
    let order = {
      expectedPickUpTime: extractExpectedPickUpTime(fields, this.props),
      fields: fields.orderDate,
      express: fields.isExpressDelivery,
      vehicleType: fields.vehicleType,
      deliveryTime: Date.parse(`${moment(fields.orderDate).format('MM/DD/YY')} ${fields.endDeliveryTimePickerVal}:00`),
      cashOnDeliveryAmount: fields.cashOnDeliveryAmount,
      cashOnDelivery: fields.cashOnDelivery,
      isOutOfCity: fields.isOutOfCity,
      isFixed: !fields.isFixed
    }

    let recipient = fields.recipientDetails;
    let items = fields.items;

    if (!this.validateUniquePickupPoints(items))
      return false;

    if (order.isOutOfCity && !recipient.outOfCityAddress)
      return this.props.showMessage({
        message: gettext('INSERT-OUT-OF-CITY-INFO'),
        level: 'error'
      });

    if (order.isOutOfCity && !Validation.outOfCityValidation(recipient.outOfCityAddress, this.props.showMessage))
      return false;

    if (order.cashOnDelivery && order.cashOnDelivery < 0)
      return this.props.showMessage({
        message: gettext('ENTER-COD-AMOUNT'),
        level: 'error'
      });

    if (!order.express && order.expectedPickUpTime.startTime > order.expectedPickUpTime.endTime)
      return this.props.showMessage({
        message: gettext('START-TIME-CANNOT-BE-HIGHER-THAN-END'),
        level: 'error'
      });

    if (!order.express && order.expectedPickUpTime.startTime === order.expectedPickUpTime.endTime)
      return this.props.showMessage({
        message: gettext('START-AND-END-TIME-CAN-NOT-BE-EQUILE'),
        level: 'error'
      });

    _.map(items, (item) => {
      if (typeof item.pickupPointId === 'object') {
        item.pickupPointId.companyId = this.props.company.id;
      }
    });


    let orderToCreate = {
      order, items, recipient
    }

    if (!fields.usersDeliveryTime) {
      orderToCreate.order.deliveryTime = undefined;
    }

    if (this.props.orderForReturn) {
      delete orderToCreate.recipient.id;
      _.map(orderToCreate.items, (item) => {
        delete item.id;
      });
    }

    if (fields.usersDeliveryTime && order.deliveryTime <= order.expectedPickUpTime.endTime) {
      return this.props.showMessage({
        message: gettext('DELIVERY-TIME-CANNOT-BE-LOwER-OR-EQUILE'),
        level: 'error'
      });
    }

    if (!Validation.orderDetailsValidation(order, this.props.showMessage))
      return false;
    if (!Validation.itemsValidation(items, this.props.showMessage))
      return false;
    else if (!Validation.recipientDetailsValidation(recipient, this.props.showMessage))
      return false;
    else {
      this.props.startSpinner();
      this.props.createOrder(getUserType(), orderToCreate);
    }
  }

  updateOrder(payload) {
    // delete payload.updatedOrder.order.id;


    if (!payload.updatedOrder.order.deliveryTime) {
      return this.props.showMessage({
        message: gettext('SELECT-DELIVERY-TIME'),
        level: 'error'
      });
    }

    if (payload.updatedOrder.order.deliveryTime <= payload.updatedOrder.order.expectedPickUpTime.endTime) {
      return this.props.showMessage({
        message: gettext('DELIVERY-TIME-CANNOT-BE-LOwER-OR-EQUILE'),
        level: 'error'
      });
    }

    if (!Validation.orderDetailsValidation(payload.updatedOrder.order, this.props.showMessage))
      return false;
    else if (!Validation.recipientDetailsValidation(payload.updatedOrder.recipient, this.props.showMessage))
      return false;
    else if (payload.updatedOrder.order.isOutOfCity && !Validation.outOfCityValidation(payload.updatedOrder.recipient.outOfCityAddress, this.props.showMessage))
      return false;

    this.props.startSpinner();
    delete payload.updatedOrder.order.items;
    delete payload.updatedOrder.order.createdAt;
    delete payload.updatedOrder.order.updatedAt;
    this.props.updateOrder(payload);
    if (getUserType() === 'operator')
      return this.props.router.push('/dashboard');
    if (getUserType() === 'dispatcher')
      return this.props.router.push('/dispatcherDashboard');
    if (getUserType() === 'fleetowner')
      return this.props.router.push('/fleetOwnerDashboard');
  }

  render() {
    let pickUpPoints = _.filter(this.props.pickUpPoints, (point) => {
      if (LoopbackHttp.isDispatcher)
        return point.dispatcherId && this.props.account.id === point.dispatcherId;
      else {
        let inTeam = false;
        _.map(this.props.teams, (team) => {
          if (point.teamId && team.id === point.teamId)
            inTeam = true;
        });
        return inTeam;
      }

    });

    let component;
    if (isEmpty(this.props.orderForReturn) && isEmpty(this.props.orderForUpdate))
      component = (
        <div>
          <PageHeader>{gettext('NEW-ORDER')}</PageHeader>
          <OrderCreationComponent
            vehicles={this.props.vehicles}
            renderPickUpPoints={this.renderPickUpPoints}
            setOfSelectedPickUpPoints={this.props.setOfSelectedPickUpPoints}
            isSelectVehicle={this.isSelectVehicle}
            needComment={this.props.needComment}
            showMessage={this.props.showMessage}
            getRecipient={this.props.getRecipient}
            fetched_recipient={this.props.fetched_recipient}
            createOrder={this.createOrder}
            pickUpPoints={pickUpPoints}
            router={this.props.router}
            account={this.props.account}
            recipients={this.props.recipients} />
        </div>
      );
    if (!isEmpty(this.props.orderForReturn) && isEmpty(this.props.orderForUpdate)) {
      let orderForReturn = this.props.orderForReturn;
      orderForReturn.recipientDetails = _.find(this.props.recipients, { id: orderForReturn.recipientId });
      orderForReturn.selectedItemId = undefined;
      _.map(orderForReturn.items, (item) => {
        item.pickupPointId = {
          contactName: orderForReturn.recipientDetails.firstName,
          phone: orderForReturn.recipientDetails.mobile,
          address: orderForReturn.recipientDetails.deliveryPoint,
          gpsLocation: orderForReturn.recipientDetails.gpsLocation,
          companyId: this.props.company.id
        }
      });
      component = (
        <div>
          <PageHeader>{gettext('RETURN-ORDER')}</PageHeader>
          <OrderReturningComponent
            orderForReturn={orderForReturn}
            vehicles={this.props.vehicles}
            renderPickUpPoints={this.renderPickUpPoints}
            setOfSelectedPickUpPoints={this.props.setOfSelectedPickUpPoints}
            isSelectVehicle={this.isSelectVehicle}
            needComment={this.props.needComment}
            showMessage={this.props.showMessage}
            createOrder={this.createOrder}
            pickUpPoints={pickUpPoints}
            removeOrderForReturn={this.props.removeOrderForReturn} />
        </div>
      );
    }
    if (isEmpty(this.props.orderForReturn) && !isEmpty(this.props.orderForUpdate)) {
      let recipientDetails = _.find(this.props.recipients, { id: this.props.orderForUpdate.recipientId });
      let orderForUpdate = this.props.orderForUpdate;
      if (orderForUpdate.isOutOfCity && !recipientDetails.outOfCityAddress)
        recipientDetails.outOfCityAddress = {};
      orderForUpdate.items = this.createFloatingPropertyInItems(this.props.orderForUpdate);
      component = (
        <div>
          <PageHeader>{gettext('UPDATE-ORDER')}</PageHeader>
          <OrderUpdatingComponent
            orderForUpdate={JSON.parse(JSON.stringify(orderForUpdate))}
            recipientDetails={JSON.parse(JSON.stringify(recipientDetails))}
            vehicles={this.props.vehicles}
            renderPickUpPoints={this.renderPickUpPoints}
            setOfSelectedPickUpPoints={this.props.setOfSelectedPickUpPoints}
            isSelectVehicle={this.isSelectVehicle}
            needComment={this.props.needComment}
            showMessage={this.props.showMessage}
            createOrder={this.createOrder}
            pickUpPoints={orderForUpdate.dispatcherId ? _(this.props.pickUpPoints).filter({ dispatcherId: orderForUpdate.dispatcherId }).toArray().value() : pickUpPoints}
            company={this.props.company}
            updateOrder={this.updateOrder}
            router={this.props.router}
            removeOrderForUpdate={this.props.removeOrderForUpdate} />
        </div>
      );
    }
    return (
      <div className="OrderActionComponent">
        {component}
      </div>
    );
  }
}




OrderActionComponent.propTypes = {

};
