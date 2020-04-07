import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { gettext } from '../i18n/service.js';

import { Button, Form, FormGroup, FormControl, Col, ControlLabel, Panel, PageHeader } from 'react-bootstrap';

export default function CreateDriverForm (props) {
  const vehicles = _.map(props.vehicles, (vehicle) => (
    <option key={`vehicle_${vehicle.type}`} value={vehicle.size}>
      {vehicle.type}
    </option>
  ));
  return (
    <Panel>
      <PageHeader>{ gettext('DRIVER.NEW-DRIVER') }</PageHeader>
      <Form horizontal action="" onSubmit={props.submit}>

        <FormGroup controlId="formHorizontalEmail">
          <Col componentClass={ControlLabel} sm={2}>
            { gettext('EMAIL') }
          </Col>
          <Col sm={10}>
            <FormControl type="email" placeholder={ gettext('EMAIL') } name="email" />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalEmail">
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
            <FormControl type="text" placeholder={ gettext('FIRST-NAME') } name="firstName" />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalEmail">
          <Col componentClass={ControlLabel} sm={2}>
            { gettext('LAST-NAME') }
          </Col>
          <Col sm={10}>
            <FormControl type="text" placeholder={ gettext('LAST-NAME') } name="lastName" />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalEmail">
          <Col componentClass={ControlLabel} sm={2}>
            { gettext('PHONE-NUMBER') }
          </Col>
          <Col sm={10}>
            <FormControl type="text" pattern="([0-9\+\-]){7,20}" placeholder={ gettext('PHONE-NUMBER') } name="phone" />
          </Col>
        </FormGroup>

        <FormGroup controlId="formControlsSelect">
          <Col componentClass={ControlLabel} sm={2}>
            { gettext('VEHICLE-TYPE') }
          </Col>
          <Col sm={10}>
            <FormControl componentClass="select" name="vehicleType" placeholder="select">
              {vehicles}
            </FormControl>
          </Col>
        </FormGroup>

        <FormGroup controlId="formControlsNumber">
          <Col componentClass={ControlLabel} sm={2}>
            { gettext('DRIVER.DRIVER-COMMISSION-PERCENT') }
          </Col>
          <Col sm={10}>
            <FormControl type="number" required={true} name="driverCommissionPercent" />
          </Col>
        </FormGroup>

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


CreateDriverForm.propTypes = {
  submit: PropTypes.func,
  vehicles: PropTypes.array
};
