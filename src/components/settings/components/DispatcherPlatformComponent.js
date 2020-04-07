import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DeleteConfirmation from '../../modals/DeletePickupPointModal';
import { Jumbotron, Button, Row, PageHeader, FormGroup, FormControl, Col, ControlLabel, InputGroup } from 'react-bootstrap';
import { Table, Tr, Td, Th, Thead } from 'reactable';
import { gettext } from '../../../i18n/service.js';
import CitiesComponent from './CitiesComponent';

import _ from 'lodash';
import * as Validation from '../../../businessLogic/fieldValidation.js';
import ScrollableAnchor, { configureAnchors, goToAnchor } from 'react-scrollable-anchor'
import { Scrollbars } from 'react-custom-scrollbars';
import ReactTelInput from 'react-telephone-input';
import { DistanceBasedCostsForm } from './DistanceBasedCostsForm';
configureAnchors({ offset: -60, scrollDuration: 200 });

export class DispatcherPlatformComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.editDispatcherPlatform = false;
    this.createDispatcherPlatform = false;
    this.addToDefaultTeam = false;
    this.selectedDispatcherPlatform = undefined;


    _.bindAll(this, ['renderDispatcherPlatformForm', 'resetBools', 'resetState', 'flipCreateDispatcherPlatform',
      'getSelectedDispatcherPlatform', 'renderDispatcherPlatformEditForm', 'getTeams', 'flipEditDispatcherPlatform',
      'validateDispatcherPlatformFields',
      'createNewDispatcherPlatform', 'updateDispatcherPlatform', 'deleteDispatcherPlatform', 'toggleAddToDefaultTeam', 'setCity']);

    this.state = {
      name: undefined,
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

  getSelectedDispatcherPlatform(id) {
    this.resetBools();
    this.selectedDispatcherPlatform = _.find(this.props.dispatcherPlatforms, { 'id': id });
    this.props.fetchCityForInfo(this.selectedDispatcherPlatform.cityId);
    this.setState(this.selectedDispatcherPlatform);
  }

  flipCreateDispatcherPlatform() {
    this.createDispatcherPlatform = !this.createDispatcherPlatform;
    this.resetState();
  }

  flipEditDispatcherPlatform() {
    this.resetBools();
    this.editDispatcherPlatform = !this.editDispatcherPlatform;
    this.forceUpdate();
  }

  resetState() {
    this.selectedDispatcherPlatform = undefined;
    for (var prop in this.state) {
      delete this.state[prop];
    }
    this.setState(this.baseState);
  }

  resetBools() {
    this.createDispatcherPlatform = false;
    this.editDispatcherPlatform = false;
  }

  createNewDispatcherPlatform() {
    if (!this.validateDispatcherPlatformFields())
      return false;
    else if (!Validation.passValdationForCreating(this.state.password, this.props.showMessage))
      return false;
    else {
      delete this.state['confirmPassword'];
      delete this.state.filterValue;
      this.state.companyId = this.props.company.id;
      this.props.startSpinner();
      this.props.createDispatcherPlatform(this.state.teamId, 'dispatcherPlatform', this.state);
      this.resetBools();
      this.resetState();
    }
  }

  updateDispatcherPlatform() {
    if (!this.validateDispatcherPlatformFields()) {
      return false;
    }
    else {
      delete this.state['confirmPassword'];
      delete this.state.filterValue;
      this.props.startSpinner();
      this.props.updateDispatcherPlatform(this.state.teamId, 'dispatcherPlatform', this.state);
      let platformId = this.state.id;
      this.props.fetchCityForInfo(this.state.cityId);
      this.resetBools();
      this.resetState();
      this.getSelectedDispatcherPlatform(platformId);
    }
  }

  deleteDispatcherPlatform() {
    this.props.startSpinner();
    this.props.deleteDispatcherPlatform(this.state.teamId, 'dispatcherPlatform', this.state.id);
    this.resetBools();
    this.resetState();
  }

  validateDispatcherPlatformFields() {
    return Validation.emailValdation(this.state.email, this.props.showMessage)
      && Validation.nameValidation(this.state.nameame, this.props.showMessage)
      && Validation.passValdation(this.state.password, this.state.confirmPassword, this.props.showMessage)
      && Validation.phoneValdation(this.state.phone, this.props.showMessage)
      && Validation.countryValdation(this.state.countryId, this.props.showMessage)
      && Validation.cityValdation(this.state.cityId, this.props.showMessage)
      && Validation.teamValdation(this.state.teamId, this.props.showMessage);
  }

  setCity(city) {
    this.setState({ cityId: city.id })
  }

  renderDispatcherPlatformForm() {
    return (
      <Jumbotron className="position_relative">
        <ScrollableAnchor id={'dispatchers_anchor'}>
          <div />
        </ScrollableAnchor>
        <div className="text_align_center margin_bottom_em">
          <h3>{gettext('PLATFORM-INFO')}</h3>
        </div>
        <Row>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('EMAIL')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedDispatcherPlatform.email}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedDispatcherPlatform.nameame}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('PHONE-NUMBER')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedDispatcherPlatform.phone}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('COUNTRY')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.getCountryByCityId(this.selectedDispatcherPlatform.countryId)}</h4></label>
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
                <label><h4>{this.selectedDispatcherPlatform.deliveryCommission}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('EXPRESS-DELIVERY-COST')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedDispatcherPlatform.expressDeliveryCommission}</h4></label>
              </Col>
            </Row>
          </div>
          <div className="botom_line" />
          <DistanceBasedCostsForm
            values={this.selectedDispatcherPlatform.distanceBasedModifiers}>
          </DistanceBasedCostsForm>

        </Row>
        <div className="edit_link">
          <a onClick={() => this.flipEditDispatcherPlatform()}><h4>{gettext('EDIT')}</h4></a>
        </div>
      </Jumbotron>
    );
  }

  renderDispatcherPlatformEditForm() {
    return (
      <Jumbotron className="position_relative">
        <ScrollableAnchor id={'dispatchers_anchor'}>
          <div />
        </ScrollableAnchor>
        <div className="text_align_center margin_bottom_em">
          <h2>{gettext('EDIT-DISPATCHER-PLATFORM')}</h2>
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
                  defaultValue={this.selectedDispatcherPlatform.email}
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
                  defaultValue={this.selectedDispatcherPlatform.nameame}
                  onChange={(e) => this.setState({ nameame: e.target.value })}
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
                  initialValue={"" + this.selectedDispatcherPlatform.phone + ""}
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
                  {this.props.getCountries(this.selectedDispatcherPlatform.countryId)}
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
                  defaultValue={this.selectedDispatcherPlatform.deliveryCommission}
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
                  defaultValue={this.selectedDispatcherPlatform.expressDeliveryCommission}
                  onChange={(e) => this.setState({ expressDeliveryCommission: e.target.value })}
                  placeholder={gettext('EXPRESS-DELIVERY-COST')} />
              </Col>
            </Row>
          </div>

          <div className="botom_line" />


          <DistanceBasedCostsForm
            defaultValues={this.selectedDispatcherPlatform.distanceBasedModifiers}
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
        </Row>
        <div className="actions">
          <Button bsStyle="primary" onClick={() => this.updateDispatcherPlatform()}>{gettext('SAVE')}</Button>
          <Button bsStyle="danger" onClick={() => { this.resetState(); this.flipEditDispatcherPlatform(); }}>{gettext('CANCEL')}</Button>
        </div>
      </Jumbotron>
    );
  }

  renderDispatcherPlatformCreateForm() {
    return (
      <Jumbotron className="position_relative">
        <ScrollableAnchor id={'dispatchers_anchor'}>
          <div />
        </ScrollableAnchor>
        <div className="text_align_center margin_bottom_em">
          <h2>{gettext('NEW-DISPATCHER-PLATFORM')}</h2>
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
                  onChange={(e) => this.setState({ nameame: e.target.value })}
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
                  onChange={(e) => this.setState({ countryId: e.target.value })}
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
                  onSelect={this.setCity}
                  currentCity={this.props.cityForInfo} />
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
        </Row>
        <div className="actions">
          <Button bsStyle="primary" onClick={() => this.createNewDispatcherPlatform()}>{gettext('SAVE')}</Button>
          <Button bsStyle="danger" onClick={() => { this.resetState(); this.flipEditDispatcherPlatform(); }}>{gettext('CANCEL')}</Button>
        </div>
      </Jumbotron>
    );
  }



  render() {
    let dispatcherPlatforms = _.uniqBy(this.props.dispatcherPlatforms, 'id');

    dispatcherPlatforms = _.filter(dispatcherPlatforms, (dispatcher) => {
      return this.state.filterValue
        ? dispatcher.nameame.toUpperCase().indexOf(this.state.filterValue.toUpperCase()) != -1
        || dispatcher.email.toUpperCase().indexOf(this.state.filterValue.toUpperCase()) != -1
        || (dispatcher.shopName && dispatcher.shopName.toUpperCase().indexOf(this.state.filterValue.toUpperCase()) != -1)
        : true;
    });

    dispatcherPlatforms = _.map(dispatcherPlatforms, (dispatcher) => {
      const isDispatcherSelected = dispatcher === this.selectedDispatcherPlatform;
      const className = isDispatcherSelected ? 'active' : '';

      return (
        <Tr className={className} key={dispatcher.id} onClick={(e) => this.getSelectedDispatcherPlatform(dispatcher.id)}>
          <Td column={gettext('NAME')}>
            {dispatcher.nameame}
          </Td>
          <Td column={gettext('EMAIL')}>
            {dispatcher.email}
          </Td>
        </Tr>
      );
    });

    return (
      <div className="dispatcher_profile">
        <Jumbotron>
          <div className="item_head_title">
            <h3>{gettext('DISPATCHER-PLATFORMS')}</h3>
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
                    {dispatcherPlatforms}
                  </Table>
                </div>
                <div className="milti_controls">
                  <Button className="multi_btn margin_bottom_halfem" onClick={() => { this.flipCreateDispatcherPlatform() }}>+</Button>
                  <Button className="multi_btn margin_bottom_halfem" onClick={() => { this.deleteDispatcherPlatform() }}>-</Button>
                </div>
              </Col>
            </Col>
          </Row>
        </Jumbotron>
        {
          this.createDispatcherPlatform ? this.renderDispatcherPlatformCreateForm() : ''
        }
        {
          this.selectedDispatcherPlatform
            ? this.editDispatcherPlatform ? this.renderDispatcherPlatformEditForm() : this.renderDispatcherPlatformForm()
            : ''
        }
      </div>
    );
  }
}




DispatcherPlatformComponent.propTypes = {
};

function mapStateToProps(state) {
  return {

  };
}

export default connect(
  mapStateToProps
)(DispatcherPlatformComponent);
