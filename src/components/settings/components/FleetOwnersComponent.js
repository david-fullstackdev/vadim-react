import React, {PropTypes} from 'react';
import { Jumbotron, Button, Row, PageHeader,FormGroup, FormControl, Col, ControlLabel } from 'react-bootstrap';
import {Table, Tr, Td, Th, Thead} from 'reactable';
import { gettext } from '../../../i18n/service.js';
import _ from 'lodash';
import * as Validation from '../../../businessLogic/fieldValidation.js';
import Switcher from 'react-switcher';

export default class FleetOwnersComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.selectedFleet = undefined;
    this.editFleet = false;
    this.createFleet = false;

    _.bindAll(this, ['renderFleetForm', 'flipCreateFleet', 'getSelectedFleet', 'renderFleetEditForm',
                      'flipEditFleet', 'getTeams', 'resetBools', 'resetState', 'validateFleetFields',
                      'createNewFleet', 'updateFleet', 'deleteFleet', 'getOwnerName', 'getOwners', 'activateDeactivateFleet', 'renderActivateButtons']);

    this.state = {
      name: undefined,
      email: undefined,
      phone: undefined,
      password: undefined,
      confirmPassword: undefined,
      filterValue: undefined
    }

    this.baseState = this.state;
  }

  renderActivateButtons() {
    return (
      <div className="switcher">
        <Switcher
          on={this.selectedFleet.active}
          onClick={() => this.activateDeactivateFleet()}>
        </Switcher>
      </div>
    )
  }

  activateDeactivateFleet() {
    let fields = {
      id: this.state.id,
      active: !this.selectedFleet.active
    }

    this.props.startSpinner();
    this.props.updateFleet(fields);
  }

  getOwners() {
    return _.map(this.props.companies, (company) => (
      <option key={`team_${company.id}`} value={company.id}>
        {company.name}
      </option>
    ));
  }

  getOwnerName(id) {
    let owner = _.find(this.props.companies, {id: id});
    if(owner)
      return owner.name;
    else
      return gettext('CANT-GET-OWNER');
  }

  getSelectedFleet(id) {
    this.resetBools();
    this.selectedFleet = _.find(this.props.fleets, { 'id': id });
    this.setState(this.selectedFleet);
  }

  getTeams() {
    return _.map(this.props.teams, (team) => (
      <option key={`team_${team.id}`} value={team.id}>
        {team.name}
      </option>
    ));
  }

  flipCreateFleet() {
    this.createFleet = !this.createFleet;
    if(this.createFleet)
      this.setState({company: { name: undefined, currency: undefined }});
    this.resetState();
  }

  flipEditFleet() {
    this.resetBools();
    this.editFleet = !this.editFleet;
    this.forceUpdate();
  }

  resetState() {
    this.selectedFleet = undefined;
    for ( var prop in this.state ) {
      delete this.state[prop];
    }
    this.setState(this.baseState);

  }

  resetBools() {
    this.createFleet = false;
    this.editFleet = false;
  }

  createNewFleet() {
    if(!this.validateFleetFields())
      return false;
    else if(!Validation.passValdationForCreating(this.state.password, this.props.showMessage))
      return false;
    else {
      delete this.state['confirmPassword'];
      this.props.startSpinner();
      this.props.createFleet(this.state);
      this.resetBools();
      this.resetState();
    }
  }

  updateFleet() {
    if(!this.validateFleetFields())
      return false;
    else {
      delete this.state['confirmPassword'];
      delete this.state['filterValue'];
      this.props.startSpinner();
      this.props.updateFleet(this.state);
      let fleetId = this.state.id;
      this.resetBools();
      this.resetState();
      this.getSelectedFleet(fleetId);
    }
  }

  deleteFleet() {
    this.props.startSpinner();
    this.props.deleteFleet(this.state.teamId, 'operator', this.state.id);
    this.resetBools();
    this.resetState();
  }

  validateFleetFields() {
    return Validation.emailValdation(this.state.email, this.props.showMessage)
            && Validation.passValdation(this.state.password, this.state.confirmPassword, this.props.showMessage)
            && Validation.phoneValdation(this.state.phone, this.props.showMessage);
  }

  renderFleetForm() {
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
                <label><h4>{this.selectedFleet.email}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedFleet.name}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('PHONE')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedFleet.phone}</h4></label>
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
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('OWNER')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.getOwnerName(this.selectedFleet.companyId)}</h4></label>
              </Col>
            </Row>
          </div>
        </Row>
        <div className="edit_link">
          <a onClick={() => this.flipEditFleet()}><h4>{gettext('EDIT')}</h4></a>
        </div>
      </Jumbotron>
    );
  }

  renderFleetEditForm() {
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
              <Col sm={8}>
                <FormControl
                   type="text"
                   required={true}
                   defaultValue={this.selectedFleet.email}
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
                   defaultValue={this.selectedFleet.name}
                   onChange={(e) => this.setState({firstName: e.target.value})}
                   placeholder={gettext('NAME')}/>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('PHONE')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                   type="text"
                   required={true}
                   defaultValue={this.selectedFleet.phone}
                   onChange={(e) => this.setState({phone: e.target.value})}
                   placeholder={gettext('PHONE')}/>
              </Col>
            </Row>
          </div>
        </Row>
        <div className="actions">
          <Button bsStyle="primary" onClick={() => this.updateFleet()}>{gettext('SAVE')}</Button>
          <Button bsStyle="danger" onClick={() => {this.resetState(); this.flipEditFleet();}}>{gettext('CANCEL')}</Button>
        </div>
      </Jumbotron>
    );
  }

  renderFleetCreateForm() {
    return (
      <Jumbotron className="position_relative">

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
                   onChange={(e) => this.setState({name: e.target.value})}
                   placeholder={gettext('NAME')}/>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('PHONE')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                   type="text"
                   required={true}
                   onChange={(e) => this.setState({phone: e.target.value})}
                   placeholder={gettext('PHONE')}/>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('LANGUAGE')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
              <FormControl
                componentClass="select"
                onChange={(e) => this.setState({language: e.target.value})}
                name="language">
                  <option selected value={'en'}>EN</option>
                  <option selected value={'ar'}>AR</option>
              </FormControl>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('COMPANY-NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
              <FormControl
                 type="text"
                 required={true}
                 onChange={(e) => {
                   let company = this.state.company;
                   company.name = e.target.value;
                   this.setState({company: company})
                 }}
                 placeholder={gettext('COMPANY-NAME')}/>
              </Col>
            </Row>
          </div>
        </Row>
        <div className="actions">
          <Button bsStyle="primary" onClick={() => this.createNewFleet()}>{gettext('SAVE')}</Button>
          <Button bsStyle="danger" onClick={() => {this.resetState(); this.flipEditFleet();}}>{gettext('CANCEL')}</Button>
        </div>
      </Jumbotron>
    );
  }

  render() {
    let fleets = _.uniqBy(this.props.fleets, 'id');

    fleets = _.filter(fleets, (operator) => {
      return this.state.filterValue
              ? operator.name.toUpperCase().indexOf(this.state.filterValue.toUpperCase()) != -1
                  || operator.email.toUpperCase().indexOf(this.state.filterValue.toUpperCase()) != -1
                      || this.getOwnerName(operator.companyId).toUpperCase().indexOf(this.state.filterValue.toUpperCase()) != -1
              :true;
    });

    fleets = _.map(fleets, (fleet) => {
      const isFleetSelected = fleet === this.selectedFleet;
      const className = isFleetSelected ? 'active' : '';

      return (
        <Tr className={className} key={fleet.id} onClick={(e) => this.getSelectedFleet(fleet.id)}>
          <Td column={gettext('NAME')}>
            { fleet.name }
          </Td>
          <Td column={gettext('EMAIL')}>
            { fleet.email }
          </Td>
          <Td column={gettext('OWNER')}>
            { this.getOwnerName(fleet.companyId) }
          </Td>
        </Tr>
      );
    });

    return (
      <div className="operator_profile">
        <Jumbotron>
          <div className="item_head_title">
            <h3>{gettext('FLEETS')}</h3>
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
                          <Th column={gettext('OWNER')}>
                            <span title={gettext('OWNER')}>{gettext('OWNER')}</span>
                          </Th>
                        </Thead>
                        {fleets}
                      </Table>
                  </div>
                  <div className="milti_controls">
                   <Button className="multi_btn margin_bottom_halfem" onClick={() => {this.flipCreateFleet()}}>+</Button>
                   <Button className="multi_btn margin_bottom_halfem" onClick={() => {this.deleteFleet()}}>-</Button>
                  </div>
                </Col>
              </Col>
          </Row>
        </Jumbotron>
        {
          this.createFleet ? this.renderFleetCreateForm() : ''
        }
        {
          this.selectedFleet
            ?this.editFleet ? this.renderFleetEditForm():this.renderFleetForm()
            : ''
        }
      </div>
    );
  }
}




FleetOwnersComponent.propTypes = {
  fleets: PropTypes.array
};
