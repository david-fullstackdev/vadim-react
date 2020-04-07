import React, {PropTypes} from 'react';
import { Jumbotron, Button, Row, PageHeader,FormGroup, FormControl, Col, ControlLabel, Glyphicon,OverlayTrigger } from 'react-bootstrap';
import {Table, Tr, Td, Th, Thead} from 'reactable';
import { gettext } from '../../../i18n/service.js';
import _ from 'lodash';
import * as Validation from '../../../businessLogic/fieldValidation.js';
import getTooltip from '../../../businessLogic/getTooltip.js';
import Switcher from 'react-switcher';

export default class CompaniesComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.selectedCompany = undefined;
    this.editCompany = false;
    this.createCompany = false;

    _.bindAll(this, ['renderCompanyForm', 'flipCreateCompany', 'getSelectedCompany', 'renderCompanyEditForm',
                      'flipEditCompany', 'getTeams', 'resetBools', 'resetState', 'validateCompanyFields',
                      'createNewCompany', 'updateCompany', 'deleteCompany', 'renderActivateButtons', 'activateDeactivateCompany']);

    this.state = {
      name: undefined,
      currency: undefined,
      driverReward: undefined,
      deliveryCommission: undefined,
      expressDeliveryCommission: undefined,
      additionalPickupPointCost: undefined,
      filterValue: undefined
    }

    this.baseState = this.state;
  }

  renderActivateButtons() {
    return (
      <div className="switcher">
        <Switcher
          on={this.selectedCompany.active}
          onClick={() => this.activateDeactivateCompany()}>
        </Switcher>
      </div>
    )
  }

  activateDeactivateCompany() {
    let fields = {
      id: this.state.id,
      active: !this.selectedCompany.active
    }

    this.props.startSpinner();
    this.props.updateCompany(this.selectedCompany.id, fields);
  }

  getSelectedCompany(id) {
    this.resetBools();
    this.selectedCompany = _.find(this.props.companies, { 'id': id });
    this.setState(this.selectedCompany);
  }

  getTeams() {
    return _.map(this.props.teams, (team) => (
      <option key={`team_${team.id}`} value={team.id}>
        {team.name}
      </option>
    ));
  }

  flipCreateCompany() {
    this.createCompany = !this.createCompany;
    this.resetState();
  }

  flipEditCompany() {
    this.resetBools();
    this.editCompany = !this.editCompany;
    this.forceUpdate();
  }

  resetState() {
    this.selectedCompany = undefined;
    for ( var prop in this.state ) {
      delete this.state[prop];
    }
    this.setState(this.baseState);

  }

  resetBools() {
    this.createCompany = false;
    this.editCompany = false;
  }

  createNewCompany() {
    if(!this.validateCompanyFields())
      return false;
    else {
      this.props.startSpinner();
      this.props.createCompany(this.state);
      this.resetBools();
      this.resetState();
    }
  }

  updateCompany() {
    if(!this.validateCompanyFields())
      return false;
    else {
      delete this.state['confirmPassword'];
      delete this.state['isDefault'];
      this.props.startSpinner();
      this.props.updateCompany(this.selectedCompany.id, this.state);
      let companyId = this.state.id;
      this.resetBools();
      this.resetState();
      this.getSelectedCompany(discompanyIdpatcherId);
    }
  }

  deleteCompany() {
    this.props.startSpinner();
    this.props.deleteCompany(this.state.teamId, 'operator', this.state.id);
    this.resetBools();
    this.resetState();
  }

  validateCompanyFields() {
    return  Validation.nameValidation(this.state.name, this.props.showMessage);
  }

  renderCompanyForm() {
    return (
      <Jumbotron className="position_relative">

        <div className="text_align_center margin_bottom_em">
          <h3>{gettext('COMPANY-INFO')}</h3>
        </div>
        <div className="text_align_center margin_bottom_em">
          <h4>{gettext('COMPANY-INFORMATION')}</h4>
        </div>
        <Row>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedCompany.name}</h4></label>
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
                <ControlLabel><h4>{gettext('DRIVER-REWARD')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedCompany.driverReward}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('DELIVERY-COMMISSION')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedCompany.deliveryCommission}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('EXPRESS-COMMISSION')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedCompany.expressDeliveryCommission}</h4></label>
              </Col>
            </Row>
          </div>
        </Row>
        <Row>
          <div className="botom_line" />
        </Row>
        <div className="text_align_center margin_bottom_em">
          <h4>{gettext('BILLING-SETTINGS')}</h4>
        </div>
        <Row>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('CURRENCY')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedCompany.currency}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('ORDER-COST')+' '}
                  <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-ORDER-COST'))}>
                    <Glyphicon glyph="question-sign" />
                  </OverlayTrigger>
                </h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedCompany.orderCost}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('ADDITIONAL-PICKUP-COST')+' '}
                  <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-ADDITIONAL-PICKUP-COST'))}>
                    <Glyphicon glyph="question-sign" />
                  </OverlayTrigger>
                </h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.selectedCompany.additionalPickupPointCost}</h4></label>
              </Col>
            </Row>
          </div>
        </Row>
        <div className="edit_link">
          <a onClick={() => this.flipEditCompany()}><h4>{gettext('EDIT')}</h4></a>
        </div>
      </Jumbotron>
    );
  }

  renderCompanyEditForm() {
    return (
      <Jumbotron className="position_relative">

        <div className="text_align_center margin_bottom_em">
          <h3>{gettext('COMPANY-INFO')}</h3>
        </div>
        <div className="text_align_center margin_bottom_em">
          <h4>{gettext('COMPANY-INFORMATION')}</h4>
        </div>
        <Row>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                   type="text"
                   required={true}
                   defaultValue={this.selectedCompany.name}
                   onChange={(e) => this.setState({name: e.target.value})}
                   placeholder={gettext('NAME')}/>
              </Col>
            </Row>

            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('DRIVER-REWARD')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                   type="text"
                   required={true}
                   defaultValue={this.selectedCompany.driverReward}
                   onChange={(e) => this.setState({driverReward: e.target.value})}
                   placeholder={gettext('DRIVER-REWARD')}/>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('DELIVERY-COMMISSION')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                   type="text"
                   required={true}
                   defaultValue={this.selectedCompany.deliveryCommission}
                   onChange={(e) => this.setState({deliveryCommission: e.target.value})}
                   placeholder={gettext('DELIVERY-COMMISSION')}/>
              </Col>
            </Row>

            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('EXPRESS-COMMISSION')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                   type="text"
                   required={true}
                   defaultValue={this.selectedCompany.expressDeliveryCommission}
                   onChange={(e) => this.setState({expressDeliveryCommission: e.target.value})}
                   placeholder={gettext('EXPRESS-COMMISSION')}/>
              </Col>
            </Row>
          </div>
        </Row>
        <Row>
          <div className="botom_line" />
        </Row>
        <div className="text_align_center margin_bottom_em">
          <h4>{gettext('BILLING-SETTINGS')}</h4>
        </div>
        <Row>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('CURRENCY')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                   type="text"
                   required={true}
                   defaultValue={this.selectedCompany.currency}
                   onChange={(e) => this.setState({currency: e.target.value})}
                   placeholder={gettext('CURRENCY')}/>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('ORDER-COST')+' '}
                      <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-ORDER-COST'))}>
                        <Glyphicon glyph="question-sign" />
                      </OverlayTrigger>
                    </h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                   type="text"
                   required={true}
                   defaultValue={this.selectedCompany.orderCost}
                   onChange={(e) => this.setState({orderCost: e.target.value})}
                   placeholder={gettext('ORDER-COST')}/>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('ADDITIONAL-PICKUP-COST')+' '}
                  <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-ADDITIONAL-PICKUP-COST'))}>
                    <Glyphicon glyph="question-sign" />
                  </OverlayTrigger>
                </h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                   type="text"
                   required={true}
                   defaultValue={this.selectedCompany.additionalPickupPointCost}
                   onChange={(e) => this.setState({additionalPickupPointCost: e.target.value})}
                   placeholder={gettext('ADDITIONAL-PICKUP-COST')}/>
              </Col>
            </Row>
          </div>
        </Row>
        <div className="actions">
          <Button bsStyle="primary" onClick={() => this.updateCompany()}>{gettext('SAVE')}</Button>
          <Button bsStyle="danger" onClick={() => {this.resetState(); this.flipEditCompany();}}>{gettext('CANCEL')}</Button>
        </div>
      </Jumbotron>
    );
  }

  renderCompanyCreateForm() {
    return (
      <Jumbotron className="position_relative">

        <div className="text_align_center margin_bottom_em">
          <h3>{gettext('NEW-OPERATOR')}</h3>
        </div>
        <Row>
          <div className="user_data center_div">
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
                <ControlLabel><h4>{gettext('CURRENCY')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                   type="text"
                   required={true}
                   onChange={(e) => this.setState({currency: e.target.value})}
                   placeholder={gettext('CURRENCY')}/>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('DRIVER-REWARD')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                   type="text"
                   required={true}
                   onChange={(e) => this.setState({driverReward: e.target.value})}
                   placeholder={gettext('DRIVER-REWARD')}/>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('DELIVERY-COMMISSION')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                   type="text"
                   required={true}
                   onChange={(e) => this.setState({deliveryCommission: e.target.value})}
                   placeholder={gettext('DELIVERY-COMMISSION')}/>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('ADDITIONAL-PICKUP-COST')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                   type="text"
                   required={true}
                   onChange={(e) => this.setState({additionalPickupPointCost: e.target.value})}
                   placeholder={gettext('ADDITIONAL-PICKUP-COST')}/>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('EXPRESS-COMMISSION')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                   type="text"
                   required={true}
                   onChange={(e) => this.setState({expressDeliveryCommission: e.target.value})}
                   placeholder={gettext('EXPRESS-COMMISSION')}/>
              </Col>
            </Row>
          </div>
        </Row>
        <div className="actions">
          <Button bsStyle="primary" onClick={() => this.createNewCompany()}>{gettext('SAVE')}</Button>
          <Button bsStyle="danger" onClick={() => {this.resetState(); this.flipEditCompany();}}>{gettext('CANCEL')}</Button>
        </div>
      </Jumbotron>
    );
  }

  render() {
    let companies = _.filter(this.props.companies, (company) => {
      return this.state.filterValue && company.name
              ? company.name.toUpperCase().indexOf(this.state.filterValue.toUpperCase()) != -1
              :true;
    });

    companies = _.map(companies, (company) => {
      const isCompanySelected = company === this.selectedCompany;
      const className = isCompanySelected ? 'active' : '';
      return (
        <Tr className={className} key={company.id} onClick={(e) => this.getSelectedCompany(company.id)}>
          <Td column={gettext('COMPANY_NAME')}>
            { company.name }
          </Td>
          <Td column={gettext('FLEETOWNER_NAME')}>
            { _.find(this.props.fleets, {id:company.ownerId})?_.find(this.props.fleets, {id:company.ownerId}).name:'' }
          </Td>
        </Tr>
      );
    });

    return (
      <div className="operator_profile">
        <Jumbotron>
          <div className="item_head_title">
            <h3>{gettext('COMPANIES')}</h3>
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
                      <Table className="company_table companies_table table-fixedheader">
                        <Thead>
                          <Th column={gettext('COMPANY_NAME')}>
                            <span title={gettext('COMPANY_NAME')}>{gettext('COMPANY_NAME')}</span>
                          </Th>
                          <Th column={gettext('FLEETOWNER_NAME')}>
                            <span title={gettext('FLEETOWNER_NAME')}>{gettext('FLEETOWNER_NAME')}</span>
                          </Th>
                        </Thead>
                        {companies}
                      </Table>
                  </div>
                  {/*}<div className="milti_controls">
                   <Button className="multi_btn margin_bottom_halfem" onClick={() => {this.flipCreateCompany()}}>+</Button>
                   <Button className="multi_btn margin_bottom_halfem" onClick={() => {this.deleteCompany()}}>-</Button>
                  </div>*/}
                </Col>
              </Col>
          </Row>
        </Jumbotron>
        {
          this.createCompany ? this.renderCompanyCreateForm() : ''
        }
        {
          this.selectedCompany
            ?this.editCompany ? this.renderCompanyEditForm():this.renderCompanyForm()
            : ''
        }
      </div>
    );
  }
}




CompaniesComponent.propTypes = {
};
