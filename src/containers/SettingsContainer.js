import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import SettingsComponent from '../components/settings/SettingsComponent';
import _ from 'lodash';
import { gettext } from '../i18n/service';
import objectAssign from 'object-assign';
import MapModalComponent from '../components/MapModalComponent';
import * as createUserActions from '../actions/createUserActions';
import * as appActions from '../actions/appActions';
import * as adminActions from '../actions/adminActions'
import * as fleetActions from '../actions/fleetOwnerActions';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';


export class SettingsContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    if(!localStorage.getItem('last_settings_tab'))
      localStorage.setItem('last_settings_tab', LoopbackHttp.isFleet?gettext('COMPANY'):gettext('USER-PROFILE'));

    this.selectedMenuItem = localStorage.getItem('last_settings_tab');

    props.appActions.startSpinner();
    props.appActions.getCountries();


    _.bindAll(this, ['selectMenuItem', 'getCityById', 'prepareUserList',
                    'getCountryByCityId', 'getCountries', 'getCities', 'getVehicles', 'addBilling',
                    'getDriversFromUsers', 'getDispatchersFromUsers', 'getOperatorsFromUsers', 'getDispatcherPlatformsFromUsers']);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if(nextProps.error !== this.props.error) {
      return this.props.showMessage({
        message: nextProps.error.message,
        level: 'error'
      });
    }
      this.props.appActions.endSpinner();

    if(nextProps.createdUser !== this.props.createdUser) {
      if(LoopbackHttp.isFleet) {
        this.props.fleetActions.getUsers(this.props.company.id);
      }
      if(LoopbackHttp.isOperator) {
        this.props.fleetActions.getOperatorUsers(nextProps.account.id);
      }
    }

    if (nextProps.accountUpdated !== this.props.accountUpdated) {
      if(LoopbackHttp.isFleet)
        this.props.fleetActions.getUsers(this.props.company.id);
      if(LoopbackHttp.isOperator)
        this.props.fleetActions.getOperatorUsers(nextProps.account.id);
    }

    if(nextProps.userDeleted !== this.props.userDeleted) {
      if(LoopbackHttp.isFleet)
        this.props.fleetActions.getUsers(this.props.company.id);
      if(LoopbackHttp.isOperator)
        this.props.fleetActions.getOperatorUsers(nextProps.account.id);
    }

    if(nextProps.teamUpdated !== this.props.teamUpdated) {
      this.props.appActions.endSpinner();
    }

    if(nextProps.teamCreated !== this.props.teamCreated) {
      this.props.appActions.endSpinner();
    }

    if(nextProps.teamDeleted !== this.props.teamDeleted) {
      if(LoopbackHttp.isFleet)
        this.props.fleetActions.getUsers(this.props.company.id);
      if(LoopbackHttp.isOperator)
        this.props.fleetActions.getOperatorUsers(nextProps.account.id);
      this.props.appActions.endSpinner();
    }

    if(nextProps.addedToTeam !== this.props.addedToTeam) {
      if(LoopbackHttp.isFleet)
        this.props.fleetActions.getUsers(this.props.company.id);
      if(LoopbackHttp.isOperator)
        this.props.fleetActions.getOperatorUsers(nextProps.account.id);
      this.props.appActions.endSpinner();
    }

    if(nextProps.removedFromTeam !== this.props.removedFromTeam) {
      if(LoopbackHttp.isFleet)
        this.props.fleetActions.getUsers(this.props.company.id);
      if(LoopbackHttp.isOperator)
        this.props.fleetActions.getOperatorUsers(nextProps.account.id);
      this.props.appActions.endSpinner();
    }

    if(nextProps.users[0] && (nextProps.users[0].dispatchers || nextProps.users[0].operators || nextProps.users[0].drivers)) {
      this.prepareUserList(nextProps.users);
    }
  }

  getDriversFromUsers(teams) {
    let drivers = [];
    _.map(teams, (team) => {
      _.map(team.drivers, (driver) => {
        driver.role = 'driver';
        ////it's team id
        driver.teamId = team.id;
        drivers.push(driver);
      });
    });

    return drivers;
  }

  getDispatchersFromUsers(teams) {
    let dispatchers = [];
    _.map(teams, (team) => {
      _.map(team.dispatchers, (dispatcher) => {
        dispatcher.role = 'dispatcher';
        ////it's team id
        dispatcher.teamId = team.id;
        dispatchers.push(dispatcher);
      });
    });

    return dispatchers;
  }

  getDispatcherPlatformsFromUsers(teams) {
    let platforms = [];
    _.map(teams, (team) => {
      _.map(team.dispatcherPlatforms, (platform) => {
        platform.role = 'dispatcherPlatform';
        ////it's team id
        platform.teamId = team.id;
        platforms.push(platform);
      });
    });

    return platforms;
  }

  getOperatorsFromUsers(teams) {
    let operators = [];
    _.map(teams, (team) => {
      _.map(team.operators, (operator) => {
        operator.role = 'operator';
        ////it's team id
        operator.teamId = team.id;
        operators.push(operator);
      });
    });

    return operators;
  }

  prepareUserList(users) {

    let drivers = this.getDriversFromUsers(users);
    let operators = this.getOperatorsFromUsers(users);
    let dispatchers = this.getDispatchersFromUsers(users);
    let platforms = this.getDispatcherPlatformsFromUsers(users);
    this.props.fleetActions.addUsersToStore(drivers.concat(operators, dispatchers, platforms));
    this.forceUpdate();
  }

  addBilling() {
    return this.props.router.push('/pay');
  }

  getCityById(id) {
    if(typeof id ==='string') {
      let city =_.find(this.props.cities, {id: id});
      if(city && city.name)
        return city.name[localStorage.getItem('user-language')];
      else return 'Can not get city';
    } else {
      if(id && id.name)
        return id.name[localStorage.getItem('user-language')];
      else return 'Can not get city';
    }
  }

  getCountryByCityId(id) {
    let country = _.find(this.props.countries, {id: id});
    if(country && country.name)
      return country.name[localStorage.getItem('user-language')];
    else return 'Can not get country';
  }

  getCities(selectedCountryId, selectedCityId = undefined) {
    return _.map(this.props.cities, (city) => {
      if(selectedCountryId === city.countryId)
        return (
          <option value={city.id}
            selected={city.id === selectedCityId}>
              {this.getCityById(city.id)}
          </option>
        );

    });
  }

  getVehicles(selectedVehicleSize = undefined) {
    return _.map(this.props.vehicles, (vehicle) => (
      <option
        selected={selectedVehicleSize === vehicle.size}
        key={`vehicle_${vehicle.type}`} value={vehicle.size}>
        {vehicle.type}
      </option>
    ));
  }

  getCountries(selectedCityCountryId = undefined) {
    return _.map(this.props.countries, (country) => {
      return (
        <option value={country.id}>
          {country.name.en}
        </option>
      );
    });
  }

  selectMenuItem(menuItem) {
    localStorage.setItem('last_settings_tab', menuItem);
    this.selectedMenuItem = menuItem;
    this.forceUpdate();
  }

  render() {
    return (
      <SettingsComponent
        users={this.props.users}
        fleets={this.props.fleets}
        companies={this.props.companies}
        selectedMenuItem={this.selectedMenuItem }
        selectMenuItem={this.selectMenuItem}
        showMessage={this.props.showMessage}
        cities={this.props.cities}
        countries={this.props.countries}
        vehicles={this.props.vehicles}
        fleetActions={this.props.fleetActions}
        createUserActions={this.props.createUserActions}
        appActions={this.props.appActions}
        adminActions={this.props.adminActions}
        company={this.props.company}
        account={this.props.account}
        teams={this.props.teams}
        getCityById={this.getCityById}
        getCountryByCityId={this.getCountryByCityId}
        pickUpPoints={this.props.pickUpPoints}
        getCountries={this.getCountries}
        getCities={this.getCities}
        getVehicles={this.getVehicles}
        addBilling={this.addBilling}
        router={this.props.router}
        cards={this.props.cards}
        orders={this.props.orders}
        bills={this.props.bills}
        fetchCityForInfo={this.fetchCityForInfo}
        cityForInfo={this.props.cityForInfo}
      />
    );
  }
}




