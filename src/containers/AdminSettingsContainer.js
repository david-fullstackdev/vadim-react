import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/adminActions';
import * as appActions from '../actions/appActions';
import AdminSettingsComponent from '../components/adminSettings/AdminSettingsComponent';
import _ from 'lodash';
import { gettext } from '../i18n/service';
import objectAssign from 'object-assign';
import MapModalComponent from '../components/MapModalComponent';


export class AdminSettingsContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.countries = props.countries;
    this.cities = props.cities;
    this.coefficients = props.coefficients;
    this.companies = props.companies;

    this.citiesFromCountry = [];
    this.citiesSelectedOnList = [];
    this.countriesSelectedOnList = [];
    this.companiesSelectedOnTable = [];
    this.companyLocation = [];

    this.isShowingMap = false;
    this.geocoder = new window.google.maps.Geocoder();
    this.formattedPickUpPointAddress = '';

    this.handleItemSelectChange = this.handleItemSelectChange.bind(this);
    this.createCountry = this.createCountry.bind(this);
    this.createCity = this.createCity.bind(this);
    this.deleteCountry = this.deleteCountry.bind(this);
    this.deleteCity = this.deleteCity.bind(this);
    this.createCompany = this.createCompany.bind(this);
    this.deleteCompany = this.deleteCompany.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.setCompanyLocation = this.setCompanyLocation.bind(this);
    this.getCities = this.getCities.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
    this.updateCity = this.updateCity.bind(this);
    this.setMultiplier = this.setMultiplier.bind(this);
    this.showMap = this.showMap.bind(this);
    this.hideMap = this.hideMap.bind(this);
    this.onMapClick = this.onMapClick.bind(this);

  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.countries)
      this.countries.push(nextProps.countries);
    if(nextProps.cities)
      this.cities.push(nextProps.cities);
    if(nextProps.companies)
      this.companies.push(nextProps.companies);

    this.forceUpdate();
  }

  showMap() {
    this.isShowingMap = true;
    this.forceUpdate();
  }

  hideMap() {
    this.isShowingMap = false;
    this.forceUpdate();
  }

  onMapClick({latLng}) {
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng()
    };

    this.geocoder.geocode({location: location}, (results) => {
      this.formattedPickUpPointAddress = results[0].formatted_address;
      this.companyLocation = {
        location,
        label: results[0].formatted_address
      };
      this.hideMap();
    });

    this.forceUpdate();
  }

  handleItemSelectChange(type, item, e) {
    e.stopPropagation();

    if(type==="country") {
      const isSelected = this.countriesSelectedOnList.includes(item);
      if (!isSelected) {
        if(this.countriesSelectedOnList!==[])
          this.countriesSelectedOnList = [];
        this.countriesSelectedOnList.push(item);
      } else {
        _.pull(this.countriesSelectedOnList, item);
        this.citiesFromCountry = [];
      }
    }

    else if(type==="city") {
      const isSelected = this.citiesSelectedOnList.includes(item);
      if (!isSelected) {
        this.citiesSelectedOnList.push(item);
      } else {
        _.pull(this.citiesSelectedOnList, item);
      }
    }

    else if(type==="company") {
      const isSelected = this.companiesSelectedOnTable.includes(item);
      if (!isSelected) {
        this.companiesSelectedOnTable.push(item);
      } else {
        _.pull(this.companiesSelectedOnTable, item);
      }
    }
    this.forceUpdate();
    return true;
  }

  createCountry(country) {
    var cont = {
      "name":country
    };

    this.props.actions.addCountry(cont);
  }

  updateCountry(id, country) {
    var cont = {
      "name": country
    };

    this.props.actions.updateCountry(id, cont);
  }

  createCity(city) {
    var cit = {
      "name": {
        en: city
      },
      "countryId":this.countriesSelectedOnList[0].id
    };

    this.props.actions.addCity(cit);
    this.forceUpdate();
  }

  updateCity(id, city) {
    var cit = {
      "name": {
        en: city
      }
    };

    this.props.actions.updateCity(id, cit);
  }

  setCompanyLocation(e) {
    this.companyLocation = e;
  }

  setMultiplier(e) {
    e.preventDefault();

    const fields = _.reduce(e.target.elements, (_fields, elem) => {
      _fields[elem.name] = elem.value;
        return _fields;
    }, {});

    const expressDelivery = _.find(this.props.coefficients, {type:"expressDelivery"});
      expressDelivery.coefficient = fields.expressDelivery;
      this.props.actions.updateCoefficient(expressDelivery);

    const deliveryCommission = _.find(this.props.coefficients, {type:"deliveryCommission"});
      deliveryCommission.coefficient = fields.deliveryCommission;
      this.props.actions.updateCoefficient(deliveryCommission);


    return this.props.showMessage({
      message: gettext('EXPRESS-MILTIPLIER-UPDATED'),
      level: 'success'
    });
  }

  createCompany(e) {
    e.preventDefault();

    const fields = _.reduce(e.target.elements, (_fields, elem) => {
      _fields[elem.name] = elem.value;
      return _fields;
    }, {});

    const newCompany = {
        title: fields.companyName,
        address: this.companyLocation.label,
        gpsLocation: this.companyLocation.location,
        foreignDeliveryCost: fields.shipmentCost
    };

    this.props.actions.addCompany(newCompany);
  }

  deleteCountry() {
    _.forEach(this.countriesSelectedOnList, (country) => {
      var cont = {
        "id":country.id
      };

      this.props.actions.deleteCountry(cont);
      _.pull(this.countries, country);
    });

    this.forceUpdate();
  }


  deleteCity() {
    _.forEach(this.citiesSelectedOnList, (city) => {
      var City = {
        "id": city.id
      };

      this.props.actions.deleteCity(City);
      _.pull(this.cities, city);
    });

    _.forEach(this.citiesSelectedOnList, (city) => {
      _.pull(this.cities, city);
    });

    this.forceUpdate();
  }

  deleteCompany() {
    _.forEach(this.companiesSelectedOnTable, (company) => {
      var comp = {
        "id":company.id
      };

      this.props.actions.deleteCompany(comp);
      _.pull(this.companies, company);
    });

    _.forEach(this.companiesSelectedOnTable, (company) => {
      _.pull(this.companies, company);
    });

    this.forceUpdate();
  }

  getCities() {
    return this.cities.filter((city) => city.countryId===this.countriesSelectedOnList[0].id);
  }

  saveChanges(e) {
    e.preventDefault();

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
    let newAccount = objectAssign({}, this.props.account);
    _.forEach(Object.keys(newAccount), (key) => {
      if (!fields[key]) {
        return;
      }
      newAccount[key] = fields[key];
    });

    const accountId = newAccount.id;
    delete newAccount.id;

    this.props.actions.updateAdministrator(accountId, newAccount);
    this.forceUpdate();
  }

  render() {
    const map = this.isShowingMap ?
      (
        <MapModalComponent
          onMapClick={this.onMapClick}
          onClickOutsideOfMap={this.hideMap}
          onCancel={this.hideMap}
        />
      )
      : '';
    return (
      <AdminSettingsComponent
        countries={this.countries}
        cities={this.cities}
        companies={this.companies}
        handleItemSelectChange={this.handleItemSelectChange}
        countriesSelectedOnList={this.countriesSelectedOnList}
        citiesSelectedOnList={this.citiesSelectedOnList}
        companiesSelectedOnTable={this.companiesSelectedOnTable}
        createCountry={this.createCountry}
        deleteCountry={this.deleteCountry}
        createCity={this.createCity}
        deleteCity={this.deleteCity}
        getCities={this.getCities}
        deleteCompany={this.deleteCompany}
        saveChanges={this.saveChanges}
        account={this.props.account}
        createCompany={this.createCompany}
        setCompanyLocation={this.setCompanyLocation}
        updateCountry={this.updateCountry}
        updateCity={this.updateCity}
        setMultiplier={this.setMultiplier}
        coefficients={this.props.coefficients}
        showMap={this.showMap}
        map={map}
        formattedPickUpPointAddress={this.formattedPickUpPointAddress}
      />
    );
  }
}




AdminSettingsContainer.propTypes = {
  account: PropTypes.object,
  countries: PropTypes.object,
  cities: PropTypes.object,
  showMessage: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  companies: PropTypes.array,
  coefficients: PropTypes.array
};

function mapStateToProps(state) {
  return {
    account: state.appReducer.account,
    countries: state.appReducer.countries,
    cities: state.appReducer.cities,
    companies: state.appReducer.companies,
    coefficients: state.appReducer.coefficients
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    appActions: bindActionCreators(appActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminSettingsContainer);
