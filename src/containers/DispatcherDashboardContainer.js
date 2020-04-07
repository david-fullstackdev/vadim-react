import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/dashboardPageActions';
import * as appActions from '../actions/appActions';
import {DispatcherOrdersListComponent} from '../components/orders/DispatcherOrdersListComponent';
import {Button, PageHeader} from 'react-bootstrap';
import { gettext } from '../i18n/service';
import getCurLang from '../businessLogic/getCurLang.js';

export class DispatcherDashboardContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onDateFilterChange = this.onDateFilterChange.bind(this);
    this.onOrderDetailLinkClick = this.onOrderDetailLinkClick.bind(this);
    this.createNewOrder = this.createNewOrder.bind(this);
    this.updateLastLogin = this.updateLastLogin.bind(this);

    this.iteration = 0;
  }

  onDateFilterChange(e) {
    this.props.actions.setDateFilter(e ? new Date(+e).toDateString() : '');
  }

  onOrderDetailLinkClick(order) {
    this.props.router.push(`/orderDetails/${order.id}`);
  }

  updateLastLogin(){
    let newAccount = {
      lastLogin: Date.now().valueOf()
    };

    this.props.appActions.updateDispatcher(this.props.account.id, newAccount);
    this.forceUpdate();
  }

  createNewOrder(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.router.push('/createNewOrder');
  }

  render() {
    return (
      <div
        dir = {getCurLang()==='ar'?'rtl':'ltr'}
        className="container dispatcherDashboardContainer"
        style={{
          paddingBottom: "20px"
        }}
      >

        <PageHeader>{ gettext('ORDER.ORDER-LIST-HEADER') }</PageHeader>
        <DispatcherOrdersListComponent
          orders={this.props.orders}
          users={this.props.users}
          isDispatcher={true}
          onDateFilterChange={this.onDateFilterChange}
          dateFilter={this.props.dateFilter}
          showOrderDetails={this.onOrderDetailLinkClick}
          vehicles={this.props.vehicles}
          platforms={this.props.platforms}
          account={this.props.account}
          updateLastLogin={this.updateLastLogin}
          acceptTerms={this.props.appActions.acceptTerms}
        />
        <Button bsStyle="success"
          onClick={this.createNewOrder}
          className="createOrderBtn"
          style={{float: "right"}}>
          { gettext('ORDER.CREATE-NEW-ORDER') }
        </Button>
      </div>
    );
  }
}




DispatcherDashboardContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  appActions: PropTypes.object.isRequired,
  orders: PropTypes.array,
  users: PropTypes.array,
  historyView: PropTypes.bool,
  dateFilter: PropTypes.string,
  history: PropTypes.object,
  vehicles: PropTypes.array.isRequired,
  platforms: PropTypes.array.isRequired,
  account: PropTypes.object
};

function mapStateToProps(state) {
  return {
   orders: state.appReducer.orders,
   users: state.appReducer.users,
   dateFilter: state.dashboardPageReducer.dateFilter,
   vehicles: state.appReducer.vehicles,
   recipients: state.appReducer.recipients,
   platforms: state.appReducer.platforms,
   account: state.appReducer.account
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    appActions: bindActionCreators(appActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DispatcherDashboardContainer);
