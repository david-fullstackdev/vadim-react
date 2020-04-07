import React, { PropTypes } from 'react';
import './orderIcons';
import './Order.scss';
import { Link } from 'react-router';
import * as orderFunctions from './orderFunctions';
import { OrderTimer } from './OrderTimer';
import { OrderPin } from './OrderPin';
import { OrderIdIcon } from './OrderIdIcon';
import { gettext } from '../../../i18n/service.js';
import OrderDetailModal from '../../modals/OrderDetailModal';

export class Order extends React.Component {
  render() {
    const order = this.props.order;

    const pickUpPoints = this.props.pickUpPoints;
    const recipients = this.props.recipients;
    const drivers = this.props.drivers;
    const driver = _.find(this.props.drivers, {id: order.driverId});
    let address = '---';
    
    if (order.items.length > 0) {
      if (order.orderStatus == 'new') {
        address = _.find(pickUpPoints, {id: order.items[0].pickupPointId}).address;
      } else {
        address = _.find(recipients, { id: order.recipientId }).deliveryPoint;
      }
    }
    return (
      <div className="sidebar-order" onDragLeave={() => {this.props.startDraggingOrder(order)}}>
        <div>
          <div className="media-left">
            <OrderDetailModal order={order}/>
            <Link to={`/orderDetails/${order.id}`}><img src="./side_menu.svg" /></Link>
          </div>
          <div className="media-body">
            <OrderIdIcon order={order} />
            &nbsp;
            <span>#{orderFunctions.idDisplay(order)}</span>
            &nbsp;
            <img src='./side_watch.svg' />
            <OrderTimer order={order} />
            <div className="float-right">
              <img className='vehicle-icon' src={`./${orderFunctions.vehicleIcon(order)}.png`} />
            </div>
          </div>
        </div>
        <div>
          <div className="media-left">
            <OrderPin order={order} />
          </div>
          <div className="media-body">
            <span className="delivery-point">{address}</span>
          </div>
        </div>
        <div>
          <div className="media-left">
            <img src={`side_${orderFunctions.deliveryIcon(order)}.svg`} width="14" title={orderFunctions.deliveryIconTitle(order)}/>
          </div>
          <div className="media-body">  
            <span>{orderFunctions.deliveryTime(order)}</span>
            &nbsp;
            <span>{driver && order.orderStatus!='new' ? (driver.firstName + ' ' + (driver.lastName?driver.lastName: '')):''}</span>
            <div className="float-right">
              <span className="item_count_label" title={gettext('Number of Pickup Points for this order')}>
                <img src={`./side_${orderFunctions.bagIcon(order)}.svg`} /><span>{order.items.length}</span>
              </span>
              {order.cacheOnDelivery && <img src="./side_cacheOnDelivery.svg" title={"Driver must collect "+order.cashOnDeliveryAmount+" from recipient upon delivery."}/>}
            </div>
          </div>
        </div>
      </div >
    );
  }
}
