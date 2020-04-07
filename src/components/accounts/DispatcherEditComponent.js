import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Geosuggest from 'react-geosuggest';
import { Button, Col, PageHeader, Tooltip, OverlayTrigger, Form, FormGroup, Modal, FormControl, InputGroup } from 'react-bootstrap';
import _ from 'lodash';
import '../../styles/editProfilePage.scss';
import { gettext, setLocale } from '../../i18n/service';
import getCurLang from '../../businessLogic/getCurLang.js';
import {rowReverseAR, selOnMapAR} from '../../constants/formCreateStyle.js';
import getTooltip from '../../businessLogic/getTooltip.js';


const selectName = 'pickUpTimeWindow';
const selectNameFalse = 'notPickUpTimeWindow';
var editPickupId = undefined;

export default function DispatcherEditComponent(props) {
  const urlForCancel = props.isDispatcher ? '/dispatcherDashboard' : '/users';

  const DeleteConfirm = React.createClass({
    getInitialState() {
      return { showModal: false };
    },

    close() {
      this.setState({ showModal: false });
    },

    open() {
      this.setState({ showModal: true });
    },

    render() {
      return (
        <div style={{display: 'inline'}}>
          <Button
            bsStyle="danger margin_bottom_halfem"
            onClick={this.open}
            style={getCurLang()==='ar'?{float:'left'}:{float:'right'}}
          >-</Button>

          <Modal show={this.state.showModal} onHide={this.close} dir={getCurLang()==='ar'?'rtl':'ltr'}>
            <Modal.Body>
              <p>{gettext('DELETE-POINT-CONFIRMATION')}  <strong>{this.props.ppoint.title}</strong></p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>{gettext('NO')}</Button>
              <Button
                onClick={(e) => (props.pickUpPoints.length===1)? props.lastPickUppoint(): props.removePickUpPoint(this.props.ppoint, e)}
                bsStyle="danger">{gettext('YES')}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
  });

  const Checkbox = React.createClass({
    getInitialState: function() {
      return {
        isChecked: (props.fields.pickUpTimeWindow===3) ? true : false
      };
    },
    toggleChange: function() {
      this.setState({
        isChecked: !this.state.isChecked // flip boolean value
      }, function() {
      }.bind(this));
    },
    render: function() {
      if(!props.isDispatcher)
      return (
        <FormGroup controlId="formHorizontalEmail" >
          <Col sm={10} style={getCurLang()==='ar'?{marginRight: '2em'}:{}}>
              <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-THREEHOURPICKER'))}>
                <label>
                  <input
                    type="radio"
                    name={(this.state.isChecked) ? selectName : selectNameFalse}
                    checked={this.state.isChecked}
                    defaultValue="3"
                    onChange={this.toggleChange}
                    className="_order_"/>

                   {gettext('THREE-HOUR-PICKER')}

                </label>
              </OverlayTrigger>
            </Col>
            <Col sm={10} style={getCurLang()==='ar'?{marginRight: '2em'}:{}}>
              <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-ONEHOURPICKER'))}>
                <label>
                  <input
                    type="radio"
                    name={(!this.state.isChecked) ? selectName : selectNameFalse}
                    checked={!this.state.isChecked}
                    defaultValue="1"
                    onChange={this.toggleChange}
                    className="_order_"/>

                  {gettext('ONE-HOUR-PICKER')}

                </label>
              </OverlayTrigger>
            </Col>
          </FormGroup>
      );
      else return <FormGroup/>;
    }
  });

  const PickUpPoints = React.createClass({
    clearState: function() {
      editPickupId = undefined;
      props.clearArrays();
      this.setState({});
    },
    render: function() {
      return (
        <div>
        {_.map(props.pickUpPoints, (pickUpPoint, index) => {

          return (
            <FormGroup controlId="formHorizontalEmail" key={pickUpPoint.id}>
              <Col sm={10}>
                <FormControl
                   type="text"
                   required={true}
                   defaultValue={props.pickUpPointTitle && editPickupId===pickUpPoint.id
                                   ?props.pickUpPointTitle
                                   :pickUpPoint.title}
                   onChange={(e) => {
                     if(editPickupId !== pickUpPoint.id) {
                      this.clearState();
                      editPickupId = pickUpPoint.id;
                     }

                     props.setPickUpPointTitle(e.target.value);
                   }}
                   name="pickUpTitle"
                   className="geosuggest geosuggestTitle"
                   style={{marginBottom: '1em',display: 'inline'}}
                 />
                <DeleteConfirm ppoint={pickUpPoint} />
              </Col>
              <Col sm={10}>
                <FormControl
                   type="text"
                   required={true}
                   onChange={(e) => {
                     if(editPickupId !== pickUpPoint.id) {
                      this.clearState();
                      editPickupId = pickUpPoint.id;
                     }

                     props.setPickUpPointContactName(e.target.value)
                   }}
                   className="geosuggest"
                   placeholder={gettext('PICKUP-POINT-CONTACT')}
                   style={{marginBottom: '1em',display: 'inline'}}
                   defaultValue={props.pickUpPointContactName && editPickupId===pickUpPoint.id
                                   ?props.pickUpPointContactName
                                   :pickUpPoint.contactName}/>
              </Col>
              <Col sm={10}>
                <FormControl
                   type="text"
                   required={true}
                   onChange={(e) => {
                     if(editPickupId !== pickUpPoint.id) {
                      this.clearState();
                      editPickupId = pickUpPoint.id;
                     }

                     props.setPickUpPointPhone(e.target.value)
                   }}
                   className="geosuggest"
                   placeholder={gettext('PICKUP-POINT-PHONE')}
                   style={{marginBottom: '1em',display: 'inline'}}
                   defaultValue={props.pickUpPointPhone && editPickupId===pickUpPoint.id
                                   ?props.pickUpPointPhone
                                   :pickUpPoint.phone}/>
              </Col>
              <Col sm={10}>
                <InputGroup style = {getCurLang()==='ar'?rowReverseAR:{}}>
                  <Geosuggest
                    onSuggestSelect={(opts) => {
                      if(editPickupId !== pickUpPoint.id) {
                       this.clearState();
                       editPickupId = pickUpPoint.id;
                      }
                      props.onGeoSuggestSelect(opts);
                    }}

                    required={true}
                    name="defaultPickUpPoint"
                    placeholder={gettext('ADDRESS')}
                    initialValue={props.pickUpPointAddress && editPickupId===pickUpPoint.id
                                    ?props.pickUpPointAddress
                                    :pickUpPoint.address}
                    inputClassName="_recipient_ _order_ form-control"/>

                    <InputGroup.Addon onKeyDown={(e) => props.onKeyDown(e)}
                      onClick={()=>{
                        if(editPickupId !== pickUpPoint.id) {
                         this.clearState();
                         editPickupId = pickUpPoint.id;
                        }

                        props.showMapEdit();
                      }}
                      style = {getCurLang()==='ar'?selOnMapAR:{}}>
                      { gettext('SELECT-ON-MAP') }
                    </InputGroup.Addon>
                  </InputGroup>
                  <hr />
                  {editPickupId===pickUpPoint.id?
                    <div className = {getCurLang()==='ar'?'navReverseLinks confirmation':'confirmation'}>
                      <Link onClick={() => props.showFormForNewPoint()}>{ gettext('CANCEL') }</Link>
                      <Button
                        onClick={() => {
                          props.updatePickUpPoint(editPickupId);
                          this.clearState();
                        }}
                        bsStyle="success"
                        style={getCurLang()==='ar'?{marginRight: "20px"}:{marginLeft: "20px"}}>
                        { gettext('SAVE') }
                      </Button>
                    </div> : ''
                  }
                </Col>
            </FormGroup>
          );
        })
      }
        </div>
    )}
  });
const NewPickUpPoint = React.createClass({
  render: function() {
    return (
      <FormGroup controlId="formHorizontalEmail">
        <Col sm={10}>
          <FormControl
             type="text"
             required={true}
             onChange={(e) => {
               props.setPickUpPointTitle(e.target.value)
             }}
             name="pickUpTitle"
             className="geosuggest"
             placeholder={gettext('PICKUP-POINT-TITLE')}
             style={{marginBottom: '1em',display: 'inline'}}
             defaultValue={props.pickUpPointTitle?props.pickUpPointTitle:''}/>
        </Col>
        <Col sm={10}>
          <FormControl
             type="text"
             required={true}
             onChange={(e) => {
               props.setPickUpPointContactName(e.target.value)
             }}
             className="geosuggest"
             placeholder={gettext('PICKUP-POINT-CONTACT')}
             style={{marginBottom: '1em',display: 'inline'}}
             defaultValue={props.pickUpPointContactName?props.pickUpPointContactName:''}/>
        </Col>
        <Col sm={10}>
          <FormControl
             type="text"
             required={true}
             onChange={(e) => {
               props.setPickUpPointPhone(e.target.value)
             }}
             className="geosuggest"
             placeholder={gettext('PICKUP-POINT-PHONE')}
             style={{marginBottom: '1em',display: 'inline'}}
             defaultValue={props.pickUpPointPhone?props.pickUpPointPhone:''}/>
        </Col>
        <Col sm={10}>
          <InputGroup style = {getCurLang()==='ar'?rowReverseAR:{}}>
            <Geosuggest
              onSuggestSelect={(opts) => {
              }}
              required={true}
              name="defaultPickUpPoint"
              inputClassName="_recipient_ _order_ form-control"
              placeholder={gettext('ADDRESS')}
              initialValue={props.pickUpPointAddress?props.pickUpPointAddress:''}
              onSuggestSelect={(opts) => {
                props.onGeoSuggestSelect(opts);
              }}
              />
              <InputGroup.Addon
                onClick={()=>{props.showMapEdit();}}
                style = {getCurLang()==='ar'?selOnMapAR:{}}>
                { gettext('SELECT-ON-MAP') }
              </InputGroup.Addon>
            </InputGroup>
            <div className = {getCurLang()==='ar'?'navReverseLinks confirmation':'confirmation'}>
              <Link
                onClick={() => props.showFormForNewPoint()}>
                { gettext('CANCEL') }
              </Link>
              <Button
                onClick={() => props.addPickUpPoint()}
                bsStyle="success"
                style={getCurLang()==='ar'?{marginRight: "20px"}:{marginLeft: "20px"}}>
                { gettext('CREATE') }
              </Button>
            </div>
          </Col>
      </FormGroup>
    );
  }});

  const countries = _.map(props.countries, (country) => {
    return (
      <option value={country.id}>{country.name[localStorage.getItem('user-language')]}</option>
    );
  });

  const oldLang = props.fields.language;
  var newLang = "";
  return (
    <div className="accountEditComponent container"  dir = {getCurLang()==='ar'?'rtl':'ltr'} style={{height: '100%'}}>
      <PageHeader>{ gettext('USER-PROFILE') }</PageHeader>
      <Form onSubmit={(e) => {props.saveChanges(e); newLang!==""?((newLang!==oldLang)?window.location.reload():''):'';}}  className ={getCurLang()==='ar'?'formReverse':''}>
        <Col sm={6}>
          <FormGroup controlId="formHorizontalEmail">
            <Col sm={10}>
              { gettext('DISPATCHER.SHOP-NAME') }
            </Col>
            <Col sm={10}>
              <FormControl required={true} type="text" defaultValue={props.fields.shopName} name="shopName"/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmail">
            <Col sm={10}>
              { gettext('FIRST-NAME') }
            </Col>
            <Col sm={10}>
              <FormControl required={true} type="text" defaultValue={props.fields.firstName} name="firstName"/>
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalEmail">
            <Col sm={10}>
              { gettext('COUNTRY') }
            </Col>
            <Col sm={10}>
              <FormControl
                componentClass="select"
                className="_order_"
                placeholder="select"
                name="country"
                onChange={(e) =>  {
                  props.onCountrySelect(e.target.value);
                }}>
                <option style={{display: 'none'}} value={props.fields.country} disabled selected>{props.getCountryName(props.fields.country)}</option>
                { countries }
              </FormControl>
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalEmail">
            <Col sm={10}>
              { gettext('CITY') }
            </Col>
            <Col sm={10}>
              <FormControl
                componentClass="select"
                className="_order_"
                placeholder="select"
                name="city"
              >
                <option style={{display: 'none'}} disabled selected>{props.getCityName(props.fields.city)}</option>
                {
                  _.map(props.getCities(), (city) => {
                    return (
                      <option value={city.id}>{city.name[localStorage.getItem('user-language')]}</option>
                    );
                  })
                }
              </FormControl>
            </Col>
          </FormGroup>

          <Checkbox />

          <Col sm={10}>
            <h2>{ gettext('PICKUP-POINT') }</h2>
          </Col>
          <PickUpPoints />
          {props.newPoint?
            <NewPickUpPoint /> : ''
          }
          <Col sm={10}>
            <Button
              bsStyle="success"
              className={!props.newPoint?'addPickUpPointBtn':'display_none'}
              onClick={() => props.showFormForNewPoint()}>
              +
            </Button>
          </Col>
        </Col>

        <Col sm={6}>
          <FormGroup controlId="formHorizontalEmail">
            <Col sm={10}>
              { gettext('EMAIL') }
            </Col>
            <Col sm={10}>
              <FormControl required={true} type="email" defaultValue={props.fields.email} name="email"/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmail">
            <Col sm={10}>
              { gettext('PASSWORD') }
            </Col>
            <Col sm={10}>
              <FormControl required={false} minLength={4} type="password" defaultValue={props.fields.password} name="password"/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmail">
            <Col sm={10}>
              { gettext('CONFIRM-PASSWORD') }
            </Col>
            <Col sm={10}>
              <FormControl required={false} minLength={4} type="password" defaultValue={props.fields.password} name="confirmPassword"/>
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalEmail">
            <Col sm={10}>
              { gettext('LANG-SELECTOR') }
            </Col>
            <Col sm={10}>
            <FormControl
              componentClass="select"
              className="_order_"
              placeholder="select"
              name="language"
              onChange={(e) =>  {
                props.onLanguageSelect(e.target.value);

                  newLang = e.target.value;
                  setLocale(newLang);

              }}>
                {props.fields.language==='en'?<option value="en" selected>en</option>:<option value="en">en</option>}
                {props.fields.language==='ar'?<option value="ar" selected>ar</option>:<option value="ar">ar</option>}
            </FormControl>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmail">
            <Col sm={10}>
              { gettext('PHONE-NUMBER') }
            </Col>
            <Col sm={10}>
              <FormControl required={true} pattern="([0-9]){5,20}" type="text" defaultValue={props.fields.phone} name="phone"/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmail">
            <Col sm={10}>
              { gettext('MOBILE') }
            </Col>
            <Col sm={10}>
              <FormControl required={true} pattern="([0-9\+\-]){7,20}" type="text" defaultValue={props.fields.mobile} name="mobile"/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalEmail">
            <Col sm={10}>
              { gettext('DELIVERY-COST') }
            </Col>
            <Col sm={10}>
              <FormControl required={true} type="text" disabled={props.isDispatcher} defaultValue={props.fields.deliveryCommission} name={!props.isDispatcher?"deliveryCommission":"field"} placeholder="SAR"/>
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalEmail">
            <Col sm={10}>
              { gettext('EXPRESS-DELIVERY-COST') }
            </Col>
            <Col sm={10}>
              <FormControl required={true} type="text" disabled={props.isDispatcher} defaultValue={props.fields.expressDeliveryCommission} name={!props.isDispatcher?"expressDeliveryCommission":"field"} placeholder="SAR"/>
            </Col>
          </FormGroup>
          <Col sm={10}>
            API-key:
          </Col>
          <Col sm={10}>
            <FormControl type="text" className="apikey_input" disabled='true' value={localStorage.getItem('auth_token')} />
          </Col>
        </Col>

        <footer className = {getCurLang()==='ar'?'navReverseLinks':''}>
          <span>
            <Link to={urlForCancel}>{ gettext('CANCEL') }</Link>
            <Button bsStyle="success" type="submit" style={getCurLang()==='ar'?{marginRight: "20px"}:{marginLeft: "20px"}}>{ gettext('SAVE') }</Button>
          </span>
        </footer>
      </Form>
      {props.map}
    </div>
  );
}




DispatcherEditComponent.propTypes = {
  saveChanges: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
  pickUpPoints: PropTypes.array.isRequired,
  onGeoSuggestSelect: PropTypes.func.isRequired,
  addPickUpPoint: PropTypes.func.isRequired,
  removePickUpPoint: PropTypes.func.isRequired,
  isDispatcher: PropTypes.bool,
  onLanguageSelect: PropTypes.func,
  clearArrays: PropTypes.func,
  lastPickUppoint: PropTypes.func,
  showMapEdit: PropTypes.func,
  map: PropTypes.string,
  formattedPickUpPointAddress: PropTypes.string,
  getCurrentPoint: PropTypes.func,
  cities: PropTypes.array,
  countries: PropTypes.array,
  onCountrySelect: PropTypes.func,
  getCities:PropTypes.func,
  ppoint: PropTypes.object,
  newPoint: PropTypes.bool,
  setPickUpPointTitle: PropTypes.func
};
