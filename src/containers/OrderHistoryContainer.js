import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {OperatorOrdersHistoryListComponent} from '../components/orders/OperatorOrdersHistoryListComponent.js';
import * as appActions from '../actions/appActions';
import _ from 'lodash';


const isOrderGroupedInAnyGroupage = (order, groupages) => {
  if (!groupages.length || !order.groupageId) {
    return false;
  }
  return groupages.some((groupage) => groupage.id === order.groupageId);
};


export class OrderHistoryContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onOrderDetailLinkClick = this.onOrderDetailLinkClick.bind(this);
    this.saveCurrentPageOrderHistoryList = this.saveCurrentPageOrderHistoryList.bind(this);
  }

  saveCurrentPageOrderHistoryList(pageNumber) {
    this.props.appActions.saveCurrentPageOrderHistoryList(pageNumber);
    this.forceUpdate();
  }

  onOrderDetailLinkClick(order, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isOrderGroupedInAnyGroupage(order, this.props.groupages)) {
      return this.props.router.push(`/groupageDetails/${order.groupageId}`);
    } else {
      return this.props.router.push(`/orderDetails/${order.id}`);
    }
  }

  render() {
    const ordersForTable = _.filter(this.props.orders, (order) => {
      if (!order || !order.orderStatus) {
        return false;
      }
      return order.orderStatus.toLowerCase() === 'canceled' || order.orderStatus.toLowerCase() === 'delivered'
                || order.orderStatus.toLowerCase() === 'returned';
    });
    return (
      <div>
        <OperatorOrdersHistoryListComponent
          orders={ordersForTable}
          groupages={this.props.groupages}
          users={this.props.users}
          vehicles={this.props.vehicles}
          showOrderDetails={this.onOrderDetailLinkClick}
          setOfItemIdsWithShowInfo={this.props.setOfItemIdsWithShowInfo}
          orderHistoryPageNumber={this.props.orderHistoryPageNumber}
          saveCurrentPageOrderHistoryList={this.saveCurrentPageOrderHistoryList}
        />
      </div>
    );
  }
}




OrderHistoryContainer.propTypes = {
  appActions: PropTypes.object.isRequired,
  pickUpPoints: PropTypes.object,
  orders: PropTypes.array,
  groupages: PropTypes.array,
  history: PropTypes.object,
  users: PropTypes.array,
  vehicles: PropTypes.array,
  setOfItemIdsWithShowInfo: PropTypes.instanceOf(Set),
  orderHistoryPageNumber: PropTypes.number
};

function mapStateToProps(state) {
  return {
    orders: state.appReducer.orders,
    pickUpPoints: state.appReducer.pickUpPoints,
    groupages: state.appReducer.groupages,
    users: state.appReducer.users,
    vehicles: state.appReducer.vehicles,
    setOfItemIdsWithShowInfo: state.dashboardPageReducer.setOfItemIdsWithShowInfo,
    orderHistoryPageNumber: state.appReducer.orderHistoryPageNumber,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    appActions: bindActionCreators(appActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderHistoryContainer);
