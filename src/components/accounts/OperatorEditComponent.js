import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import { Button, Form, FormGroup, FormControl, Col, Checkbox, PageHeader } from 'react-bootstrap';
import '../../styles/editProfilePage.scss';
import { gettext } from '../../i18n/service';
import getCurLang from '../../businessLogic/getCurLang.js';

export default function PlatformEditComponent(props) {
  return (
    <div className="accountEditComponent container"  dir = {getCurLang()==='ar'?'rtl':'ltr'} style={{height: '100%'}}>
      <PageHeader>{ gettext('EDIT-PLATFORM-PROFILE') }</PageHeader>
      <Form onSubmit={(e) => props.saveChanges(e)} className="createUserForm">

        <FormGroup controlId="formHorizontalEmail">
          <Col sm={10}>
            { gettext('EMAIL') }
          </Col>
          <Col sm={10}>
            <FormControl type="text" defaultValue={props.fields.email} placeholder={gettext('EMAIL')} name="email"  />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalEmail">
          <Col sm={10}>
            { gettext('PASSWORD') }
          </Col>
          <Col sm={10}>
            <FormControl required={false} minLength={4} type="password"  name="password"/>
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalEmail">
          <Col sm={10}>
            { gettext('CONFIRM-PASSWORD') }
          </Col>
          <Col sm={10}>
            <FormControl required={false} minLength={4} type="password"  name="confirmPassword"/>
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalEmail">
          <Col sm={10}>
            { gettext('FIRST-NAME') }
          </Col>
          <Col sm={10}>
            <FormControl type="text" defaultValue={props.fields.firstName} placeholder={ gettext('FIRST-NAME') } name="firstName"  />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalEmail">
          <Col sm={10}>
            { gettext('LAST-NAME') }
          </Col>
          <Col sm={10}>
            <FormControl type="text" defaultValue={props.fields.lastName} placeholder={ gettext('LAST-NAME') } name="lastName"  />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalPassword">
          <Col sm={10}>
            { gettext('PHONE-NUMBER') }
          </Col>
          <Col sm={10}>
            <FormControl type="text" pattern="([0-9\+\-]){7,20}" defaultValue={props.fields.phone} placeholder={ gettext('PHONE-NUMBER') } name="phone" />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col sm={10}>
            <Checkbox  name="canAddDriver">{ gettext('CAN-ADD-DRIVERS') }</Checkbox>
          </Col>
        </FormGroup>

        <FormGroup>
          <Col sm={10}>
            <Checkbox  name="canAddDispatcher">{ gettext('CAN-ADD-DISPATCHERS') }</Checkbox>
          </Col>
        </FormGroup>

        <FormGroup>
          <Col sm={10}>
            <Checkbox  name="canAddOperator">{ gettext('CAN-ADD-OPERATORS') }</Checkbox>
          </Col>
        </FormGroup>

        <div className = {getCurLang()==='ar'?'createUserFormBtnsDiv navReverseLinks':'createUserFormBtnsDiv'}>
          <span>
            <Link to="/users">
              { gettext('CANCEL') }
            </Link>
            <Button bsStyle="success" type="submit" style={getCurLang()==='ar'?{marginRight: "20px"}:{marginLeft: "20px"}}>
              { gettext('UPDATE-USER') }
            </Button>
          </span>
        </div>
      </Form>
    </div>
  );
}



PlatformEditComponent.propTypes = {
  saveChanges: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
};
