import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MapModalComponent from '../../../components/MapModalComponent';
import DeleteConfirmation from '../../modals/DeletePickupPointModal';
import { Jumbotron, Button, Row, PageHeader, FormGroup, FormControl, Col, ControlLabel, InputGroup } from 'react-bootstrap';
import { Table, Tr, Td, Th, Thead } from 'reactable';
import { gettext } from '../../../i18n/service.js';
import Geosuggest from 'react-geosuggest';
import _ from 'lodash';
import * as Validation from '../../../businessLogic/fieldValidation.js';
import LoopbackHttp from '../../../businessLogic/LoopbackHttp.js';
import CitiesComponent from './CitiesComponent';

import Switcher from 'react-switcher';
import Phone from 'react-phone-number-input';
import ReactTelInput from 'react-telephone-input';
import { DistanceBasedCostsForm } from './DistanceBasedCostsForm';

export class DispatchersComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.editDispatcher = false;
    this.createDispatcher = false;
    this.isShowingMap = false;
    this.addToDefaultTeam = false;
    this.newPickupPoint = {};
    this.selectedPickupPoint = {};
    this.pickUpPoints = [];
    this.selectedDispatcher = undefined;
    this.geocoder = new window.google.maps.Geocoder();

    _.bindAll(this, ['renderDispatcherForm', 'resetBools', 'resetState', 'flipCreateDispatcher',
      'getSelectedDispatcher', 'renderDispatcherEditForm', 'getTeams', 'flipEditDispatcher', 'validateDispatcherFields',
      'createNewDispatcher', 'updateDispatcher', 'deleteDispatcher', 'renderPickUpPoints',
      'renderEditPickUpPoints', 'renderNewPickupPoint', 'cancelNewPoint', 'onMapClick', 'showMapEdit',
      'hideMapEdit', 'deletePoint', 'toggleAddToDefaultTeam', 'renderActivateButtons', 'activateDeactivateDispatcher', 'setCity']);

    this.state = {
      firstName: undefined,
      email: undefined,
      mobile: undefined,
      phone: undefined,
      password: undefined,
      confirmPassword: undefined,
      cityId: undefined,
      countryId: undefined,
      deliveryCommission: undefined,
      expressDeliveryCommission: undefined,
      teamId: undefined,
      filterValue: undefined,
      distanceBasedModifiers: {}
    }

    this.baseState = this.state;
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.createdUser !== this.props.createdUser) {
      if (nextProps.createdUser.role === 'dispatcher') {
        this.newPickupPoint.dispatcherId = nextProps.createdUser.id;
        this.props.createDefaultPickUpPoint(this.newPickupPoint);
      }
    }

    if (nextProps.createdPickUpPoint !== this.props.createdPickUpPoint) {
      this.pickUpPoints.push(nextProps.createdPickUpPoint);
      this.props.endSpinner();
    }
  }

  activateDeactivateDispatcher() {
    let fields = {
      id: this.state.id,
      active: !this.selectedDispatcher.active
    }

    this.props.startSpinner();
    this.props.updateDispatcher(this.state.teamId, 'dispatcher', fields);
  }

  renderActivateButtons() {
    return (
      <div className="switcher">
        <Switcher
          on={this.selectedDispatcher.active}
          onClick={() => this.activateDeactivateDispatcher()}>
        </Switcher>
      </div>
    )
  }

  setCity(city) {
    this.setState({ cityId: city.id })
  }

  toggleAddToDefaultTeam(e) {
    this.addToDefaultTeam = !this.addToDefaultTeam;
    if (this.addToDefaultTeam)
      this.setState({ teamId: this.props.company.defaultTeamId });
    else
      this.setState({ teamId: undefined });
  }

  getTeams() {
    return _.map(this.props.teams, (team) => (
      <option key={`team_${team.id}`} value={team.id}>
        {team.name}
      </option>
    ));
  }

  getSelectedDispatcher(id) {
    this.resetBools();
    this.selectedDispatcher = _.find(this.props.dispatchers, { 'id': id });
    this.props.fetchCityForInfo(this.selectedDispatcher.cityId);
    this.pickUpPoints = _(this.props.pickUpPoints).toArray().filter({ dispatcherId: id }).value();
    this.setState(this.selectedDispatcher);
  }

  onMapClick({ latLng }) {
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng()
    };

    this.geocoder.geocode({ location: location }, (results) => {
      if (this.newPickupPoint.toCreate) {
        this.newPickupPoint.gpsLocation = location;
        this.newPickupPoint.address = results[0].formatted_address;
      }

      if (this.selectedPickupPoint.id) {
        this.selectedPickupPoint.gpsLocation = location;
        this.selectedPickupPoint.address = results[0].formatted_address;
      }
      this.hideMapEdit();
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

  flipCreateDispatcher() {
    this.createDispatcher = !this.createDispatcher;
    this.resetState();
  }

  flipEditDispatcher() {
    this.resetBools();
    this.editDispatcher = !this.editDispatcher;
    this.forceUpdate();
  }

  cancelNewPoint() {
    this.newPickupPoint = { conpanyId: this.props.company.id };
    this.forceUpdate();
  }

  deletePoint(point) {
    _.pull(this.pickUpPoints, point);
    this.forceUpdate();
  }

  resetState() {
    this.selectedDispatcher = undefined;
    for (var prop in this.state) {
      delete this.state[prop];
    }
    this.setState(this.baseState);
  }

  resetBools() {
    this.createDispatcher = false;
    this.editDispatcher = false;
  }

  createNewDispatcher() {
    if (!this.validateDispatcherFields())
      return false;
    else if (!Validation.passValdationForCreating(this.state.password, this.props.showMessage))
      return false;
    else if (!Validation.pickupPointValidation(this.newPickupPoint, this.props.showMessage))
      return false;
    else {
      delete this.state['confirmPassword'];
      delete this.state.filterValue;
      this.state.companyId = this.props.company.id;
      this.props.startSpinner();
      this.props.createDispatcher(this.state.teamId, 'dispatcher', this.state);
      this.resetBools();
      this.resetState();
    }
  }

  updateDispatcher() {
    if (!this.validateDispatcherFields()) {
      return false;
    }
    else {
      delete this.state['confirmPassword'];
      delete this.state.filterValue;
      this.props.startSpinner();
      var dispatcherData = this.state;
      dispatcherData.mobile = parseInt(dispatcherData.mobile);
      dispatcherData.phone = parseInt(dispatcherData.phone);
      this.props.updateDispatcher(this.state.teamId, 'dispatcher', this.state);
      let dispatcherId = this.state.id;
      this.props.fetchCityForInfo(this.state.cityId);
      this.resetBools();
      this.resetState();
      this.getSelectedDispatcher(dispatcherId);
    }
  }

  deleteDispatcher() {
    this.props.startSpinner();
    this.props.deleteDispatcher(this.state.teamId, 'dispatcher', this.state.id);
    this.resetBools();
    this.resetState();
  }

  validateDispatcherFields() {
    return Validation.emailValdation(this.state.email, this.props.showMessage)
      && Validation.nameValidation(this.state.firstName, this.props.showMessage)
      && Validation.passValdation(this.state.password, this.state.confirmPassword, this.props.showMessage)
      && Validation.phoneValdation(parseInt(this.state.phone), this.props.showMessage)
      && Validation.mobileValdation(parseInt(this.state.mobile), this.props.showMessage)
      && Validation.countryValdation(this.state.countryId, this.props.showMessage)
      && Validation.cityValdation(this.state.cityId, this.props.showMessage)
      && Validation.teamValdation(this.state.teamId, this.props.showMessage)
      && Validation.dispatcherDeliveryCostValidation(this.state.deliveryCommission, this.props.showMessage)
      && Validation.dispatcherExpressDeliveryCostValidation(this.state.expressDeliveryCommission, this.props.showMessage);
  }

  renderDispatcherForm() {
    return (
      <Jumbotron className="position_relative">
        <div className="text_align_center margin_bottom_em">
          <h3>{gettext('USER-INFO')}</h3>
        </div>
        <Row>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('EMAIL')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedDispatcher.email}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedDispatcher.firstName}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('SHOP-NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedDispatcher.shopName}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('MOBILE')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedDispatcher.mobile}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('PHONE-NUMBER')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedDispatcher.phone}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('COUNTRY')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.getCountryByCityId(this.selectedDispatcher.countryId)}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('CITY')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.getCityById(this.props.cityForInfo)}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('ACTIVE')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                {this.renderActivateButtons()}
              </Col>
            </Row>
          </div>
          <div className="botom_line" />
          <div className="text_align_center margin_bottom_em">
            <h3>{gettext('COST-INFO')}</h3>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('DELIVERY-COST')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedDispatcher.deliveryCommission}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('EXPRESS-DELIVERY-COST')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedDispatcher.expressDeliveryCommission}</h4></label>
              </Col>
            </Row>
          </div>

          <div className="botom_line" />

          <DistanceBasedCostsForm
            values={this.selectedDispatcher.distanceBasedModifiers}>
          </DistanceBasedCostsForm>




          <div className="botom_line" />
          {this.renderPickUpPoints()}
        </Row>
        <div className="edit_link">
          <a onClick={() => this.flipEditDispatcher()}><h4>{gettext('EDIT')}</h4></a>
        </div>
      </Jumbotron>
    );
  }

  renderDispatcherEditForm() {
    if (!this.state.countryId && this.props.countries.length === 1)
      this.setState({ countryId: this.props.countries[0].id })
    return (
      <Jumbotron className="position_relative">

        <div className="text_align_center margin_bottom_em">
          <h2>{gettext('EDIT-DISPATCHER')}</h2>
        </div>
        <div className="text_align_center margin_bottom_em">
          <h4>{gettext('USER-INFO')}</h4>
        </div>
        <Row>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('EMAIL')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.selectedDispatcher.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                  placeholder={gettext('EMAIL')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('PASSWORD')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="password"
                  required={true}
                  onChange={(e) => this.setState({ password: e.target.value })}
                  placeholder={gettext('PASSWORD')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('CONFIRM-PASSWORD')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="password"
                  required={true}
                  onChange={(e) => this.setState({ confirmPassword: e.target.value })}
                  placeholder={gettext('CONFIRM-PASSWORD')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.selectedDispatcher.firstName}
                  onChange={(e) => this.setState({ firstName: e.target.value })}
                  placeholder={gettext('NAME')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('SHOP-NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.selectedDispatcher.shopName}
                  onChange={(e) => this.setState({ shopName: e.target.value })}
                  placeholder={gettext('SHOP-NAME')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('MOBILE')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <ReactTelInput
                  required={true}
                  defaultCountry="sa"
                  initialValue={"" + this.selectedDispatcher.mobile + ""}
                  flagsImagePath='./flags.png'
                  onChange={(telNumber, selectedCountry) => {
                    this.setState({ mobile: parseInt(telNumber.replace(/[^0-9]/g, ''), 10) })
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('PHONE-NUMBER')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <ReactTelInput
                  required={true}
                  defaultCountry="sa"
                  initialValue={"" + this.selectedDispatcher.phone + ""}
                  flagsImagePath='./flags.png'
                  onChange={(telNumber, selectedCountry) => {
                    this.setState({ phone: parseInt(telNumber.replace(/[^0-9]/g, ''), 10) })
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('COUNTRY')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  componentClass="select"
                  className="_order_"
                  placeholder="select"
                  onChange={(e) => {
                    this.setState({ countryId: e.target.value });
                    this.props.getCitiesByText('', e.target.value);
                  }}
                  value={this.state.countryId}
                  name="country">
                  {this.props.getCountries(this.selectedDispatcher.countryId)}
                </FormControl>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('CITY')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <CitiesComponent
                  cities={this.props.cities}
                  getCitiesByText={this.props.getCitiesByText}
                  countryId={this.state.countryId}
                  getCityById={this.props.getCityById}
                  onSelect={this.setCity}
                  currentCity={this.props.cityForInfo} />
              </Col>
            </Row>
          </div>
          <div className="botom_line" />
          <div className="text_align_center margin_bottom_em">
            <h4>{gettext('COST-INFO')}</h4>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('DELIVERY-COST')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.selectedDispatcher.deliveryCommission}
                  onChange={(e) => this.setState({ deliveryCommission: e.target.value })}
                  placeholder={gettext('DELIVERY-COST')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('EXPRESS-DELIVERY-COST')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.selectedDispatcher.expressDeliveryCommission}
                  onChange={(e) => this.setState({ expressDeliveryCommission: e.target.value })}
                  placeholder={gettext('EXPRESS-DELIVERY-COST')} />
              </Col>
            </Row>
          </div>
          <div className="botom_line" />

          <DistanceBasedCostsForm
            defaultValues={this.selectedDispatcher.distanceBasedModifiers}
            isForm={true}
            onChangeCallback={(key, value) => {
              let { distanceBasedModifiers } = this.state;
              if (distanceBasedModifiers === void 0) {
                distanceBasedModifiers = {};
              }
              distanceBasedModifiers[key] = Number(value);
              this.setState({ distanceBasedModifiers: distanceBasedModifiers });
            }}>
          </DistanceBasedCostsForm>

          <div className="botom_line" />
          <div className="text_align_center margin_bottom_em">
            <h3>{gettext('PICK-UP-POINTS')}</h3>
          </div>
          {this.renderEditPickUpPoints()}
        </Row>
        <div className="actions">
          <Button bsStyle="primary" onClick={() => this.updateDispatcher()}>{gettext('SAVE')}</Button>
          <Button bsStyle="danger" onClick={() => { this.resetState(); this.flipEditDispatcher(); }}>{gettext('CANCEL')}</Button>
        </div>
      </Jumbotron>
    );
  }

  renderDispatcherCreateForm() {
    return (
      <Jumbotron className="position_relative">

        <div className="text_align_center margin_bottom_em">
          <h2>{gettext('NEW-DISPATCHER')}</h2>
        </div>
        <div className="text_align_center margin_bottom_em">
          <h4>{gettext('USER-INFO')}</h4>
        </div>
        <Row>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('EMAIL')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  onChange={(e) => this.setState({ email: e.target.value })}
                  placeholder={gettext('EMAIL')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('PASSWORD')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="password"
                  required={true}
                  onChange={(e) => this.setState({ password: e.target.value })}
                  placeholder={gettext('PASSWORD')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('CONFIRM-PASSWORD')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="password"
                  required={true}
                  onChange={(e) => this.setState({ confirmPassword: e.target.value })}
                  placeholder={gettext('CONFIRM-PASSWORD')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  onChange={(e) => this.setState({ firstName: e.target.value })}
                  placeholder={gettext('NAME')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('SHOP-NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  onChange={(e) => this.setState({ shopName: e.target.value })}
                  placeholder={gettext('SHOP-NAME')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('MOBILE')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <ReactTelInput
                  required={true}
                  defaultCountry="sa"
                  flagsImagePath='./flags.png'
                  onChange={(telNumber, selectedCountry) => {
                    this.setState({ mobile: parseInt(telNumber.replace(/[^0-9]/g, ''), 10) })
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('PHONE-NUMBER')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <ReactTelInput
                  required={true}
                  defaultCountry="sa"
                  flagsImagePath='./flags.png'
                  onChange={(telNumber, selectedCountry) => {
                    this.setState({ phone: parseInt(telNumber.replace(/[^0-9]/g, ''), 10) })
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('COUNTRY')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  componentClass="select"
                  className="_order_"
                  placeholder="select"
                  onChange={(e) => {
                    this.setState({ countryId: e.target.value });
                    this.props.getCitiesByText('', e.target.value);
                  }}
                  name="country">
                  <option disabled selected value={undefined}>{gettext('SELECT-COUNTRY')}</option>
                  {this.props.getCountries()}
                </FormControl>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('CITY')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <CitiesComponent
                  cities={this.props.cities}
                  getCitiesByText={this.props.getCitiesByText}
                  countryId={this.state.countryId}
                  getCityById={this.props.getCityById}
                  onSelect={this.setCity} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('TEAM')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  componentClass="select"
                  className="_order_"
                  placeholder="select"
                  disabled={this.addToDefaultTeam}
                  onChange={(e) => this.setState({ teamId: e.target.value })}
                  name="city">
                  <option disabled selected value={undefined}>{gettext('SELECT-TEAM')}</option>
                  {this.getTeams()}
                </FormControl>
                <div className="checkbox">
                  <label>
                    <input type="checkbox"
                      checked={this.addToDefaultTeam}
                      onChange={(e) => this.toggleAddToDefaultTeam(e)} />
                    {gettext('ADD-TO-DEFAULT-TEAM')}
                    {this.addToDefaultTeam ? ' - ' + _.find(this.props.teams, { id: this.props.company.defaultTeamId }).name : ''}
                  </label>
                </div>
              </Col>
            </Row>
          </div>
          <div className="botom_line" />
          <div className="text_align_center margin_bottom_em">
            <h4>{gettext('COST-INFO')}</h4>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('DELIVERY-COST')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="number"
                  required={true}
                  onChange={(e) => this.setState({ deliveryCommission: e.target.value })}
                  placeholder={gettext('DELIVERY-COST')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('EXPRESS-DELIVERY-COST')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  onChange={(e) => this.setState({ expressDeliveryCommission: e.target.value })}
                  placeholder={gettext('EXPRESS-DELIVERY-COST')} />
              </Col>
            </Row>
          </div>
          <div className="botom_line" />

          <DistanceBasedCostsForm
            defaultValues={null}
            isForm={true}
            onChangeCallback={(key, value) => {
              let { distanceBasedModifiers } = this.state;
              if (distanceBasedModifiers === void 0) {
                distanceBasedModifiers = {};
              }
              distanceBasedModifiers[key] = Number(value);
              this.setState({ distanceBasedModifiers: distanceBasedModifiers });
            }}>
          </DistanceBasedCostsForm>

          <div className="botom_line" />
          <div className="text_align_center margin_bottom_em">
            <h3>{gettext('PICK-UP-POINTS')}</h3>
          </div>
          {this.renderNewPickupPoint()}
        </Row>
        <div className="actions">
          <Button bsStyle="primary" onClick={() => this.createNewDispatcher()}>{gettext('SAVE')}</Button>
          <Button bsStyle="danger" onClick={() => { this.resetState(); this.flipEditDispatcher(); }}>{gettext('CANCEL')}</Button>
        </div>
      </Jumbotron>
    );
  }

  renderPickUpPoints() {
    return (
      <div>
        <div className="text_align_center margin_bottom_em">
          <h3>{gettext('PICK-UP-POINTS')}</h3>
        </div>
        {_.map(this.pickUpPoints, (point, i) => {
          return (
            <div className="user_data center_div">
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('TITLE')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{point.title}</h4></label>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('CONTACT-NAME')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{point.contactName}</h4></label>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('PHONE')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{point.phone}</h4></label>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('ADDRESS')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{point.address}</h4></label>
                </Col>
              </Row>
              {
                i !== (this.pickUpPoints.length - 1) ?
                  <div className="botom_line" /> : ''
              }
            </div>
          )
        })
        }
      </div>
    );
  }

  renderEditPickUpPoints() {
    return (
      <div>
        {_.map(this.pickUpPoints, (point, i) => {
          return (
            <div className="user_data center_div" key={point.id}>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('TITLE')}</h4></ControlLabel>
                </Col>
                <Col sm={8}>
                  <FormControl
                    type="text"
                    required={true}
                    defaultValue={point.title}
                    disabled={this.selectedPickupPoint.id !== point.id}
                    className="geosuggest pickup_title"
                    onChange={(e) => this.selectedPickupPoint.title = e.target.value}
                    placeholder={gettext('TITLE')} />
                  <div style={{ display: 'inline' }}>
                    <Button
                      bsStyle="primary edit_btn"
                      onClick={() => {
                        this.selectedPickupPoint = point;
                        this.forceUpdate();
                      }} />
                  </div>
                  <DeleteConfirmation
                    ppoint={point}
                    deletePickUpPoint={this.props.deletePickUpPoint}
                    deleteLocalPickUpPoint={this.props.deleteLocalPickUpPoint}
                    deletePoint={this.deletePoint} />
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('CONTACT-NAME')}</h4></ControlLabel>
                </Col>
                <Col sm={8}>
                  <FormControl
                    type="text"
                    required={true}
                    defaultValue={point.contactName}
                    disabled={this.selectedPickupPoint.id !== point.id}
                    onChange={(e) => this.selectedPickupPoint.contactName = e.target.value}
                    placeholder={gettext('CONTACT-NAME')} />
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('PHONE')}</h4></ControlLabel>
                </Col>
                <Col sm={8}>
                  <ReactTelInput
                    required={true}
                    defaultCountry="sa"
                    initialValue={"" + point.phone + ""}
                    flagsImagePath='./flags.png'
                    disabled={this.selectedPickupPoint.id !== point.id}
                    onChange={(telNumber, selectedCountry) => {
                      this.selectedPickupPoint.phone = parseInt(telNumber.replace(/[^0-9]/g, ''), 10)
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('ADDRESS')}</h4></ControlLabel>
                </Col>
                <Col sm={8}>
                  <InputGroup>
                    <Geosuggest
                      required={true}
                      name="defaultPickUpPoint"
                      placeholder={gettext('ADDRESS')}
                      inputClassName="_recipient_ _order_ form-control"
                      initialValue={point.address}
                      disabled={this.selectedPickupPoint.id !== point.id}
                      onSuggestSelect={(opts) => {
                        this.selectedPickupPoint.gpsLocation = opts.location;
                        this.selectedPickupPoint.address = opts.label;
                      }} />

                    <InputGroup.Addon onKeyDown={(e) => props.onKeyDown(e)}
                      disabled={this.selectedPickupPoint.id !== point.id}
                      onClick={() => this.showMapEdit()}>
                      {gettext('SELECT-ON-MAP')}
                    </InputGroup.Addon>
                  </InputGroup>
                </Col>
              </Row>
              {
                this.selectedPickupPoint.id === point.id ?
                  <Row>
                    <Col sm={12} className="right_content">
                      <Button className="margin_left_right"
                        bsStyle="primary"
                        onClick={() => {
                          if (!Validation.pickupPointValidation(this.selectedPickupPoint, this.props.showMessage))
                            return false;
                          else {
                            this.props.startSpinner();
                            this.props.updatePickUpPoint(this.selectedPickupPoint);
                            this.selectedPickupPoint = {};
                            this.forceUpdate();
                          }
                        }}>
                        {gettext('UPDATE')}
                      </Button>
                      <Button className="margin_left_right"
                        bsStyle="default"
                        onClick={() => {
                          this.selectedPickupPoint = {};
                          this.forceUpdate();
                        }}>
                        {gettext('CANCEL')}
                      </Button>
                    </Col>
                  </Row> : ''
              }
              <div className="botom_line" />
            </div>
          )
        })
        }
        {
          this.newPickupPoint.toCreate ?
            this.renderNewPickupPoint() : ''
        }

        {
          this.newPickupPoint.toCreate ?
            <div className="user_data center_div">
              <Row>
                <Col sm={12} className="right_content">
                  <Button className="margin_left_right"
                    bsStyle="primary"
                    onClick={() => {
                      if (!Validation.pickupPointValidation(this.newPickupPoint, this.props.showMessage))
                        return false;
                      else {
                        this.props.startSpinner();
                        this.newPickupPoint.dispatcherId = this.selectedDispatcher.id;
                        this.newPickupPoint.companyId = this.props.company.id;
                        this.props.createDefaultPickUpPoint(this.newPickupPoint);
                        this.cancelNewPoint();
                      }
                    }}>
                    {gettext('CREATE')}
                  </Button>
                  <Button className="margin_left_right"
                    bsStyle="default"
                    onClick={() => this.cancelNewPoint()}>
                    {gettext('CANCEL')}
                  </Button>
                  <div className="botom_line" />
                </Col>
              </Row>
            </div>
            : ''
        }
        {
          !this.newPickupPoint.toCreate ?
            <div className="user_data center_div">
              <Row>
                <Col sm={12} className="right_content">
                  <Button onClick={() => { this.newPickupPoint.toCreate = true; this.forceUpdate(); }}>+</Button>
                </Col>
              </Row>
            </div> : ''
        }
      </div>
    );
  }

  renderNewPickupPoint() {
    this.newPickupPoint.toCreate = true;
    this.newPickupPoint.companyId = this.props.company.id;
    return (
      <div className="user_data center_div">
        <Row>
          <Col sm={4}>
            <ControlLabel><h4>{gettext('TITLE')}</h4></ControlLabel>
          </Col>
          <Col sm={8}>
            <FormControl
              type="text"
              required={true}
              onChange={(e) => this.newPickupPoint.title = e.target.value}
              placeholder={gettext('TITLE')} />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <ControlLabel><h4>{gettext('CONTACT-NAME')}</h4></ControlLabel>
          </Col>
          <Col sm={8}>
            <FormControl
              type="text"
              required={true}
              onChange={(e) => this.newPickupPoint.contactName = e.target.value}
              placeholder={gettext('CONTACT-NAME')} />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <ControlLabel><h4>{gettext('PHONE')}</h4></ControlLabel>
          </Col>
          <Col sm={8}>
            <ReactTelInput
              required={true}
              defaultCountry="sa"
              flagsImagePath='./flags.png'
              onChange={(telNumber, selectedCountry) => {
                this.newPickupPoint.phone = parseInt(telNumber.replace(/[^0-9]/g, ''), 10)
              }}
            />
          </Col>


        </Row>
        <Row>
          <Col sm={4}>
            <ControlLabel><h4>{gettext('ADDRESS')}</h4></ControlLabel>
          </Col>
          <Col sm={8}>
            <InputGroup>
              <Geosuggest
                required={true}
                name="defaultPickUpPoint"
                placeholder={gettext('ADDRESS')}
                inputClassName="_recipient_ _order_ form-control"
                initialValue={this.newPickupPoint.address}
                onSuggestSelect={(opts) => {
                  this.newPickupPoint.gpsLocation = opts.location;
                  this.newPickupPoint.address = opts.label;
                }
                } />
              <InputGroup.Addon onKeyDown={(e) => props.onKeyDown(e)}
                onClick={() => this.showMapEdit()}>
                {gettext('SELECT-ON-MAP')}
              </InputGroup.Addon>
            </InputGroup>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    let dispatchers = _.uniqBy(this.props.dispatchers, 'id');

    dispatchers = _.filter(dispatchers, (dispatcher) => {
      return this.state.filterValue
        ? dispatcher.firstName.toUpperCase().indexOf(this.state.filterValue.toUpperCase()) != -1
        || dispatcher.email.toUpperCase().indexOf(this.state.filterValue.toUpperCase()) != -1
        || (dispatcher.shopName && dispatcher.shopName.toUpperCase().indexOf(this.state.filterValue.toUpperCase()) != -1)
        : true;
    });

    dispatchers = _.map(dispatchers, (dispatcher) => {
      const isDispatcherSelected = dispatcher === this.selectedDispatcher;
      const className = isDispatcherSelected ? 'active' : '';

      return (
        <Tr className={className} key={dispatcher.id} onClick={(e) => this.getSelectedDispatcher(dispatcher.id)}>
          <Td column={gettext('NAME')}>
            {dispatcher.firstName}
          </Td>
          <Td column={gettext('EMAIL')}>
            {dispatcher.email}
          </Td>
          <Td column={gettext('SHOP-NAME')}>
            {dispatcher.shopName}
          </Td>
        </Tr>
      );
    });

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
      <div className="dispatcher_profile">
        <Jumbotron>
          <div className="item_head_title">
            <h3>{gettext('DISPATCHERS')}</h3>
          </div>
          <Row className="center_flex margin_bottom_em">
            <Col sm={10}>
              <Col sm={12}>
                <FormControl
                  type="text"
                  required={true}
                  placeholder={gettext('SEARCH')}
                  onChange={(e) => this.setState({ filterValue: e.target.value })} />
              </Col>
            </Col>
          </Row>
          <Row className="center_flex">
            <Col sm={10}>
              <Col sm={12}>
                <div className="table_container">
                  <Table className="company_table table-fixedheader">
                    <Thead>
                      <Th column={gettext('NAME')}>
                        <span title={gettext('NAME')}>{gettext('NAME')}</span>
                      </Th>
                      <Th column={gettext('EMAIL')}>
                        <span title={gettext('EMAIL')}>{gettext('EMAIL')}</span>
                      </Th>
                      <Th column={gettext('SHOP-NAME')}>
                        <span title={gettext('SHOP-NAME')}>{gettext('SHOP-NAME')}</span>
                      </Th>
                    </Thead>
                    {dispatchers}
                  </Table>
                </div>
                <div className="milti_controls">
                  {
                    !LoopbackHttp.isOperator || (LoopbackHttp.isOperator && this.props.account.canAddDispatcher)
                      ? <Button className="multi_btn margin_bottom_halfem" onClick={() => { this.flipCreateDispatcher() }}>+</Button>
                      : ''
                  }
                  <Button className="multi_btn margin_bottom_halfem" onClick={() => { this.deleteDispatcher() }}>-</Button>
                </div>
              </Col>
            </Col>
          </Row>
        </Jumbotron>
        {
          this.createDispatcher ? this.renderDispatcherCreateForm() : ''
        }
        {
          this.selectedDispatcher
            ? this.editDispatcher ? this.renderDispatcherEditForm() : this.renderDispatcherForm()
            : ''
        }
        {maps}
      </div>
    );
  }
}




DispatchersComponent.propTypes = {
  dispatchers: PropTypes.array
};

function mapStateToProps(state) {
  return {
    createdUser: state.createUserReducer.createdUser,
    createdPickUpPoint: state.appReducer.createdPickUpPoint
  };
}

export default connect(
  mapStateToProps
)(DispatchersComponent);
