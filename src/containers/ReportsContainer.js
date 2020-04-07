import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as appActions from '../actions/appActions';
import ReportsComponent from '../components/reports/ReportsComponent';
import _ from 'lodash';
import { gettext } from '../i18n/service';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';
import moment from 'moment';
import { formatCashOn } from '../businessLogic/formatCashOnDelivery.js';

export class ReportsContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.orders = props.orders;

    this.dispatcher = LoopbackHttp.isDispatcher ? props.account : undefined;
    this.byValue = "day";

    _.bindAll(this, ['filterUpdate', 'changeByValue', 'getStatistics']);

  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.statistics !== this.props.statistics) {
      this.props.endSpinner();
    }
  }

  changeByValue(val) {
    this.byValue = val;
    this.forceUpdate();
  }

  filterUpdate(e) {
    e.preventDefault();
    e.stopPropagation();

    if(!LoopbackHttp.isDispatcher)
      this.email = fields.emailValue && fields.emailValue!=="" ? fields.emailValue : undefined;

    if(LoopbackHttp.isDispatcher)
      this.email = this.props.account.email;

  }

  getStatistics(startDate, endDate, userId) {
    // this.props.getStatistics(startDate, endDate, userId);
  }

  render() {
    return (
      <ReportsComponent
        users={this.props.users}
        getStatistics={this.props.getStatistics}
        byValue={this.byValue}
        changeByValue={this.changeByValue}
        dispatcher={this.dispatcher}
        account={this.props.account}
        statistics={this.props.statistics}
        startSpinner={this.props.startSpinner}
        company={this.props.company}
        orders={this.props.orders}
      />
    );
  }
}




ReportsContainer.propTypes = {
  orders: PropTypes.array,
  users: PropTypes.array,
  showMessage: PropTypes.func.isRequired,
  coefficients: PropTypes.array,
  account: PropTypes.object
};

function mapStateToProps(state) {
  return {
    orders: state.appReducer.orders,
    users: state.appReducer.users,
    coefficients: state.appReducer.coefficients,
    account: state.appReducer.account,
    statistics: state.appReducer.statistics
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(appActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsContainer);
