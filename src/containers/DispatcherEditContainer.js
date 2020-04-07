import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/appActions';
import * as createUserActions from '../actions/createUserActions';
import DispatcherEditComponent from '../components/accounts/DispatcherEditComponent';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';
import Wait from '../businessLogic/wait.js';
import objectAssign from 'object-assign';
import _ from 'lodash';
import { gettext } from '../i18n/service';
import MapModalComponent from '../components/MapModalComponent';
import isEmpty from '../businessLogic/isObjectEmpty.js';

const showMessageAboutPickUpPointChangesBeingFinished = (showMessage) => {
  showMessage({
    message: gettext('PICKUP-POINT-CHANGES-SAVED'),
    level: 'success'
  })
;};


export class DispatcherEditContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    if (!props.account) {
      return this.props.showMessage({
        message: gettext('CANNOT-GET-USER'),
        level: 'error'
      });
    }


    this.currentPickUpPoint = [];
    this.pickUpPoints = _(props.pickUpPoints).toArray().filter({dispatcherId: props.account.id}).value();
    this.cities = [];


    this.accountUpdated = props.accountUpdated;
    this.selectedLanguage = props.language;
    this.selectedCountry = props.fields?props.fields.country:undefined;


    this.geocoder = new window.google.maps.Geocoder();
    this.isDispatcher = LoopbackHttp.isDispatcher;
    this.isShowingMap = false;
    this.newPoint = false;

    this.pickUpPointAddress = undefined;
    this.pickUpPointLocation = undefined;
    this.pickUpPointTitle = undefined;
    this.pickUpPointContactName = undefined;
    this.pickUpPointPhone = undefined;

    this.onMapClick = this.onMapClick.bind(this);
    this.showMapEdit = this.showMapEdit.bind(this);
    this.hideMapEdit = this.hideMapEdit.bind(this);
    this.getCurrentPoint = this.getCurrentPoint.bind(this);
    this.lastPickUppoint = this.lastPickUppoint.bind(this);
    this.clearArrays = this.clearArrays.bind(this);
    this.onLanguageSelect = this.onLanguageSelect.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.addPickUpPoint = this.addPickUpPoint.bind(this);
    this.removePickUpPoint = this.removePickUpPoint.bind(this);
    this.onGeoSuggestSelect = this.onGeoSuggestSelect.bind(this);
    this.onCountrySelect = this.onCountrySelect.bind(this);
    this.getCities = this.getCities.bind(this);
    this.showFormForNewPoint = this.showFormForNewPoint.bind(this);
    this.updatePickUpPoint = this.updatePickUpPoint.bind(this);
    this.setPickUpPointTitle = this.setPickUpPointTitle.bind(this);
    this.setPickUpPointContactName = this.setPickUpPointContactName.bind(this);
    this.setPickUpPointPhone = this.setPickUpPointPhone.bind(this);
    this.pointValidation = this.pointValidation.bind(this);
    this.getCountryName = this.getCountryName.bind(this);
    this.getCityName = this.getCityName.bind(this);


    this.onCountrySelect(props.account.country);

    if (!Object.keys(this.props.account).length) {
      this.props.showMessage({
        message: gettext('CANNOT-GET-DATA-FROM-SERVER'),
        level: 'error',
        position: 'tc',
        autoDismiss: 0
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountUpdated !== this.accountUpdated) {
      this.accountUpdated = nextProps.accountUpdated;
      this.props.showMessage({
        message: gettext('ACCOUNT-CHANGES-SAVED'),
        level: 'success'
      });
    }

    if (this.pickUpPoints !== nextProps.pickUpPoints) {
      this.pickUpPoints = _(nextProps.pickUpPoints).toArray().filter({dispatcherId: this.props.account.id}).value();
      this.props.actions.endSpinner();

      // this.forceUpdate();
    }
  }

  lastPickUppoint() {
    return this.props.showMessage({
      message: gettext('You must have at least one pickup point'),
      level: 'error'
    });
  }
  showMapEdit() {
    this.isShowingMap = true;
    this.forceUpdate();
  }

  hideMapEdit() {
    this.isShowingMap = false;
    this.forceUpdate();
  }

  getCurrentPoint(point){
    this.currentPickUpPoint = point;
  }

  getCityName(id) {
    let city =_.find(this.props.cities, {id: id});
    if(city && city.name)
      return city.name[localStorage.getItem('user-language')];
    else return 'Can not get city';
  }

  getCountryName(id) {
    let country =_.find(this.props.countries, {id: id});
    if(country && country.name)
      return country.name[localStorage.getItem('user-language')];
    else return 'Can not get country';
  }


  onMapClick({latLng}) {
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng()
    };

    this.geocoder.geocode({location: location}, (results) => {
        const opts = {
          label: results[0].formatted_address,
          location
        };
        this.pickUpPointAddress = results[0].formatted_address;
        this.pickUpPointLocation = location;
        this.onGeoSuggestSelect(opts);
        this.hideMapEdit();
    });

    // this.forceUpdate();
  }

  showFormForNewPoint() {
    this.newPoint = !this.newPoint;
    this.forceUpdate()
  }


  pointValidation(point) {
    let error = true;
    if(!/^[0-9]{5,20}$/.test(point.phone)) {
      this.props.showMessage({
        message: gettext('INSERT-CORRECT-PHONE'),
        level: 'error'
      });
      error = false;
    }
    if(!/^([^0-9]{3,30})$/.test(point.contactName)) {
      this.props.showMessage({
        message: gettext('INSERT-CORRECT-NAME'),
        level: 'error'
      });
      error = false;
    }

    if(!point.contactName.replace(/ /g,'')==='') {
      this.props.showMessage({
        message: gettext('INSERT-CORRECT-NAME'),
        level: 'error'
      });
      error = false;
    }

    return error;
  }

  addPickUpPoint(data) {
    let pickUpPointsToCreate = {
      address: this.pickUpPointAddress,
      gpsLocation: this.pickUpPointLocation,
      title: this.pickUpPointTitle,
      contactName: this.pickUpPointContactName,
      phone: this.pickUpPointPhone,
      dispatcherId: this.props.account.id,
      companyId: this.props.company.id
    }
    for (var key in pickUpPointsToCreate) {
      if(!pickUpPointsToCreate[key])
        return this.props.showMessage({
          message: gettext('Please insert all fields'),
          level: 'error'
        });
    }

    this.pointValidation(pickUpPointsToCreate);

    this.clearArrays();
    this.props.actions.startSpinner();

    this.props.createUserActions.createDefaultPickUpPoint(pickUpPointsToCreate);
    this.newPoint = false;

    this.forceUpdate()
  }

  setPickUpPointTitle(title) {
    this.pickUpPointTitle = title;
  }

  setPickUpPointContactName(name) {
    this.pickUpPointContactName = name;
  }

  setPickUpPointPhone(phone) {
    this.pickUpPointPhone = phone;
  }

  updatePickUpPoint(editPickupId) {
    this.props.actions.startSpinner();

    let pickUpPointsToUpdate = {
      address: this.pickUpPointAddress,
      gpsLocation: this.pickUpPointLocation,
      title: this.pickUpPointTitle,
      contactName: this.pickUpPointContactName,
      phone: this.pickUpPointPhone,
      id: editPickupId
    }

    for (var key in pickUpPointsToUpdate) {
      if(!pickUpPointsToUpdate[key])
        delete pickUpPointsToUpdate[key];
    }

    if(pickUpPointsToUpdate.phone && !/^([0-9]){7,20}$/.test(pickUpPointsToUpdate.phone)) {
        this.props.actions.endSpinner();
        this.forceUpdate();
        return this.props.showMessage({
          message: gettext('INSERT-CORRECT-PHONE'),
          level: 'error'
        });
    }

    if(pickUpPointsToUpdate.contactName && !/[^0-9]{3,30}$/.test(pickUpPointsToUpdate.contactName)) {
      this.props.actions.endSpinner();
      this.forceUpdate();
        return this.props.showMessage({
          message: gettext('INSERT-CORRECT-NAME'),
          level: 'error'
        });
    }

    this.props.createUserActions.updatePickUpPoint(pickUpPointsToUpdate);
    this.clearArrays();

    this.forceUpdate()
  }

  removePickUpPoint(pickUpPoint, e) {
    e.preventDefault();
    e.stopPropagation();
    let pointInUse = undefined;
    this.props.orders.filter((order) => {
          order.items.filter((item) => {
            if(item.pickupPointId===pickUpPoint.id) {
              if(item.itemStatus!=="rejected" && item.itemStatus!=="returned" && item.itemStatus!=="delivered") {
                pointInUse = item.itemStatus;
              }
            }
          });
      });

    if(pointInUse)
      return this.props.showMessage({
        message: gettext('You can not delete pick up point if order status is '+ pointInUse),
        level: 'error'
      });
    else {
      if (_.includes(this.pickUpPoints, pickUpPoint)) {
        _.pull(this.pickUpPoints, pickUpPoint);
      }

      this.props.actions.deletePickUpPoint(pickUpPoint);
      this.props.actions.deleteLocalPickUpPoint(pickUpPoint);
      this.forceUpdate();
    }

  }

  onGeoSuggestSelect({label, location}) {
    this.pickUpPointAddress = label;
    this.pickUpPointLocation = location;
  }

  onLanguageSelect(lan){
    this.selectedLanguage = lan;
  }

  onCountrySelect(id) {
    let country = this.props.countries.find((country) => country.id===id);
      if(country) {
        this.cities = this.props.cities.filter((city) => city.countryId===country.id);
          this.forceUpdate();
      }
  }

  getCities() {
    return this.cities;
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
    if (fields.password) {
      newAccount.password = fields.password;
    }
    if (this.selectedLanguage) {
      newAccount.language = this.selectedLanguage;
    }
    if (fields.country) {
      newAccount.country = fields.country;
    }
    if (fields.city) {
      newAccount.city = fields.city;
    }
    if (fields.expressDeliveryCommission) {
      newAccount.expressDeliveryCommission = fields.expressDeliveryCommission;
    }
    if (fields.shopName) {
      newAccount.shopName = fields.shopName;
    }
    const accountId = newAccount.id;
    delete newAccount.id;
    this.props.actions.updateDispatcher(accountId, newAccount);

    this.clearArrays();
    this.props.showMessage({
      message: gettext('ACCOUNT-CHANGES-SAVED'),
      level: 'success'
    });
    Wait(300);
    this.forceUpdate();
    this.props.router.push(`/dashboard`);
  }

  clearArrays() {
    this.pickUpPointAddress = undefined;
    this.pickUpPointLocation = undefined;
    this.pickUpPointTitle = undefined;
    this.pickUpPointContactName = undefined;
    this.pickUpPointPhone = undefined;
  }

  render() {
    if (!Object.keys(this.props.account).length) {
      return (
        <div>{ gettext('CANNOT-GET-USER') }</div>
      );
    }

    const maps = this.isShowingMap ?
      (
        <MapModalComponent
          onMapClick={this.onMapClick}
          onClickOutsideOfMap={this.hideMapEdit}
          onCancel={this.hideMapEdit}
          hideMapEdit={this.hideMapEdit}
        />
      )
      : '';
    return (
      <DispatcherEditComponent
        isDispatcher={this.isDispatcher}
        fields={this.props.account}
        saveChanges={this.saveChanges}
        pickUpPoints={this.pickUpPoints}
        addPickUpPoint={this.addPickUpPoint}
        updatePickUpPoint={this.updatePickUpPoint}
        removePickUpPoint={this.removePickUpPoint}
        onGeoSuggestSelect={this.onGeoSuggestSelect}
        onLanguageSelect={this.onLanguageSelect}
        clearArrays={this.clearArrays}
        lastPickUppoint={this.lastPickUppoint}
        showMapEdit={this.showMapEdit}
        pickUpPointAddress={this.pickUpPointAddress}
        getCurrentPoint={this.getCurrentPoint}
        map={maps}
        countries={this.props.countries}
        cities={this.cities}
        onCountrySelect={this.onCountrySelect}
        getCities={this.getCities}
        showFormForNewPoint={this.showFormForNewPoint}
        newPoint={this.newPoint}
        setPickUpPointTitle={this.setPickUpPointTitle}
        setPickUpPointContactName={this.setPickUpPointContactName}
        setPickUpPointPhone={this.setPickUpPointPhone}
        pickUpPointTitle={this.pickUpPointTitle}
        pickUpPointPhone={this.pickUpPointPhone}
        pickUpPointContactName={this.pickUpPointContactName}
        getCityName={this.getCityName}
        getCountryName={this.getCountryName}
      />
    );
  }
}


DispatcherEditContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  createUserActions: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  orders: PropTypes.array,
  accountUpdated: PropTypes.number.isRequired,
  showMessage: PropTypes.func.isRequired,
  pickUpPoints: PropTypes.object.isRequired,
  countries: PropTypes.array,
  cities: PropTypes.array,
  language: PropTypes.string,
  fields: PropTypes.object
};

function mapStateToProps(state, props) {
  const account = props.params.dispatcherId ?
    _.find(state.appReducer.users, {id: props.params.dispatcherId}) :
    state.appReducer.account;
  return {
    account: account,
    accountUpdated: state.appReducer.accountUpdated,
    pickUpPoints: state.appReducer.pickUpPoints,
    orders: state.appReducer.orders,
    cities: state.appReducer.cities,
    countries: state.appReducer.countries,
    company: state.appReducer.company
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    createUserActions: bindActionCreators(createUserActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DispatcherEditContainer);
