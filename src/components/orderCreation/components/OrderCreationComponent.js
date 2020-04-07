import React, { PropTypes } from 'react';
import { Row, Col, Jumbotron, ControlLabel, Checkbox, FormControl, Button, Glyphicon, InputGroup } from 'react-bootstrap';
import Geosuggest from 'react-geosuggest';
import DateTimeField from 'react-bootstrap-datetimepicker';
import Phone from 'react-phone-number-input';
import ReactTelInput from 'react-telephone-input';
import PlacesAutocomplete from 'react-places-autocomplete';
import { geocodeByAddress, geocodeByPlaceId } from 'react-places-autocomplete';
import { gettext } from '../../../i18n/service.js';
import { connect } from 'react-redux';
import _ from 'lodash';
import getCurLang from '../../../businessLogic/getCurLang.js';
import moment from 'moment';
import MapModalComponent from '../../MapModalComponent';
import { getCurrendDashboardUrl } from '../../../businessLogic/getCurrendDashboardUrl';


const deliveryTimes = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00"
];

const pickUpTimes = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

export default class OrderCreationComponent extends React.Component {
  constructor(props, context) {
    super(props, context);


    this.geocoder = new window.google.maps.Geocoder();
    this.state = {
      today: new Date().valueOf(),
      orderDate: new Date().valueOf(),
      startPickUpTimePickerVal: undefined,
      endPickUpTimePickerVal: undefined,

      startDeliveryTimePickerVal: undefined,
      endDeliveryTimePickerVal: undefined,
      isExpressDelivery: false,
      usersDeliveryTime: false,
      isOutOfCity: false,
      isSelectVehicle: false,
      isShowingMap: false,
      isShowingFloatingMap: false,
      isFloating: false,
      isFixed: false,

      defaultZoom: 0,
      selectedItemId: undefined,
      vehicleType: 2,
      items: [{
        isFloating: props.pickUpPoints.length === 0 ? true : false,
        isComment: false,
        pickupPointId: props.pickUpPoints.length === 0 ? {} : props.pickUpPoints[0].id,
        hotFoodContainer: false,
        fridge: false
      }],
      recipientDetails: { firstName: undefined },
      cashOnDeliveryAmount: undefined,
      cashOnDelivery: false,
      address: ''
    }

    this.onChange = (address) => this.setState({ address })
    _.bindAll(this, ['renderItems', 'renderRecipientDetails', 'renderPickUpTimes', 'renderFloatingPoint', 'renderVehicles',
      'setStartPickUpTimePickerVal', 'setEndPickUpTimePickerVal', 'needComment', 'showMap', 'hideMap', 'onMapClick',
      'renderDeliveryTimes', 'toggleExpressDelivery', 'toggleUsersDeliveryTime', 'addNewItem', 'deleteItem',
      'onFloatingMapClick', 'showFloatingMap', 'hideFloatingMap', 'toggleOutOfCity', 'toggleCashOnDelivery', 'getRecipientNameByPhone', 'toggleIsFixed']);

  }

  needComment(i) {
    let items = this.state.items;
    items[i].isComment = !items[i].isComment;
    if (!items[i].isCommen)
      delete items[i].comment;
    this.setState({ items: items });
  }

  addNewItem() {
    let items = this.state.items;
    items.push({
      isFloating: this.props.pickUpPoints.length === 0 ? true : false,
      isComment: false,
      pickupPointId: this.props.pickUpPoints.length === 0 ? {} : this.props.pickUpPoints[0].id,
      hotFoodContainer: false,
      fridge: false
    });
    this.setState({ items: items });
  }

  deleteItem(item) {
    if (this.state.items.length === 1) {
      return this.props.showMessage({
        message: gettext('ORDER-MUST-HAVE-AT-LEAST-ONE-ITEM'),
        level: 'error'
      });
    }
    let items = this.state.items;
    _.pull(items, item);
    this.setState({ items: items });
  }

  renderVehicles() {
    const vehicles = _.map(this.props.vehicles, (vehicle) => (
      <option key={`vehicle_${vehicle.type}`} value={vehicle.size}>
        {vehicle.type}
      </option>
    ));
    return (
      <Row>
        <div className="time_select">
          <ControlLabel>{gettext('VEHICLE-TYPE')}</ControlLabel>
          <FormControl componentClass="select" placeholder="select"
            onChange={(e) => this.setState({ vehicleType: e.target.value })}>
            {vehicles}
          </FormControl>
        </div>
      </Row>
    )
  }

