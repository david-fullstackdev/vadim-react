import React, { PropTypes } from 'react';
import './OrdersExpander.scss';
import { Collapse } from 'react-collapse';
import { Order } from './order/Order';

import { DragSource } from 'react-dnd';
import { ItemTypes } from '../../constants/actionTypes';
import { createDragPreview } from 'react-dnd-text-dragpreview';
import { Scrollbars } from 'react-custom-scrollbars';

var dragPreviewStyle = {
    backgroundColor: 'rgb(68, 67, 67)',
    color: 'white',
    fontSize: 15,
    paddingTop: 4,
    paddingRight: 7,
    paddingBottom: 6,
    paddingLeft: 7
}

const orderSource = {
    beginDrag(props) {
        return {
            f: '',
        };
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    };
}

function formatDragMessage(numOrders) {
    const noun = numOrders === 1 ? 'order' : 'orders'
    return `Moving ${numOrders} ${noun}`
}

export class OrdersGroup extends React.Component {
    componentDidMount() {
        this.dragPreview = createDragPreview('Dragging', dragPreviewStyle)
        this.props.connectDragPreview(this.dragPreview);
    }

    componentDidUpdate(prevProps) {
        this.dragPreview = createDragPreview('Dragging', dragPreviewStyle, this.dragPreview)
    }

    render() {
        const groupHeight = 375;
        const { isOpen, orders, toggle, title, orderComponent, recipients, pickUpPoints, drivers } = this.props;
        const ordersCount = +orders.length;
        const text = ordersCount + ' ' + title;
        const icon = isOpen ? 'chevron-down' : 'menu-right';
        return this.props.connectDragSource(
            <div className="sidebar-orders-expander">
                <div className="expand-button" onClick={toggle}>
                    <div className="media-body">
                        {text}
                    </div>
                    <div className="media-right">
                        <span className={"glyphicon glyphicon-" + icon}></span>
                    </div>
                </div>
                {orders.length > 5 ? this.renderScrolled(orders, recipients, pickUpPoints, drivers, isOpen) : this.renderPlain(orders, recipients, pickUpPoints, drivers, isOpen)}
            </div>
        );
    }

    renderOrder(order, recipients, pickUpPoints, drivers) {
        return <Order order={order} key={order.id} startDraggingOrder={this.props.startDraggingOrder} pickUpPoints={pickUpPoints} 
                    recipients={recipients} drivers={drivers}></Order>;
    }

    renderPlain(orders, recipients, pickUpPoints, drivers, isOpen) {
        return (
            <Collapse isOpened={isOpen}>
                {orders.map(order => this.renderOrder(order, recipients, pickUpPoints, drivers))}
            </Collapse>
        );
    }

    renderScrolled(orders, recipients, pickUpPoints, drivers, isOpen) {
        return (
            <Collapse isOpened={isOpen} fixedHeight={375}>
                <Scrollbars style={{ height: (377) + 'px' }} trackHorizontal={false}>
                    {orders.map(order => this.renderOrder(order, recipients, pickUpPoints, drivers))}
                </Scrollbars>
            </Collapse>
        );
    }
}

OrdersGroup.propTypes = {
    title: PropTypes.string,
    orders: PropTypes.array,
    recipients: PropTypes.array,
    pickUpPoints: PropTypes.array,
    drivers: PropTypes.array
};

export default DragSource(ItemTypes.ORDER, orderSource, collect)(OrdersGroup);
