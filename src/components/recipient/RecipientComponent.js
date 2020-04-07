import React, {PropTypes} from 'react';
import { gettext } from '../../i18n/service.js';
import getCurLang from '../../businessLogic/getCurLang.js';
import _ from 'lodash';
import { Button, Form, FormGroup, FormControl, Col, ControlLabel, Panel } from 'react-bootstrap';
import formatId from '../../businessLogic/formatId.js';
import './RecipientComponentStyle.scss';
import { formatCashOn } from '../../businessLogic/formatCashOnDelivery.js';
import {withGoogleMap, GoogleMap, Marker} from 'react-google-maps';
import Media from 'react-responsive';
import * as getCurrentPos from '../../businessLogic/getCurrentPos.js';
import { formatTime } from '../../businessLogic/deliveryTimeFormatter.js';


const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    defaultCenter={props.defaultCenter || {
      lat: 24.727318,
      lng: 46.709809
    }}
    defaultZoom={props.defaultZoom || 10}
    onClick={(e) => props.onMapClick(e)}>
    { props.marker.lat?
      <Marker
        position={props.marker}
        defaultAnimation={4}/>
      :''}
      <button type="button" onClick={props.getMyLocation} className="btn btn-info btn-circle">
        <img className="location_icon" src="./location-icon.png" />
      </button>
  </GoogleMap>
));

const renderItems = (order) => {
  return _.map(order.items, (item) => {
    return (

        <span>
          <strong>{ gettext('ITEM.ITEM-#') } {formatId(item.id)}</strong>
          <br></br>
          <div className="dotted-line"></div>
            <p className="h5">{gettext('PACKING-LIST') }:</p>
            <ul key={item.id} className="recipient-pack-list">
              <li className="description h5">{item.packingList}</li>
            </ul>
          <div className="dotted-line"></div>
        </span>

    );
  });
};



