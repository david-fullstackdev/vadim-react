import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/dashboardPageActions';
import * as appActions from '../actions/appActions';
import { PageHeader } from 'react-bootstrap';
import GroupageDetailsComponent from '../components/groupageDetails/GroupageDetailsComponent';
import _ from 'lodash';
import { gettext } from '../i18n/service';



export class GroupageDetailsContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.assignGroupage = this.assignGroupage.bind(this);
    this.unassignGroupage = this.unassignGroupage.bind(this);
    this.groupageUnassigned = props.groupageUnassigned;
  }

  componentDidMount() {
    if (this.props.groupage.driverId) {
      this.props.actions.getGroupageGpsLog(this.props.groupage.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.groupageUnassigned !== this.groupageUnassigned) {
      this.groupageUnassigned = nextProps.groupageUnassigned;
      this.props.appActions.getGroupages();
      this.props.appActions.getOrders();
    }
    this.props.appActions.endSpinner();
  }

  assignGroupage(groupage,orders) {

    for (var value of orders) {
      if(value.orderStatus==='canceled') {
            return this.props.showMessage({
            message: gettext('CANNNOT-ASSIGN-GROUPAGE-ORDER-CANCELED'),
            level: 'error'
        });
      }
    }

    if((groupage.groupageStatus==='assigned')||
        (groupage.groupageStatus==='waitingForPickUp')||
          (groupage.groupageStatus==='pickedUp')||
            (groupage.groupageStatus==='done')||
              (groupage.groupageStatus==='rejectedOnWay')||
                (groupage.groupageStatus==='returned'))
      return this.props.showMessage({
          message: gettext('CANNOT-ASSIGN-ALREADY-ASSIGNED'),
          level: 'error'
    });


    if((groupage.groupageStatus==='unassigned'))
      this.props.router.push(`/assignDriverToGroupage/${groupage.id}`);

  }

  unassignGroupage(groupageId,status) {

    if(status==='pickedUp'){
      return this.props.showMessage({
        message: gettext('CANNOT-UNASSIGN-ALREADY-PICKEDUP'),
        level: 'error'
      });
    }
    else if(status==='done'){
      return this.props.showMessage({
        message: gettext('CANNOT-UNASSIGN-GROUPAGE-DELIVERED-OR-RETURNED'),
        level: 'error'
      });
    }
    else if(status==='rejectedOnWay'){
      return this.props.showMessage({
        message: gettext('CANNOT-UNASSIGN-GROUPAGE-CANCELED-RETURNED'),
        level: 'error'
      });
    }
    else if(status==='returned'){
      return this.props.showMessage({
        message: gettext('CANNOT-UNASSIGN-GROUPAGE-RETURNED'),
        level: 'error'
      });
    }
    else {
      this.props.appActions.startSpinner();
      this.props.actions.unassignGroupage(groupageId);
    }
  }

  render() {
    if (!this.props.groupage) {
      return <div>{ gettext('CANNOT-GET-GROUPAGE') }</div>;
    }
    const groupageOrders = _.filter(this.props.orders, {groupageId: this.props.groupage.id});
    return (
      <div className="orderDetailsPage container">
        <PageHeader>{ gettext('GROUPAGE.GROUPAGE-DETAILS') }</PageHeader>
        <GroupageDetailsComponent
          groupage={this.props.groupage}
          orders={groupageOrders}
          pickUpPoints={this.props.pickUpPoints}
          users={this.props.users}
          recipients={this.props.recipients}
          assignGroupage={this.assignGroupage}
          unassignGroupage={this.unassignGroupage}
          showOnMap={this.showOnMap}
          vehicles={this.props.vehicles}
          gpsLogs={this.props.gpsLogs}
          />
      </div>
    );
  }
}




GroupageDetailsContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  appActions: PropTypes.object.isRequired,
  groupage: PropTypes.object,
  orders: PropTypes.array,
  pickUpPoints: PropTypes.object,
  users: PropTypes.array,
  recipients: PropTypes.array,
  params: PropTypes.object,
  history: PropTypes.object,
  groupageUnassigned: PropTypes.number,
  vehicles: PropTypes.array.isRequired,
  gpsLogs: PropTypes.array,
  loaded: PropTypes.bool,
  showMessage: PropTypes.func
};

function mapStateToProps(state, props) {
  return {
    groupage: _.find(state.appReducer.groupages, {id: props.params.groupageId}),
    orders: state.appReducer.orders,
    pickUpPoints: state.appReducer.pickUpPoints,
    users: state.appReducer.users,
    recipients: state.appReducer.recipients,
    vehicles: state.appReducer.vehicles,
    gpsLogs: state.dashboardPageReducer.gpsLogs,
    loaded: state.appReducer.loaded
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
)(GroupageDetailsContainer);
