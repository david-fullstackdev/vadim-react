import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as appActions from '../actions/appActions.js';
import * as actions from '../actions/driverInfoPageActions.js';
import DriverInfoPageComponent from '../components/driverInfo/DriverInfoPageComponent.js';
import objectAssign from 'object-assign';
import _ from 'lodash';
import { gettext } from '../i18n/service';


export class DriverInfoPageContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleDateSelected = this.handleDateSelected.bind(this);
    this.submit = this.submit.bind(this);
    this.startDate = 0;
    this.endDate = 0;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      return this.props.showMessage({
        title: gettext('ERROR-OCCURED'),
        message: nextProps.error,
        autoDismiss: 60,
        level: 'error'
      });
    }
    if (nextProps.updatedDriver) {
      this.props.showMessage({
        message: gettext('ACCOUNT-CHANGES-SAVED'),
        level: 'success'
      });
      return this.props.appActions.updateLocalUser(nextProps.updatedDriver);
    }
  }

  getDriverSalaryForDateSpan() {
    if (!this.startDate || !this.endDate) {
      return;
    }
    this.props.actions.getDriverSalaryForDateSpan(this.props.driver.id, this.startDate, this.endDate, (request) => {
      request
        .then((data) => {
          return data.json().then((json) => {
            if (json.error) {
              this.props.actions.onDriverSalaryFetchFail(json.error.message);
            }
            this.props.actions.onDriverSalaryFetchSuccess(json.salary);
          });
        })
        .catch((error) => {
          this.props.actions.onDriverSalaryFetchFail(error);
        });
    });
  }

  handleDateSelected(dateType, date) {
    this[`${dateType}Date`] = date;
    this.getDriverSalaryForDateSpan();
  }

  submit(e) {
    e.preventDefault();
    e.stopPropagation();

    const fields = _.reduce(e.target.elements, (_fields, elem) => {
      _fields[elem.name] = elem.value;
      return _fields;
    }, {});
    if (fields.password && fields.confirmPassword !== fields.password) {
      return this.props.showMessage({
        message: gettext('CONFIRM-NEW-PASSWORD'),
        level: 'error'
      });
    }
    let newAccount = objectAssign({}, this.props.driver);
    _.forEach(Object.keys(newAccount), (key) => {
      if (!fields[key]) {
        return;
      }
      newAccount[key] = fields[key];
    });
    if (fields.password) {
      newAccount.password = fields.password;
    }
    const accountId = newAccount.id;
    delete newAccount.id;
    delete newAccount.role;
    delete newAccount.updatedAt;

    if (newAccount.driverCommissionPercent) {
      newAccount.driverCommissionPercent = newAccount.driverCommissionPercent / 100;
    }

    this.props.actions.updateDriver(accountId, newAccount, (req) => {
      req.then((data) => {
        data.json().then((json) => {
          if (json.error) {
            return this.props.actions.onDriverUpdateFail(data.error.message);
          }
          this.props.actions.onDriverUpdateSuccess(json);
        });
      })
      .catch((error) => {
        this.props.actions.onDriverUpdateFail(error);
      });
    });
  }

  render() {
    return (
      <DriverInfoPageComponent
        driver={this.props.driver}
        handleDateSelected={this.handleDateSelected}
        salary={this.props.salary}
        loading={this.props.loading}
        submit={this.submit}
        vehicles={this.props.vehicles}
        />
    );
  }
}




DriverInfoPageContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  appActions: PropTypes.object.isRequired,
  driver: PropTypes.object,
  showMessage: PropTypes.func,
  salary: PropTypes.number,
  loading: PropTypes.bool,
  updatedDriver: PropTypes.object,
  vehicles: PropTypes.array
};

function mapStateToProps(state, props) {
  return {
    driver: _.find(state.appReducer.users, {id: props.params.driverId}),
    loading: state.driverInfoPageReducer.loading,
    error: state.driverInfoPageReducer.error,
    salary: state.driverInfoPageReducer.salary,
    updatedDriver: state.driverInfoPageReducer.updatedDriver,
    vehicles: state.appReducer.vehicles
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
)(DriverInfoPageContainer);
