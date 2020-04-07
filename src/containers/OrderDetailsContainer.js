import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoopbackHttp, { getUserType } from '../businessLogic/LoopbackHttp.js';
import { PageHeader } from 'react-bootstrap';
import * as actions from '../actions/dashboardPageActions';
import * as appActions from '../actions/appActions';
import * as adminActions from '../actions/adminActions';
import DispatcherOrderDetailsComponent from '../components/orderDetails/OrderDetailsComponent';
import { gettext } from '../i18n/service';
import objectAssign from 'object-assign';
import _ from 'lodash';
import { getCurrendDashboardUrl } from '../businessLogic/getCurrendDashboardUrl';


export class DashboardContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.pickUpPoints = props.pickUpPoints;

    this.goToCurrentOrders = this.goToCurrentOrders.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.orderCanceled = props.orderCanceled;
    this.isDispatcher = LoopbackHttp.isDispatcher;
    this.deleteOrder = this.deleteOrder.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.returnOrder = this.returnOrder.bind(this);
    this.getFloatingPickupPoint = this.getFloatingPickupPoint.bind(this);

    if (LoopbackHttp.isDispatcher) {
      var order = props.orders.filter((item) => item.id === props.params.orderId)[0];
      _.map(order.items, (item) => {
        this.props.appActions.getPickUpPoint(item.pickupPointId);
      });
    }
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.orderCanceled !== this.orderCanceled) {
      this.orderCanceled = nextProps.orderCanceled;
      //todo change this to fetch only one order by id
      // this.props.appActions.getOrders();
      this.props.appActions.endSpinner();
    }
    if (LoopbackHttp.isDispatcher && nextProps.floatingPickUpPoint[0])
      this.pickUpPoints[nextProps.floatingPickUpPoint[0].id] = nextProps.floatingPickUpPoint[0];
  }

  componentDidMount() {

  }

  getFloatingPickupPoint(id) {

  }

  setFloatingPoint(point) {
  }

  returnOrder(e, order) {
    e.preventDefault();
    e.stopPropagation();
    this.props.appActions.setOrderForReturn(order);
    this.props.router.push('/returnFleetOrder');
  }

  goToCurrentOrders() {
    // this.props.history.goBack();
    if (getUserType() === 'operator')
      return this.props.router.push(getCurrendDashboardUrl(this.props.account));
    if (getUserType() === 'dispatcher')
      return this.props.router.push('/dispatcherDashboard');
    if (getUserType() === 'fleetowner')
      return this.props.router.push(getCurrendDashboardUrl(this.props.account));
  }

  deleteOrder(order) {
    if (LoopbackHttp.isAdministrator) {

      this.props.adminActions.deleteOrder(order);
      _.pull(this.props.orders, order);

      this.props.showMessage({
        message: order.id + ' ' + gettext('HAS-BEEN-DELETED'),
        level: 'success'
      });
      this.props.router.push('/admindashboard');
      this.forceUpdate();
    }
  }

  cancelOrder(order) {
    if (order.orderStatus === 'canceled') {
      return this.props.showMessage({
        message: gettext('ORDER-CANNOT-BE-CANCELED.CANCELED-ALREADY'),
        level: 'error'
      });
    }
    if (order.orderStatus === 'includedToGroupage') {
      return this.props.showMessage({
        message: gettext('ORDER-CANNOT-BE-CANCELED.IN-GROUPAGE-ALREADY'),
        level: 'error'
      });
    }
    if (order.orderStatus !== 'new') {
      return this.props.showMessage({
        message: gettext('ORDER-CANNOT-BE-CANCELED'),
        level: 'error'
      });
    }
    this.props.showMessage({
      message: order.id + ' ' + gettext('HAS-BEEN-CANCELED'),
      level: 'success'
    });
    this.props.appActions.startSpinner();
    this.props.appActions.updateLocalOrder(order, { orderStatus: 'canceled' });
    this.props.actions.cancelOrder(order);
  }

  updateOrder(e, order, pickUpPoints) {
    e.preventDefault();
    e.stopPropagation();
    this.props.appActions.setOrderForUpdate(order);
    this.props.appActions.setPointsForUpdate(pickUpPoints);
    this.props.router.push('/updateOrder');
  }

  render() {
    console.log('-------------------------------------------------------');
    console.log(this);
    if (!this.props.orders.length) {
      return false;
    }
    const order = this.props.orders.filter((item) => item.id === this.props.params.orderId)[0];
    if (!order) {
      return false;
    }

    const orderDetails =
      (
        <DispatcherOrderDetailsComponent
          groupages={this.props.groupages}
          order={order}
          pickUpPoints={this.pickUpPoints}
          users={this.props.users}
          recipients={this.props.recipients}
          goToCurrentOrders={this.goToCurrentOrders}
          cancelOrder={this.cancelOrder}
          vehicles={this.props.vehicles}
          isOperator={!this.isDispatcher}
          deleteOrder={this.deleteOrder}
          updateOrder={this.updateOrder}
          returnOrder={this.returnOrder}
          company={this.props.company}
        />
      );
    return (
      <div className="orderDetailsPage container">
        <PageHeader>{gettext('ORDER.ORDER-DETAILS')}</PageHeader>
        {orderDetails}
      </div>
    );
  }
}




DashboardContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  adminActions: PropTypes.object.isRequired,
  appActions: PropTypes.object.isRequired,
  history: PropTypes.object,
  groupages: PropTypes.array,
  orders: PropTypes.array,
  pickUpPoints: PropTypes.object,
  recipients: PropTypes.array,
  users: PropTypes.array,
  params: PropTypes.object,
  orderCanceled: PropTypes.number,
  showMessage: PropTypes.func.isRequired,
  vehicles: PropTypes.array.isRequired
};

function mapStateToProps(state) {
  return {
    groupages: state.appReducer.groupages,
    orders: state.appReducer.orders,
    pickUpPoints: state.appReducer.pickUpPoints,
    recipients: state.appReducer.recipients,
    users: state.appReducer.users,
    orderCanceled: state.dashboardPageReducer.orderCanceled,
    vehicles: state.appReducer.vehicles,
    floatingPickUpPoint: state.appReducer.floatingPickUpPoint,
    company: state.appReducer.company,
    account: state.appReducer.account
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    appActions: bindActionCreators(appActions, dispatch),
    adminActions: bindActionCreators(adminActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardContainer);