export default function RecipientComponent(props) {

  const geocoder = new window.google.maps.Geocoder();
  var formattedAddres = "";
  var marker = [];
      const Order =
        React.createClass({
          render: function() {
            return (
              <Panel className="recipient-order-form"
                header={
                  <strong>{gettext('ORDER-#') } {formatId(props.orders.id)}</strong>
                }>
                <p className="h5">{gettext('DISPATCHER.SHOP-NAME')}: {props.dispatcher.shopName}</p>
                <p className="h5">{gettext('MOBILE') }: {props.dispatcher.phone}</p>
                { props.orders.expectedPickUpTime?<p className="h5">{gettext('EXPECTED-PICKUP-TIME') }: {formatTime(props.orders.expectedPickUpTime.endTime)}</p>
                :''}
                { props.orders.deliveryTime!==null?<p className="h5">{gettext('DELIVERY-TIME') }: {formatTime(props.orders.deliveryTime)}</p>
                :''}
                  {renderItems(props.orders)}
                <p className="h5">{gettext('CASH-ON-DELIVERY')}: <strong>{formatCashOn(props.orders.cashOnDelivery, props.orders.cashOnDeliveryAmount)} SAR</strong></p>
              </Panel>
            );
          }
        });

        const Recipient =
          React.createClass({
            render: function() {
              return (
                <Panel className="recipient-order-form"
                  header={
                    <strong>{gettext('RECIPIENT')}</strong>
                  }>
                  <p className="h5">{gettext('FIRST-NAME')}: {props.recipients.firstName}</p>
                  <p className="h5">{gettext('PHONE') }: {props.recipients.mobile}</p>
                </Panel>
              );
            }
          });


          const Geosug =
            React.createClass({
              getInitialState: function() {
                return {addr: formattedAddres};
              },
              render: function() {
                return (
                    <FormGroup controlId="formHorizontalEmail" style={{clear: 'both', paddingTop: '1em'}}>
                      <Col componentClass={ControlLabel}  sm={3}>
                        { gettext('DELIVERY-POINT') }
                      </Col>
                      <Col sm={9}>
                        <FormControl
                          ref="myPoint"
                          required={true}
                          style={{marginBottom: '1em'}}
                          type="text"
                          name="deliveryPoint"
                          value={formattedAddres?formattedAddres:props.recipients.deliveryPoint}
                        />
                      </Col>
                    </FormGroup>
                );
              }
            });

            const GeosugMobile =
              React.createClass({
                getInitialState: function() {
                  return {addr: formattedAddres};
                },
                render: function() {
                  return (
                      <FormGroup controlId="formHorizontalEmail" style={{clear: 'both', paddingTop: '1em'}}>
                          <label>{ gettext('DELIVERY-POINT') }</label>
                          <FormControl
                            ref="myPoint"
                            required={true}
                            type="text"
                            name="deliveryPoint"
                            value={formattedAddres?formattedAddres:props.recipients.deliveryPoint}
                          />
                      </FormGroup>
                  );
                }
              });

            const Map =
              React.createClass({
                getInitialState: function() {
                  // var geocoder = new window.google.maps.Geocoder();
                  // geocoder.geocode({
                  //   'address': props.orders.deliveryPoint,
                  //   'partialmatch': true}, (results) => {
                  //     var location = {
                  //         lat: results[0].geometry.location.lat(),
                  //         lng: results[0].geometry.location.lng()
                  //       };
                  //       marker = location;
                  //       this.forceUpdate();
                  //
                  //   });
                  if(props.recipients.gpsLocation)
                    marker = props.recipients.gpsLocation;
                  return {};
                },
                onMapClick: function({latLng})  {

                  const location = {
                    lat: latLng.lat(),
                    lng: latLng.lng()
                  };

                  props.setLocationLatLng(location);

                  marker = location;
                  geocoder.geocode({location: location}, (results) => {
                      formattedAddres = results[0].formatted_address;
                      props.setFormattedAddress(results[0].formatted_address);
                      this.forceUpdate();
                  });


                },
                success: function(pos)  {
                  var crd = pos.coords;

                  const mylocation = {
                    lat: crd.latitude,
                    lng: crd.longitude
                  };

                  var geocoder = new window.google.maps.Geocoder();
                  geocoder.geocode({'location': mylocation}, (results) => {
                        formattedAddres = results[0].formatted_address;
                        props.setFormattedAddress(results[0].formatted_address);
                        this.forceUpdate();
                    });

                  marker = mylocation;
                },
                getMyLocation: function()  {
                  if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(this.success,getCurrentPos.error,{ enableHighAccuracy: false });
                  } else {
                      alert('location not supported');
                  }
                },
                render: function() {
                  return (
                    <div>
                    <Media query="(min-width: 981px)">
                      <Geosug/>
                    </Media>
                    <Media query="(max-width: 980px)">
                      <GeosugMobile/>
                    </Media>
                    <GettingStartedGoogleMap
                      containerElement={
                        <div
                          className="mapContainer"
                        />
                      }
                      mapElement={
                        <div style={{ height: `100%` }} />
                      }
                      defaultZoom={this.props.defaultZoom || 10}
                      defaultCenter={marker.lat ? marker : {
                        lat: 24.727318,
                        lng: 46.709809
                      }}
                      onMapClick={(e) => this.onMapClick(e)}
                      marker={marker}
                      getMyLocation={this.getMyLocation}/>


                      </div>
                  );
                }
              });


      return (
        <div className="RecipientComponent" dir = {getCurLang()==='ar'?'rtl':'ltr'} >
        <Media query="(min-width: 981px)">
          <Col sm={3}>
            <Order/>
              <Recipient/>
          </Col>
          <Form onSubmit={props.submit}>
            <Col sm={9}>
              <Panel className="recipient-point-form"
                header={
                  <h3>{gettext('PLEASE-SPECIFY-WHERE-AND-WHEN-TO-DELIVER-THE-ORDER')}</h3>
                }>
                <Map/>
              </Panel>
            </Col>
            <span className = {getCurLang()==='ar'?"ar-recipient-btns":"en-recipient-btns"}>
              <Button bsStyle="success" type="submit" style={getCurLang()==='ar'?{marginRight: "20px"}:{marginLeft: "20px"}}>
                { gettext('SUBMIT') }
              </Button>
            </span>
          </Form>
          </Media>
          <Media query="(max-width: 981px)">

            <Col sm={9} className="center-block">
              <div style={{textAlign:'center', marginTop:'1em'}}>
                <img  src={props.logo}/>
              </div>
              <Order/>
              <Recipient/>
              <div className="time_point">
                <Map/>
                  <Button bsStyle="success" className="recipient_submit_btn" onClick={props.submit}>
                    { gettext('SUBMIT') }
                  </Button>
              </div>
            </Col>
          </Media>
        </div>

      );
}

RecipientComponent.propTypes = {
  setDeliveryTime: PropTypes.func,
  orders: PropTypes.object,
  recipients: PropTypes.object,
  dispatcher: PropTypes.object,
  setFormattedAddress: PropTypes.func,
  submit: PropTypes.func,
  locationLatLng: PropTypes.array,
  setLocationLatLng: PropTypes.func,
  deliveryPointMarker: PropTypes.array,
  formattedAddress: PropTypes.object,
  deliveryTimeValidator: PropTypes.func,
  logo: PropTypes.string,
  defaultZoom: PropTypes.number

};
