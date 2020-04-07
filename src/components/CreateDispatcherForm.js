import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import Geosuggest from 'react-geosuggest';
import { gettext } from '../i18n/service.js';
import getCurLang from '../businessLogic/getCurLang.js';
import {rowReverseAR, selOnMapAR} from '../constants/formCreateStyle.js';
import { Button, Form, FormGroup, FormControl, Col, ControlLabel, PageHeader, InputGroup } from 'react-bootstrap';
import _ from 'lodash';

export default function CreateDispatcherForm (props) {
  const countries = _.map(props.countries, (country) => {
    return (
      <option value={country.id}>{country.name}</option>
    );
  });
  return (
    <div dir = {getCurLang()==='ar'?'rtl':'ltr'}>
      <PageHeader style={{marginLeft:'1em'}}>{ gettext('DISPATCHER.NEW-DISPATCHER') }</PageHeader>
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
              { gettext('FIRST-NAME') }
            </Col>
            <Col sm={9}>
              <FormControl type="text" required={true} placeholder={ gettext('FIRST-NAME') } name="firstName" />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}>
              { gettext('LAST-NAME') }
            </Col>
            <Col sm={9}>
              <FormControl type="text" required={true} placeholder={ gettext('LAST-NAME') } name="lastName" />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}>
              { gettext('DISPATCHER.SHOP-NAME') }
            </Col>
            <Col sm={9}>
              <FormControl type="string" required={true} placeholder={ gettext('DISPATCHER.SHOP-NAME') } name="shopName" />
            </Col>
          </FormGroup>
        </Col>

        <Col sm={6}>
          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}>
              { gettext('COUNTRY') }
            </Col>
            <Col sm={9}>
              <FormControl
                componentClass="select"
                className="_order_"
                placeholder="select"
                name="countryId"
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
                name="cityId"
              >
                {
                  _.map(props.cities, (city) => {
                    return (
                      <option value={city.id}>{city.name.en}</option>
                    );
                  })
                }
              </FormControl>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}>
              { gettext('PHONE-NUMBER') }
            </Col>
            <Col sm={9}>
              <FormControl type="tel" pattern="([0-9]){5,20}" placeholder={ gettext('PHONE-NUMBER') } name="phone" />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}>
              { gettext('MOBILE') }
            </Col>
            <Col sm={9}>
              <FormControl type="text" pattern="([0-9\+\-]){7,20}" required={true} placeholder={ gettext('MOBILE') } name="mobile" />
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
              <FormControl type="number" required={true} placeholder={ gettext('EXPRESS-DELIVERY-COST') + ', SAR' } name="expressDeliveryCommission" />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}>
              { gettext('DEFAULT-PICKUP-POINT') }
            </Col>
            <Col sm={9}>
              <FormControl
                type="text"
                required={true}
                placeholder={gettext('PICKUP-POINT-TITLE')}
                onChange={props.onSelectTitlePickUpPoint}
                name="pickUpTitle"
                className="geosuggest geosuggestFormWidth"
                style={{marginBottom: '1em'}}
              />
              <InputGroup style = {getCurLang()==='ar'?rowReverseAR:{}}>
                <Geosuggest
                  onSuggestSelect={props.onSelectDefaultPickUpPoint}
                  required={true}
                  name="defaultPickUpPoint"
                  initialValue={props.formattedPickUpPointAddress}
                  placeholder={ gettext('ADDRESS') }
                  inputClassName="_recipient_ _order_ form-control"
                  />
                  <InputGroup.Addon onClick={props.showMap} style = {getCurLang()==='ar'?selOnMapAR:{}}>
                    { gettext('SELECT-ON-MAP') }
                  </InputGroup.Addon>
                </InputGroup>
            </Col>
          </FormGroup>
        </Col>
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
        {props.map}
      </Form>
    </div>
  );
}


CreateDispatcherForm.propTypes = {
  submit: PropTypes.func,
  onSelectDefaultPickUpPoint: PropTypes.func,
  onSelectTitlePickUpPoint: PropTypes.func,
  showMap: PropTypes.func,
  formattedPickUpPointAddress: PropTypes.string,
  cities: PropTypes.array,
  countries: PropTypes.array,
  onCountrySelect: PropTypes.func,
  map: PropTypes.object
};
