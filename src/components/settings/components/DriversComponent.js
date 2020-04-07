import React, { PropTypes } from 'react';
import { Jumbotron, Button, Row, PageHeader, FormGroup, FormControl, Col, ControlLabel } from 'react-bootstrap';
import { Table, Tr, Td, Th, Thead } from 'reactable';
import { gettext } from '../../../i18n/service.js';
import _ from 'lodash';
import * as Validation from '../../../businessLogic/fieldValidation.js';
import Switcher from 'react-switcher';
import formatCamelCase from '../../../businessLogic/formatCamelCase.js';
import ReactTelInput from 'react-telephone-input';
import LoopbackHttp from '../../../businessLogic/LoopbackHttp.js';
import CitiesComponent from './CitiesComponent';
import { DriverCodImg } from '../../DriverCodImg';

export default class DriversComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.selectedDriver = undefined;
    this.addToDefaultTeam = false;
    this.editDriver = false;
    this.createDriver = false;

    _.bindAll(this, ['flipEditDriver', 'resetState', 'createNewDriver', 'flipCreateDriver',
      'renderDriverCreateForm', 'getVehicle', 'resetBools', 'getSelectedDriver', 'renderDriverForm',
      'validateDriverFields', 'renderDriverEditForm', 'getTeams', 'renderActivateButtons', 'activateDeactivateDriver',
      'toggleAddToDefaultTeam', 'setCity', 'resetCashOnDelivery']);
    this.state = {
      firstName: undefined,
      email: undefined,
      phone: undefined,
      vehicleType: undefined,
      driverCommissionPercent: undefined,
      password: undefined,
      confirmPassword: undefined,
      cityId: undefined,
      countryId: undefined,
      teamId: undefined,
      hotFoodContainer: false,
      fridge: false,
      filterValue: undefined
    }
    this.baseState = this.state;
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

  getVehicle(type) {
    return _.find(this.props.vehicles, { size: type });
  }

  getSelectedDriver(id) {
    this.resetBools();
    this.selectedDriver = _.find(this.props.drivers, { 'id': id });
    this.props.fetchCityForInfo(this.selectedDriver.cityId);
    this.setState(this.selectedDriver);
  }

  flipCreateDriver() {
    // this.resetBools();
    this.createDriver = !this.createDriver;
    this.resetState();
  }

  flipEditDriver() {
    this.resetBools();
    this.editDriver = !this.editDriver;
    this.forceUpdate();
  }

  resetState() {
    this.selectedDriver = undefined;
    for (var prop in this.state) {
      delete this.state[prop];
    }
    this.setState(this.baseState);
  }

  resetBools() {
    this.createDriver = false;
    this.editDriver = false;
  }

  createNewDriver() {
    if (!this.validateDriverFields())
      return false;
    else if (!Validation.passValdationForCreating(this.state.password, this.props.showMessage))
      return false;
    else {
      delete this.state['confirmPassword'];
      delete this.state.filterValue;
      this.state.companyId = this.props.company.id;
      //this.props.startSpinner();
      var driverInfo = this.state;
      driverInfo.phone = driverInfo.phone.toString();
      this.props.createDriver(this.state.teamId, 'driver', driverInfo);
      //this.props.endSpinner();
      this.resetBools();
      this.resetState();
    }
  }

  updateDriver() {
    if (!this.validateDriverFields())
      return false;
    else {
      delete this.state['confirmPassword'];
      delete this.state.filterValue;
      //this.props.startSpinner();
      this.props.updateDriver(this.state.teamId, 'driver', this.state);
      let driverId = this.state.id;
      this.props.fetchCityForInfo(this.state.cityId);
      this.resetBools();
      this.resetState();
      this.getSelectedDriver(driverId);
    }
  }

  activateDeactivateDriver() {
    let fields = {
      id: this.state.id,
      driverStatus: this.selectedDriver.driverStatus === 'active' ? 'inactive' : 'active'
    }

    this.props.startSpinner();
    this.props.updateDriver(this.state.teamId, 'driver', fields);
  }

  deleteDriver() {
    //this.props.startSpinner();
    this.props.deleteDriver(this.state.teamId, 'driver', this.state.id);
    this.resetBools();
    this.resetState();
  }

  setCity(city) {
    this.setState({ cityId: city.id })
  }

  validateDriverFields() {
    return Validation.emailValdation(this.state.email, this.props.showMessage)
      && Validation.nameValidation(this.state.firstName, this.props.showMessage)
      && Validation.passValdation(this.state.password, this.state.confirmPassword, this.props.showMessage)
      && Validation.phoneValdation(this.state.phone, this.props.showMessage)
      && Validation.countryValdation(this.state.countryId, this.props.showMessage)
      && Validation.cityValdation(this.state.cityId, this.props.showMessage)
      && Validation.teamValdation(this.state.teamId, this.props.showMessage)
      && Validation.vehicleValdation(this.state.vehicleType, this.props.showMessage)
      && Validation.driverCommissionPercentValdation(this.state.driverCommissionPercent, this.props.showMessage);
  }

  resetCashOnDelivery(driver) {
    this.props.resetCashOnDelivery(driver.id);
    driver.cashOnDelivery = 0;
  }

  renderDriverForm() {
    return (
      <div className="dispatcher_profile">
        <Jumbotron className="position_relative">
          <div className="text_align_center margin_bottom_em">
            <h3>{gettext('DRIVER-INFO')}</h3>
          </div>
          <Row>
            <div className="user_data center_div">
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('EMAIL')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{this.selectedDriver.email}</h4></label>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('NAME')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{this.selectedDriver.firstName}</h4></label>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('PHONE-NUMBER')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{this.selectedDriver.phone}</h4></label>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('COUNTRY')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{this.props.getCountryByCityId(this.selectedDriver.countryId)}</h4></label>
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
                  <ControlLabel><h4>{gettext('STATUS')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  {this.renderActivateButtons()}
                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('TYPE')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{this.selectedDriver.isFullTime ? 'Full-time' : 'Freelancer'}</h4></label>

                </Col>
              </Row>

              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('RESET-COD')}</h4></ControlLabel>
                  <DriverCodImg driver={this.selectedDriver} company={this.props.company} styleImg={{ margin: '0px 0px 10px 10px' }} />
                </Col>
                <Col sm={4}>
                  <label><h4>{this.selectedDriver.cashOnDelivery} / {this.props.company.cashOnDeliveryCap}</h4></label>
                </Col>

                <Col sm={2}>
                  {!this.selectedDriver.cashOnDelivery || this.selectedDriver.cashOnDelivery === 0 ? null : <Button style={{ 'margin-left': '10px' }} bsStyle="default" style={{
                    background: '#60285E', color: 'white', position: 'absolute', right: '-90%'
                  }} onClick={() => this.resetCashOnDelivery(this.selectedDriver)}>{gettext('RESET')}</Button>}
                </Col>
              </Row>

            </div>
            <div className="botom_line" />
            <div className="text_align_center margin_bottom_em">
              <h3>{gettext('VEHICLE-INFO')}</h3>
            </div>
            <div className="user_data center_div">
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('VEHICLE-TYPE')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label>
                    <img className="driver_info_vehicle" alt={this.getVehicle(this.selectedDriver.vehicleType).type} src={this.getVehicle(this.selectedDriver.vehicleType).icon} />
                  </label>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('ADD-EQUIPMENT')}</h4></ControlLabel>
                </Col>
                <Col sm={4}>
                  <label><h4>{this.selectedDriver.hotFoodContainer ? gettext('HOT-FOOD-CONTAINER') : ''}</h4></label>
                </Col>
                <Col sm={4}>
                  <label><h4>{this.selectedDriver.fridge ? gettext('FRIDGE') : ''}</h4></label>
                </Col>
              </Row>
            </div>
            <div className="botom_line" />
            <div className="text_align_center margin_bottom_em">
              <h3>{gettext('PAYMENT-INFO')}</h3>
            </div>
            <div className="user_data center_div">
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('DRIVER-COMMISSION')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{this.selectedDriver.driverCommissionPercent}</h4></label>
                </Col>
              </Row>
            </div>
          </Row>
          <div className="edit_link">
            <a onClick={() => this.flipEditDriver()}><h4>{gettext('EDIT')}</h4></a>
          </div>
        </Jumbotron>
      </div>
    );
  }

  renderDriverEditForm() {

    return (
      <Jumbotron className="position_relative">
        <div className="text_align_center margin_bottom_em">
          <h2>{gettext('EDIT-DRIVER')}</h2>
        </div>
        <div className="text_align_center margin_bottom_em">
          <h4>{gettext('DRIVER-INFO')}</h4>
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
                  defaultValue={this.selectedDriver.email}
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
                  defaultValue={this.selectedDriver.firstName}
                  onChange={(e) => this.setState({ firstName: e.target.value })}
                  placeholder={gettext('NAME')} />
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
                  initialValue={"" + this.selectedDriver.phone + ""}
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
                  {this.props.getCountries(this.selectedDriver.countryId)}
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

            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('TYPE')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  componentClass="select"
                  className="_order_"
                  placeholder="select"
                  onChange={(e) => this.setState({ isFullTime: e.target.value })}
                  name="driver-type">
                  <option value={true} selected={this.selectedDriver.isFullTime}>{gettext('FULL-TIME-DRIVER')}</option>
                  <option value={false} selected={!this.selectedDriver.isFullTime}>{gettext('FREELANCER-DRIVER')}</option>
                </FormControl>
              </Col>
            </Row>


          </div>
          <div className="botom_line" />
          <div className="text_align_center margin_bottom_em">
            <h4>{gettext('VEHICLE-INFO')}</h4>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('VEHICLE-TYPE')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl componentClass="select" name="vehicleType" placeholder="select"
                  onChange={(e) => this.setState({ vehicleType: parseInt(e.target.value) })}>
                  {this.props.getVehicles(this.state.vehicleType)}
                </FormControl>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('ADD-EQUIPMENT')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <div className="checkbox">
                  <label>
                    <input type="checkbox"
                      checked={this.state.hotFoodContainer}
                      onChange={() => this.setState({ hotFoodContainer: !this.state.hotFoodContainer })} />
                    {gettext('HOT-FOOD-CONTAINER')}
                  </label>
                </div>
                <div className="checkbox">
                  <label>
                    <input type="checkbox"
                      checked={this.state.fridge}
                      onChange={() => this.setState({ fridge: !this.state.fridge })} />
                    {gettext('FRIDGE')}
                  </label>
                </div>
              </Col>
            </Row>
          </div>

          <div className="botom_line" />

          <div className="text_align_center margin_bottom_em">
            <h4>{gettext('PAYMENT-INFO')}</h4>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('DRIVER-COMMISSION')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="number"
                  required={true}
                  defaultValue={this.selectedDriver.driverCommissionPercent}
                  onChange={(e) => this.setState({ driverCommissionPercent: e.target.value })}
                  placeholder={gettext('DRIVER-COMMISSION')} />
              </Col>
            </Row>
          </div>
        </Row>
        <div className="actions">
          <Button bsStyle="primary" onClick={() => this.updateDriver()}>{gettext('SAVE')}</Button>
          <Button bsStyle="danger" onClick={() => { this.resetState(); this.flipEditDriver(); }}>{gettext('CANCEL')}</Button>
        </div>
      </Jumbotron>
    );
  }

  renderDriverCreateForm() {

    return (
      <Jumbotron className="position_relative">
        <div className="text_align_center margin_bottom_em">
          <h2>{gettext('NEW-DRIVER')}</h2>
        </div>
        <div className="text_align_center margin_bottom_em">
          <h4>{gettext('DRIVER-INFO')}</h4>
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
                  disabled={this.addToDefaultTeam}
                  placeholder="select"
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
                    {this.addToDefaultTeam && _.find(this.props.teams, { id: this.props.company.defaultTeamId }) ? ' - ' + _.find(this.props.teams, { id: this.props.company.defaultTeamId }).name : ''}
                  </label>
                </div>
              </Col>
            </Row>
          </div>
          <div className="botom_line" />
          <div className="text_align_center margin_bottom_em">
            <h4>{gettext('VEHICLE-INFO')}</h4>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('VEHICLE-TYPE')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl componentClass="select" name="vehicleType" placeholder="select"
                  onChange={(e) => this.setState({ vehicleType: parseInt(e.target.value) })}>
                  <option disabled selected value={undefined}>{gettext('SELECT-VEHICLE')}</option>
                  {this.props.getVehicles()}
                </FormControl>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('ADD-EQUIPMENT')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <div className="checkbox">
                  <label>
                    <input type="checkbox"
                      checked={this.state.hotFoodContainer}
                      onChange={() => this.setState({ hotFoodContainer: !this.state.hotFoodContainer })} />
                    {gettext('HOT-FOOD-CONTAINER')}
                  </label>
                </div>
                <div className="checkbox">
                  <label>
                    <input type="checkbox"
                      checked={this.state.fridge}
                      onChange={() => this.setState({ fridge: !this.state.fridge })} />
                    {gettext('FRIDGE')}
                  </label>
                </div>
              </Col>
            </Row>
          </div>

          <div className="botom_line" />

          <div className="text_align_center margin_bottom_em">
            <h4>{gettext('PAYMENT-INFO')}</h4>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('DRIVER-COMMISSION')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  onChange={(e) => this.setState({ driverCommissionPercent: parseInt(e.target.value) })}
                  placeholder={gettext('DRIVER-COMMISSION')} />
              </Col>
            </Row>
          </div>
        </Row>
        <div className="actions">
          <Button bsStyle="primary" onClick={() => this.createNewDriver()}>{gettext('SAVE')}</Button>
          <Button bsStyle="danger" onClick={() => { this.resetState(); this.flipCreateDriver(); }}>{gettext('CANCEL')}</Button>
        </div>
      </Jumbotron>
    );
  }

  renderActivateButtons() {
    return (
      <div className="switcher">
        <Switcher
          on={this.selectedDriver.driverStatus === 'active'}
          onClick={() => this.activateDeactivateDriver()}>
        </Switcher>
      </div>
    )
  }

  render() {
    let drivers = _.uniqBy(this.props.drivers, 'id');

    drivers = _.filter(drivers, (driver) => {
      return this.state.filterValue
        ? driver.firstName.toUpperCase().indexOf(this.state.filterValue.toUpperCase()) != -1
        || driver.email.toUpperCase().indexOf(this.state.filterValue.toUpperCase()) != -1
        : true;
    });

    drivers = _.map(drivers, (driver) => {
      const isDriverSelected = driver === this.selectedDriver;
      const className = isDriverSelected ? 'active' : '';
      return (
        <Tr className={className} key={driver.id} onClick={(e) => this.getSelectedDriver(driver.id)}>
          <Td column={gettext('NAME')}>
            {driver.firstName}
          </Td>
          <Td column={gettext('EMAIL')}>
            {driver.email}
          </Td>
        </Tr>
      );
    });



    return (
      <div className="dispatcher_profile">
        <Jumbotron>
          <div className="item_head_title">
            <h3>{gettext('DRIVERS')}</h3>
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
                    </Thead>
                    {drivers}
                  </Table>
                </div>
                <div className="milti_controls">
                  {
                    !LoopbackHttp.isOperator || (LoopbackHttp.isOperator && this.props.account.canAddDriver)
                      ? <Button className="multi_btn margin_bottom_halfem" onClick={() => { this.flipCreateDriver() }}>+</Button> : ''
                  }
                  <Button className="multi_btn margin_bottom_halfem" onClick={() => { this.deleteDriver() }}>-</Button>
                </div>
              </Col>

            </Col>
          </Row>
        </Jumbotron>
        {
          this.createDriver ? this.renderDriverCreateForm() : ''
        }
        {
          this.selectedDriver
            ? this.editDriver ? this.renderDriverEditForm() : this.renderDriverForm()
            : ''
        }

      </div>
    );
  }
}

DriversComponent.propTypes = {
  showMessage: PropTypes.func.isRequired
};