  renderPickUpTimes() {
    const correctOneHourPickUpTimes = _.map(pickUpTimes, (time) => {
      return (
        <option
          className={
            !(parseInt(parseInt(time)) > new Date(this.state.orderDate).getHours())
              && this.state.orderDate <= this.state.today ? 'display_none' : ''
          }

          style={
            !(parseInt(parseInt(time)) > new Date(this.state.orderDate).getHours())
              && this.state.orderDate <= this.state.today ? { display: 'none' } : {}
          }

          disabled={
            !(parseInt(parseInt(time)) > new Date(this.state.orderDate).getHours())
              && this.state.orderDate <= this.state.today ? true : false
          }
          value={time}>
          {time}
        </option>
      );
    });
    return correctOneHourPickUpTimes;
  }

  renderDeliveryTimes() {
    const correctDeliveryTimeOptions = _.map(deliveryTimes, (time, i) => {
      if (i !== 0)
        return (
          <option
            className={
              !(parseInt(time) > this.state.startPickUpTimePickerVal && parseInt(time) > this.state.endPickUpTimePickerVal)
                && !this.state.isExpressDelivery ? 'display_none' : ''
            }
            value={time}>
            {deliveryTimes[i - 1] + ' : ' + time}
          </option>
        );
    });
    return correctDeliveryTimeOptions;
  }

