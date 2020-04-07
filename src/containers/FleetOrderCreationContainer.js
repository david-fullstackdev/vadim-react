import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/createOrderActions';
import * as appActions from '../actions/appActions';
import * as fleetActions from '../actions/fleetOwnerActions';
import FleetOrderCreationForm from '../components/orderCreation/OrderActionComponent';
import MapModalComponent from '../components/MapModalComponent';
import objectAssign from 'object-assign';
import _ from 'lodash';
import moment from 'moment';
import { gettext } from '../i18n/service';
import LoopbackHttp, {getUserType} from '../businessLogic/LoopbackHttp.js';
import isEmpty from '../businessLogic/isObjectEmpty.js';


export class FleetOrderCreationContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.items = [{ isFloating: false, isComment: false }];

    _.bindAll(this, []);

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.orderCreated && nextProps.orderCreated !== this.props.orderCreated) {
      this.props.appActions.addNewRecipientToStore(nextProps.createdStuff.result.recipient);
      this.props.appActions.addNewOrderToStore(objectAssign({}, nextProps.createdStuff.result.order, { items: nextProps.createdStuff.result.items }));
      this.props.appActions.removeOrderForReturn();
      this.props.appActions.endSpinner();
      if(getUserType() === 'operator')
        return this.props.router.push('/dashboard');
      if(getUserType() === 'dispatcher')
        return this.props.router.push('/dispatcherDashboard');
      if(getUserType() === 'fleetowner')
        return this.props.router.push('/fleetOwnerDashboard');
    }
  }

  render() {
    return (
      <FleetOrderCreationForm
        vehicles={this.props.vehicles}
        showMessage={this.props.showMessage}
        pickUpPoints={this.props.pickUpPoints}
        orderForReturn={this.props.orderForReturn}
        orderForUpdate={this.props.orderForUpdate}
        createOrder={this.props.fleetActions.createOrder}
        updateOrder={this.props.appActions.updateOrderAndLog}
        startSpinner={this.props.appActions.startSpinner}
        recipients={this.props.recipients}
        company={this.props.company}
        account={this.props.account}
        getRecipient={this.props.appActions.getRecipient}
        fetched_recipient={this.props.fetched_recipient}
        teams={this.props.teams}
        router={this.props.router}
        removeOrderForUpdate={this.props.appActions.removeOrderForUpdate}
        removeOrderForReturn={this.props.appActions.removeOrderForReturn}
        />
    );
  }
}



FleetOrderCreationContainer.propTypes = {
  showMessage: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    pickUpPoints: state.appReducer.pickUpPoints,
    orderCreated: state.orderCreationReducer.orderCreated,
    recipient: state.orderCreationReducer.recipient,
    recipients: state.appReducer.recipients,
    order: state.orderCreationReducer.order,
    item: state.orderCreationReducer.item,
    vehicles: state.appReducer.vehicles,
    createdStuff: state.orderCreationReducer.createdStuff,
    account: state.appReducer.account,
    orderForReturn: state.appReducer.orderForReturn,
    orderForUpdate: state.appReducer.orderForUpdate,
    users: state.appReducer.users,
    company: state.appReducer.company,
    fetched_recipient:state.appReducer.fetched_recipient,
    teams: state.appReducer.teams
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    appActions: bindActionCreators(appActions, dispatch),
    fleetActions: bindActionCreators(fleetActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FleetOrderCreationContainer);
