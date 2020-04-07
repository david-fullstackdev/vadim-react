import React, {PropTypes} from 'react';
import {Panel, FormGroup, ControlLabel, PageHeader, Form, Col, FormControl, Button, Row} from 'react-bootstrap';
import {Link} from 'react-router';
import DateTimeField from 'react-bootstrap-datetimepicker';
import './DriverInfoPageComponent.scss';
import _ from 'lodash';
import { gettext } from '../../i18n/service';
import getCurLang from '../../businessLogic/getCurLang.js';

export default function DriverInfoPageComponent({driver, handleDateSelected, salary, loading, submit, vehicles}) {
  if (!driver) {
    return <div>Can not get driver</div>;
  }
  const loader = loading ? <h4>Loading...</h4> : '';
  const driverName = `${driver.firstName} ${driver.lastName}`;
  const formattedSalary = salary ? `$${salary}` : '';
  const vehiclesToChooseFrom = _.map(vehicles, (vehicle) => (
    <option key={`vehicle_${vehicle.type}`} value={vehicle.size}>
      {vehicle.type}
    </option>
  ));
  return (
      <div className="driverInfoPageComponent container" dir = {getCurLang()==='ar'?'rtl':'ltr'} style={{height: '100%'}}>
        <PageHeader>{driverName}</PageHeader>
        <Row>
          <Form onSubmit={submit}>
            <Col sm={6}>

              <FormGroup controlId="formHorizontalEmail">
                <ControlLabel>
                  { gettext('FIRST-NAME') }
                </ControlLabel>
                <FormControl required={true} type="text" defaultValue={driver.firstName} name="firstName"/>
              </FormGroup>

              <FormGroup controlId="formHorizontalEmail">
                <ControlLabel>
                  { gettext('LAST-NAME') }
                </ControlLabel>
                <FormControl required={true} type="text" defaultValue={driver.lastName} name="lastName"/>
              </FormGroup>

              <FormGroup controlId="formControlsSelect">
                <ControlLabel>{ gettext('VEHICLE-TYPE') }</ControlLabel>
                <FormControl componentClass="select" defaultValue={driver.vehicleType} name="vehicleType" placeholder="select">
                  {vehiclesToChooseFrom}
                </FormControl>
              </FormGroup>

            </Col>

            <Col sm={6}>
              <FormGroup controlId="formHorizontalEmail">
                <ControlLabel>
                  { gettext('EMAIL') }
                </ControlLabel>
                <FormControl required={true} type="email" defaultValue={driver.email} name="email"/>
              </FormGroup>

              <FormGroup controlId="formHorizontalEmail">
                <ControlLabel>
                  { gettext('PASSWORD') }
                </ControlLabel>
                <FormControl required={false} minLength={4} type="password" defaultValue={driver.password} name="password"/>
              </FormGroup>

              <FormGroup controlId="formHorizontalEmail">
                <ControlLabel>
                  { gettext('CONFIRM-PASSWORD') }
                </ControlLabel>
                <FormControl required={false} minLength={4} type="password" defaultValue={driver.password} name="confirmPassword"/>
              </FormGroup>

              <FormGroup controlId="formHorizontalEmail">
                <ControlLabel>
                  { gettext('PHONE-NUMBER') }
                </ControlLabel>
                <FormControl required={true} type="text" pattern="([0-9\+\-]){5,20}" defaultValue={driver.phone} name="phone"/>
              </FormGroup>

              <FormGroup>
                <ControlLabel>
                  { gettext('DRIVER.DRIVER-COMMISSION-PERCENT') }
                </ControlLabel>
                <FormControl required={true} type="number" min="0" defaultValue={driver.driverCommissionPercent * 100} name="driverCommissionPercent"/>
              </FormGroup>
            </Col>

            <footer>
              {loader}
              <span>
                <Link to="/users">{ gettext('CANCEL') }</Link>
                <Button bsStyle="success" type="submit">{ gettext('SAVE') }</Button>
              </span>
            </footer>
          </Form>
        </Row>
        <Row>
          <Panel>
            <h3>{ gettext('SELECT-DATES-T0-SHOW-DRIVER-SALARY') }</h3>
            <FormGroup controlId="formHorizontalEmail">
              <ControlLabel>
                { gettext('START-DATE') }
              </ControlLabel>
              <DateTimeField
                mode="date"
                viewMode="days"
                onChange={(date) => handleDateSelected('start', date)}
                />
            </FormGroup>

            <FormGroup controlId="formHorizontalEmail">
              <ControlLabel>
                { gettext('END-DATE') }
              </ControlLabel>
              <DateTimeField
                mode="date"
                viewMode="days"
                onChange={(date) => handleDateSelected('end', date)}
                />
            </FormGroup>
            <h4>{formattedSalary}</h4>
          </Panel>
        </Row>
      </div>
  );
}




DriverInfoPageComponent.propTypes = {
  driver: PropTypes.object,
  handleDateSelected: PropTypes.func,
  loading: PropTypes.bool,
  submit: PropTypes.func,
  salary: PropTypes.number,
  vehicles: PropTypes.array
};
