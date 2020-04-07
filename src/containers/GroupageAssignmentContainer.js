import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/dashboardPageActions';
import * as appActions from '../actions/appActions';
import { Panel, PageHeader, Button } from 'react-bootstrap';
import { Table, Tr, Td, Th, Thead } from 'reactable';
import _ from 'lodash';
import { gettext } from '../i18n/service';
import getCurLang from '../businessLogic/getCurLang.js';

export class GroupageAssignmentContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.selectedDrivers = [];

    // this.loaded = props.loaded;
    this.groupageAssigned = props.groupageAssigned;
    this.assignGroupage = this.assignGroupage.bind(this);
    this.handleDriverSelectChange = this.handleDriverSelectChange.bind(this);
    this.checkIfDriverIsSelected = this.checkIfDriverIsSelected.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // if(nextProps.loaded===true) {
    //   this.loaded = nextProps.loaded;
    //   this.props.appActions.endSpinner();
    // }
    if (nextProps.groupageAssigned && nextProps.groupageAssigned !== this.groupageAssigned) {
      this.groupageAssigned = nextProps.groupageAssigned;
      // this.props.appActions.updateLocalGroupage(nextProps.groupage);
      this.props.appActions.endSpinner();
      return this.props.router.push(`/groupageDetails/${nextProps.groupage.id}`);
    }
  }

  handleDriverSelectChange(driver, e) {
    e.stopPropagation();
    this.selectedDrivers = [];

    if (!this.checkIfDriverIsSelected(driver))
      this.selectedDrivers.push(driver);

    this.forceUpdate();
    return true;
  }

  checkIfDriverIsSelected(driver) {
    return _.includes(this.selectedDrivers, driver);
  }

  assignGroupage(e, groupage, driverId) {
    e.preventDefault();
    e.stopPropagation();


    this.props.appActions.startSpinner();
    this.props.actions.assignGroupage(groupage.id, driverId);
  }

  render() {
    if (!this.props.groupages.length) {
      return false;
    }
    const groupage = this.props.groupages.filter((item) => item.id === this.props.params.groupageId)[0];
    const groupageVehicleType = _(this.props.orders).filter({ groupageId: groupage.id }).maxBy((order) => order.vehicleType).vehicleType;
    const driversToShowInList = _.filter(this.props.drivers, (driver) => {
      const driverGroupages = _.filter(this.props.groupages, { driverId: driver.id });
      const areThereGroupagesBelongingToThisDriverWithSamePickUpTime = _.some(driverGroupages, (_groupage) => {
        _groupage.expectedPickUpTime.startTime === groupage.expectedPickUpTime.startTime;
      });
      return driver.vehicleType >= groupageVehicleType && driver.driverStatus !== 'inactive' && !areThereGroupagesBelongingToThisDriverWithSamePickUpTime;
    }) || [];

    //todo check if driver will be free in this period of time
    return (
      <Panel>
        <PageHeader>{gettext('DRIVER.ASSIGN-DRIVER')}</PageHeader>
        <div className="center_content">
          <div className="groupage_assigning_container">
            <Table
              dir={getCurLang() === 'ar' ? 'rtl' : 'ltr'}
              className="dispatcherDashboardPageOrdersTable drivers_table">
              <Thead>

                <Th column={gettext('DRIVER.DRIVER-NAME')}>
                  <label title={gettext('DRIVER.DRIVER-NAME')}>{gettext('DRIVER.DRIVER-NAME')}</label>
                </Th>
                <Th column={gettext('VEHICLE-TYPE')}>
                  <label title={gettext('VEHICLE-TYPE')}>{gettext('VEHICLE-TYPE')}</label>
                </Th>
                <Th column={gettext('ACTIVE-ORDERS')}>
                  <label title={gettext('ACTIVE-ORDERS')}>{gettext('ACTIVE-ORDERS')}</label>
                </Th>

              </Thead>
              {_.map(driversToShowInList, (driver) => {
                const driverVehicle = _.find(this.props.vehicles, { size: +driver.vehicleType }) || {};
                const isDriverSelected = this.checkIfDriverIsSelected(driver);
                const className = isDriverSelected ? 'highlighted' : '';
                var orderCount = 0;
                const groupages = _.filter(this.props.groupages, (groupage) => {
                  return groupage.driverId === driver.id
                    && (groupage.groupageStatus === "waitingForPickUp"
                      || groupage.groupageStatus === "pickedUp"
                      || groupage.groupageStatus === "rejectedOnWay");
                });
                _.map(this.props.orders, (order) => {
                  _.map(groupages, (groupage) => {
                    if (groupage.id === order.groupageId
                      && order.orderStatus !== 'new' && order.orderStatus !== 'delivered' && order.orderStatus !== 'returned')
                      orderCount++;
                  });
                });


                return (
                  <Tr key={driver.id}
                    onClick={(e) => this.handleDriverSelectChange(driver, e)}
                    className={className}>

                    <Td column={gettext('DRIVER.DRIVER-NAME')}>
                      {`${driver.firstName}`}
                    </Td>
                    <Td column={gettext('VEHICLE-TYPE')}>
                      <img alt={driverVehicle.type} src={driverVehicle.icon} />
                    </Td>

                    <Td column={gettext('ACTIVE-ORDERS')}>
                      {orderCount}
                    </Td>
                  </Tr>
                );
              })}
            </Table>
            <div className="right_content">
              <Button bsStyle="success"
                onClick={(e) => this.assignGroupage(e, groupage, this.selectedDrivers[0].id)}>
                {gettext('DRIVER.ASSIGN-DRIVER')}
              </Button>
            </div>
          </div>
        </div>
      </Panel>
    );
  }
}




GroupageAssignmentContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  appActions: PropTypes.object,
  groupages: PropTypes.array,
  params: PropTypes.object,
  drivers: PropTypes.array,
  history: PropTypes.object,
  groupageAssigned: PropTypes.number,
  groupage: PropTypes.object,
  orders: PropTypes.array.isRequired,
  vehicles: PropTypes.array.isRequired,
  loaded: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    drivers: state.appReducer.users.filter((user) => (user.role === 'driver' && user.driverStatus !== 'inactive')),
    groupages: state.appReducer.groupages,
    groupageAssigned: state.dashboardPageReducer.groupageAssigned,
    groupage: state.dashboardPageReducer.groupage,
    orders: state.appReducer.orders,
    vehicles: state.appReducer.vehicles,
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
)(GroupageAssignmentContainer);
