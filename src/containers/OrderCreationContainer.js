import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/createOrderActions';
import * as appActions from '../actions/appActions';
//import OrderCreationForm from '../components/orderCreation/OrderActionComponent';
import OrderCreationForm from '../components/OrderCreationForm';
import MapModalComponent from '../components/MapModalComponent';
import objectAssign from 'object-assign';
import _ from 'lodash';
import moment from 'moment';
import { gettext } from '../i18n/service';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';
import isEmpty from '../businessLogic/isObjectEmpty.js';


const extractInputValues = (elems) => elems.reduce((prev, curr) => {
  if (!curr.name) {
    return prev;
  }
  if (curr.name === 'expectedPickUpTime') {
    prev[curr.name] = curr.value.split('-');
    return prev;
  }
  if (curr.type === 'radio' && curr.checked === false) {
    return prev;
  }
  prev[curr.name] = curr.type === 'checkbox' ? curr.checked : curr.value;
  return prev;
}, {});

const extractExpectedPickUpTime = (fields, props) => {
  const expectedPickUpTime = {
    startTime: Date.parse(`${fields.expectedPickUpDate} ${fields.expectedPickUpTimeWindow.split('-')[0]}`),
    endTime: Date.parse(`${fields.expectedPickUpDate} ${fields.expectedPickUpTimeWindow.split('-')[1]}`)
  };

  let newFields = objectAssign({}, fields, { expectedPickUpTime });
  delete newFields.expectedPickUpDate;
  delete newFields.expectedPickUpTimeWindow;
  if (isNaN(newFields.expectedPickUpTime.startTime) || isNaN(newFields.expectedPickUpTime.endTime)) {
    return props.showMessage({
      message: gettext('SELECT-DELIVERY-TIME'),
      level: 'error'
    });
  }
  return newFields;
};


