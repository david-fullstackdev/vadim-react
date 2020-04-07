import React, { PropTypes } from 'react';
import { PageHeader, Jumbotron, ControlLabel, Col, Row, Button } from 'react-bootstrap';
import { gettext } from '../../i18n/service.js';
import { connect } from 'react-redux';
import _ from 'lodash';
import getCurLang from '../../businessLogic/getCurLang.js';
import moment from 'moment';
import { parseExpectedPickUpTimeOnlyTime } from '../../businessLogic/expectedPickUpTimeParser.js';
import { formatTime } from '../../businessLogic/deliveryTimeFormatter.js';
import getOrderType from '../../businessLogic/getOrderType.js';
import { formatCashOn } from '../../businessLogic/formatCashOnDelivery.js';
import formatCamelCase from '../../businessLogic/formatCamelCase.js';
import setOrderStatusColor from '../../businessLogic/setOrderStatusColor.js';
import CancelOrderModal from '../modals/CancelOrderModal.js';
import LoopbackHttp from '../../businessLogic/LoopbackHttp.js';

import './NewOrderDetailsComponent.scss';

export default class OrderDetailsComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.recipient = _.find(props.recipients, { id: props.order.recipientId });
    _.bindAll(this, ['renderOrderDetails', 'getVehicle', 'renderRecipientDetails', 'renderItems', 'renderCreatedByDetails', 'renderDriverDetails']);
  }

  getVehicle(type) {
    return _.find(this.props.vehicles, { size: type });
  }


  renderFooter() {
    return (
      <footer className="orderDetailsFooter">
        <span>
          <Button bsStyle="success" onClick={() => this.props.goToCurrentOrders()}>{gettext('BACK-TO-CURRENT-ORDERS')}</Button>
          {
            this.props.order.orderStatus !== 'canceled' && this.props.order.orderStatus !== 'delivered' ?
              <CancelOrderModal cancelOrder={this.props.cancelOrder} order={this.props.order} /> : ''
          }

          {(LoopbackHttp.isDispatcher && (this.props.order.orderStatus !== 'delivered' && this.props.order.orderStatus !== 'returned' && this.props.order.orderStatus !== 'canceled')) || !LoopbackHttp.isDispatcher ?
            <Button onClick={(e) => this.props.updateOrder(e, this.props.order, this.props.pickUpPoints)} bsStyle="primary">{gettext('UPDATE')}</Button> : ''
          }

          {this.props.order.orderStatus === 'delivered' ?
            <Button onClick={(e) => this.props.returnOrder(e, this.props.order)} bsStyle="danger">{gettext('RETURN')}</Button> : ''
          }
        </span>
      </footer>
    );
  }

  renderDriverDetails(driver) {
    return (
      <Row>
        <div className="user_data center_div">
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('NAME')}</h5></ControlLabel>
            </Col>
            <Col sm={6}>
              <label><h5>{driver.firstName}</h5></label>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('PHONE')}</h5></ControlLabel>
            </Col>
            <Col sm={6}>
              <label><h5>{driver.mobile}</h5></label>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('DRIVER-COMMISSION')}</h5></ControlLabel>
            </Col>
            <Col sm={6}>
              <label><h5>{driver.driverCommissionPercent}%</h5></label>
            </Col>
          </Row>
        </div>
      </Row>
    );
  }

  renderOrderDetails() {
    const getDeliveryPoint = (recipient) => {
      if (!recipient.outOfCityAddress)
        return <span>{gettext('CANT-GET-DELIVERY-POINT')} </span>
      return (
        <span>
          <span>{gettext('COUNTRY')}: </span>{recipient.outOfCityAddress.country}<br />
          <span>{gettext('CITY')}: </span>{recipient.outOfCityAddress.city}<br />
          <span>{gettext('ADDRESS-LINE-FIRST')}: </span>{recipient.outOfCityAddress.addressFirst}<br />
          <span>{gettext('ADDRESS-LINE-SECOND')}: </span>{recipient.outOfCityAddress.addressSecond}<br />
          <span>{gettext('ZIP-CODE')}: </span>{recipient.outOfCityAddress.zipCode}<br />
        </span>
      )
    }

    return (
      <Row>
        <div className="user_data center_div">
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('DATE') + ' '}{moment(this.props.order.createdAt).format('L')}</h5></ControlLabel>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('STATUS')}</h5></ControlLabel>
            </Col>
            <Col sm={6}>
              <label style={setOrderStatusColor(this.props.order.orderStatus)}><h5>{formatCamelCase(this.props.order.orderStatus)}</h5></label>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('PICKUP-TIME')}</h5></ControlLabel>
            </Col>
            <Col sm={6}>
              <label><h5>{parseExpectedPickUpTimeOnlyTime(this.props.order.expectedPickUpTime)}  {moment(+this.props.order.expectedPickUpTime.endTime).format('DD/MM')}</h5></label>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('DELIVERY-TIME')}</h5></ControlLabel>
            </Col>
            <Col sm={6}>
              <label><h5>{formatTime(this.props.order.deliveryTime)}</h5></label>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('ORDER-TYPE')}</h5></ControlLabel>
            </Col>
            <Col sm={6}>
              <label><h5>{getOrderType(this.props.order)}</h5></label>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('VEHICLE')}</h5></ControlLabel>
            </Col>
            <Col sm={6}>
              <label><h5>{formatCamelCase(this.getVehicle(parseInt(this.props.order.vehicleType)).type)}</h5></label>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('DELIVER-TO')}</h5></ControlLabel>
            </Col>
            <Col sm={6}>
              {
                this.props.order.isOutOfCity
                  ? getDeliveryPoint(this.recipient)
                  : <label><h5>{this.recipient.deliveryPoint}</h5></label>
              }
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('ITEMS')}</h5></ControlLabel>
            </Col>
            <Col sm={6}>
              <label><h5>{this.props.order.items.length}</h5></label>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('CASH-ON-DELIVERY')}</h5></ControlLabel>
            </Col>
            <Col sm={6}>
              <label><h5>{formatCashOn(this.props.order.cashOnDelivery, this.props.order.cashOnDeliveryAmount)}</h5></label>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('ORDER-PRICE-TYPE')}</h5></ControlLabel>
            </Col>
            <Col sm={6}>
              <label><h5>{this.props.order.isFixed ? gettext('FIXED-PRICE') : gettext('DISTANCE-BASED')}</h5></label>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('TOTAL')}</h5></ControlLabel>
            </Col>
            <Col sm={6}>
              <label><h5>{this.props.order.deliveryCommission || gettext('CANNOT-GET-DELIVERY-COMMISSION')}</h5></label>
            </Col>
          </Row>
        </div>
      </Row>
    );
  }

  renderRecipientDetails() {
    return (
      <Row>
        <div className="user_data center_div">
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('NAME')}</h5></ControlLabel>
            </Col>
            <Col sm={6}>
              <label><h5>{this.recipient.firstName}</h5></label>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('PHONE')}</h5></ControlLabel>
            </Col>
            <Col sm={6}>
              <label><h5>{this.recipient.mobile}</h5></label>
            </Col>
          </Row>
        </div>
      </Row>
    );
  }

  renderItems() {
    return this.props.order.items.map((item) => {
      const point = this.props.pickUpPoints[item.pickupPointId] ?
        this.props.pickUpPoints[item.pickupPointId] :
        gettext('CANNOT-GET-PICKUP-POINT');
      return (
        <div>
          <div className="botom_line" />
          <div className="text_align_center margin_bottom_em">
            <h3>{gettext('ITEM#')} {item.id.slice(item.id.length - 5, item.id.length)}</h3>
          </div>
          <Row>
            <div className="user_data center_div">
              <Row>
                <Col sm={6}>
                  <ControlLabel><h5>{gettext('PICKUP-POINT')}</h5></ControlLabel>
                </Col>
                <Col sm={6}>
                  <ControlLabel><h5>{point.address}</h5></ControlLabel><br />
                  {point.contactName ?
                    <ControlLabel><h5>{point.contactName}</h5></ControlLabel>
                    : ''}
                  <br />
                  {point.phone ?
                    <ControlLabel><h5>{point.phone}</h5></ControlLabel>
                    : ''}
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <ControlLabel><h5>{gettext('PACKING-LIST')}</h5></ControlLabel>
                </Col>
                <Col sm={6}>
                  <ControlLabel><h5>{item.packingList}</h5></ControlLabel>
                </Col>
              </Row>
              {item.comment
                ? <Row>
                  <Col sm={6}>
                    <ControlLabel><h5>{gettext('COMMENT')}</h5></ControlLabel>
                  </Col>
                  <Col sm={6}>
                    <ControlLabel><h5>{item.comment}</h5></ControlLabel>
                  </Col>
                </Row>
                : ''
              }
            </div>
          </Row>
        </div>
      );
    })
  }

  renderCreatedByDetails() {
    return (
      <Row>
        <div className="user_data center_div">
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('COMPANY-NAME')}</h5></ControlLabel>
            </Col>
            <Col sm={6}>
              <label><h5>{this.props.order.createdBy.companyName}</h5></label>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('NAME')}</h5></ControlLabel>
            </Col>
            <Col sm={6}>
              <label><h5>{this.props.order.createdBy.name}</h5></label>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <ControlLabel><h5>{gettext('PHONE')}</h5></ControlLabel>
            </Col>
            <Col sm={6}>
              <label><h5>{this.props.order.createdBy.phone}</h5></label>
            </Col>
          </Row>
        </div>
      </Row>
    );
  }

  render() {
    const driver = _.find(this.props.users, { role: 'driver', id: this.props.order.driverId });
    return (
      <div className="OrderDetailsComponent">
        <div className="text_align_center margin_bottom_em">
          <h3>{gettext('ORDER#')} {this.props.order.id.slice(this.props.order.id.length - 5, this.props.order.id.length)}</h3>
        </div>
        {this.renderOrderDetails()}
        <div className="botom_line" />

        {!LoopbackHttp.isDispatcher
          ? <div className="text_align_center margin_bottom_em">
            <h3>{gettext('CREATED-BY')}</h3>
          </div> : ''}
        {!LoopbackHttp.isDispatcher ? this.renderCreatedByDetails() : ''}
        {!LoopbackHttp.isDispatcher ? <div className="botom_line" /> : ''}

        <div className="text_align_center margin_bottom_em">
          <h3>{gettext('RECIPIENT')}</h3>
        </div>
        {this.renderRecipientDetails()}

        {driver ?
          <div className="botom_line" /> : ''
        }

        {driver ?
          <div className="text_align_center margin_bottom_em">
            <h3>{gettext('DRIVER-INFO')}</h3>
          </div> : ''
        }
        {driver ?
          this.renderDriverDetails(driver) : ''
        }

        {this.renderItems()}
        {this.renderFooter()}
      </div>
    );
  }
}




OrderDetailsComponent.propTypes = {

};
