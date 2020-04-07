import React, {PropTypes} from 'react';
import { Row, Col, Jumbotron, ControlLabel, Checkbox, FormControl, Button, Glyphicon, InputGroup } from 'react-bootstrap';
import Geosuggest from 'react-geosuggest';
import DateTimeField from 'react-bootstrap-datetimepicker';
import { gettext } from '../../../i18n/service.js';
import {connect} from 'react-redux';
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

export default class OrderReturningComponent extends React.Component {
  constructor(props, context) {
    super(props, context);


    this.geocoder = new window.google.maps.Geocoder();
    this.state = props.orderForReturn;

    _.bindAll(this, ['renderItems', 'renderRecipientDetails', 'renderPickUpTimes', 'renderFloatingPoint', 'renderVehicles',
      'setStartPickUpTimePickerVal', 'setEndPickUpTimePickerVal', 'needComment', 'showMap', 'hideMap', 'onMapClick',
      'renderDeliveryTimes', 'toggleExpressDelivery', 'toggleUsersDeliveryTime', 'deleteItem',
      'onFloatingMapClick', 'showFloatingMap', 'hideFloatingMap', 'toggleOutOfCity']);

  }

  componentWillUnmount() {
    this.props.removeOrderForReturn();
  }

  needComment(i) {
    let items = this.state.items;
    items[i].isComment = !items[i].isComment;
    if(!items[i].isCommen)
      delete items[i].comment;
    this.setState({items: items});
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
    this.setState({items: items});
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
            onChange={(e) => this.setState({vehicleType: e.target.value})}>
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

          style= {
            !(parseInt(parseInt(time)) > new Date(this.state.orderDate).getHours())
              && this.state.orderDate <= this.state.today ? {display: 'none'} : {}
          }

          disabled = {
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
      if(i!==0)
      return (
        <option
          className={
            !(parseInt(time) > this.state.startPickUpTimePickerVal && parseInt(time) > this.state.endPickUpTimePickerVal)
              && !this.state.isExpressDelivery ? 'display_none' : ''
          }
          value={time}>
          {deliveryTimes[i-1]+' : '+time}
        </option>
      );
    });
    return correctDeliveryTimeOptions;
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
                 this.setState({recipientDetails: recipientDetails});
               }}
               placeholder={gettext('MOBILE')}/>
          </Col>
          <Col sm={6}>
            <FormControl
               type="text"
               required={true}
               defaultValue={this.state.recipientDetails.firstName}
               onChange={(e) => {
                 let recipientDetails = this.state.recipientDetails;
                 recipientDetails.firstName = e.target.value;
                 this.setState({recipientDetails: recipientDetails});
               }}
               placeholder={gettext('NAME')}/>
          </Col>

            <Col sm={!this.state.isOutOfCity?3:12}>
              <div className="delivery_controll">
                <ControlLabel>
                  {gettext('WHERE-TO-DELIVER')}
                </ControlLabel>
              </div>
            </Col>
            <Col sm={9}>
              <div className="delivery_controll">
                <InputGroup style={getCurLang() === 'ar' ? rowReverseAR : {}}>
                  <Geosuggest
                    style={{
                      display: 'block',
                      width: '100%'
                    }}
                    disabled
                    inputClassName="form-control floatingPickUpPoint"
                    placeholder={gettext('DELIVERY-POINT')}
                    initialValue={this.state.recipientDetails.deliveryPoint}
                  />
                  <InputGroup.Addon onClick={() => this.showMap()}>
                    {gettext('SELECT-ON-MAP')}
                  </InputGroup.Addon>
                </InputGroup>
              </div>
            </Col>
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
          defaultValue={this.state.items[i].pickupPointId.contactName}
          onChange={(e) => {
            let items = this.state.items;
            this.state.items[i].pickupPointId.contactName = e.target.value;
            this.setState({items: items});
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
          defaultValue={this.state.items[i].pickupPointId.phone}
          onChange={(e) => {
            let items = this.state.items;
            this.state.items[i].pickupPointId.phone = e.target.value;
            this.setState({items: items});
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
            disabled={true}
            name="floatingPickUpPoint"
            placeholder={gettext('PICKUP-POINT')}
            initialValue={this.state.items[i].pickupPointId.address}
            inputClassName="form-control floatingPickUpPoint"
          />

          <InputGroup.Addon onClick={() => {this.showFloatingMap(); this.setState({selectedItemId: i});}}>
            {gettext('SELECT-ON-MAP')}
          </InputGroup.Addon>
        </InputGroup>
      </div>
    );
  }

  renderItems() {
    const items = _.map(this.state.items, (item, i) => {
      item.isFloating = true;
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
                    this.setState({items: items})
                  }}
                  className="floating_checkbox hidden">{gettext('USE-FLOATING-POINT')}
                </Checkbox>
                {
                  !item.isFloating
                    ?''
                    : this.renderFloatingPoint(i)
                }
                <br /><br />
                <ControlLabel>
                  {gettext('PACKING-LIST')}
                </ControlLabel>
                <Checkbox
                  className="floating_checkbox"
                  checked={item.isComment || item.comment}
                  onChange={() => this.needComment(i)}>
                    {gettext('ADD-COMMENT')}
                </Checkbox>
                <FormControl type="textarea" style={{ resize: "vertical" }}
                  placeholder={gettext('PACKING-LIST')}
                  componentClass="textarea"
                  defaultValue={item.packingList}
                  onChange={(e) => {
                    let items = this.state.items;
                    items[i].packingList = e.target.value;
                    this.setState({items: items});
                  }}/>
                <div className={item.isComment?'marginmargin_top_em':'display_none'}>
                  <ControlLabel>
                    {gettext('COMMENT')}
                  </ControlLabel>
                  <FormControl type="textarea" style={{ resize: "vertical" }}
                    placeholder={gettext('COMMENT')}
                    componentClass="textarea"
                    defaultValue={item.comment}
                    onChange={(e) => {
                      let items = this.state.items;
                      items[i].comment = e.target.value;
                      this.setState({items: items});
                    }}/>
                </div>
                <Col sm={6}>
                  <Checkbox
                    checked={item.needHotFoodContainer}
                    onChange={() => {
                      let items = this.state.items;
                      items[i].needHotFoodContainer = !item.needHotFoodContainer;
                      this.setState({items: items});
                    }}>
                    {gettext('NEED-HOT-FOOD-CONTAINER')}
                  </Checkbox>
                </Col>
                <Col sm={6}>
                  <Checkbox checked={item.needFridge}
                    onChange={() => {
                      let items = this.state.items;
                      items[i].needFridge = !item.needFridge;
                      this.setState({items: items});
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
    this.setState({startPickUpTimePickerVal: parseInt(e.target.value)})
  }

  setEndPickUpTimePickerVal(e) {
    this.setState({endPickUpTimePickerVal: parseInt(e.target.value)})
  }

  toggleExpressDelivery() {
    this.setState({isExpressDelivery: !this.state.isExpressDelivery});
  }

  toggleUsersDeliveryTime() {
    this.setState({usersDeliveryTime: !this.state.usersDeliveryTime});
  }

  toggleOutOfCity() {
    let recipientDetails = this.state.recipientDetails
    if(recipientDetails.outOfCityAddress)
      delete recipientDetails.outOfCityAddress;
    if(recipientDetails.gpsLocation)
      delete recipientDetails.gpsLocation;
    if(recipientDetails.deliveryPoint)
      delete recipientDetails.deliveryPoint;
    this.setState({isOutOfCity: !this.state.isOutOfCity, recipientDetails: recipientDetails})
  }

  showMap() {
    this.setState({isShowingMap: true});
  }

  hideMap() {
    this.setState({isShowingMap: false});
  }

  onMapClick({ latLng }) {
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng()
    };
    this.geocoder.geocode({ location: location }, (results) => {
      let recipientDetails = this.state.recipientDetails;
      recipientDetails.deliveryPoint = results[0].formatted_address;
      recipientDetails.gpsLocation = location;
      this.setState({recipientDetails: recipientDetails, isShowingMap: false});
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
      items[this.state.selectedItemId].pickupPointId.gpsLocation = location;
      items[this.state.selectedItemId].pickupPointId.address = results[0].formatted_address;
      this.setState({items: items, isShowingFloatingMap: false});
    });

    this.forceUpdate();
  }

  showFloatingMap() {
    this.setState({ isShowingFloatingMap: true});
  }

  hideFloatingMap() {
    this.setState({ isShowingFloatingMap: false});
  }

  render() {
    const map = this.state.isShowingMap ?
      (
        <MapModalComponent
          onMapClick={this.onMapClick}
          onClickOutsideOfMap={this.hideMap}
          onCancel={this.hideMap}
          defaultZoom={this.state.defaultZoom}/>
      )
      : '';

    const floatingMap = this.state.isShowingFloatingMap ?
      (
        <MapModalComponent
          onMapClick={this.onFloatingMapClick}
          onClickOutsideOfMap={this.hideFloatingMap}
          onCancel={this.hideFloatingMap}
          defaultZoom={this.state.defaultZoom}/>
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
                }/>
            </div>
            <div className="check_list">
              <Checkbox
                disabled={this.state.usersDeliveryTime || this.state.isOutOfCity}
                checked={this.state.isExpressDelivery}
                onChange={this.toggleExpressDelivery}>
                {gettext('DELIVER-NOW')}
              </Checkbox>

              <Checkbox
                disabled={this.state.isExpressDelivery}
                checked={this.state.isOutOfCity}
                onChange={() => this.toggleOutOfCity()}>
                {gettext('SELECT-OUT-OF-CITY')}
              </Checkbox>

              <Checkbox checked={this.state.isSelectVehicle}
                onChange={() => this.setState({isSelectVehicle: !this.state.isSelectVehicle})}>
                  {gettext('SELECTBOX-VEHICLE-TYPE')}
              </Checkbox>

              <Checkbox
                disabled={this.state.isExpressDelivery}
                checked={this.state.usersDeliveryTime}
                onChange={this.toggleUsersDeliveryTime}>
                {gettext('WANT-SPECIFY-DELIVERY-TIME')}
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
                    <option disabled selected value="select">{gettext('START')}</option>
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
            { this.state.usersDeliveryTime?
              <Row>
                <div className="time_select">
                  <ControlLabel>{gettext('DELIVERY-TIME')}</ControlLabel>
                  {/*}<FormControl componentClass="select" placeholder="select"
                    disabled={this.state.isExpressDelivery || !this.state.usersDeliveryTime}
                    onChange={(e) => this.setState({startDeliveryTimePickerVal: e.target.value})}>
                      <option disabled value="select">{gettext('START')}</option>
                      {this.renderDeliveryTimes()}
                  </FormControl>*/}
                  <FormControl className="delivery_time_dropdown" componentClass="select" placeholder="select"
                    disabled={this.state.isExpressDelivery || !this.state.usersDeliveryTime}
                    onChange={(e) => this.setState({endDeliveryTimePickerVal: e.target.value})}>
                    <option disabled value="select">-</option>
                    {this.renderDeliveryTimes()}
                  </FormControl>
                </div>
              </Row> : ''
            }
            {this.state.isSelectVehicle ? this.renderVehicles() : ''}
          </Col>
        </Row>
        {this.renderItems()}
        <div className="underline"/>
        {this.renderRecipientDetails()}
        <Button bsStyle="success"
          className="add_point_btn"
          onClick={() => this.props.createOrder(this.state)}>
            {gettext('SUBMIT')}
        </Button>

        {map}
        {floatingMap}
      </Jumbotron>
    );
  }
}




OrderReturningComponent.propTypes = {

};