export class OrderCreationContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.orderCreated = props.orderCreated;

    this.recipientGpsLocation = {};
    this.selectedDeliveryTime = null;
    this.isShowingMap = false;
    this.isShowingFloatingMap = false;
    this.geocoder = new window.google.maps.Geocoder();
    this.setOfSelectedPickUpPoints = new Set();
    this.formattedDeliveryPointAddress = '';
    this.items = [{ isFloating: false, pickupPointId: props.pickUpPoints[Object.keys(props.pickUpPoints)[0]], isComment: false }];
    this.focusedItem = 0;

    this.orderForReturn = props.orderForReturn;
    this.props.appActions.removeOrderForReturn();
    this.state = {
      isOutOfCityDelivery: false,
      defaultZoom: 0,
      outOfCityForm: {
        present: false,
        country: '',
        city: '',
        addressFirst: '',
        addressSecond: '',
        zipCode: ''
      }

    }

    this.onPickUpPointSelected(null, Object.keys(this.props.pickUpPoints)[0]);

    const forBind = ['submit', 'changeItemFocus', 'itemsFloatingPointsValidation', 'setPickUpPointPhone', 'onFloatingPickUpPointSelected', 'changeItemsPacklist', 'changeItemsComment', 'changePickupPointType', 'setFloatingPointContactName', 'addNewItem', 'removeItem', 'deliveryTimeValidator', 'onDeliveryPointSelect', 'onDeliveryTimeSelect', 'showMap', 'hideMap', 'onMapClick', 'getDispatcher', 'getRecipient',
      'setFloatingPickUpPoint', 'onPickUpPointSelected', 'needComment', 'recipientFieldsValidation', 'showFloatingMap', 'showFloatingMap', 'onFloatingMapClick', 'hideFloatingMap'];

    _.bindAll(this, forBind);

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.orderCreated && nextProps.orderCreated !== this.orderCreated) {
      this.orderCreated = nextProps.orderCreated;
      this.props.appActions.addNewRecipientToStore(nextProps.createdStuff.result.recipient);
      this.props.appActions.addNewOrderToStore(objectAssign({}, nextProps.createdStuff.result.order, { items: nextProps.createdStuff.result.items }));
      this.props.appActions.endSpinner();

      return this.props.router.push('/dispatcherDashboard');
    }
  }

  showMap() {
    this.isShowingMap = true;
    this.forceUpdate();
  }

  changeItemFocus(i) {
    this.focusedItem = i;
    this.forceUpdate();
  }

  showFloatingMap() {
    this.isShowingFloatingMap = true;
    this.forceUpdate();
  }

  hideMap() {
    this.isShowingMap = false;
    this.forceUpdate();
  }

  onMapClick({ latLng }) {
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng()
    };
    this.onDeliveryPointSelect({ location: location });
    this.geocoder.geocode({ location: location }, (results) => {

      this.formattedDeliveryPointAddress = results[0].formatted_address;
      this.recipientGpsLocation = {
        "address": this.formattedDeliveryPointAddress,
        "gpsLocation": location
      };
      this.hideMap();
    });

    this.forceUpdate();

  }

  onFloatingMapClick({ latLng }) {
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng()
    };

    this.geocoder.geocode({ location: location }, (results) => {
      this.items[this.focusedItem].pickupPointId.address = results[0].formatted_address;
      this.items[this.focusedItem].pickupPointId.gpsLocation = location;

      this.hideFloatingMap();
    });

    this.forceUpdate();
  }

  hideFloatingMap() {
    this.isShowingFloatingMap = false;
    this.forceUpdate();
  }

  changeItemsPacklist(e, i) {
    this.items[i].packingList = e.target.value;
    this.forceUpdate();
  }

  changeItemsComment(e, i) {
    this.items[i].comment = e.target.value;
    this.forceUpdate();
  }

  setFloatingPickUpPoint(e, i) {
    this.items[i].pickupPointId.gpsLocation = e.location;
    this.items[i].pickupPointId.address = e.label;

    this.forceUpdate();
  }

  setPickUpPointPhone(e, i) {
    this.items[i].pickupPointId.phone = e.target.value;
    this.forceUpdate();
  }

  setFloatingPointContactName(e, i) {
    this.items[i].pickupPointId.contactName = e.target.value;
    this.forceUpdate();
  }

  addNewItem() {
    this.items.push(
      {
        isFloating: false,
        pickupPointId: this.props.pickUpPoints[Object.keys(this.props.pickUpPoints)[0]],
        isComment: false
      });
    this.forceUpdate();
  }

  changePickupPointType(i) {
    this.items[i].isFloating = !this.items[i].isFloating;
    if (this.items[i].isFloating)
      this.items[i].pickupPointId = {};
    this.forceUpdate();
  }

  needComment(i) {
    this.items[i].isComment = !this.items[i].isComment;
    this.forceUpdate();
  }

  removeItem() {
    if (this.items.length === 1) {
      return this.props.showMessage({
        message: gettext('ORDER-MUST-HAVE-AT-LEAST-ONE-ITEM'),
        level: 'error'
      });
    }
    this.items.pop();
    this.forceUpdate();
  }
  deliveryTimeValidator(e, val) {
    e.target.value = val;
    this.props.showMessage({
      message: gettext('DELIVERY-TIME-LESS-THEN-PICKUPTIME'),
      level: 'error'
    });
    return val;
  }

  onDeliveryPointSelect({ label, location }) {
    this.recipientGpsLocation.address = label;
    this.recipientGpsLocation.gpsLocation = location;
  }

  onDeliveryTimeSelect(time) {
    this.selectedDeliveryTime = time;
  }

  onPickUpPointSelected(e, i) {
    if (e) {
      this.items[i].pickupPointId = e.target.value;
      this.forceUpdate();
    }
  }

  onFloatingPickUpPointSelected(e, i) {
    if (e) {
      this.items[i].pickupPointId = {};
      this.forceUpdate();
    }
  }

  itemsFloatingPointsValidation(items) {
    let error = true;
    _.map(items, (item) => {
      if (item.isFloating) {
        if (item.pickupPointId && !/^[0-9]{7,20}$/.test(item.pickupPointId.phone)) {
          this.props.showMessage({
            message: gettext('INSERT-CORRECT-PHONE'),
            level: 'error'
          });
          error = false;
        }
        if (item.pickupPointId && !/^([^0-9]{3,30})$/.test(item.pickupPointId.contactName)) {
          this.props.showMessage({
            message: gettext('INSERT-CORRECT-NAME'),
            level: 'error'
          });
          error = false;
        }
      }
      if (item.pickupPointId && /^\s+$/.test(item.pickupPointId.contactName)) {
        this.props.showMessage({
          message: gettext('INSERT-CORRECT-NAME'),
          level: 'error'
        });
        error = false;
      }
    });
    return error;
  }

  recipientFieldsValidation(recipient) {
    let error = true;
    if (!/^[0-9]{7,20}$/.test(recipient.mobile)) {
      this.props.showMessage({
        message: gettext('INSERT-CORRECT-RECIPIENT-PHONE'),
        level: 'error'
      });
      error = false;
    }
    if (!/^([^0-9]{3,30})$/.test(recipient.firstName)) {
      this.props.showMessage({
        message: gettext('INSERT-CORRECT-RECIPIENT-NAME'),
        level: 'error'
      });
      error = false;
    }

    if (/^\s+$/.test(recipient.firstName)) {
      this.props.showMessage({
        message: gettext('INSERT-CORRECT-RECIPIENT-NAME'),
        level: 'error'
      });
      error = false;
    }

    return error;
  }



  submit(e) {

    e.preventDefault();

    let recipientFields = [];
    let orderFields = [];

    _(e.target.elements).toArray().forEach((elem) => {
      if (elem.classList.contains('_order_')) {
        orderFields.push(elem);
      } if (elem.classList.contains('_recipient_')) {
        recipientFields.push(elem);
      }
    });
    //return
    const extractedOrderFields = extractInputValues(orderFields);
    if (extractedOrderFields.express) {
      var curStartHours = new Date().getHours();
      extractedOrderFields.expectedPickUpTimeWindow = curStartHours + ':00-' + (curStartHours + 1) + ':00';
      this.selectedDeliveryTime = (curStartHours + 1).toString() + ':00';
    }

    this.orderFields = extractExpectedPickUpTime(extractedOrderFields, this.props);

    this.orderFields.orderStatus = 'new';
    this.orderFields.orderCreatedTime = +moment().zone('+0300').format('x');
    this.orderFields.cashOnDeliveryAmount = this.orderFields.cashOnDeliveryAmount ? +this.orderFields.cashOnDeliveryAmount : 0;
    this.orderFields.deliveryTime = Date.parse(`${extractedOrderFields.expectedPickUpDate} ${this.selectedDeliveryTime}`);
    this.orderFields.vehicleType = +this.orderFields.vehicleType;
    if (!this.orderFields.vehicleType || !this.orderFields.venicle) {
      this.orderFields.vehicleType = +2;
    }

    if (!this.selectedDeliveryTime && !this.orderFields.express && !this.state.outOfCityForm.present) {
      return this.props.showMessage({
        message: gettext('SELECT-DELIVERY-TIME'),
        level: 'error'
      });
    }

    this.recipientFields = extractInputValues(recipientFields);


    if (this.state.outOfCityForm.present) {
      const idx = _.findIndex(this.props.companies, company => company.default);
      this.recipientFields.country = this.state.outOfCityForm.country;
      this.recipientFields.city = this.state.outOfCityForm.city;
      this.recipientFields.addressFirst = this.state.outOfCityForm.addressFirst;
      this.recipientFields.addressSecond = this.state.outOfCityForm.addressSecond;
      this.recipientFields.zipCode = this.state.outOfCityForm.zipCode;

      this.recipientFields.outOfCityAddress = {
        gpsLocation: this.props.companies[idx].gpsLocation,
        address: this.props.companies[idx].address
      };

      this.orderFields.isOutOfCity = true;

      this.recipientFields = this.removeUnusefulFields(this.recipientFields)

    } else {
      this.recipientFields.deliveryPoint = this.recipientGpsLocation.address;
      this.recipientFields.gpsLocation = this.recipientGpsLocation.gpsLocation;
    }

    if (!this.itemsFloatingPointsValidation(this.items)) {
      return '';
    }
    if (!this.recipientFieldsValidation(this.recipientFields)) {
      return '';
    }

    if (!this.recipientFields.gpsLocation && !this.recipientFields.outOfCityAddress.gpsLocation) {
      return this.props.showMessage({
        message: gettext('SELECT-DELIVERY-POINT'),
        level: 'error'
      });
    }

    if (_.uniqBy(this.items, 'pickupPointId').length !== this.items.length) {
      return this.props.showMessage({
        message: gettext('ITEM-MUST-HAVE-UNIQUE-PICKUP-POINT'),
        level: 'error'
      });
    }
    const payload = {
      recipient: this.recipientFields,
      order: this.orderFields,
      items: this.items
    };

    if (payload.order.cashOnDelivery && !payload.order.cashOnDeliveryAmount) {

      return this.props.showMessage({
        message: gettext('ENTER-ORDER-COST'),
        level: 'error'
      });
    }
    if (payload.order.cashOnDeliveryAmount < 0) {
      return this.props.showMessage({
        message: gettext('NEGATIVE-COD'),
        level: 'error'
      });
    }

    this.props.appActions.startSpinner();
    this.props.actions.createOrder(payload);
  }

  getDispatcher(id) {
    return _.find(this.props.users, { 'id': id, 'role': 'dispatcher' });
  }

  getRecipient(id) {
    return _.find(this.props.recipients, { 'id': id });
  }

  render() {

    const map = this.isShowingMap ?
      (
        <MapModalComponent
          onMapClick={this.onMapClick}
          onClickOutsideOfMap={this.hideMap}
          onCancel={this.hideMap}
          defaultZoom={this.state.defaultZoom}
        />
      )
      : '';

    const floatingMap = this.isShowingFloatingMap ?
      (
        <MapModalComponent
          onMapClick={this.onFloatingMapClick}
          onClickOutsideOfMap={this.hideFloatingMap}
          onCancel={this.hideFloatingMap}
        />
      )
      : '';
    return (
      <OrderCreationForm
        fields={this.props.account}
        submit={this.submit}
        returnOrder={this.returnOrder}
        pickUpPoints={this.props.pickUpPoints}
        items={this.items}
        removeItem={this.removeItem}
        removeItemFromReturn={this.removeItemFromReturn}
        deliveryTimeValidator={this.deliveryTimeValidator}
        addNewItem={this.addNewItem}
        onDeliveryPointSelect={this.onDeliveryPointSelect}
        onDeliveryTimeSelect={this.onDeliveryTimeSelect}
        showMap={this.showMap}
        changePickupPointType={this.changePickupPointType}
        showFloatingMap={this.showFloatingMap}
        formattedDeliveryPointAddress={this.formattedDeliveryPointAddress}
        vehicles={this.props.vehicles}
        setOfSelectedPickUpPoints={this.setOfSelectedPickUpPoints}
        orderForReturn={this.orderForReturn}
        getDispatcher={this.getDispatcher}
        getRecipient={this.getRecipient}
        floatingPickUpPoint={this.floatingPickUpPoint}
        setFloatingPickUpPoint={this.setFloatingPickUpPoint}
        account={this.props.account}
        isOutOfCityDelivery={this.state.isOutOfCityDelivery}
        onPickUpPointSelected={this.onPickUpPointSelected}
        outOfCityForm={this.state.outOfCityForm}
        companies={this.props.companies}
        setPickUpPointPhone={this.setPickUpPointPhone}
        setFloatingPointContactName={this.setFloatingPointContactName}

        changeItemsPacklist={this.changeItemsPacklist}
        changeItemsComment={this.changeItemsComment}
        onFloatingPickUpPointSelected={this.onFloatingPickUpPointSelected}
        changeItemFocus={this.changeItemFocus}
        needComment={this.needComment}

      >
        {map}
        {floatingMap}
      </OrderCreationForm>
    );
  }

  removeUnusefulFields(recipient) {
    delete recipient['out-country'];
    delete recipient['out-city'];
    delete recipient['out-adress-line-1'];
    delete recipient['out-adress-line-2'];
    delete recipient['out-zip-code'];
    delete recipient['outOfCityCheck'];
    delete recipient['deliveryPoint'];
    return recipient;
  }

}



OrderCreationContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  account: PropTypes.object,
  appActions: PropTypes.object,
  history: PropTypes.object,
  params: PropTypes.object,
  pickUpPoints: PropTypes.object,
  recipientCreated: PropTypes.number,
  itemCreated: PropTypes.number,
  orderCreated: PropTypes.number,
  recipient: PropTypes.object,
  recipients: PropTypes.array,
  order: PropTypes.object,
  showMessage: PropTypes.func.isRequired,
  vehicles: PropTypes.array.isRequired,
  orderForReturn: PropTypes.object,
  users: PropTypes.array,
  companies: PropTypes.array
};

function mapStateToProps(state) {
  return {
    pickUpPoints: _.pickBy(state.appReducer.pickUpPoints, (pickUpPoint) => pickUpPoint.valid !== false),
    orderCreated: state.orderCreationReducer.orderCreated,
    recipient: state.orderCreationReducer.recipient,
    recipients: state.appReducer.recipients,
    order: state.orderCreationReducer.order,
    item: state.orderCreationReducer.item,
    vehicles: state.appReducer.vehicles,
    createdStuff: state.orderCreationReducer.createdStuff,
    account: state.appReducer.account,
    orderForReturn: state.appReducer.orderForReturn,
    users: state.appReducer.users,
    companies: state.appReducer.companies
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    appActions: bindActionCreators(appActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderCreationContainer);
