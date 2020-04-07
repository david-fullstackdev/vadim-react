import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import { Button, Col, PageHeader, Form, FormGroup,ControlLabel, FormControl } from 'react-bootstrap';
import '../../styles/editProfilePage.scss';
import { gettext } from '../../i18n/service';
import getCurLang from '../../businessLogic/getCurLang.js';

export default function PlatformEditComponent(props) {

  return (
    <div dir = {getCurLang()==='ar'?'rtl':'ltr'}>
      <PageHeader>{ gettext('EDIT-PLATFORM-PROFILE') }</PageHeader>
      <Form  onSubmit={(e) => props.saveChanges(e)} className="createUserForm">
        <Col sm={12} className = {getCurLang()==='ar'?'formReverse':''}>
          <Col sm={6}>
            <FormGroup controlId="formHorizontalEmail">
              <Col componentClass={ControlLabel} sm={3}>
                { gettext('EMAIL') }
              </Col>
              <Col sm={9}>
                <FormControl required={true} placeholder={ gettext('EMAIL') } type="email" defaultValue={props.fields.email} name="email"/>
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalEmail">
              <Col componentClass={ControlLabel} sm={3}>
                { gettext('PASSWORD') }
              </Col>
              <Col sm={9}>
                <FormControl required={false} placeholder={ gettext('PASSWORD') } minLength={4} type="password" defaultValue={props.fields.password} name="password"/>
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalEmail">
              <Col componentClass={ControlLabel} sm={3}>
                { gettext('CONFIRM') }
              </Col>
              <Col sm={9}>
                <FormControl required={false} placeholder={ gettext('CONFIRM-PASSWORD') } minLength={4} type="password" defaultValue={props.fields.password} name="confirmPassword"/>
              </Col>
            </FormGroup>
          </Col>

          <Col sm={6}>
            <FormGroup controlId="formHorizontalEmail">
              <Col componentClass={ControlLabel} sm={3}>
                { gettext('PLATFORM-NAME') }
              </Col>
              <Col sm={9}>
                <FormControl type="text" required={true} defaultValue={props.fields.name} placeholder={ gettext('PLATFORM-NAME') } name="name" />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalEmail">
              <Col componentClass={ControlLabel} sm={3}>
                { gettext('PHONE-NUMBER') }
              </Col>
              <Col sm={9}>
                <FormControl type="text" pattern="([0-9\+\-]){5,20}" defaultValue={props.fields.phone}  placeholder={ gettext('PHONE-NUMBER') } name="phone" />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalEmail">
              <Col componentClass={ControlLabel} sm={3}>
                { gettext('DELIVERY-COST') }
              </Col>
              <Col sm={9}>
                <FormControl type="number" required={true} defaultValue={props.fields.deliveryCommission} placeholder={ gettext('DELIVERY-COST') + ', SAR' } name="deliveryCommission" />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalEmail">
              <Col componentClass={ControlLabel} sm={3}>
                { gettext('DISPATCHER-PLATFORM.CURRENCY') }
              </Col>
              <Col sm={9}>
                <FormControl type="string" placeholder={ gettext('DISPATCHER-PLATFORM.CURRENCY') } defaultValue={props.fields.currency} required={true} name="currency" />
              </Col>
            </FormGroup>
          </Col>
        </Col>
        <Col sm={12}>
          <div className = {getCurLang()==='ar'?'createUserFormBtnsDiv navReverseLinks':'createUserFormBtnsDiv'}>
            <span>
              <Link to="/users">
                { gettext('CANCEL') }
              </Link>
              <Button bsStyle="success" type="submit" style={getCurLang()==='ar'?{marginRight: "20px"}:{marginLeft: "20px"}}>
                { gettext('SUBMIT') }
              </Button>
            </span>
          </div>
        </Col>
      </Form>
    </div>
  );
}



PlatformEditComponent.propTypes = {
  saveChanges: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
};