SettingsContainer.propTypes = {
  showMessage: PropTypes.func.isRequired,
  createdUser: PropTypes.object
};

function mapStateToProps(state) {
  return {
    account: state.appReducer.account,
    orders: state.appReducer.orders,
    bills: state.appReducer.bills,
    groupages: state.appReducer.groupages,
    vehicles: state.appReducer.vehicles,
    cities: state.appReducer.cities,
    countries: state.appReducer.countries,
    company: state.appReducer.company,
    teams: state.appReducer.teams,
    createdUser: state.createUserReducer.createdUser,
    accountUpdated: state.appReducer.accountUpdated,
    teamUpdated: state.appReducer.teamUpdated,
    teamCreated: state.appReducer.teamCreated,
    teamDeleted: state.appReducer.teamDeleted,
    addedToTeam: state.appReducer.addedToTeam,
    removedFromTeam: state.appReducer.removedFromTeam,
    userDeleted: state.appReducer.userDeleted,
    users: state.appReducer.users,
    pickUpPoints: state.appReducer.pickUpPoints,
    cards: state.appReducer.cards,
    fleets: state.appReducer.fleets,
    companies: state.appReducer.companies,
    error: state.appReducer.error,
    cityForInfo: state.appReducer.cityForInfo
  };
}

function mapDispatchToProps(dispatch) {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    createUserActions: bindActionCreators(createUserActions, dispatch),
    adminActions: bindActionCreators(adminActions, dispatch),
    fleetActions: bindActionCreators(fleetActions, dispatch)

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsContainer);
