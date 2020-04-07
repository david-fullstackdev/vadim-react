import React, { PropTypes } from 'react';
import { Row, Col, Jumbotron, ControlLabel, Checkbox, FormControl, Button, Glyphicon, InputGroup } from 'react-bootstrap';
import Geosuggest from 'react-geosuggest';
import DateTimeField from 'react-bootstrap-datetimepicker';
import { gettext } from '../../../i18n/service.js';
import { connect } from 'react-redux';
import _ from 'lodash';
import getCurLang from '../../../businessLogic/getCurLang.js';
import moment from 'moment';
import MapModalComponent from '../../MapModalComponent';


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

export default class OrderUpdatingComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.geocoder = new window.google.maps.Geocoder();
    this.state = {
      order: props.orderForUpdate,
      isShowingMap: false,
      isShowingFloatingMap: false,
      isSelectVehicle: true,
      recipientDetails: props.recipientDetails,
      itemsToUpdate: [],
      itemsToDelete: [],
      itemsToAdd: [],

      defaultZoom: 0,
      selectedItemId: undefined,

    }

    _.bindAll(this, ['renderItems', 'renderRecipientDetails', 'renderPickUpTimes', 'renderFloatingPoint', 'renderVehicles',
      'setStartPickUpTimePickerVal', 'setEndPickUpTimePickerVal', 'needComment', 'showMap', 'hideMap', 'onMapClick',
      'renderDeliveryTimes', 'addNewItem', 'deleteItem',
      'onFloatingMapClick', 'showFloatingMap', 'hideFloatingMap', 'joinItems', 'prepareOrderToUpdate', 'toggleCashOnDelivery']);

  }

  componentWillUnmount() {
    this.props.removeOrderForUpdate();
  }

  needComment(i) {
    let items = this.props.orderForUpdate.items;
    items[i].isComment = !items[i].isComment;
    if (!items[i].isCommen)
      delete items[i].comment;
    this.setState({ items: items });
  }

  addNewItem() {
    let items = this.props.orderForUpdate.items;
    items.push({
      isFloating: this.props.pickUpPoints.length === 0 ? true : false,
      isComment: false,
      pickupPointId: this.props.pickUpPoints.length === 0 ? {} : this.props.pickUpPoints[0].id,
      hotFoodContainer: false,
      fridge: false,
      toAdd: true,
      companyId: this.props.company.id
    });
    this.setState({ items: items });
  }



  deleteItem(itemForDelete) {
    if (this.state.order.items.length === 1) {
      return this.props.showMessage({
        message: gettext('ORDER-MUST-HAVE-AT-LEAST-ONE-ITEM'),
        level: 'error'
      });
    }

    // let itemToDelete = undefined;
    // _.map(this.state.order.items, (item) => {
    //
    //   if (item.id === itemForDelete.id)
    //     itemToDelete = item;
    //
    // });

    if (itemForDelete) {
      if (itemForDelete.id)
        this.state.itemsToDelete.push(itemForDelete.id);
      _.pull(this.state.order.items, itemForDelete);
    }
    this.forceUpdate();
  }

  joinItems(items) {
    let toAdd = [];
    let toUpdate = [];
    let points = [];

    _.map(items, (item) => {
      if (!item.id)
        toAdd.push(item);
      else
        toUpdate.push(item);
    });

    points = toAdd.concat(toUpdate);
    if (_.uniqBy(points, 'pickupPointId').length !== points.length) {

      this.props.showMessage({
        message: gettext('ITEM-MUST-HAVE-UNIQUE-PICKUP-POINT'),
        level: 'error'
      });
      return false;
    }

    return {
      toAdd: toAdd,
      toUpdate: toUpdate,
      toDelete: this.state.itemsToDelete
    };
  }

  prepareOrderToUpdate() {

    const payload = {
      orderId: this.state.order.id,
      updatedOrder: {
        items: this.joinItems(this.state.order.items),
        recipient: this.state.recipientDetails,
        order: this.state.order
      }
    };

    this.props.updateOrder(payload)
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
            defaultValue={this.props.orderForUpdate.vehicleType}
            className='delivery_time_select'
            onChange={(e) => {
              let order = this.state.order;
              order.vehicleType = e.target.value;
              this.setState({ order: order });
            }}>
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
            defaultValue={this.state.recipientDetails.outOfCityAddress ? this.state.recipientDetails.outOfCityAddress.country : ''}
            required={true} className="_recipient_" name="out-zip-code"
            onChange={(e) => {
              let recipientDetails = this.state.recipientDetails;
              if (!recipientDetails.outOfCityAddress)
                recipientDetails.outOfCityAddress = {};
              recipientDetails.outOfCityAddress.country = e.target.value;
              this.setState({ recipientDetails: recipientDetails });
            }} />
        </Col>
        <Col sm={3}>
          <ControlLabel>
            {gettext('CITY')}
          </ControlLabel>
        </Col>
        <Col sm={9}>
          <FormControl type="text"
            placeholder={gettext('ENTER-YOUR-CITY')}
            defaultValue={this.state.recipientDetails.outOfCityAddress ? this.state.recipientDetails.outOfCityAddress.city : ''}
            required={true} className="_recipient_" name="out-zip-code"
            onChange={(e) => {
              let recipientDetails = this.state.recipientDetails;
              if (!recipientDetails.outOfCityAddress)
                recipientDetails.outOfCityAddress = {};
              recipientDetails.outOfCityAddress.city = e.target.value;
              this.setState({ recipientDetails: recipientDetails });
            }} />
        </Col>
        <Col sm={3}>
          <ControlLabel>
            {gettext('ADDRESS-LINE-FIRST')}
          </ControlLabel>
        </Col>
        <Col sm={9}>
          <FormControl type="text"
            placeholder={gettext('ENTER-YOUR-LINE-FIRST')}
            defaultValue={this.state.recipientDetails.outOfCityAddress ? this.state.recipientDetails.outOfCityAddress.addressFirst : ''}
            required={true} className="_recipient_" name="out-adress-line-1"
            onChange={(e) => {
              let recipientDetails = this.state.recipientDetails;
              if (!recipientDetails.outOfCityAddress)
                recipientDetails.outOfCityAddress = {};
              recipientDetails.outOfCityAddress.addressFirst = e.target.value;
              this.setState({ recipientDetails: recipientDetails });
            }} />
        </Col>
        <Col sm={3}>
          <ControlLabel>
            {gettext('ADDRESS-LINE-SECOND')}
          </ControlLabel>
        </Col>
        <Col sm={9}>
          <FormControl type="text"
            placeholder={gettext('ENTER-YOUR-LINE-SECOND')}
            defaultValue={this.state.recipientDetails.outOfCityAddress ? this.state.recipientDetails.outOfCityAddress.addressSecond : ''}
            className="_recipient_" name="out-adress-line-2"
            onChange={(e) => {
              let recipientDetails = this.state.recipientDetails;
              if (!recipientDetails.outOfCityAddress)
                recipientDetails.outOfCityAddress = {};
              recipientDetails.outOfCityAddress.addressSecond = e.target.value;
              this.setState({ recipientDetails: recipientDetails });
            }} />
        </Col>
        <Col sm={3}>
          <ControlLabel>
            {gettext('ZIP-CODE')}
          </ControlLabel>
        </Col>
        <Col sm={9}>
          <FormControl type="text"
            placeholder={gettext('ENTER-YOUR-ZIPCODE')}
            defaultValue={this.state.recipientDetails.outOfCityAddress ? this.state.recipientDetails.outOfCityAddress.zipCode : ''}
            required={true} className="_recipient_" name="out-zip-code"
            onChange={(e) => {
              let recipientDetails = this.state.recipientDetails;
              if (!recipientDetails.outOfCityAddress)
                recipientDetails.outOfCityAddress = {};
              recipientDetails.outOfCityAddress.zipCode = e.target.value;
              this.setState({ recipientDetails: recipientDetails });
            }} />
        </Col>
      </div>
    )
  }

  renderRecipientDetails() {
    return (
      <div className="recipient_details">
        <div className="text_align_center margin_bottom_em">
          <h3>{gettext('RECIPIENT-DETAILS')}</h3>
        </div>
        <Row>
          <Col sm={6}>
            <FormControl
              type="text"
              required={true}
              defaultValue={this.state.recipientDetails.mobile}
              onChange={(e) => {
                let recipientDetails = this.state.recipientDetails;
                recipientDetails.mobile = e.target.value;
                this.setState({ recipientDetails: recipientDetails });
              }}
              placeholder={gettext('MOBILE')} />
          </Col>
          <Col sm={6}>
            <FormControl
              type="text"
              required={true}
              defaultValue={this.state.recipientDetails.firstName}
              onChange={(e) => {
                let recipientDetails = this.state.recipientDetails;
                recipientDetails.firstName = e.target.value;
                this.setState({ recipientDetails: recipientDetails });
              }}
              placeholder={gettext('NAME')} />
          </Col>

          <Col sm={!this.state.order.isOutOfCity ? 3 : 12}>
            <div className="delivery_controll">
              <ControlLabel>
                {gettext('WHERE-TO-DELIVER')}
              </ControlLabel>
            </div>
          </Col>
          {!this.state.order.isOutOfCity ?
            <Col sm={9}>
              <div className="delivery_controll">
                <InputGroup>
                  <Geosuggest
                    style={{
                      display: 'block',
                      width: '100%'
                    }}
                    inputClassName="form-control floatingPickUpPoint"
                    placeholder={gettext('DELIVERY-POINT')}
                    onSuggestSelect={(opts) => {
                      let recipientDetails = this.state.recipientDetails;
                      recipientDetails.gpsLocation = opts.location;
                      recipientDetails.deliveryPoint = opts.label;
                      this.setState({ recipientDetails: recipientDetails });
                    }}
                    initialValue={this.state.recipientDetails.deliveryPoint}
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
    this.state.order.items[i].pickupPointId.companyId = this.props.company.id;
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
          value={this.state.order.items[i].pickupPointId.contactName}
          style={{ marginBottom: '1em', display: 'inline' }}
          onChange={(e) => {
            let order = this.state.order;
            order.items[i].pickupPointId.contactName = e.target.value;
            this.setState({ order: order });
          }} />

        <ControlLabel>
          {gettext('PHONE')}
        </ControlLabel>
        <FormControl
          type="text"
          required={true}
          className="geosuggest"
          placeholder={gettext('PHONE')}
          value={this.state.order.items[i].pickupPointId.phone}
          style={{ marginBottom: '1em', display: 'inline' }}
          onChange={(e) => {
            let order = this.state.order;
            order.items[i].pickupPointId.phone = e.target.value;
            this.setState({ order: order });
          }} />
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
            initialValue={this.state.order.items[i].pickupPointId.address}
            placeholder={gettext('PICKUP-POINT')}
            inputClassName="form-control floatingPickUpPoint"
            onSuggestSelect={(opts) => {
              let order = this.state.order;
              order.items[i].pickupPointId.address = opts.label;
              order.items[i].pickupPointId.gpsLocation = opts.location;

              this.setState({ order: order })

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
    const items = _.map(this.state.order.items, (item, i) => {
      return (
        <Row key={`item_${i}`}>
          <Col sm={12}>
            <Row>
              <div className="pickup_point">
                <ControlLabel>
                  {gettext('PICKUP-POINT')}
                </ControlLabel>
                <Checkbox
                  checked={item.isFloating}
                  className="floating_checkbox"
                  onChange={() => {
                    let order = this.state.order;
                    order.items[i].isFloating = !order.items[i].isFloating;
                    order.items[i].pickupPointId = {};
                    this.setState({ order: order });
                  }}>
                  {gettext('USE-FLOATING-POINT')}
                </Checkbox>
                {
                  !item.isFloating
                    ? <FormControl componentClass="select"
                      value={item.pickupPointId}
                      placeholder="select"
                      className="pickup_point_select"
                      onChange={(e) => {
                        let order = this.state.order;
                        order.items[i].pickupPointId = e.target.value;
                        this.setState({ order: order });
                      }}>
                      {this.props.renderPickUpPoints(this.props.pickUpPoints)}
                    </FormControl>
                    : this.renderFloatingPoint(i)
                }
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
                    let order = this.state.order;
                    order.items[i].packingList = e.target.value;
                    this.setState({ order: order });
                  }} />
                <div className={item.comment || item.isComment ? 'marginmargin_top_em' : 'display_none'}>
                  <ControlLabel>
                    {gettext('COMMENT')}
                  </ControlLabel>
                  <FormControl type="textarea" style={{ resize: "vertical" }}
                    placeholder={gettext('COMMENT')}
                    componentClass="textarea"
                    value={item.comment}
                    onChange={(e) => {
                      let order = this.state.order;
                      order.items[i].comment = e.target.value;
                      this.setState({ order: order });
                    }} />
                </div>
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
    let order = this.state.order;
    order.expectedPickUpTime.startTime = Date.parse(`${moment(this.state.order.expectedPickUpTime.startTime).format('MM/DD/YY')} ${e.target.value}:00`);

    this.setState({ order: order });

  }

  setEndPickUpTimePickerVal(e) {
    let order = this.state.order;
    order.expectedPickUpTime.endTime = Date.parse(`${moment(this.state.order.expectedPickUpTime.startTime).format('MM/DD/YY')} ${e.target.value}:00`);

    this.setState({ order: order });
  }

  toggleCashOnDelivery() {
    let order = this.state.order;
    order.cashOnDelivery = !order.cashOnDelivery;
    if (!order.cashOnDelivery)
      delete order.cashOnDeliveryAmount;
    this.setState({ order: order });
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
      this.hideMap();
    });
  }

  onFloatingMapClick({ latLng }) {
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng()
    };

    this.geocoder.geocode({ location: location }, (results) => {


      let order = this.state.order;
      order.items[this.state.selectedItemId].pickupPointId.address = results[0].formatted_address;
      order.items[this.state.selectedItemId].pickupPointId.gpsLocation = location;

      this.setState({ order: order })

      this.setState({ isShowingFloatingMap: false });
    });

    this.forceUpdate();
  }

  showFloatingMap() {
    this.setState({ isShowingFloatingMap: true });
  }

  hideFloatingMap() {
    this.setState({ isShowingFloatingMap: false });
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
                maxDate={this.state.order.express ? moment() : undefined}
                defaultText={moment(this.state.order.expectedPickUpTime.startTime).format('MM/DD/YY')}
                value={moment(this.state.order.expectedPickUpTime.startTime).format('MM/DD/YY')}
                inputProps={{
                  name: "expectedPickUpDate",
                  className: "_order_ form-control",
                  required: true,
                  readonly: this.state.order.express,
                  disabled: this.state.order.express,
                  pickTime: !this.state.order.express
                }}
                onChange={
                  (e) => {
                    if (this.state.order.express)
                      return this.props.showMessage({
                        message: gettext('CANT-CHANGE-IF-EXPRESS'),
                        level: 'error'
                      });
                    let order = this.state.order;

                    order.expectedPickUpTime = {
                      startTime: Date.parse(`${moment(parseInt(e)).format('MM/DD/YY')} ${moment(this.state.order.expectedPickUpTime.startTime).format('HH:00')}`),
                      endTime: Date.parse(`${moment(parseInt(e)).format('MM/DD/YY')} ${moment(this.state.order.expectedPickUpTime.endTime).format('HH:00')}`)
                    }

                    order.deliveryTime = Date.parse(`${moment(parseInt(e)).format('MM/DD/YY')} ${moment(this.state.order.deliveryTime).format('HH:00')}`);

                    this.setState({ orderDate: parseInt(e), order: order })
                  }} />
            </div>
            <div className="check_list">
              <Checkbox checked={this.state.isSelectVehicle}
                onChange={() => this.setState({ isSelectVehicle: !this.state.isSelectVehicle })}>
                {gettext('SELECTBOX-VEHICLE-TYPE')}
              </Checkbox>
              <Checkbox
                checked={this.state.order.cashOnDelivery}
                onChange={this.toggleCashOnDelivery}>
                {gettext('CASH-ON-DELIVERY')}
              </Checkbox>
            </div>
            <div className="check_list">
              <h3>
                {
                  this.state.order.express
                    ? <strong className="express">{gettext('EXPRESS-DELIVERY') + '!'}</strong> : ''
                }
                {
                  this.state.order.isOutOfCity
                    ? <strong className="isOutOfCity">{gettext('OUT-OF-CITY') + '!'}</strong> : ''
                }
              </h3>
            </div>
          </Col>
          <Col sm={6}>
            <Row>
              <div className="time_select">
                <ControlLabel>{gettext('PICKUP-TIME-ORDER-CREATION')}</ControlLabel>
                <FormControl componentClass="select" className="select_box" placeholder="select"
                  disabled={this.state.order.express}
                  onChange={(e) => this.setStartPickUpTimePickerVal(e)}
                  defaultValue={moment(this.state.order.expectedPickUpTime.startTime).format('HH:00')}>
                  {this.renderPickUpTimes()}
                </FormControl>
                -
                <FormControl componentClass="select" placeholder="select"
                  disabled={this.state.order.express}
                  onChange={(e) => this.setEndPickUpTimePickerVal(e)}
                  defaultValue={moment(this.state.order.expectedPickUpTime.endTime).format('HH:00')}>
                  {this.renderPickUpTimes()}
                </FormControl>
              </div>
            </Row>
            <Row>
              <div className="time_select">
                <ControlLabel>{gettext('DELIVERY-TIME')}</ControlLabel>
                {/*}<FormControl componentClass="select" placeholder="select"
                    disabled={this.state.order.express}
                    onChange={(e) => this.setState({startDeliveryTimePickerVal: e.target.value})}>
                      <option disabled value="select">{gettext('START')}</option>
                      {this.renderDeliveryTimes()}
                  </FormControl>*/}
                <FormControl className="delivery_time_dropdown" componentClass="select" placeholder="select"
                  className='delivery_time_select'
                  disabled={this.state.order.express}
                  onChange={(e) => {
                    let order = this.state.order;
                    order.deliveryTime = Date.parse(`${moment(this.state.order.expectedPickUpTime.startTime).format('MM/DD/YY')} ${e.target.value}:00`);

                    this.setState({ order: order });
                  }}
                  defaultValue={moment(this.state.order.deliveryTime).format('HH:00')}>
                  {!this.state.order.deliveryTime ?
                    <option
                      selected={!this.state.order.deliveryTime}
                      value={undefined}>
                      {gettext('SELECT-DELIVERY-TIME')}
                    </option> : ''
                  }
                  {this.renderDeliveryTimes()}
                </FormControl>
              </div>
            </Row>
            {this.state.isSelectVehicle ? this.renderVehicles() : ''}
            {this.state.order.cashOnDelivery ?
              <Row>
                <div className="cash_on_delivery">
                  <ControlLabel>{gettext('CASH-ON-DELIVERY')}</ControlLabel>
                  <FormControl
                    type="number"
                    required={true}
                    value={this.state.order.cashOnDeliveryAmount}
                    className='delivery_time_select'
                    onChange={(e) => {
                      let order = this.state.order;
                      order.cashOnDeliveryAmount = e.target.value;
                      this.setState({ order: order });
                    }}
                    placeholder={gettext('CASH-ON-DELIVERY')} />
                </div>
              </Row> : ''
            }
          </Col>
        </Row>
        {this.renderItems()}
        <Button bsStyle="success"
          disabled={this.state.order.express}
          className="add_point_btn"
          onClick={this.addNewItem}>
          {gettext('ADD-ITEM')}
        </Button>
        <div className="underline" />
        {this.renderRecipientDetails()}


        <div className="add_point_btn">
          <div className="btn-container">

            <Button bsStyle="success"
              onClick={() => this.prepareOrderToUpdate()}>
              {gettext('SUBMIT')}
            </Button>

            <Button bsStyle="success" style={{ background: '#d9534f' }}
              onClick={() => this.props.router.goBack()}>
              {gettext('CANCEL')}
            </Button>

          </div>
        </div>

        {map}
        {floatingMap}
      </Jumbotron >
    );
  }
}




OrderUpdatingComponent.propTypes = {

};
