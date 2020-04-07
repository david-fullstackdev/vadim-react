import React, {PropTypes} from 'react';
import { Form, FormControl, Panel, Button, Col, Modal, Glyphicon,Tooltip, OverlayTrigger } from 'react-bootstrap';
import {parseExpectedPickUpTime} from '../../businessLogic/expectedPickUpTimeParser.js';
import {formatTime} from '../../businessLogic/deliveryTimeFormatter.js';
import orderedTimeFormatter from '../../businessLogic/orderedTimeFormatter.js';
import _ from 'lodash';
import { gettext, formatRequiredVehicleType, getStatus } from '../../i18n/service.js';
import { formatCashOn } from '../../businessLogic/formatCashOnDelivery.js';
import getCurLang from '../../businessLogic/getCurLang.js';
import LoopbackHttp from '../../businessLogic/LoopbackHttp.js';
import moment from 'moment';


var lan = getCurLang();

export default function DispatcherOrderDetailsComponent({order,deleteOrder, pickUpPoints, vehicles, users, recipients, groupages, goToCurrentOrders, cancelOrder,returnOrder, updateOrder}) {
  const groupage = order.groupageId ? _.find(groupages, {id: order.groupageId}) : null;
  const assignedOperator = groupage ? _.find(users, {id: groupage.operatorId}) : null;
  const operatorName = assignedOperator ? `${assignedOperator.firstName}` : gettext('N-A');
  const operatorPhone = assignedOperator ? assignedOperator.phone : gettext('N-A');
  const recipient = _.find(recipients, {id: order.recipientId});
  const recipientName = recipient ? `${recipient.firstName}` : gettext('CANNOT-GET-RECIPIENT');
  const dispatcher = _.find(users, {id: order.dispatcherId}) || {};
  const requiredVehicle = _.find(vehicles, {size: +order.vehicleType}) || {};
  const platform = (order.createdByPlatformId)
    ? _.find(users, {id: order.createdByPlatformId})
    : undefined;

  const DeleteConfirm = React.createClass({
    getInitialState() {
      return { showModal: false };
    },

    close() {
      this.setState({ showModal: false });
    },

    open() {
      this.setState({ showModal: true });
    },

    render() {
      return (
        <div className="inline_block">
          { this.props.action==='delete' && !LoopbackHttp.isDispatcher
            ?<Button bsStyle="warning" onClick={this.open}>{gettext('DELETE')} </Button>
            :''
          }
          { this.props.action==='cancel' && this.props.order.orderStatus!=='delivered' && this.props.order.orderStatus!=='canceled'
            ?<Button bsStyle="danger" onClick={this.open}>{gettext('CANCEL-ORDER')} </Button>
            :''
          }
          <Modal show={this.state.showModal} onHide={this.close} dir={getCurLang()==='ar'?'rtl':'ltr'}>
            <Modal.Body>
              { this.props.action==='delete'
                ?<p>{gettext('DELETE-ORDER-CONFIRMATION')}</p>
                :''
              }
              { this.props.action==='cancel'
                ?<p>{gettext('DELETE-ORDER-CONFIRMATION')}</p>
                :''
              }
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>{this.props.action!=='update'?gettext('NO'):gettext('CANCEL')}</Button>
              { this.props.action==='delete'
                ?<Button onClick={() => { deleteOrder(this.props.order); this.close();} }  bsStyle="danger">{gettext('YES')}</Button>
                :''
              }
              { this.props.action==='cancel'
                ?<Button onClick={() => { cancelOrder(this.props.order); this.close();} }  bsStyle="danger">{gettext('YES')}</Button>
                :''
              }
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
  });

  const tooltipOldCost = (oldCosts) => (
    <Tooltip id="tooltip">
      { _.map(oldCosts, (cost) => {
        return (
          <div>
            <strong>{moment(cost.time).zone('+0300').format('lll')} - </strong>
            <strong>{cost.amount} SAR</strong>
          </div>
        );
      }) }
     </Tooltip>
  );
  const getDeliveryTime = (order) => {
    if(order.express)
      return <strong className="express">{gettext('EXPRESS-DELIVERY')+'!'}</strong>;
    if(order.isOutOfCity)
      return <strong className="isOutOfCity">{gettext('OUT-OF-CITY')+'!'}</strong>;
    else
      return formatTime(order.deliveryTime);
  }

  const getDeliveryPoint = (recipient) => {
    return (
      <div>
        <strong>{gettext('COUNTRY')}: </strong>{recipient.outOfCityAddress.country}<br/>
        <strong>{gettext('CITY')}: </strong>{recipient.outOfCityAddress.city}<br/>
        <strong>{gettext('ADDRESS-LINE-FIRST')}: </strong>{recipient.outOfCityAddress.addressFirst}<br/>
        <strong>{gettext('ADDRESS-LINE-SECOND')}: </strong>{recipient.outOfCityAddress.addressSecond}<br/>
        <strong>{gettext('ZIP-CODE')}: </strong>{recipient.outOfCityAddress.zipCode}<br/>
      </div>
    )
  }

  const footer =  (
    <footer className="orderDetailsFooter">
      <span>
        <Button bsStyle="success" onClick={goToCurrentOrders}>{gettext('BACK-TO-CURRENT-ORDERS')}</Button>
        { LoopbackHttp.isAdministrator?
          <DeleteConfirm action="delete" order={order}/> :''
        }

        <DeleteConfirm action="cancel" order={order}/>

        { order.orderStatus !== 'delivered' && order.orderStatus !== 'canceled'?
          <Button onClick={(e) => updateOrder(e, order, pickUpPoints)}  bsStyle="primary">{gettext('UPDATE')}</Button> : ''
        }

        { order.orderStatus === 'delivered'?
          <Button onClick={(e) => returnOrder(e, order)}  bsStyle="danger">{gettext('RETURN')}</Button>: ''
        }
      </span>
    </footer>
  );
  return (
    <div className={(lan==='ar')?'orderDetails formReverse':'orderDetails'} dir={(lan==='ar')?'rtl':'ltr'}>

        <Col sm={6} >
          <Panel header={
              <strong>
                {gettext('ORDER-#').toUpperCase()} {order.id.slice(order.id.length - 5, order.id.length)}
              </strong>
            }>
            {order.items.map((item) => {

              const point = pickUpPoints[item.pickupPointId] ?
                pickUpPoints[item.pickupPointId] :
                gettext('CANNOT-GET-PICKUP-POINT');
              return (
                <span key={item.id}>
                  <h3>{gettext('ITEM').toUpperCase()} {item.id.slice(item.id.length - 5, item.id.length)}</h3><br/>
                  <strong>{gettext('PICKUP-POINT')}: </strong>{point.address}<br/>
                  { point.contactName?
                  <div><strong>{gettext('PICKUP-POINT-CONTACT')}: </strong>{point.contactName}</div>
                  : '' }
                  { point.phone?
                  <div><strong>{gettext('PHONE')}: </strong>{point.phone}</div>
                  : '' }<br/>
                  <strong>{gettext('PACKING-LIST')}: </strong><pre>{item.packingList}</pre><br/>
                  { item.comment
                    ?<div><strong>{gettext('COMMENT')}: </strong><pre>{item.comment}</pre><br/></div>
                    : ''
                  }
                </span>
              );
            })}
            <strong>{gettext('PICKUP-TIME')}: </strong>{parseExpectedPickUpTime(order.expectedPickUpTime)}<br/>
            <strong>{gettext('DELIVERY-TIME')}: </strong>{getDeliveryTime(order)}<br/>
            <strong>{gettext('ORDER.ORDERED')}: </strong>{orderedTimeFormatter(order.orderCreatedTime)}<br/>
            <strong>{gettext('DELIVERY-POINT')}: </strong>{order.isOutOfCity?'':recipient.deliveryPoint}<br/>
            {
              order.isOutOfCity?
                getDeliveryPoint(recipient) : ''
            }
            <strong>{gettext('REQUIRED-VEHICLE')}: </strong>{ formatRequiredVehicleType(requiredVehicle.type) }<br/>
            <strong>{gettext('DELIVERY-COST')}: </strong>{order.deliveryCommission || gettext('CANNOT-GET-DELIVERY-COMMISSION')} SAR<br/>
            <strong>{gettext('CASH-ON-DELIVERY')}: </strong>{formatCashOn(order.cashOnDelivery, order.cashOnDeliveryAmount)} SAR
              { order.oldCosts.length > 0
                ?<OverlayTrigger placement="top" overlay={tooltipOldCost(order.oldCosts)}><Glyphicon glyph="info-sign" /></OverlayTrigger>
                :''
              }
              <br/>
          </Panel>
        </Col>

        <Col sm={6}>
          <Panel header={
              <strong>
                {getStatus(order.orderStatus)}
              </strong>
            }>
            <Col sm={6}>
              <strong>{gettext('OPERATOR')}: </strong>{operatorName}<br/>
            </Col>
            <Col sm={6}>
              <strong>{gettext('OPERATOR.OPERATOR-PHONE')}: </strong>{operatorPhone}<br/>
            </Col>
            <h3>{gettext('RECIPIENT')}</h3>
            <strong>{gettext('NAME')}: </strong>{recipientName}<br/>
            <strong>{gettext('MOBILE')}: </strong>{recipient.mobile}<br/>

            <h3>{gettext('DISPATCHER')}</h3>
            {platform ?
              <div><strong>{gettext('SUBMITTED-BY-PLATFORM')+ ': '}</strong>{platform.name}<br/></div>
              : ''
            }
            <strong>{gettext('DISPATCHER.SHOP-NAME')}: </strong>{dispatcher.shopName}<br/>
            <strong>{gettext('NAME')}: </strong>{`${dispatcher.firstName}`}<br/>
            <strong>{gettext('MOBILE')}: </strong>{dispatcher.mobile}<br/>
            <strong>{gettext('PHONE')}: </strong>{dispatcher.phone}<br/>
          </Panel>
        </Col>
        {footer}
    </div>
  );
}




DispatcherOrderDetailsComponent.propTypes = {
  groupages: PropTypes.array,
  order: PropTypes.object,
  pickUpPoints: PropTypes.object,
  recipients: PropTypes.array,
  users: PropTypes.array,
  goToCurrentOrders: PropTypes.func,
  cancelOrder: PropTypes.func,
  vehicles: PropTypes.array.isRequired,
  deleteOrder: PropTypes.func,
  updateOrder: PropTypes.func,
  returnOrder: PropTypes.func,
  action: PropTypes.string
};
