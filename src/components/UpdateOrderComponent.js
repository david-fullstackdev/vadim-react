import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Button, Form, Tooltip, OverlayTrigger, FormGroup, Glyphicon, FormControl, Col, PageHeader, ControlLabel, InputGroup, Alert } from 'react-bootstrap';
import DateTimeField from 'react-bootstrap-datetimepicker';
import Geosuggest from 'react-geosuggest';
import '../styles/orderCreationFormStyles.scss';
import _ from 'lodash';
import { gettext } from '../i18n/service.js';
import { SetCorrectDeliveryTime, ConvertExpPickUpTime } from '../businessLogic/convertExpPickUpTime.js';
import getCurLang from '../businessLogic/getCurLang.js';
import { rowReverseAR, selOnMapAR } from '../constants/formCreateStyle.js';
import moment from 'moment';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';
import isEmpty from '../businessLogic/isObjectEmpty.js';
import formatId from '../businessLogic/formatId.js';
import getTooltip from '../businessLogic/getTooltip.js';
import classnames from 'classnames';
import { formatCashOn } from '../businessLogic/formatCashOnDelivery.js';


const divHide = {
  display: 'none'
};
const divShow = {
  display: 'block'
};

const deliveryTimes = [
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
  "21:00-22:00",
  "22:00-23:00"
];

const oneHourTimes = [
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
];

const threeHourTimes = [
  "08:00-11:00",
  "11:00-14:00",
  "14:00-17:00",
  "17:00-20:00",
];

const selectName = 'expectedPickUpTimeWindow';
const selectNameFalse = 'notExpectedPickUpTimeWindow';

