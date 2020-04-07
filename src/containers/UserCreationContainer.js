import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/createUserActions';
import * as appActions from '../actions/appActions';
import CreateOperator from '../components/CreateOperatorForm';
import CreateDispatcher from '../components/CreateDispatcherForm';
import CreateDriver from '../components/CreateDriverForm';
import CreateDispatcherPlatform from '../components/CreateDispatcherPlatform';
import MapModalComponent from '../components/MapModalComponent';
import { gettext } from '../i18n/service.js';
import _ from 'lodash';

export class UserCreationContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.userCreated = props.userCreated;
    this.pickUpPointCreated = props.pickUpPointCreated;

    this.isShowingMap = false;
    this.geocoder = new window.google.maps.Geocoder();
    this.formattedPickUpPointAddress = '';
    this.UserId = "";
    this.defaultPickUpPointOpts = undefined;
    this.defaultTitleUpPointOpts = undefined;

    this.cities = [];

    this.showMap = this.showMap.bind(this);
    this.hideMap = this.hideMap.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
    this.onSelectDefaultPickUpPoint = this.onSelectDefaultPickUpPoint.bind(this);
    this.onSelectTitlePickUpPoint = this.onSelectTitlePickUpPoint.bind(this);
    this.submit = this.submit.bind(this);
    this.onCountrySelect = this.onCountrySelect.bind(this);
  }


  componentWillReceiveProps (nextProps) {
    if (nextProps.userCreated && nextProps.userCreated !== this.userCreated) {
      this.props.appActions.addNewUserToStore(nextProps.createdUser);
      this.userCreated = nextProps.userCreated;
      this.props.router.push('/users');
      // if (this.props.params.userType !== 'dispatcher') {
      //   return this.props.router.push('/users');
      // }
      this.UserId = nextProps.createdUser.id;
      const fields = {
        dispatcherId: nextProps.createdUser.id,
        gpsLocation: this.defaultPickUpPointOpts.location,
        address: this.defaultPickUpPointOpts.label,
        title: this.defaultTitleUpPointOpts
      };
      this.props.actions.createDefaultPickUpPoint(fields);
    } if (nextProps.pickUpPointCreated && nextProps.pickUpPointCreated !== this.pickUpPointCreated) {
      this.pickUpPointCreated = nextProps.pickUpPointCreated;
      this.props.appActions.addNewPickUpPointToStore(nextProps.createdPickUpPoint);
      this.props.router.push('/users');
    }
  }

  onSelectDefaultPickUpPoint({location, label}) {
    this.defaultPickUpPointOpts = {location, label};
  }

  onSelectTitlePickUpPoint(e) {
    this.defaultTitleUpPointOpts = e.target.value;
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

    this.onSelectDefaultPickUpPoint(location);
    this.geocoder.geocode({location: location}, (results) => {
      this.formattedPickUpPointAddress = results[0].formatted_address;
      this.defaultPickUpPointOpts = {
        location,
        label: results[0].formatted_address
      };

      this.hideMap();
    });

    this.forceUpdate();
  }

  onCountrySelect(id) {
    if(id) {
      this.cities = this.props.cities.filter((city) => city.countryId===id);
      this.forceUpdate();
    }
  }

  submit(e) {
    e.preventDefault();

    const elems = Array.from(e.target.elements).filter((input) => !input.className.includes('__input_ignore__'));
    let fields = elems.reduce((prev, curr) => {
      if (!curr.name) {
        return prev;
      }
      if (curr.type === 'radio' && curr.checked === false) {
        return prev;
      }
      prev[curr.name] = curr.type === 'checkbox' ? curr.checked : curr.value;
      return prev;
    }, {});
    fields.role = this.props.params.userType;
    if (fields.role === 'driver') {
      fields.driverStatus = 'active';
      fields.driverCommissionPercent = fields.driverCommissionPercent / 100;
    }

    if (_.some(this.props.users, (user) => user.email === fields.email)) {
      return this.props.showMessage({
        message: gettext('USER-EXISTS'),
        level: 'error'
      });
    }
    if(this.props.params.userType==='dispatcherPlatform')
      this.props.actions.CreateDispatcherPlatform(fields);
    else
      this.props.actions.createUser(this.props.params.userType, fields);
  }


  render() {
    switch(this.props.params.userType) {
      case "operator":
        return (
          <CreateOperator
            submit={this.submit}
            onInputChange={this.onInputChange}
          />
        );
      case "dispatcher":
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
          <CreateDispatcher
            submit={this.submit}
            onInputChange={this.onInputChange}
            onSelectDefaultPickUpPoint={this.onSelectDefaultPickUpPoint}
            onSelectTitlePickUpPoint={this.onSelectTitlePickUpPoint}
            showMap={this.showMap}
            formattedPickUpPointAddress={this.formattedPickUpPointAddress}
            map={map}
            cities={this.cities}
            countries={this.props.countries}
            onCountrySelect={this.onCountrySelect}/>
        );
      case 'dispatcherPlatform':
        return (
          <CreateDispatcherPlatform
            submit={this.submit}
            cities={this.cities}
            countries={this.props.countries}
            onCountrySelect={this.onCountrySelect}
          />
        );
      case 'driver':
        return (
          <CreateDriver
            submit={this.submit}
            onInputChange={this.onInputChange}
            vehicles={this.props.vehicles}
          />
        );

    }
  }

}



UserCreationContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  appActions: PropTypes.object,
  users: PropTypes.Array,
  history: PropTypes.object,
  params: PropTypes.object,
  userCreated: PropTypes.number,
  pickUpPointCreated: PropTypes.number,
  createdUser: PropTypes.object,
  createdPickUpPoint: PropTypes.object,
  vehicles: PropTypes.array.isRequired,
  countries: PropTypes.object,
  cities: PropTypes.object,
  showMessage: PropTypes.func
};

function mapStateToProps(state) {
  return {
   users: state.appReducer.users,
   userCreated: state.createUserReducer.userCreated,
   createdUser: state.createUserReducer.createdUser,
   pickUpPointCreated: state.createUserReducer.pickUpPointCreated,
   createdPickUpPoint: state.createUserReducer.createdPickUpPoint,
   vehicles: state.appReducer.vehicles,
   cities: state.appReducer.cities,
   countries: state.appReducer.countries
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
)(UserCreationContainer);
