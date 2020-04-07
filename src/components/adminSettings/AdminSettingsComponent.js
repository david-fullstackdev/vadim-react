import React, {PropTypes} from 'react';
import { Button, PageHeader, Form, FormControl, Col, InputGroup, FormGroup,ListGroup, ListGroupItem } from 'react-bootstrap';
import { gettext } from '../../i18n/service.js';
import _ from 'lodash';
import getCurLang from '../../businessLogic/getCurLang.js';
import './AdminSettingsComponent.scss';
import {Table, Tr, Td, Th, Thead} from 'reactable';
import Geosuggest from 'react-geosuggest';
import {selOnMapAR} from '../../constants/formCreateStyle.js';


export default function AdminSettingsComponent(props) {
  var newCountry;
  var newCity;
  const countryList = (countries) => {
    return _.map(countries, (country) => {
      const isItemSelected = _.includes(props.countriesSelectedOnList, country);
      const className = isItemSelected ? 'list_element active' : 'list_element';
      let updatedCountry;
      return (
        <ListGroupItem className={className} onClick={(e) => props.handleItemSelectChange("country",country, e)}>
          <label contentEditable
            onBlur={(e) => updatedCountry = e.currentTarget.textContent }>
              {country.name.toString()}
          </label>
          <Button
            bsStyle="default"
            bsSize="xs"
            onClick={() => updatedCountry?props.updateCountry(country.id, updatedCountry):''}
            style={{float: 'right'}}>
              &#9998;
          </Button>
        </ListGroupItem>
      );
    });
  };

  const companyList = (companies) => {
    return _.map(companies, (company) => {
      const isItemSelected = _.includes(props.companiesSelectedOnTable, company);
      const className = isItemSelected ? 'active' : '';
      return (
        <Tr className={className} onClick={(e) => props.handleItemSelectChange("company", company, e)}>
          <Td column={gettext('COMPANY-NAME')}>
            { company.title }
          </Td>
          <Td column={gettext('ADDRESS')}>
            { company.address }
          </Td>
          <Td column={gettext('COST')}>
            { company.foreignDeliveryCost }
          </Td>
          <Td column="">
            <Button bsStyle="default" bsSize="xs" style={{float: 'right'}}>&#9998;</Button>
          </Td>
        </Tr>
      );
    });
  };
  return (
    <div className="AdminSettingsContainer">
      <PageHeader>{ gettext('DOOK-SETTINGS') }</PageHeader>
        <div className="formReverse">
          <Col sm={6} className="padding_ten">
              <Form
               onSubmit={(e) => {props.saveChanges(e);}}>
                <Col sm={8} style={getCurLang()==='ar'?{float:'right'}:{}}>
                  <h3 className="dook_font">{ gettext('DOOK-ADMIN-CREDENTIALS') }</h3>
                </Col>

                <FormGroup controlId="formHorizontalEmail">
                  <Col sm={8} style={getCurLang()==='ar'?{float:'right'}:{}}>
                    { gettext('EMAIL') }
                  </Col>
                  <Col sm={8} style={getCurLang()==='ar'?{float:'right'}:{}}>
                    <FormControl required={true} type="email" placeholder="Email" defaultValue={props.account.email} name="email"/>
                  </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalEmail">
                  <Col sm={8} style={getCurLang()==='ar'?{float:'right'}:{}}>
                    { gettext('PASSWORD') }
                  </Col>
                  <Col sm={8} style={getCurLang()==='ar'?{float:'right'}:{}}>
                    <FormControl required={false} minLength={4} placeholder="Password" type="password" name="password"/>
                  </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalEmail">
                  <Col sm={8} style={getCurLang()==='ar'?{float:'right'}:{}}>
                    { gettext('CONFIRM-PASSWORD') }
                  </Col>
                  <Col sm={8} style={getCurLang()==='ar'?{float:'right'}:{}}>
                    <FormControl required={false} minLength={4} type="Confirm password" name="confirmPassword"/>
                  </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalEmail">
                  <Col sm={8} style={getCurLang()==='ar'?{float:'right'}:{}}>
                    { gettext('LANG-SELECTOR') }
                  </Col>
                  <Col sm={8} style={getCurLang()==='ar'?{float:'right'}:{}}>
                    <FormControl
                      componentClass="select"
                      placeholder="select"
                      name="language"
                      >
                      {props.account.language==='en'?<option value="en" selected>en</option>:<option value="en">en</option>}
                      {props.account.language==='ar'?<option value="ar" selected>ar</option>:<option value="ar">ar</option>}
                    </FormControl>
                  </Col>
                </FormGroup>
                <Col sm={8} style={getCurLang()==='ar'?{float:'right'}:{}}>
                  <span className="add_cancel_container" style={getCurLang()==='ar'?{float:'left'}:{float:'right'}}>
                    <Button bsStyle="success" type="submit" style={getCurLang()==='ar'?{marginRight: "20px"}:{marginLeft: "20px"}}>{ gettext('UPDATE') }</Button>
                  </span>
                </Col>
              </Form>
            <Form
              onSubmit={(e) => props.setMultiplier(e)}>
              <Col sm={8} style={getCurLang()==='ar'?{float:'right'}:{}}>
                <h3 className="dook_font">{ gettext('DOOK-DEFAULT-DELIVERY-COST') }</h3>
              </Col>
              <Col sm={6} style={getCurLang()==='ar'?{float:'right'}:{}}>
                <FormGroup controlId="formHorizontalEmail">
                  <FormControl
                    required={true}
                    type="number"
                    defaultValue={ _.find(props.coefficients, {type:"deliveryCommission"}).coefficient }
                    placeholder="Comission"
                    name="deliveryCommission"/>
                </FormGroup>
              </Col>
              <Col sm={2}  style={getCurLang()==='ar'?{float:'right'}:{}}>
                <Button bsStyle="success" className="set_btn" type="submit" style={getCurLang()==='ar'?{}:{marginLeft: "20px"}}>{ gettext('SET') }</Button>
              </Col>
            </Form>
            <Form
             onSubmit={(e) => props.setMultiplier(e)}>
              <Col sm={8}  style={getCurLang()==='ar'?{float:'right'}:{}}>
                <h3 className="dook_font">{ gettext('EXPRESS-MILTIPLIER') }</h3>
              </Col>
              <Col sm={6}  style={getCurLang()==='ar'?{float:'right'}:{}}>
                <FormGroup controlId="formHorizontalEmail">
                  <FormControl
                    required={true}
                    type="number"
                    defaultValue={ _.find(props.coefficients, {type:"expressDelivery"}).coefficient }
                    placeholder="Multiplier"
                    name="expressDelivery"/>
                </FormGroup>
              </Col>
              <Col sm={2}  style={getCurLang()==='ar'?{float:'right'}:{}}>
                <Button bsStyle="success" className="set_btn" type="submit" style={getCurLang()==='ar'?{}:{marginLeft: "20px"}}>{ gettext('SET') }</Button>
              </Col>
            </Form>
          </Col>

          <Col sm={6} className="padding_ten">
            <Col sm={8} style={getCurLang()==='ar'?{float:'right'}:{}}>
              <h3 className="dook_font">{ gettext('DOOK-AVAILABILITY-LOCATIONS') }</h3>
            </Col>
            <Col sm={8} style={getCurLang()==='ar'?{float:'right'}:{}}>
              { gettext('COUNTRIES') }

              <FormGroup controlId="formHorizontalEmail">
                <FormControl
                  type="text"
                  className="country_input"
                  placeholder={ gettext('COUNTRY') }
                  name="expressMultiplier"
                  onChange={(e) => newCountry = e.target.value}/>
                <Button bsStyle="success addBtn"
                  onClick={() => props.createCountry(newCountry) }>
                    { gettext('ADD') }
                </Button>

              </FormGroup>
              <div>
                <div className="list_group_container">
                  <ListGroup>
                    {countryList(props.countries)}
                  </ListGroup>
                </div>
                <div className="button_group_container">
                  <Button bsStyle="danger" onClick={() => props.deleteCountry()}>-</Button>
                </div>
              </div>
            </Col>
            {props.countriesSelectedOnList.length===1?
            <Col sm={8} style={getCurLang()==='ar'?{float:'right'}:{}}>
              { gettext('CITIES') }

              <FormGroup controlId="formHorizontalEmail">
                <FormControl
                  type="text"
                  className="country_input"
                  placeholder={ gettext('CITY') }
                  name="expressMultiplier"
                  onChange={(e) => newCity = e.target.value}/>
                <Button bsStyle="success addBtn" onClick={() => props.createCity(newCity)}>{ gettext('ADD') }</Button>
              </FormGroup>

              <div>
                <div className="list_group_container">
                  <ListGroup>
                    { _.map(props.getCities(),
                      (city) => {
                      const isItemSelected = _.includes(props.citiesSelectedOnList, city);
                      const className = isItemSelected ? 'list_element active' : 'list_element';
                      let updatedCity;
                      return (
                        <ListGroupItem className={className} onClick={(e) => props.handleItemSelectChange("city", city, e)}>
                          <label contentEditable
                            onBlur={(e) => updatedCity = e.currentTarget.textContent }>
                              {city.name.en}
                          </label>
                          <Button
                            bsStyle="default"
                            bsSize="xs"
                            onClick={() => updatedCity?props.updateCity(city.id, updatedCity):''}
                            style={{float: 'right'}}>
                              &#9998;
                          </Button>
                        </ListGroupItem>
                      );
                    }) }
                  </ListGroup>
                </div>
                <div className="button_group_container">
                  <Button bsStyle="danger" onClick={() => props.deleteCity()}>-</Button>
                </div>
              </div>
            </Col> : ''}
          </Col>

          </div>
            <Col sm={12} style={{marginBottom: '10em'}} className="padding_ten">
                <h3 className="dook_font" style={{paddingLeft:'15px'}}>{ gettext('OUT-OF-CITY-SHIPMENT') }</h3>

                <div className="company_create_form">
                  <Form onSubmit={(e) => props.createCompany(e)}>
                    <FormGroup controlId="formHorizontalEmail">
                      <span className="out_of_city_labels">{ gettext('COMPANY-NAME') }</span>
                      <Col sm={4} className={getCurLang()==='ar'?'float_right':''}>
                        <FormControl type="text" placeholder="Company name" name="companyName"/>
                      </Col>
                      <Col sm={4} className={getCurLang()==='ar'?'float_right':''}>
                        <Button bsStyle="success" type="submit">ADD</Button>
                      </Col>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalEmail">
                      <span className="out_of_city_labels">{ gettext('ADDRESS') }</span>
                      <Col sm={4} className={getCurLang()==='ar'?'float_right':''}>
                        <InputGroup>
                          <Geosuggest
                            style={{
                              display: 'block',
                              width: '40%'
                            }}
                            onSuggestSelect={(e) => props.setCompanyLocation(e)}
                            name="address"
                            placeholder={gettext('DELIVERY-POINT-ADDRESS')}
                            inputClassName="form-control"
                            initialValue={props.formattedPickUpPointAddress}
                            required={true}
                            />
                            <InputGroup.Addon onClick={props.showMap} style = {getCurLang()==='ar'?selOnMapAR:{}}>
                              { gettext('SELECT-ON-MAP') }
                            </InputGroup.Addon>
                          </InputGroup>
                      </Col>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalEmail">
                      <span className="out_of_city_labels">{ gettext('SHIPMENT-COST') }</span>
                      <Col sm={4} className={getCurLang()==='ar'?'float_right':''}>
                        <FormControl type="number" placeholder="Shipment cost" name="shipmentCost"/>
                      </Col>
                    </FormGroup>

                  </Form>
                </div>

                <br />
                <div className="table_container">
                  <Table className="company_table table-fixedheader">
                    <Thead>
                      <Th column={gettext('COMPANY-NAME')}>
                        <span title={gettext('COMPANY-NAME')}>{gettext('COMPANY-NAME')}</span>
                      </Th>
                      <Th column={gettext('ADDRESS')}>
                        <span title={gettext('ADDRESS')}>{gettext('ADDRESS')}</span>
                      </Th>
                      <Th column={gettext('COST')}>
                        <span title={gettext('COST')}>{gettext('COST')}</span>
                      </Th>
                      <Th column=""/>
                    </Thead>
                    {companyList(props.companies)}
                  </Table>
                </div>
                <div className="button_group_container">
                  <Button bsStyle="danger" onClick={() => props.deleteCompany()}>-</Button>
                </div>
            </Col>
          {props.map}
    </div>
  );
}




AdminSettingsComponent.propTypes = {
  saveChanges: PropTypes.func.isRequired,
  countries: PropTypes.object,
  cities: PropTypes.array,
  companies: PropTypes.array,
  countriesSelectedOnList: PropTypes.array,
  handleItemSelectChange: PropTypes.func,
  citiesSelectedOnList: PropTypes.func,
  companiesSelectedOnTable: PropTypes.func,
  createCountry: PropTypes.func,
  deleteCountry: PropTypes.func,
  createCity: PropTypes.func,
  deleteCity: PropTypes.func,
  getCities: PropTypes.func,
  account: PropTypes.object,
  deleteCompany: PropTypes.func,
  createCompany: PropTypes.func,
  setCompanyLocation: PropTypes.func,
  updateCountry: PropTypes.func,
  updateCity: PropTypes.func,
  setMultiplier: PropTypes.func,
  coefficients: PropTypes.array,
  showMap: PropTypes.func,
  formattedPickUpPointAddress: PropTypes.string,
  map: PropTypes.object
};
