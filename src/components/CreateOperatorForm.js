import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import { gettext } from '../i18n/service.js';
import getTooltip from '../businessLogic/getTooltip.js';
import { Button, Form, FormGroup, Tooltip, OverlayTrigger, FormControl, Col, ControlLabel, Checkbox, Panel, PageHeader } from 'react-bootstrap';

export default function CreateOperatorForm(props) {
  return (
    <Panel>

      <PageHeader>{ gettext('OPERATOR.NEW-OPERATOR') }</PageHeader>

      <Form horizontal action="" onSubmit={props.submit}>

        <Col sm={8}>
          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={2}>
              { gettext('EMAIL') }
            </Col>
            <Col sm={10}>
              <FormControl type="text" placeholder={gettext('EMAIL')} name="email"  />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalPassword">
            <Col componentClass={ControlLabel} sm={2}>
              { gettext('PASSWORD') }
            </Col>
            <Col sm={10}>
              <FormControl type="password" placeholder={ gettext('PASSWORD') } name="password" />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={2}>
              { gettext('FIRST-NAME') }
            </Col>
            <Col sm={10}>
              <FormControl type="text" placeholder={ gettext('FIRST-NAME') } name="firstName"  />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={2}>
              { gettext('LAST-NAME') }
            </Col>
            <Col sm={10}>
              <FormControl type="text" placeholder={ gettext('LAST-NAME') } name="lastName"  />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalPassword">
            <Col componentClass={ControlLabel} sm={2}>
              { gettext('PHONE-NUMBER') }
            </Col>
            <Col sm={10}>
              <FormControl type="text" pattern="([0-9\+\-]){7,20}" placeholder={ gettext('PHONE-NUMBER') } name="phone" />
            </Col>
          </FormGroup>
        </Col>

        <Col sm={4}>
          <FormGroup>
            <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-CAN-ADD-DRIVERS'))}>
              <Col smOffset={2} sm={10}>
                  <Checkbox  name="canAddDriver">{ gettext('CAN-ADD-DRIVERS') }</Checkbox>
              </Col>
            </OverlayTrigger>
          </FormGroup>

          <FormGroup>
            <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-CAN-ADD-DISPATCHERS'))}>
              <Col smOffset={2} sm={10}>
                  <Checkbox  name="canAddDispatcher">{ gettext('CAN-ADD-DISPATCHERS') }</Checkbox>
              </Col>
            </OverlayTrigger>
          </FormGroup>

          <FormGroup>
            <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-CAN-ADD-OPERATORS'))}>
              <Col smOffset={2} sm={10}>
                  <Checkbox  name="canAddOperator">{ gettext('CAN-ADD-OPERATORS') }</Checkbox>
              </Col>
            </OverlayTrigger>
          </FormGroup>
        </Col>

        <FormGroup>
          <Col smOffset={2} sm={10}>
            <Button type="submit">
              { gettext('SUBMIT') }
            </Button>
            <Link to="/users">
              { gettext('CANCEL') }
            </Link>
          </Col>
        </FormGroup>

      </Form>
    </Panel>
  );
}


CreateOperatorForm.propTypes = {
  submit: PropTypes.func
};