  renderOutOfCityForm() {
    return (
      <div className="out_of_city_form">
        <Col sm={3}>
          <ControlLabel>
            {gettext('COUNTRY')}
          </ControlLabel>
        </Col>
        <Col sm={9}>
          <FormControl type="text"
            placeholder={gettext('ENTER-YOUR-COUNTRY')}
            onChange={(e) => {
              let recipientDetails = this.state.recipientDetails;
              if (!recipientDetails.outOfCityAddress)
                recipientDetails.outOfCityAddress = {};
              recipientDetails.outOfCityAddress.country = e.target.value;
              this.setState({ recipientDetails: recipientDetails });
            }}
            required={true} className="_recipient_" name="out-zip-code" />
        </Col>
        <Col sm={3}>
          <ControlLabel>
            {gettext('CITY')}
          </ControlLabel>
        </Col>
        <Col sm={9}>
          <FormControl type="text"
            placeholder={gettext('ENTER-YOUR-CITY')}
            onChange={(e) => {
              let recipientDetails = this.state.recipientDetails;
              if (!recipientDetails.outOfCityAddress)
                recipientDetails.outOfCityAddress = {};
              recipientDetails.outOfCityAddress.city = e.target.value;
              this.setState({ recipientDetails: recipientDetails });
            }}
            required={true} className="_recipient_" name="out-zip-code" />
        </Col>
        <Col sm={3}>
          <ControlLabel>
            {gettext('ADDRESS-LINE-FIRST')}
          </ControlLabel>
        </Col>
        <Col sm={9}>
          <FormControl type="text"
            placeholder={gettext('ENTER-YOUR-LINE-FIRST')}
            onChange={(e) => {
              let recipientDetails = this.state.recipientDetails;
              if (!recipientDetails.outOfCityAddress)
                recipientDetails.outOfCityAddress = {};
              recipientDetails.outOfCityAddress.addressFirst = e.target.value;
              this.setState({ recipientDetails: recipientDetails });
            }}
            required={true} className="_recipient_" name="out-adress-line-1" />
        </Col>
        <Col sm={3}>
          <ControlLabel>
            {gettext('ADDRESS-LINE-SECOND')}
          </ControlLabel>
        </Col>
        <Col sm={9}>
          <FormControl type="text"
            placeholder={gettext('ENTER-YOUR-LINE-SECOND')}
            onChange={(e) => {
              let recipientDetails = this.state.recipientDetails;
              if (!recipientDetails.outOfCityAddress)
                recipientDetails.outOfCityAddress = {};
              recipientDetails.outOfCityAddress.addressSecond = e.target.value;
              this.setState({ recipientDetails: recipientDetails });
            }}
            className="_recipient_" name="out-adress-line-2" />
        </Col>
        <Col sm={3}>
          <ControlLabel>
            {gettext('ZIP-CODE')}
          </ControlLabel>
        </Col>
        <Col sm={9}>
          <FormControl type="text"
            placeholder={gettext('ENTER-YOUR-ZIPCODE')}
            onChange={(e) => {
              let recipientDetails = this.state.recipientDetails;
              if (!recipientDetails.outOfCityAddress)
                recipientDetails.outOfCityAddress = {};
              recipientDetails.outOfCityAddress.zipCode = e.target.value;
              this.setState({ recipientDetails: recipientDetails });
            }}
            required={true} className="_recipient_" name="out-zip-code" />
        </Col>
      </div>
    )
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.fetched_recipient != nextProps.fetched_recipient) {
      if (nextProps.fetched_recipient[0]) {
        var recipientDetails = this.state.recipientDetails;
        recipientDetails.gpsLocation = nextProps.fetched_recipient[0].gpsLocation;
        recipientDetails.deliveryPoint = nextProps.fetched_recipient[0].deliveryPoint;
      }
      this.setState({ address: nextProps.fetched_recipient[0] ? nextProps.fetched_recipient[0].deliveryPoint : this.state.address })

    }
  }

  getRecipientNameByPhone() {

    let recipient = _.find(this.props.recipients, { mobile: this.state.recipientDetails.mobile.toString() });

    if (recipient) {
      let recipientDetails = this.state.recipientDetails;
      recipientDetails.firstName = recipient.firstName;
      this.setState({ recipientDetails: recipientDetails });
    }

  }


  handleInputBlur(telNumber, selectedCountry) {
    console.log('Focus off the ReactTelephoneInput component. Tel number entered is: ', telNumber, ' selected country is: ', selectedCountry);
  }

  renderRecipientDetails() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
      placeholder: gettext('DELIVERY-POINT'),
    }
    var that = this;
    return (
      <div className="recipient_details">
        <div className="text_align_center margin_bottom_em">
          <h3>{gettext('RECIPIENT-DETAILS')}</h3>
        </div>
        <Row>
          <Col sm={6}>
            <ReactTelInput
              defaultCountry="sa"
              flagsImagePath='./flags.png'
              onBlur={() => {
                this.getRecipientNameByPhone();
              }}
              onChange={(telNumber, selectedCountry) => {
                let recipientDetails = that.state.recipientDetails;
                recipientDetails.mobile = parseInt(telNumber.replace(/[^0-9]/g, ''), 10);
                if (telNumber) {
                  that.props.getRecipient(parseInt(telNumber.replace(/[^0-9]/g, ''), 10))
                }
                that.setState({ recipientDetails: recipientDetails });
              }}
            />
          </Col>
          <Col sm={6}>
            <FormControl
              type="text"
              required={true}
              value={this.state.recipientDetails.firstName}
              onChange={(e) => {
                let recipientDetails = this.state.recipientDetails;
                recipientDetails.firstName = e.target.value;
                this.setState({ recipientDetails: recipientDetails });
              }}
              placeholder={gettext('NAME')} />
          </Col>
        </Row>
        <Row>
          <Col sm={!this.state.isOutOfCity ? 3 : 12}>
            <div className="delivery_controll">
              <ControlLabel>
                {gettext('WHERE-TO-DELIVER')}
              </ControlLabel>
            </div>
          </Col>
          {!this.state.isOutOfCity ?
            <Col sm={9}>
              <div className="delivery_controll">
                <InputGroup>
                  <Geosuggest

                    style={{
                      display: 'block',
                      width: '100%'
                    }}
                    onSuggestSelect={(opts) => {
                      let recipientDetails = this.state.recipientDetails;
                      recipientDetails.gpsLocation = opts.location;
                      recipientDetails.deliveryPoint = opts.label;
                      this.setState({ recipientDetails: recipientDetails });
                    }}
                    name="deliveryPoint"
                    placeholder={gettext('DELIVERY-POINT-ADDRESS')}
                    inputClassName="_recipient_ _order_ form-control"
                    initialValue={this.state.address}
                    required={true}
                  />
                  <InputGroup.Addon onClick={() => this.showMap()}>
                    {gettext('SELECT-ON-MAP')}
                  </InputGroup.Addon>
                </InputGroup>
              </div>
            </Col>
            :
            this.renderOutOfCityForm()
          }
        </Row>
      </div>
    );
  }

  renderFloatingPoint(i) {
    return (
      <div>
        <ControlLabel>
          {gettext('PICKUP-POINT-CONTACT')}
        </ControlLabel>
        <FormControl
          type="text"
          required={true}
          className="geosuggest"
          placeholder={gettext('PICKUP-POINT-CONTACT')}
          value={this.state.items[i].pickupPointId.contactName}
          onChange={(e) => {
            let items = this.state.items;
            items[i].pickupPointId.contactName = e.target.value;
            this.setState({ items: items });
          }}
          style={{ marginBottom: '1em', display: 'inline' }} />

        <ControlLabel>
          {gettext('PHONE')}
        </ControlLabel>
        <FormControl
          type="text"
          required={true}
          className="geosuggest"
          placeholder={gettext('PHONE')}
          value={this.state.items[i].pickupPointId.phone}
          onChange={(e) => {
            let items = this.state.items;
            items[i].pickupPointId.phone = e.target.value;
            this.setState({ items: items });
          }}
          style={{ marginBottom: '1em', display: 'inline' }} />
        <ControlLabel>
          {gettext('ADDRESS')}
        </ControlLabel>
        <InputGroup>
          <Geosuggest
            style={{
              display: 'block',
              width: '100%'
            }}
            name="floatingPickUpPoint"
            placeholder={gettext('PICKUP-POINT')}
            initialValue={this.state.items[i].pickupPointId.address}
            inputClassName="form-control floatingPickUpPoint"
            onSuggestSelect={(opts) => {
              let items = this.state.items;
              items[i].pickupPointId.address = opts.label;
              items[i].pickupPointId.gpsLocation = opts.location;

              this.setState({ items: items });
            }}
          />

          <InputGroup.Addon onClick={() => { this.showFloatingMap(); this.setState({ selectedItemId: i }); }}>
            {gettext('SELECT-ON-MAP')}
          </InputGroup.Addon>
        </InputGroup>
      </div>
    );
  }

  renderItems() {
    const items = _.map(this.state.items, (item, i) => {
      return (
        <Row key={i}>
          <Col sm={12}>
            <Row>
              <div className="pickup_point">
                <ControlLabel>
                  {gettext('PICKUP-POINT')}
                </ControlLabel>
                <Checkbox
                  checked={item.isFloating}
                  onChange={() => {
                    let items = this.state.items;
                    items[i].isFloating = !item.isFloating;
                    items[i].pickupPointId = {};
                    this.setState({ items: items })
                  }}
                  className="floating_checkbox">{gettext('USE-FLOATING-POINT')}
                </Checkbox>
                {
                  !item.isFloating
                    ? <FormControl componentClass="select" placeholder="select" className="pickup_point_select"
                      value={item.pickupPointId}
                      onChange={(e) => {
                        let items = this.state.items;
                        items[i].pickupPointId = e.target.value;
                        this.setState({ items: items })
                      }}>
                      {this.props.renderPickUpPoints(this.props.pickUpPoints)}
                    </FormControl>
                    : this.renderFloatingPoint(i)
                }
                {/*
                  !item.isFloating ?
                    <Button bsStyle="success" className="additional_btn">{gettext('ADD-NEW')}</Button>
                    : ''
                */}
                <br /><br />
                <ControlLabel>
                  {gettext('PACKING-LIST')}
                </ControlLabel>
                <Checkbox
                  className="floating_checkbox"
                  checked={item.isComment}
                  onChange={() => this.needComment(i)}>
                  {gettext('ADD-COMMENT')}
                </Checkbox>
                <FormControl type="textarea" style={{ resize: "vertical" }}
                  placeholder={gettext('PACKING-LIST')}
                  componentClass="textarea"
                  value={item.packingList}
                  onChange={(e) => {
                    let items = this.state.items;
                    items[i].packingList = e.target.value;
                    this.setState({ items: items });
                  }} />
                <div className={item.isComment ? 'marginmargin_top_em' : 'display_none'}>
                  <ControlLabel>
                    {gettext('COMMENT')}
                  </ControlLabel>
                  <FormControl type="textarea" style={{ resize: "vertical" }}
                    placeholder={gettext('COMMENT')}
                    componentClass="textarea"
                    value={item.comment}
                    onChange={(e) => {
                      let items = this.state.items;
                      items[i].comment = e.target.value;
                      this.setState({ items: items });
                    }} />
                </div>
                <Col sm={6} style={{ display: 'none' }} >
                  <Checkbox
                    checked={item.needHotFoodContainer}
                    onChange={() => {
                      let items = this.state.items;
                      items[i].hotFoodContainer = !item.hotFoodContainer;
                      this.setState({ items: items });
                    }}>
                    {gettext('NEED-HOT-FOOD-CONTAINER')}
                  </Checkbox>
                </Col>
                <Col sm={6} style={{ display: 'none' }}>
                  <Checkbox checked={item.needFridge}
                    onChange={() => {
                      let items = this.state.items;
                      items[i].fridge = !item.fridge;
                      this.setState({ items: items });
                    }}>
                    {gettext('NEED-FRIDGE')}
                  </Checkbox>
                </Col>
                <div className="remove_point_btn">
                  <Button onClick={() => this.deleteItem(item)}>X</Button>
                </div>
              </div>
            </Row>
          </Col>
        </Row>
      );
    });
    return items;
  }

  setStartPickUpTimePickerVal(e) {
    this.setState({ startPickUpTimePickerVal: parseInt(e.target.value) })
  }

  setEndPickUpTimePickerVal(e) {
    this.setState({ endPickUpTimePickerVal: parseInt(e.target.value) })
  }

  toggleExpressDelivery() {
    this.setState({ isExpressDelivery: !this.state.isExpressDelivery });
  }

  toggleUsersDeliveryTime() {
    this.setState({ usersDeliveryTime: !this.state.usersDeliveryTime });
  }

  toggleCashOnDelivery() {
    this.setState({ cashOnDelivery: !this.state.cashOnDelivery });
  }

  toggleIsFixed() {
    this.setState({ isFixed: !this.state.isFixed });
  }

  toggleOutOfCity() {
    let recipientDetails = this.state.recipientDetails
    if (recipientDetails.outOfCityAddress)
      delete recipientDetails.outOfCityAddress;
    if (recipientDetails.gpsLocation)
      delete recipientDetails.gpsLocation;
    if (recipientDetails.deliveryPoint)
      delete recipientDetails.deliveryPoint;
    this.setState({ isOutOfCity: !this.state.isOutOfCity, recipientDetails: recipientDetails })
  }

  showMap() {
    this.setState({ isShowingMap: true });
  }

  hideMap() {
    this.setState({ isShowingMap: false });
  }

  onMapClick({ latLng }) {
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng()
    };
    this.geocoder.geocode({ location: location }, (results) => {
      let recipientDetails = this.state.recipientDetails;
      recipientDetails.gpsLocation = location;
      recipientDetails.deliveryPoint = results[0].formatted_address;
      this.setState({ recipientDetails: recipientDetails });
      this.setState({ address: recipientDetails.deliveryPoint })
      this.hideMap();
    });
  }

  onFloatingMapClick({ latLng }) {
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng()
    };

    this.geocoder.geocode({ location: location }, (results) => {
      let items = this.state.items;
      items[this.state.selectedItemId].pickupPointId.address = results[0].formatted_address;
      items[this.state.selectedItemId].pickupPointId.gpsLocation = location;

      this.setState({ items: items, isShowingFloatingMap: false });
    });

    this.forceUpdate();
  }

  showFloatingMap() {
    this.setState({ isShowingFloatingMap: true });
  }

  hideFloatingMap() {
    this.setState({ isShowingFloatingMap: false });
  }

  getCurrendDashboardUrl() {
    return getCurrendDashboardUrl(this.props.account)
  }

  render() {
    const map = this.state.isShowingMap ?
      (
        <MapModalComponent
          onMapClick={this.onMapClick}
          onClickOutsideOfMap={this.hideMap}
          onCancel={this.hideMap}
          defaultZoom={this.state.defaultZoom} />
      )
      : '';

    const floatingMap = this.state.isShowingFloatingMap ?
      (
        <MapModalComponent
          onMapClick={this.onFloatingMapClick}
          onClickOutsideOfMap={this.hideFloatingMap}
          onCancel={this.hideFloatingMap}
          defaultZoom={this.state.defaultZoom} />
      )
      : '';

    return (
      <Jumbotron className="card">
        <div className="text_align_center margin_bottom_em">
          <h3>{gettext('ORDER-DETAILS')}</h3>
        </div>
        <Row>
          <Col sm={6}>
            <div className="date_select">
              <DateTimeField
                mode="date"
                viewMode="days"
                minDate={moment()}
                inputProps={{
                  name: "expectedPickUpDate",
                  className: "_order_ form-control",
                  required: true
                }}
                onChange={
                  (e) => this.setState({ orderDate: parseInt(e) })
                } />
            </div>
            <div className="check_list">
              <Checkbox
                disabled={this.state.usersDeliveryTime || this.state.isOutOfCity}
                checked={this.state.isExpressDelivery}
                onChange={this.toggleExpressDelivery}>
                {gettext('DELIVER-NOW')}
              </Checkbox>

              <Checkbox
                disabled={this.state.isExpressDelivery || this.state.usersDeliveryTime}
                checked={this.state.isOutOfCity}
                onChange={() => this.toggleOutOfCity()}>
                {gettext('SELECT-OUT-OF-CITY')}
              </Checkbox>

              <Checkbox checked={this.state.isSelectVehicle}
                onChange={() => this.setState({ isSelectVehicle: !this.state.isSelectVehicle, vehicleType: 1 })}>
                {gettext('SELECTBOX-VEHICLE-TYPE')}
              </Checkbox>

              <Checkbox
                disabled={this.state.isExpressDelivery || this.state.isOutOfCity}
                checked={this.state.usersDeliveryTime}
                onChange={this.toggleUsersDeliveryTime}>
                {gettext('WANT-SPECIFY-DELIVERY-TIME')}
              </Checkbox>

              <Checkbox
                checked={this.state.cashOnDelivery}
                onChange={this.toggleCashOnDelivery}>
                {gettext('CASH-ON-DELIVERY')}
              </Checkbox>

              <Checkbox
                checked={this.state.isFixed}
                onChange={this.toggleIsFixed}>
                {gettext('DISTANCE-BASED DELIVERY COST')}
              </Checkbox>
            </div>
          </Col>
          <Col sm={6}>
            <Row>
              <div className="time_select">
                <ControlLabel>{gettext('PICKUP-TIME-ORDER-CREATION')}</ControlLabel>
                <FormControl componentClass="select" className="select_box" placeholder="select"
                  disabled={this.state.isExpressDelivery}
                  onChange={(e) => this.setStartPickUpTimePickerVal(e)}>
                  <option selected disabled value="select">{gettext('START')}</option>
                  {this.renderPickUpTimes()}
                </FormControl>
                <FormControl componentClass="select" placeholder="select"
                  disabled={this.state.isExpressDelivery}
                  onChange={(e) => this.setEndPickUpTimePickerVal(e)}>
                  <option selected disabled value="select">{gettext('END')}</option>
                  {this.renderPickUpTimes()}
                </FormControl>
              </div>
            </Row>
            {this.state.usersDeliveryTime ?
              <Row>
                <div className="time_select">
                  <ControlLabel>{gettext('DELIVERY-TIME')}</ControlLabel>
                  {/*<FormControl componentClass="select" placeholder="select"
                    disabled={this.state.isExpressDelivery || !this.state.usersDeliveryTime}
                    onChange={(e) => this.setState({startDeliveryTimePickerVal: e.target.value})}>
                      <option disabled value="select">{gettext('START')}</option>
                      {this.renderDeliveryTimes()}
                  </FormControl>*/}
                  <FormControl className="delivery_time_dropdown" componentClass="select" placeholder="select"
                    disabled={this.state.isExpressDelivery || !this.state.usersDeliveryTime}
                    onChange={(e) => this.setState({ endDeliveryTimePickerVal: e.target.value })}>
                    <option disabled selected value="select">-</option>
                    {this.renderDeliveryTimes()}
                  </FormControl>
                </div>
              </Row> : ''
            }
            {this.state.isSelectVehicle ? this.renderVehicles() : ''}
            {this.state.cashOnDelivery ?
              <Row>
                <div className="cash_on_delivery">
                  <ControlLabel>{gettext('CASH-ON-DELIVERY')}</ControlLabel>
                  <FormControl
                    type="number"
                    required={true}
                    onChange={(e) => {
                      this.setState({ cashOnDeliveryAmount: e.target.value });
                    }}
                    placeholder={gettext('CASH-ON-DELIVERY')} />
                </div>
              </Row> : ''
            }

          </Col>
        </Row>

        {this.renderItems()}
        <Button bsStyle="success"
          disabled={this.state.isExpressDelivery}
          className="add_point_btn"
          onClick={this.addNewItem}>
          {gettext('ADD-ITEM')}
        </Button>
        <div className="underline" />
        {this.renderRecipientDetails()}



        <div className="add_point_btn">
          <div className="btn-container">
            <Button bsStyle="success"
              onClick={() => {
                let statevar = this.state;
                statevar.recipientDetails.mobile = parseInt(statevar.recipientDetails.mobile);
                this.props.createOrder(statevar);
              }}>
              {gettext('SUBMIT')}
            </Button>

            <Button bsStyle="success" style={{ background: '#d9534f' }}

              onClick={() => this.props.router.push(this.getCurrendDashboardUrl())}>
              {gettext('CANCEL')}
            </Button>
          </div>
        </div>

        {map}
        {floatingMap}
      </Jumbotron>
    );
  }
}




OrderCreationComponent.propTypes = {

};
