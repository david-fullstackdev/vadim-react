import React, { PropTypes } from 'react';
import { Jumbotron, Button, Row, PageHeader, FormGroup, FormControl, Col, ControlLabel, Glyphicon, OverlayTrigger } from 'react-bootstrap';
import { gettext } from '../../../i18n/service.js';
import * as Validation from '../../../businessLogic/fieldValidation.js';
import _ from 'lodash';
import getTooltip from '../../../businessLogic/getTooltip.js';
import { DistanceBasedCostsForm } from './DistanceBasedCostsForm';

export default class CompanyComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.editCompany = false;
    _.bindAll(this, ['renderCompany', 'validateCompanyFields', 'updateCompany', 'resetState', 'renderEditCompany',
      'flipEditCompany']);

    this.state = {
      name: props.company.name,
      currency: props.company.currency,
      deliveryCommission: props.company.deliveryCommission,
      expressDeliveryCommission: props.company.expressDeliveryCommission,
      additionalPickupPointCost: props.company.additionalPickupPointCost,
      avatar: props.company.avatar,
      autoAssignRadius: props.company.autoAssignRadius,
      autoAssignTime: props.company.autoAssignTime,
      autoAssignTryNumber: props.company.autoAssignTryNumber
    }

    this.baseState = this.state;
  }

  flipEditCompany() {
    this.editCompany = !this.editCompany;
    this.resetState();
  }

  updateCompany() {
    if (!this.validateCompanyFields())
      return false;
    else {
      delete this.state.avatar;
      this.props.startSpinner();
      this.props.updateThisCompany(this.props.company.id, this.state);
      this.props.getCompany(this.props.account.id);
      this.props.endSpinner();
      this.resetState();
    }
  }

  resetState() {
    this.setState(this.baseState);
  }

  validateCompanyFields() {
    return Validation.nameValidation(this.state.name, this.props.showMessage)
      && Validation.numberWithDotValdation(this.state.deliveryCommission, this.props.showMessage);
  }

  renderCompany() {
    return (
      <div>
        <div className="text_align_center margin_bottom_halfem">
          <h4>{gettext('COMPANY-INFORMATION')}</h4>
        </div>
        <Row>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('COMPANY-NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.company.name}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('OWNER')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.account.name}</h4></label>
              </Col>
            </Row>

            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('CASH-ON-DELVIERY-CAP') + ' '}
                  <OverlayTrigger placement="top" overlay={getTooltip(gettext('NOTIFICATION-UP-RADIUS-TOOLTIP'))}>
                    <Glyphicon glyph="question-sign" />
                  </OverlayTrigger>
                </h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.company.cashOnDeliveryCap}</h4></label>
              </Col>
            </Row>

          </div>
          <div className="botom_line" />
          <div className="text_align_center margin_bottom_em">
            <h4>{gettext('BILLING-SETTINGS')}</h4>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('CURRENCY')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.company.currency}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('ORDER-COST') + ' '}
                  <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-ORDER-COST'))}>
                    <Glyphicon glyph="question-sign" />
                  </OverlayTrigger>
                </h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.company.orderCost}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('ADDITIONAL-PICKUP-COST') + ' '}
                  <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-ADDITIONAL-PICKUP-COST'))}>
                    <Glyphicon glyph="question-sign" />
                  </OverlayTrigger>
                </h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.company.additionalPickupCost}</h4></label>
              </Col>
            </Row>
          </div>

          <div className="botom_line" />
          <div className="text_align_center margin_bottom_em">
            <h4>{gettext('DELIVERY-COMMISSION-SETTINGS')}</h4>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('REGULAR-COMMISSION') + ' '}
                  <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-DELIVERY-COMMISSION'))}>
                    <Glyphicon glyph="question-sign" />
                  </OverlayTrigger>
                </h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.company.deliveryCommission}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('EXPRESS-DELIVERY-COMMISSION') + ' '}
                  <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-EXPRESS-COMMISSION'))}>
                    <Glyphicon glyph="question-sign" />
                  </OverlayTrigger>
                </h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.company.expressDeliveryCommission}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('ADDITIONAL-PICKUP-COST') + ' '}
                  <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-ADDITIONAL-PICKUP-POINT-COST'))}>
                    <Glyphicon glyph="question-sign" />
                  </OverlayTrigger>
                </h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.company.additionalPickupPointCost}</h4></label>
              </Col>
            </Row>

          </div>

          <div className="botom_line" />

          <DistanceBasedCostsForm
            values={this.props.company.distanceBasedModifiers}
            tooltips={true}>
          </DistanceBasedCostsForm>

          <div className="botom_line" />

          <div className="text_align_center margin_bottom_em">
            <h4>{gettext('DELIVERY-RESTRICTION-CONTROLS')}</h4>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('PICK-UP-RADIUS') + ' '}
                  <OverlayTrigger placement="top" overlay={getTooltip(gettext('PICK-UP-RADIUS-TOOLTIP'))}>
                    <Glyphicon glyph="question-sign" />
                  </OverlayTrigger>
                </h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.company.radius}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('NOTIFICATION-UP-RADIUS') + ' '}
                  <OverlayTrigger placement="top" overlay={getTooltip(gettext('NOTIFICATION-UP-RADIUS-TOOLTIP'))}>
                    <Glyphicon glyph="question-sign" />
                  </OverlayTrigger>
                </h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.company.notificationRadius}</h4></label>
              </Col>
            </Row>
          </div>


          <div className="botom_line" />

          <div className="text_align_center margin_bottom_em">
            <h4>{gettext('AUTO-ASSIGN-SETINGS')}</h4>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('RADIUS') + ' '}
                  <OverlayTrigger placement="top" overlay={getTooltip(gettext('RADIUS-TOOLTIP'))}>
                    <Glyphicon glyph="question-sign" />
                  </OverlayTrigger>
                </h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.company.autoAssignRadius}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('ASSIGN-TIME') + ' '}
                  <OverlayTrigger placement="top" overlay={getTooltip(gettext('ASSIGN-TIME-TOOLTIP'))}>
                    <Glyphicon glyph="question-sign" />
                  </OverlayTrigger>
                </h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.company.autoAssignTime}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('TRY-NUMBER') + ' '}
                  <OverlayTrigger placement="top" overlay={getTooltip(gettext('TRY-NUMBER-TOOLTIP'))}>
                    <Glyphicon glyph="question-sign" />
                  </OverlayTrigger>
                </h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.company.autoAssignTryNumber}</h4></label>
              </Col>
            </Row>
          </div>

        </Row>
        <div className="edit_link">
          <a onClick={() => this.flipEditCompany()}><h4>{gettext('EDIT')}</h4></a>
        </div>
      </div>
    )
  }

  setIfNumber(event, oldValue, fieldldName) {
    if (isNaN(event.target.value)) {
      event.target.value = oldValue;
    } else {
      this.setState({ [fieldldName]: Number(event.target.value) });
    }
  }

  renderEditCompany() {
    return (
      <div>
        <div className="text_align_center margin_bottom_halfem">
          <h4>{gettext('COMPANY-INFORMATION')}</h4>
        </div>
        <Row>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('COMPANY-NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.props.company.name}
                  onChange={(e) => this.setState({ name: e.target.value })}
                  placeholder={gettext('COMPANY-NAME')} />
              </Col>
            </Row>

            <Row>
              <Col sm={4}>
                <ControlLabel><h4> {gettext('CASH-ON-DELVIERY-CAP')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.props.company.cashOnDeliveryCap}
                  onChange={(e) => this.setState({ cashOnDeliveryCap: e.target.value })}
                  placeholder={500} />
              </Col>
            </Row>

          </div>
          <div className="botom_line" />
          <div className="text_align_center margin_bottom_em">
            <h4>{gettext('DELIVERY-COMMISSION-SETTINGS')}</h4>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('REGULAR-COMMISSION')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.props.company.deliveryCommission}
                  onChange={(e) => this.setState({ deliveryCommission: e.target.value })}
                  placeholder={gettext('DELIVERY-COMMISSION')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('EXPRESS-DELIVERY-COMMISSION')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.props.company.expressDeliveryCommission}
                  onChange={(e) => this.setState({ expressDeliveryCommission: e.target.value })}
                  placeholder={gettext('EXPRESS-DELIVERY-COMMISSION')} />
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
                  defaultValue={this.props.company.additionalPickupPointCost}
                  onChange={(e) => this.setState({ additionalPickupPointCost: e.target.value })}
                  placeholder={gettext('ADDITIONAL-PICKUP-COST')} />
              </Col>
            </Row>
          </div>

          <div className="botom_line" />

          <DistanceBasedCostsForm
            defaultValues={this.props.company.distanceBasedModifiers}
            isForm={true}
            onChangeCallback={(key, value) => {
              let { distanceBasedModifiers } = this.props.company;
              if (distanceBasedModifiers === void 0) {
                distanceBasedModifiers = {};
              }
              distanceBasedModifiers[key] = Number(value);
              this.setState({ distanceBasedModifiers: distanceBasedModifiers });
            }}>
          </DistanceBasedCostsForm>

          <div className="botom_line" />

          <div className="text_align_center margin_bottom_em">
            <h4>{gettext('DELIVERY-RESTRICTION-CONTROLS')}</h4>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('PICK-UP-RADIUS')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.props.company.radius}
                  onChange={(e) => this.setState({ radius: e.target.value })}
                  placeholder={50} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('NOTIFICATION-UP-RADIUS')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.props.company.notificationRadius}
                  onChange={(e) => this.setState({ notificationRadius: e.target.value })}
                  placeholder={500} />
              </Col>
            </Row>
          </div>


          <div className="text_align_center margin_bottom_em">
            <h4>{gettext('AUTO-ASSIGN-SETINGS')}</h4>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('RADIUS')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.props.company.autoAssignRadius}
                  onChange={(e) => this.setIfNumber(e, this.props.company.autoAssignRadius, 'autoAssignRadius')}
                  placeholder={50} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('ASSIGN-TIME')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.props.company.autoAssignTime}
                  onChange={(e) => this.setIfNumber(e, this.props.company.autoAssignTime, 'autoAssignTime')}
                  placeholder={500} />
              </Col>
            </Row>

            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('TRY-NUMBER')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.props.company.autoAssignTryNumber}
                  onChange={(e) => this.setIfNumber(e, this.props.company.autoAssignTryNumber, 'autoAssignTryNumber')}
                  placeholder={500} />
              </Col>
            </Row>
          </div>

        </Row>
        <div className="actions">
          <Button bsStyle="primary" onClick={() => { this.updateCompany(); this.flipEditCompany() }}>{gettext('SAVE')}</Button>
          <Button bsStyle="danger" onClick={() => this.flipEditCompany()}>{gettext('CANCEL')}</Button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <Jumbotron className="company_profile">
        <div className="item_head_title">
          <h3>{gettext('COMPANY')}</h3>
        </div>
        {!this.editCompany ? this.renderCompany() : this.renderEditCompany()}
      </Jumbotron>
    );
  }
}




CompanyComponent.propTypes = {

};
