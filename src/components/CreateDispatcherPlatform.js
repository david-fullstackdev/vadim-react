import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import { gettext } from '../i18n/service.js';
import getCurLang from '../businessLogic/getCurLang.js';
import { Button, Form, FormGroup, FormControl, Col, ControlLabel, PageHeader } from 'react-bootstrap';
import _ from 'lodash';
export default function CreateDispatcherPlatform (props) {
  const countries = _.map(props.countries, (country) => {
    return (
      <option value={country.name.toString()}>{country.name.toString()}</option>
    );
  });
  return (
    <div dir = {getCurLang()==='ar'?'rtl':'ltr'}>
      <PageHeader style={{marginLeft:'1em'}}>{ gettext('DISPATCHER.NEW-DISPATCHER-PLATFORM') }</PageHeader>
      <Form horizontal action="" onSubmit={props.submit} className="createUserForm">
      <Col sm={12} className = {getCurLang()==='ar'?'formReverse':''}>
        <Col sm={6}>

          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}>
              { gettext('EMAIL') }
            </Col>
            <Col sm={9}>
              <FormControl type="mail" required={true} placeholder={ gettext('EMAIL') } name="email" />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}>
              { gettext('PASSWORD') }
            </Col>
            <Col sm={9}>
              <FormControl type="password" autocomplete="false" required={true} placeholder={ gettext('PASSWORD') } name="password" />
            </Col>
          </FormGroup>


        <FormGroup controlId="formHorizontalEmail">
          <Col componentClass={ControlLabel} sm={3}>
            { gettext('PLATFORM-NAME') }
          </Col>
          <Col sm={9}>
            <FormControl type="text" required={true} placeholder={ gettext('PLATFORM-NAME') } name="name" />
          </Col>
        </FormGroup>
        </Col>
        <Col sm={6}>
          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}>
              { gettext('PHONE-NUMBER') }
            </Col>
            <Col sm={9}>
              <FormControl type="text" pattern="([0-9\+\-]){7,20}"  placeholder={ gettext('PHONE-NUMBER') } name="phone" />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}>
              { gettext('DELIVERY-COST') }
            </Col>
            <Col sm={9}>
              <FormControl type="number" required={true} placeholder={ gettext('DELIVERY-COST') + ', SAR' } name="deliveryCommission" />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}>
              { gettext('EXPRESS-COST') }
            </Col>
            <Col sm={9}>
              <FormControl type="number" required={true} placeholder={ gettext('EXPRESS-COST') + ', SAR' } name="expressDeliveryCommission" />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}>
              { gettext('DISPATCHER-PLATFORM.CURRENCY') }
            </Col>
            <Col sm={9}>
              <FormControl type="string" placeholder={ gettext('DISPATCHER-PLATFORM.CURRENCY') } required={true} name="currency" />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}>
              { gettext('COUNTRY') }
            </Col>
            <Col sm={9}>
              <FormControl
                componentClass="select"
                className="_order_"
                placeholder="select"
                name="country"
                onChange={(e) =>  {
                  props.onCountrySelect(e.target.value);
                }}>
                <option disabled selected value> -- {gettext('SELECT-COUNTRY')} -- </option>
                { countries }
              </FormControl>
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}>
              { gettext('CITY') }
            </Col>
            <Col sm={9}>
              <FormControl
                componentClass="select"
                className="_order_"
                placeholder="select"
                name="city"
              >
                {
                  _.map(props.cities, (city) => {
                    return (
                      <option value={city.name.toString()}>{city.name.toString()}</option>
                    );
                  })
                }
              </FormControl>
            </Col>
          </FormGroup>
          <div className = {getCurLang()==='ar'?'createUserFormBtnsDiv navReverseLinks':'createUserFormBtnsDiv'}>
            <span>
              <Link to="/users">
                { gettext('CANCEL') }
              </Link>
              <Button bsStyle="success" type="submit" style={getCurLang()==='ar'?{marginRight: "20px"}:{marginLeft: "20px"}}>
                { gettext('ADD-USER') }
              </Button>
            </span>
          </div>
        </Col>

      </Col>
      </Form>
    </div>
  );
}


CreateDispatcherPlatform.propTypes = {
  submit: PropTypes.func,
  cities: PropTypes.array,
  countries: PropTypes.array,
  onCountrySelect: PropTypes.func
};