export default class UpdateOrderComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.formattedDeliveryPointAddress = props.formattedDeliveryPointAddress;
    this.isThreHourPicker = props.fields.pickUpTimeWindow === 3;
    this.pickUpTimePickerVal = new Date(props.orderForUpdate.expectedPickUpTime.endTime).getHours().toString() + ':00';
    props.onDeliveryTimeSelect(new Date(props.orderForUpdate.deliveryTime).getHours().toString() + ':00');

    this.deliveryTimePickerVal = null;
    this.geosuggest = undefined;
    this.isCashOnDelivery = props.orderForUpdate.cashOnDelivery;
    this.isExpressDelivery = props.orderForUpdate.express;
    this.isVenicleType = true;
    this.isFloating = false;

    this.recipient = props.getRecipient(props.orderForUpdate.recipientId);
    let location = this.recipient.gpsLocation;
    props.onDeliveryPointSelect({location});

    this.pickUpPoints = props.pickUpPoints
    this.state = {
      today: new Date().valueOf(),
      orderDate: new Date().valueOf(),
      outOfCityCheck: false,
      outOfCityForm: this.props.outOfCityForm
    }

    _.bindAll(this, ['toggleCashOnDelivery', 'setSelectedPickUpPoint', 'toggleExpressDelivery', 'togleTimePickerChose', 'toggleVenicleType', 'togleOutOfSityCheck', 'toggleFloatingPoint']);

    this.count = 0;
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.formattedDeliveryPointAddress !== this.formattedDeliveryPointAddress) {
      this.formattedDeliveryPointAddress = nextProps.formattedDeliveryPointAddress;
      if (this.geosuggest) {
        this.geosuggest.update(this.formattedDeliveryPointAddress);
        this.forceUpdate();
      }
    }
  }

  toggleCashOnDelivery(e) {
    e.preventDefault();
    e.stopPropagation();
    this.isCashOnDelivery = !this.isCashOnDelivery;
    setTimeout(() => {
      this.forceUpdate();
    }, 0);
  }

  toggleExpressDelivery(e) {
    e.preventDefault();
    e.stopPropagation();
    this.isExpressDelivery = !this.isExpressDelivery;
    this.pickUpTimePickerVal = new Date().getHours();
    setTimeout(() => {
      this.forceUpdate();
    }, 0);
  }

  toggleFloatingPoint(e) {
    e.preventDefault();
    e.stopPropagation();
    this.isFloating = !this.isFloating;
    setTimeout(() => {
      this.forceUpdate();
    }, 0);
  }

  toggleVenicleType(e) {
    e.preventDefault();
    e.stopPropagation();
    this.isVenicleType = !this.isVenicleType;
    setTimeout(() => {
      this.forceUpdate();
    }, 0);
  }

  togleTimePickerChose(e) {
    e.preventDefault();
    e.stopPropagation();
    this.isThreHourPicker = !this.isThreHourPicker;

    setTimeout(() => {
      this.forceUpdate();
    }, 0);
  }

  togleOutOfSityCheck(e) {
    const outOfCityForm = this.state.outOfCityForm;
    outOfCityForm.present = e.target.checked;
    this.setState({ outOfCityForm });
    // const outOfCityCheck = !this.state.outOfCityCheck;
    // this.props
    //   .onChangeDefaultZoom(outOfCityCheck ? 7 : 0);

    // this.setState({ outOfCityCheck })
  }

  setSelectedPickUpPoint(pointId) {
    let selected = false;
    _.map(this.props.orderForUpdate.items, (item) => {
      if (item.pickupPointId === pointId) {
        selected = true;
      }
    });
    return selected;
  }

  setDeliveryTime(e) {
    (this.pickUpTimePickerVal >= ConvertExpPickUpTime(e.target.value)) ?
      (this.props.onDeliveryTimeSelect(this.props.deliveryTimeValidator(e, SetCorrectDeliveryTime(this.pickUpTimePickerVal)))) :
      this.props.onDeliveryTimeSelect(e.target.value.split('-')[1]);
  }

  setPickUpTimePickerVal(e) {
    this.pickUpTimePickerVal = ConvertExpPickUpTime(e.target.value);
    this.props.onDeliveryTimeSelect(null);
    this.forceUpdate();
  }

  outOfCityFormOnChange(name) {
    return function (e) {
      const outOfCityForm = this.state.outOfCityForm;
      outOfCityForm[name] = e.target.value;
      this.setState({ outOfCityForm });
    }
  }

  renderOutOfCityForm() {
    // return
    return (
      <div>
        <ControlLabel>
          {gettext('COUNTRY')}
        </ControlLabel>
        <FormControl type="text"
          defaultValue={this.state.outOfCityForm.country}
          placeholder={gettext('ENTER-YOUR-COUNTRY')}
          onChange={this.outOfCityFormOnChange('country').bind(this)}
          required={true} className="_recipient_" name="out-country" />

        <ControlLabel>
          {gettext('CITY')}
        </ControlLabel>
        <FormControl type="text"
          defaultValue={this.state.outOfCityForm.city}
          placeholder={gettext('ENTER-YOUR-CITY')}
          onChange={this.outOfCityFormOnChange('city').bind(this)}
          required={true} className="_recipient_" name="out-city" />
        <ControlLabel>
          {gettext('ADDRESS-LINE-FIRST')}
        </ControlLabel>

        <FormControl type="text"
          defaultValue={this.state.outOfCityForm.addressFirst}
          placeholder={gettext('ENTER-YOUR-LINE-FIRST')}
          onChange={this.outOfCityFormOnChange('addressFirst').bind(this)}
          required={true} className="_recipient_" name="out-adress-line-1" />
        <ControlLabel>
          {gettext('ADDRESS-LINE-SECOND')}
        </ControlLabel>

        <FormControl type="text"
          defaultValue={this.state.outOfCityForm.addressSecond}
          placeholder={gettext('ENTER-YOUR-LINE-SECOND')}
          onChange={this.outOfCityFormOnChange('addressSecond').bind(this)}
          className="_recipient_" name="out-adress-line-2" />

        <ControlLabel>
          {gettext('ZIP-CODE')}
        </ControlLabel>
        <FormControl type="text"
          // pattern="([0-9]){5,5}"
          defaultValue={this.state.outOfCityForm.zipCode}
          placeholder={gettext('ENTER-YOUR-ZIPCODE')}
          onChange={this.outOfCityFormOnChange('zipCode').bind(this)}
          required={true} className="_recipient_" name="out-zip-code" />

        <div className='outOfCityAlert'>
          <Alert bsStyle="warning">
            <span>Out of city delivery will add (SAR) to delivery cost {this.calculateOutOfCityCoast()}</span><br />
          </Alert>
        </div>

      </div>
    )
  }

  calculateOutOfCityCoast() {
    const idx = _.findIndex(this.props.companies, (company) => company.default);
    const commision = this.isExpressDelivery ? this.props.account.expressDeliveryCommission : this.props.account.deliveryCommission;

    return (
      idx >= 0 ? <strong>{commision + this.props.companies[idx].foreignDeliveryCost}</strong> : null
    )
  }

  renderMap() {
    const hideMap = classnames({
      'create-order-hide-map': this.state.outOfCityForm.present
    });
    return (
      <div className={hideMap}>
        <ControlLabel>
          {gettext('DELIVERY-POINT-ADDRESS')}
        </ControlLabel>
        <InputGroup style={getCurLang() === 'ar' ? rowReverseAR : {}}>
          <Geosuggest
            ref={(it) => {
              if (!it || this.geosuggest) {
                return;
              }
              this.geosuggest = it;
            }}
            style={{
              display: 'block',
              width: '100%'
            }}
            disabled={true}
            onSuggestSelect={this.props.onDeliveryPointSelect}
            name="deliveryPoint"
            placeholder={gettext('DELIVERY-POINT-ADDRESS')}
            inputClassName="_recipient_ _order_ form-control"
            required={!this.state.outOfCityForm.present}
            initialValue={this.props.formattedDeliveryPointAddress?this.props.formattedDeliveryPointAddress:this.recipient.deliveryPoint}
          />
          <InputGroup.Addon onClick={this.props.showMap} style={getCurLang() === 'ar' ? selOnMapAR : {}}>
            {gettext('SELECT-ON-MAP')}
          </InputGroup.Addon>

        </InputGroup>
      </div>
    )
  }

  submit(event) {
    this.props.submit(event);
  }

  render() {
    // let pointsWithoutFloating = _.map(this.props.pickUpPoints, (point) => {
    //   if(point.title!=='Floating')
    //     return point;
    //
    // });
    const pickUpPoints = (pointId) => _.map(Object.keys(this.props.pickUpPoints), (key) => (

      <option
        key={`${this.props.pickUpPoints[key].id}`}
        disabled={this.props.setOfSelectedPickUpPoints.has(this.props.pickUpPoints[key].id)}
        value={`${this.props.pickUpPoints[key].id}`}
        selected={pointId===this.props.pickUpPoints[key].id}>
          {this.props.pickUpPoints[key].title}
      </option>:''

    ));
    ///////////////////////////////////////
    ///////////////////////////////////////
    ///////////////////////////////////////
    ///////////////////////////////////////
    ///////////////////////////////////////
    //реальзовать флоатинги подвязанные к orderForReturn.items[i]
    const floatingPickUpPoint = (i) => (
      <FormGroup controlId="formHorizontalEmail">
        <ControlLabel>
          {gettext('PICKUP-POINT-CONTACT')}
        </ControlLabel>
        <FormControl
           type="text"
           required={true}
           onChange={(e) => {
             this.props.setFloatingPointContactName(e, i)
           }}
           className="geosuggest"
           placeholder={gettext('PICKUP-POINT-CONTACT')}
           style={{marginBottom: '1em',display: 'inline'}}
           defaultValue={
             _.find(this.props.pickUpPoints, {id: this.props.orderForUpdate.items[i].pickupPointId})
               ?_.find(this.props.pickUpPoints, {id: this.props.orderForUpdate.items[i].pickupPointId}).contactName
               :this.props.orderForUpdate.items[i].pickupPointId.contactName
           } />
        <ControlLabel>
          {gettext('PHONE')}
        </ControlLabel>
        <FormControl
           type="text"
           required={true}
           onChange={(e) => {
             this.props.setPickUpPointPhone(e, i);
           }}
           className="geosuggest"
           placeholder={gettext('PHONE')}
           style={{marginBottom: '1em',display: 'inline'}}
           defaultValue={
             _.find(this.props.pickUpPoints, {id: this.props.orderForUpdate.items[i].pickupPointId})
               ?_.find(this.props.pickUpPoints, {id: this.props.orderForUpdate.items[i].pickupPointId}).phone
               :this.props.orderForUpdate.items[i].pickupPointId.phone
           }/>
        <ControlLabel>
          {gettext('ADDRESS')}
        </ControlLabel>
        <InputGroup style={getCurLang() === 'ar' ? rowReverseAR : {}}>
          <Geosuggest
            ref={(it) => {
              if (!it || this.geosuggest) {
                return;
              }
              this.geosuggest = it;
            }}
            style={{
              display: 'block',
              width: '100%'
            }}
            disabled={true}
            onSuggestSelect={(e) => this.props.setFloatingPickUpPoint(e, i)}
            name="floatingPickUpPoint"
            placeholder={gettext('PICKUP-POINT')}
            inputClassName="form-control floatingPickUpPoint"
            initialValue={
              _.find(this.props.pickUpPoints, {id: this.props.orderForUpdate.items[i].pickupPointId})
                ?_.find(this.props.pickUpPoints, {id: this.props.orderForUpdate.items[i].pickupPointId}).address
                :this.props.orderForUpdate.items[i].pickupPointId.address
            }
            required={true}
          />
          <InputGroup.Addon onClick={(e) => {this.props.changeItemFocus(i);this.props.showFloatingMap();}} style={getCurLang() === 'ar' ? selOnMapAR : {}}>
            {gettext('SELECT-ON-MAP')}
          </InputGroup.Addon>
        </InputGroup>
      </FormGroup>
    );
    const vehicles = _.map(this.props.vehicles, (vehicle) => (
      <option key={`vehicle_${vehicle.type}`} value={vehicle.size}
        selected={this.props.orderForUpdate.vehicleType===vehicle.size}>
        {vehicle.type}
      </option>
    ));
    const correctDeliveryTimeOptions = _.map(deliveryTimes, (time) => {
      return (
        <option
          className={
            (ConvertExpPickUpTime(time) < this.pickUpTimePickerVal) && !this.isExpressDelivery ? 'display_none' : ''
          }
          selected = {
            parseInt(ConvertExpPickUpTime(time))===new Date(this.props.orderForUpdate.deliveryTime).getHours()
          }
          value={time}>
          {time}
        </option>
      );
    });

    const correctThreeHourPickUpTimes = _.map(threeHourTimes, (time) => {
      return (
        <option
          className={
            !(parseInt(ConvertExpPickUpTime(time)) > new Date(this.state.orderDate).getHours())
              && this.state.orderDate <= this.state.today ? 'display_none' : ''
          }
          style= {
            !(parseInt(ConvertExpPickUpTime(time)) > new Date(this.state.orderDate).getHours())
              && this.state.orderDate <= this.state.today ? {display: 'none!important'} : {}
          }
          disabled = {
            !(parseInt(ConvertExpPickUpTime(time)) > new Date(this.state.orderDate).getHours())
              && this.state.orderDate <= this.state.today ? true : false
          }
          selected = {
            parseInt(ConvertExpPickUpTime(time))===new Date(this.props.orderForUpdate.expectedPickUpTime.endTime).getHours()
          }
          value={time}>
          {time}
        </option>
      );
    });

    const correctOneHourPickUpTimes = _.map(oneHourTimes, (time) => {
      return (
        <option
          className={
            !(parseInt(ConvertExpPickUpTime(time)) > new Date(this.state.orderDate).getHours())
              && this.state.orderDate <= this.state.today ? 'display_none' : ''
          }

          style= {
            !(parseInt(ConvertExpPickUpTime(time)) > new Date(this.state.orderDate).getHours())
              && this.state.orderDate <= this.state.today ? {display: 'none'} : {}
          }

          disabled = {
            !(parseInt(ConvertExpPickUpTime(time)) > new Date(this.state.orderDate).getHours())
              && this.state.orderDate <= this.state.today ? true : false
          }
          selected = {
            parseInt(ConvertExpPickUpTime(time))===new Date(this.props.orderForUpdate.expectedPickUpTime.endTime).getHours()
          }
          value={time}>
          {time}
        </option>
      );
    });

    let updateItems = (
      <div>
        {_.map(this.props.orderForUpdate.items, (item, i) => {
          return (
            <div>
              <FormGroup controlId="formHorizontalTextarea" key={`pack_${item.id}`}>
                <h3>{gettext('PICKUP-POINT')}
                  {i!=0 ? ' (+'+this.props.dispatcher.additionalPickupPointCost +' '+ this.props.dispatcher.currency + ')':''}
                </h3>
                { !item.isFloating?
                  <FormControl componentClass="select" itemID={item.id} className="_item_" name="pickupPointId"
                    placeholder="select"
                    onChange={(e) => this.props.onPickUpPointSelected(e, i)}>
                    {pickUpPoints(item.pickupPointId)}
                  </FormControl>
                  :
                  floatingPickUpPoint(i)
                }
                  <FormGroup controlId="formHorizontalEmail">
                    <div className="checkbox" style={getCurLang() === 'ar' ? { marginRight: '2em' } : { marginLeft: '2em' }}>
                      <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-CREATE-FLOATINGPOINT'))}>
                        <label>
                          <input type="checkbox" className="floating_point" name="floating_point" checked={item.isFloating}
                          onChange={() => this.props.changePickupPointType(i)}/>
                          {gettext('USE-FLOATING-POINT')}<Glyphicon glyph="info-sign" />
                        </label>
                      </OverlayTrigger>
                    </div>
                  </FormGroup>

                <ControlLabel>
                  {gettext('PACKING-LIST') + ', ' + gettext('ITEM.ITEM-#') + ' ' + formatId(item.id)}
                </ControlLabel>
                <FormControl type="textarea"
                  required={true} style={{ resize: "vertical" }}
                  placeholder={gettext('PACKING-LIST')}
                  componentClass="textarea"
                  className="_item_" name="packingList"
                  itemID={item.id}
                  defaultValue={item.packingList}
                  onChange={(e) => this.props.changeItemsPacklist(e, i)}/>
              </FormGroup>
              <FormGroup controlId="formControlsTextarea" key={`comment_${item.id}`}>
                <ControlLabel>
                  {gettext('COMMENT-BOX')}
                </ControlLabel>
                <FormControl type="textarea"
                  componentClass="textarea"
                  style={{ resize: "vertical" }}
                  placeholder={gettext('LEAVE-COMMENT-IF-YOU-NEED')}
                  className="_item_"
                  itemID={item.id} name="comment"
                  defaultValue={item.comment}
                  onChange={(e) => this.props.changeItemsComment(e, i)}/>
              </FormGroup>
              <br />
              { this.props.orderForUpdate.items.length > 1 ?
                <Button bsStyle="danger" onClick={(e) => this.props.removeItemFromUpdate(e, item)}>{gettext('ITEM.REMOVE-ITEM')}</Button> : ''
              }
              <div className="dotted-line"></div>
            </div>
          );
        })
        }
        <FormGroup controlId="formHorizontalEmail">
          <Button bsStyle="primary" disabled={this.isExpressDelivery} onClick={this.props.addNewItemToUpdate}>{gettext('ITEM.ADD-NEW-ITEM')}</Button>
        </FormGroup>

      </div>
    );

    return (
      <div className="orderCreationForm container" dir={getCurLang() === 'ar' ? 'rtl' : 'ltr'} style={{ height: '100%' }}>
        <PageHeader>{gettext('UPDATE-ORDER')}</PageHeader>
        <Form onSubmit={this.props.updateOrder}
          className={getCurLang() === 'ar' ? 'formReverse' : ''}>

          <Col sm={6}>

            <h2>{gettext('PACKAGE-DETAILS')}</h2>
            <div className="dotted-line"></div>
            {!isEmpty(this.props.orderForUpdate)?updateItems:''}
            <h2>{gettext('PICKUP')}</h2>

            <FormGroup controlId="formHorizontalEmail">
              <ControlLabel>
                {gettext('DATE')}
              </ControlLabel>
              <DateTimeField
                mode="date"
                viewMode="days"
                minDate={moment().zone('+0300')}
                inputProps={{
                  name: "expectedPickUpDate",
                  className: "_order_ form-control",
                  required: true
                }}
                onChange={
                  (e) => this.setState({ orderDate: parseInt(e) })
                }
              />
            </FormGroup>
            <FormGroup controlId="formControlsSelect">
              <ControlLabel>{gettext('TIME-WINDOW')}</ControlLabel>
              <FormControl
                componentClass="select"
                className="_order_"
                style={this.isThreHourPicker ? divShow : divHide}
                name={this.isThreHourPicker ? selectName : selectNameFalse}
                placeholder="select"
                disabled={this.isExpressDelivery}
                onChange={(e) => this.setPickUpTimePickerVal(e)}>
                {correctThreeHourPickUpTimes}
              </FormControl>

              <FormControl
                componentClass="select"
                className="_order_"
                style={!this.isThreHourPicker ? divShow : divHide}
                name={!this.isThreHourPicker ? selectName : selectNameFalse}
                placeholder="select"
                disabled={this.isExpressDelivery}
                onChange={(e) => this.setPickUpTimePickerVal(e)}>
                <option disabled selected value> -- {gettext('SELECT-PICKUP-TIME')} -- </option>
                {correctOneHourPickUpTimes}
              </FormControl>
            </FormGroup>

            <FormGroup controlId="formHorizontalEmail">
              <div className="checkbox" style={getCurLang() === 'ar' ? { marginRight: '2em' } : { marginLeft: '2em' }}>
                <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-DELIVERNOW'))}>
                  <label>
                    <input type="checkbox" name="express" disabled={this.props.orderForUpdate.items > 1 } checked={this.isExpressDelivery} onChange={this.toggleExpressDelivery} className="_order_" />
                    {gettext('DELIVER-NOW')} {" (" + this.props.fields.expressDeliveryCommission + " " + this.props.fields.currency + ")"}
                    <Glyphicon glyph="info-sign" />
                  </label>
                </OverlayTrigger>
              </div>
            </FormGroup>

            <FormGroup controlId="formHorizontalEmail">
              <div className="checkbox" style={getCurLang() === 'ar' ? { marginRight: '2em' } : { marginLeft: '2em' }}>
                <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-SELECT-VEHICLE'))}>
                  <label>
                    <input type="checkbox" name="venicle" checked={this.isVenicleType} onChange={this.toggleVenicleType} className="_order_" />
                    {gettext('SELECTBOX-VEHICLE-TYPE')} <Glyphicon glyph="info-sign" />
                  </label>
                </OverlayTrigger>
              </div>
            </FormGroup>

            <FormGroup controlId="formControlsSelect" style={!this.isVenicleType ? { visibility: 'hidden' } : {}}>
              <select className="_order_ form-control" name="vehicleType">
                {vehicles}
              </select>
            </FormGroup>
            <div className="dotted-line"></div>
          </Col>

          <Col sm={6}>

            <h2>{gettext('RECIPIENT')}</h2>

            <div className="dotted-line"></div>
            <FormGroup controlId="formHorizontalEmail">
              <ControlLabel>
                {gettext('FIRST-NAME')}
              </ControlLabel>
              <FormControl type="string"
                pattern="[^0-9]{3,30}"
                defaultValue={this.recipient ? this.recipient.firstName : ''}
                required={true}
                placeholder={gettext('FIRST-NAME')}
                className="_recipient_" name="firstName" />
            </FormGroup>

            <FormGroup controlId="formHorizontalEmail">
              <ControlLabel>
                {gettext('MOBILE')}
              </ControlLabel>
              <FormControl type="text"
                pattern="([0-9]){7,20}"
                defaultValue={this.recipient ? this.recipient.mobile : ''}
                minLength={7}
                placeholder={gettext('MOBILE') + ' +XXXXXXXXXXX'}
                required={true} className="_recipient_" name="mobile" />
            </FormGroup>

              <FormGroup controlId="formHorizontalEmail">

                <div className='checkbox outOfCityCheck' style={getCurLang() === 'ar' ? { marginRight: '2em' } : { marginLeft: '2em' }}>
                  <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-OUTOFCITY'))}>
                    <label>
                      <input type="checkbox" name="outOfCityCheck" className="_order_" checked={this.state.outOfCityForm.present} onChange={this.togleOutOfSityCheck} />
                      {gettext('SELECT-OUT-OF-CITY')} <Glyphicon glyph="info-sign" />
                    </label>
                  </OverlayTrigger>
                </div>

                {this.renderMap()}

                {
                  this.state.outOfCityForm.present ? this.renderOutOfCityForm() : null
                }

                <div className="dotted-line"></div>
              </FormGroup>

            <h2>{gettext('DELIVERY')}</h2>

            <FormGroup controlId="formHorizontalEmail" style={this.isExpressDelivery ? { display: 'none' } : {}}>
              <ControlLabel>
                {gettext('DELIVERY-TIME')}
              </ControlLabel>
              <FormControl
                disabled={this.isExpressDelivery}
                componentClass="select"
                className="_order_"
                onChange={(e) => this.setDeliveryTime(e)}>
                <option disabled selected value> -- {gettext('SELECT-DELIVERY-TIME')} -- </option>
                {correctDeliveryTimeOptions}
              </FormControl>
            </FormGroup>

            <FormGroup controlId="formHorizontalEmail">
                <div className="checkbox" style={getCurLang() === 'ar' ? { marginRight: '2em' } : { marginLeft: '2em' }}>
                  <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-COD'))}>
                    <label>
                      <input type="checkbox" name="cashOnDelivery" checked={this.isCashOnDelivery}
                       onChange={this.toggleCashOnDelivery} className="_order_" />
                      {gettext('CASH-ON-DELIVERY')} <Glyphicon glyph="info-sign" />
                    </label>
                  </OverlayTrigger>
                </div>

              {this.isCashOnDelivery ?
                <FormControl type="text" defaultValue={formatCashOn(this.props.orderForUpdate.cashOnDelivery, this.props.orderForUpdate.cashOnDeliveryAmount)} pattern="[0-9]{1,}" min="0" placeholder="SAR" className="_order_" disabled={!this.isCashOnDelivery} name="cashOnDeliveryAmount" />
                : ''}
              <div className="dotted-line"></div>
            </FormGroup>

          </Col>

          {this.props.children}

          <footer className={getCurLang() === 'ar' ? 'navReverseLinks' : ''} style={{ bottom: '4em' }}>
            <span>
              <Link to="/dispatcherDashboard">
                {gettext('CANCEL')}
              </Link>
              <Button bsStyle="success" type="submit" style={getCurLang() === 'ar' ? { marginRight: "20px" } : { marginLeft: "20px" }}>
                {gettext('SUBMIT')}
              </Button>
            </span>
          </footer>
        </Form>
      </div>
    );
  }


}

UpdateOrderComponent.propTypes = {
  account: PropTypes.object,
  onInputChange: PropTypes.func,
  pickUpPoints: PropTypes.object,
  pickUpTimeValidator: PropTypes.func,
  deliveryTimeValidator: PropTypes.func,
  addNewItem: PropTypes.func,
  onDeliveryPointSelect: PropTypes.func,
  onDeliveryTimeSelect: PropTypes.func,
  showMap: PropTypes.func,
  formattedDeliveryPointAddress: PropTypes.string,
  vehicles: PropTypes.array.isRequired,
  setOfSelectedPickUpPoints: PropTypes.instanceOf(Set),
  onPickUpPointSelected: PropTypes.func,
  recipients: PropTypes.array,
  getDispatcher: PropTypes.func,
  getRecipient: PropTypes.func,
  setFloatingPickUpPoint: PropTypes.func,
  fields: PropTypes.object,
  children: PropTypes.string,
  outOfCityForm: PropTypes.object,
  updateOrder: PropTypes.func
};
