import React, {PropTypes} from 'react';
import { Jumbotron, Button, Row, PageHeader,FormGroup, FormControl, Col, ControlLabel, ListGroup, ListGroupItem } from 'react-bootstrap';
import {Table, Tr, Td, Th, Thead} from 'reactable';
import { gettext } from '../../../i18n/service.js';
import _ from 'lodash';
import * as Validation from '../../../businessLogic/fieldValidation.js';
import ScrollableAnchor, { configureAnchors, goToAnchor } from 'react-scrollable-anchor';
import CitiesComponent from './CitiesComponent';

import { Scrollbars } from 'react-custom-scrollbars';
import ReactTelInput from 'react-telephone-input';
configureAnchors({offset: -60, scrollDuration: 200});

export default class OperatorsComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.selectedOperator = undefined;
    this.addToDefaultTeam = false;
    this.editOperator = false;
    this.createOperator = false;

    _.bindAll(this, ['renderOperatorForm', 'flipCreateOperator', 'getSelectedOperator', 'renderOperatorEditForm',
                      'flipEditOperator', 'getTeams', 'resetBools', 'resetState', 'validateOperatorFields',
                      'createNewOperator', 'updateOperator', 'deleteOperator', 'toggleAddToDefaultTeam', 'setCity']);

    this.state = {
      firstName: undefined,
      email: undefined,
      phone: undefined,
      password: undefined,
      confirmPassword: undefined,
      cityId: undefined,
      countryId: undefined,
      canAddDriver: false,
      canAddDispatcher: false,
      canCreateOrders: false,
      teamId:undefined,
      filterValue: undefined
    }

    this.baseState = this.state;
  }

  toggleAddToDefaultTeam(e) {
    this.addToDefaultTeam = !this.addToDefaultTeam;
    if(this.addToDefaultTeam)
      this.setState({teamId: this.props.company.defaultTeamId});
    else
      this.setState({teamId: undefined});
  }

  getSelectedOperator(id) {
    this.resetBools();
    this.selectedOperator = _.find(this.props.operators, { 'id': id });
    this.props.fetchCityForInfo(this.selectedOperator.cityId);
    this.setState(this.selectedOperator);
  }

  getTeams() {
    return _.map(this.props.teams, (team) => (
      <option key={`team_${team.id}`} value={team.id}>
        {team.name}
      </option>
    ));
  }

  flipCreateOperator() {
    this.createOperator = !this.createOperator;
    this.resetState();
  }

  flipEditOperator() {
    this.resetBools();
    this.editOperator = !this.editOperator;
    this.forceUpdate();
  }

  resetState() {
    this.selectedOperator = undefined;
    for ( var prop in this.state ) {
      delete this.state[prop];
    }
    this.setState(this.baseState);

  }

  resetBools() {
    this.createOperator = false;
    this.editOperator = false;
  }

  createNewOperator() {
    if(!this.validateOperatorFields())
      return false;
    else if(!Validation.passValdationForCreating(this.state.password, this.props.showMessage))
      return false;
    else {
      delete this.state['confirmPassword'];
      this.state.companyId = this.props.company.id;
      this.props.startSpinner();
      this.props.createOperator(this.state.teamId, 'operator', this.state);
      this.resetBools();
      this.resetState();
    }
  }

  updateOperator() {
    if(!this.validateOperatorFields())
      return false;
    else {
      delete this.state['confirmPassword'];
      let operator = this.state.id;
      this.props.startSpinner();
      this.props.updateOperator(this.state.teamId, 'operator', this.state);
      let operatorId = this.state.id;
      this.props.fetchCityForInfo(this.state.cityId);
      this.resetBools();
      this.resetState();
      this.getSelectedOperator(operator);
    }
  }

  deleteOperator() {
    this.props.startSpinner();
    this.props.deleteOperator(this.state.teamId, 'operator', this.state.id);
    this.resetBools();
    this.resetState();
  }

  validateOperatorFields() {
    return Validation.emailValdation(this.state.email, this.props.showMessage)
            && Validation.nameValidation(this.state.firstName, this.props.showMessage)
            && Validation.passValdation(this.state.password, this.state.confirmPassword, this.props.showMessage)
            && Validation.phoneValdation(this.state.phone, this.props.showMessage)
            && Validation.countryValdation(this.state.countryId, this.props.showMessage)
            && Validation.cityValdation(this.state.cityId, this.props.showMessage)
            && Validation.teamValdation(this.state.teamId, this.props.showMessage);
  }

  setCity(city) {
    this.setState({cityId: city.id})
  }

  renderOperatorForm() {
    return (
      <Jumbotron className="position_relative">
        <ScrollableAnchor id={'operators_anchor'}>
          <div />
        </ScrollableAnchor>
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
                <label><h4>{this.selectedOperator.email}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedOperator.firstName}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('PHONE')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedOperator.phone}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('COUNTRY')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.getCountryByCityId(this.selectedOperator.countryId)}</h4></label>
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
            <h3>{gettext('PROPERTIES')}</h3>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={6}>
                { this.selectedOperator.canAddDispatcher
                  ?<h4>{gettext('CAN-ADD-DISPATCHERS')}</h4>
                  :<h4>{gettext('CANT-ADD-DISPATCHERS')}</h4>
                }
                { this.selectedOperator.canCreateOrders
                  ?<h4>{gettext('CAN-CREATE-ORDERS')}</h4>
                  :<h4>{gettext('CANT-CREATE-ORDERS')}</h4>
                }
              </Col>
              <Col sm={6}>
                { this.selectedOperator.canAddDriver
                  ?<h4>{gettext('CAN-ADD-DRIVERS')}</h4>
                  :<h4>{gettext('CANT-ADD-DRIVERS')}</h4>
                }
              </Col>
            </Row>
          </div>
        </Row>
        <div className="edit_link">
          <a onClick={() => this.flipEditOperator()}><h4>{gettext('EDIT')}</h4></a>
        </div>
      </Jumbotron>
    );
  }

  renderOperatorEditForm() {
    return (
      <Jumbotron className="position_relative">
        <ScrollableAnchor id={'operators_anchor'}>
          <div />
        </ScrollableAnchor>
        <div className="text_align_center margin_bottom_em">
          <h3>{gettext('USER-INFO')}</h3>
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
                   defaultValue={this.selectedOperator.email}
                   onChange={(e) => this.setState({email: e.target.value})}
                   placeholder={gettext('EMAIL')}/>
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
                   onChange={(e) => this.setState({password: e.target.value})}
                   placeholder={gettext('PASSWORD')}/>
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
                   onChange={(e) => this.setState({confirmPassword: e.target.value})}
                   placeholder={gettext('CONFIRM-PASSWORD')}/>
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
                   defaultValue={this.selectedOperator.firstName}
                   onChange={(e) => this.setState({firstName: e.target.value})}
                   placeholder={gettext('NAME')}/>
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
                  initialValue={""+this.selectedOperator.phone+""}
                  flagsImagePath='./flags.png'
                  onChange={(telNumber, selectedCountry) =>{
                    this.setState({phone: parseInt(telNumber.replace(/[^0-9]/g, ''), 10)})
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
                    this.setState({countryId: e.target.value});
                    this.props.getCitiesByText('', e.target.value);
                  }}
                  value={this.state.countryId}
                  name="country">
                    { this.props.getCountries(this.selectedOperator.countryId) }
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
                  currentCity={this.props.cityForInfo}/>
              </Col>
            </Row>
          </div>
          <div className="botom_line" />
          <div className="text_align_center margin_bottom_em">
            <h3>{gettext('PROPERTIES')}</h3>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={6}>
                <div className="checkbox">
                  <label>
                    <input type="checkbox"
                      checked={this.state.canAddDispatcher}
                      onChange={() => this.setState({canAddDispatcher: !this.state.canAddDispatcher})}/>
                    {gettext('CAN-ADD-DISPATCHERS')}
                  </label>
                </div>
                <div className="checkbox">
                  <label>
                    <input type="checkbox"
                      checked={this.state.canCreateOrders}
                      onChange={() => this.setState({canCreateOrders: !this.state.canCreateOrders})}/>
                    {gettext('CAN-CREATE-ORDERS')}
                  </label>
                </div>
              </Col>
              <Col sm={6}>
                <div className="checkbox">
                  <label>
                    <input type="checkbox"
                      checked={this.state.canAddDriver}
                      onChange={() => this.setState({canAddDriver: !this.state.canAddDriver})}/>
                    {gettext('CAN-ADD-DRIVERS')}
                  </label>
                </div>
              </Col>
            </Row>
          </div>
        </Row>
        <div className="actions">
          <Button bsStyle="primary" onClick={() => this.updateOperator()}>{gettext('SAVE')}</Button>
          <Button bsStyle="danger" onClick={() => {this.resetState(); this.flipEditOperator();}}>{gettext('CANCEL')}</Button>
        </div>
      </Jumbotron>
    );
  }

  renderOperatorCreateForm() {
    return (
      <Jumbotron className="position_relative">
        <ScrollableAnchor id={'operators_anchor'}>
          <div />
        </ScrollableAnchor>
        <div className="text_align_center margin_bottom_em">
          <h3>{gettext('NEW-OPERATOR')}</h3>
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
                   onChange={(e) => this.setState({email: e.target.value})}
                   placeholder={gettext('EMAIL')}/>
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
                   onChange={(e) => this.setState({password: e.target.value})}
                   placeholder={gettext('PASSWORD')}/>
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
                   onChange={(e) => this.setState({confirmPassword: e.target.value})}
                   placeholder={gettext('CONFIRM-PASSWORD')}/>
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
                   onChange={(e) => this.setState({firstName: e.target.value})}
                   placeholder={gettext('NAME')}/>
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
                  onChange={(telNumber, selectedCountry) =>{
                    this.setState({phone: parseInt(telNumber.replace(/[^0-9]/g, ''), 10)})
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
                    this.setState({countryId: e.target.value});
                    this.props.getCitiesByText('', e.target.value);
                  }}
                  name="country">
                    <option disabled selected value={undefined}>{gettext('SELECT-COUNTRY')}</option>
                    { this.props.getCountries() }
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
                  onSelect={this.setCity}/>
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
                onChange={(e) => this.setState({teamId: e.target.value})}
                name="city">
                  <option disabled selected value={undefined}>{gettext('SELECT-TEAM')}</option>
                  { this.getTeams() }
              </FormControl>
              <div className="checkbox">
                <label>
                  <input type="checkbox"
                    checked={this.addToDefaultTeam}
                    onChange={(e) => this.toggleAddToDefaultTeam(e)}/>
                  {gettext('ADD-TO-DEFAULT-TEAM')}
                  {this.addToDefaultTeam?' - '+_.find(this.props.teams, {id: this.props.company.defaultTeamId}).name:''}
                </label>
              </div>
              </Col>
            </Row>
          </div>
          <div className="botom_line" />
          <div className="text_align_center margin_bottom_em">
            <h3>{gettext('PROPERTIES')}</h3>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={6}>
                <div>
                  <input type="checkbox"
                    checked={this.state.canAddDispatcher}
                    onChange={() => this.setState({canAddDispatcher: !this.state.canAddDispatcher})}/>
                    {gettext('CAN-ADD-DISPATCHERS')}
                </div>
                <div>
                  <input type="checkbox"
                    checked={this.state.canCreateOrders}
                    onChange={() => this.setState({canCreateOrders: !this.state.canCreateOrders})}/>
                    {gettext('CAN-CREATE-ORDERS')}
                </div>
              </Col>
              <Col sm={6}>
                <div>
                  <input type="checkbox"
                    checked={this.state.canAddDriver}
                    onChange={() => this.setState({canAddDriver: !this.state.canAddDriver})}/>
                    {gettext('CAN-ADD-DISPATCHERS')}
                </div>
              </Col>
            </Row>
          </div>
        </Row>
        <div className="actions">
          <Button bsStyle="primary" onClick={() => this.createNewOperator()}>{gettext('SAVE')}</Button>
          <Button bsStyle="danger" onClick={() => {this.resetState(); this.flipEditOperator();}}>{gettext('CANCEL')}</Button>
        </div>
      </Jumbotron>
    );
  }

  render() {
    let operators = _.uniqBy(this.props.operators, 'id');

    operators = _.filter(operators, (operator) => {
      return this.state.filterValue
              ? operator.firstName.toUpperCase().indexOf(this.state.filterValue.toUpperCase()) != -1
                  || operator.email.toUpperCase().indexOf(this.state.filterValue.toUpperCase()) != -1
              :true;
    });

    operators = _.map(operators, (operator) => {
      const isOperatorSelected = operator === this.selectedOperator;
      const className = isOperatorSelected ? 'active' : '';

      return (
        <Tr className={className} key={operator.id} onClick={(e) => this.getSelectedOperator(operator.id)}>
          <Td column={gettext('NAME')}>
            { operator.firstName }
          </Td>
          <Td column={gettext('EMAIL')}>
            { operator.email }
          </Td>
        </Tr>
      );
    });

    return (
      <div className="operator_profile">
        <Jumbotron>
          <div className="item_head_title">
            <h3>{gettext('OPERATORS')}</h3>
          </div>
          <Row className="center_flex margin_bottom_em">
            <Col sm={10}>
              <Col sm={12}>
                <FormControl
                   type="text"
                   required={true}
                   placeholder={gettext('SEARCH')}
                   onChange={(e) => this.setState({filterValue: e.target.value})}/>
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
                        {operators}
                      </Table>
                  </div>
                  <div className="milti_controls">
                   <Button className="multi_btn margin_bottom_halfem" onClick={() => {this.flipCreateOperator()}}>+</Button>
                   <Button className="multi_btn margin_bottom_halfem" onClick={() => {this.deleteOperator()}}>-</Button>
                  </div>
                </Col>
              </Col>
          </Row>
        </Jumbotron>
        {
          this.createOperator ? this.renderOperatorCreateForm() : ''
        }
        {
          this.selectedOperator
            ?this.editOperator ? this.renderOperatorEditForm():this.renderOperatorForm()
            : ''
        }
      </div>
    );
  }
}




OperatorsComponent.propTypes = {
  operators: PropTypes.array
};
