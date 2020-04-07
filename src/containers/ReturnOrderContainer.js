import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/createOrderActions';
import * as appActions from '../actions/appActions';
import ReturnOrderComponent from '../components/ReturnOrderComponent';
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
    this.itemCount = 1;
    this.floatingPickUpPoint = {};
    this.floatingPointPhone = undefined;
    this.floatingPointContactName = undefined;
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

    const forBind = ['returnOrder', 'floatingPointValidation', 'recipientFieldsValidation', 'setPickUpPointPhone', 'setFloatingPointContactName', 'addNewItem', 'removeItem', 'deliveryTimeValidator', 'onDeliveryPointSelect', 'onDeliveryTimeSelect', 'showMap', 'hideMap', 'onMapClick', 'getDispatcher', 'getRecipient', 'setFloatingPickUpPoint', 'onPickUpPointSelected','showFloatingMap','showFloatingMap','removeItemFromReturn','onFloatingMapClick','hideFloatingMap'];

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

  onFloatingMapClick({latLng}) {
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng()
    };

    this.geocoder.geocode({location: location}, (results) => {
        this.floatingPickUpPoint.address = results[0].formatted_address
        this.floatingPickUpPoint.gpsLocation = location;
      this.hideFloatingMap();
    });

    this.forceUpdate();
  }

  hideFloatingMap() {
    this.isShowingFloatingMap = false;
    this.forceUpdate();
  }

  setFloatingPickUpPoint({label, location}) {
    this.floatingPickUpPoint.address = label;
    this.floatingPickUpPoint.gpsLocation = location;
  }

  setPickUpPointPhone(phone) {
    this.floatingPickUpPoint.phone = phone;
  }

  setFloatingPointContactName(name) {
    this.floatingPickUpPoint.contactName = name;
  }

  addNewItem() {
    if (this.itemCount + 1 > Object.keys(this.props.pickUpPoints).length) {
      return this.props.showMessage({
        message: gettext('AMOUNT-OF-ITEMS-CANNOT-EXCEED-AMOUNT-OF-PICKUP-POINTS'),
        level: 'error'
      });
    }
    this.itemCount++;
    this.forceUpdate();
  }

  removeItemFromReturn(itemForDelete) {

    if (this.orderForReturn.items.length === 1) {
      return this.props.showMessage({
        message: gettext('ORDER-MUST-HAVE-AT-LEAST-ONE-ITEM'),
        level: 'error'
      });
    }

    let itemToDelete = undefined;
    _.map(this.orderForReturn.items, (item) => {

      if (item.id === itemForDelete.id)
        itemToDelete = item;

    });

    if(itemForDelete)
      _.pull(this.orderForReturn.items, itemToDelete);

    this.forceUpdate();
  }

  removeItem() {
    if (this.itemCount === 1) {
      return this.props.showMessage({
        message: gettext('ORDER-MUST-HAVE-AT-LEAST-ONE-ITEM'),
        level: 'error'
      });
    }
    this.itemCount--;
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
    this.recipientGpsLocation.lat = location.lat;
    this.recipientGpsLocation.lng = location.lng;
  }

  onDeliveryTimeSelect(time) {
    this.selectedDeliveryTime = time;
  }

  onPickUpPointSelected(e, id) {
    let selectedPickUpPoint = id ? this.props.pickUpPoints[id] : this.props.pickUpPoints[e.target.value];
    this.geocoder.geocode({ location: selectedPickUpPoint.gpsLocation }, (results) => {
      // this.selectedPickUpPointCity = this.getCityName(results[0]);
      // let isOutOfCityDelivery = this.isOutofCity(this.selectedCity, this.selectedPickUpPointCity);
      // this.setState({ isOutOfCityDelivery });
    })

  }

  recipientFieldsValidation(recipient) {
    let error = true;
    if(!/^[0-9]{7,20}$/.test(recipient.mobile)) {
      this.props.showMessage({
        message: gettext('INSERT-CORRECT-RECIPIENT-PHONE'),
        level: 'error'
      });
      error = false;
    }
    if(!/^([^0-9]{3,30})$/.test(recipient.firstName)) {
      this.props.showMessage({
        message: gettext('INSERT-CORRECT-RECIPIENT-NAME'),
        level: 'error'
      });
      error = false;
    }

    if(/^\s+$/.test(recipient.firstName)) {
      this.props.showMessage({
        message: gettext('INSERT-CORRECT-RECIPIENT-NAME'),
        level: 'error'
      });
      error = false;
    }

    return error;
  }

  floatingPointValidation(point) {
    let error = true;
    if(!/^[0-9]{7,30}$/.test(point.phone)) {
      this.props.showMessage({
        message: gettext('INSERT-CORRECT-PHONE'),
        level: 'error'
      });
      error = false;
    }
    if(!/^([^0-9]{3,30})$/.test(point.contactName)) {
      this.props.showMessage({
        message: gettext('INSERT-CORRECT-NAME'),
        level: 'error'
      });
      error = false;
    }

    if(/^\s+$/.test(point.contactName)) {
      this.props.showMessage({
        message: gettext('INSERT-CORRECT-NAME'),
        level: 'error'
      });
      error = false;
    }

    return error;
  }


  returnOrder(e) {
    e.preventDefault();


    let recipientFields = [];
    let orderFields = [];
    let itemFields = [];
    let deliveryPointId = undefined;
    let isUseDispatchersPoints = undefined;

    _(e.target.elements).toArray().forEach((elem) => {
      if (elem.classList.contains('_item_')) {
        itemFields.push(elem);
      } if (elem.classList.contains('_order_')) {
        orderFields.push(elem);
      } if (elem.classList.contains('_recipient_')) {
        recipientFields.push(elem);
      } if (elem.classList.contains('floatingDeliveryPoint')) {
        deliveryPointId = elem.value;
      } if (elem.classList.contains('isUseDispatchersPoints')) {
        isUseDispatchersPoints = elem.checked;
      }
    });

    let deliveryPoint = undefined;
    if(isUseDispatchersPoints)
      deliveryPoint = _.find(this.props.pickUpPoints, { 'id': deliveryPointId });
    else
      deliveryPoint = {
        address: this.formattedDeliveryPointAddress,
        gpsLocation: this.recipientGpsLocation.gpsLocation
      };


    const extractedOrderFields = extractInputValues(orderFields);
    if (extractedOrderFields.express) {
      var curStartHours = new Date().getHours();
      extractedOrderFields.expectedPickUpTimeWindow = curStartHours + ':00-' + (curStartHours + 1) + ':00';
      this.selectedDeliveryTime = (curStartHours + 1).toString() + ':00';
    }

    this.orderFields = extractExpectedPickUpTime(extractedOrderFields, this.props);

    this.orderFields.orderStatus = 'new';
    this.orderFields.orderCreatedTime = +moment().zone('+0300').format('x');
    this.orderFields.deliveryTime = Date.parse(`${extractedOrderFields.expectedPickUpDate} ${this.selectedDeliveryTime}`);
    this.orderFields.deliveryPoint = deliveryPoint.address;
    this.orderFields.dispatcherId = this.orderForReturn.dispatcherId;
    this.orderFields.vehicleType = +this.orderFields.vehicleType;
    if (!this.orderFields.vehicleType || !this.orderFields.venicle) {
      this.orderFields.vehicleType = +2;
    }

    if (!this.selectedDeliveryTime && !this.orderFields.express) {
      return this.props.showMessage({
        message: gettext('SELECT-DELIVERY-TIME'),
        level: 'error'
      });
    }

    this.itemFields = [];

    for (let i = 0, n = this.orderForReturn.items.length; i < n; i++) {
      const singleItemFields = extractInputValues(itemFields.slice(i, i + 1));
      this.itemFields.push(singleItemFields);
    }

    this.recipientFields = extractInputValues(recipientFields);
    this.recipientFields.deliveryPoint = deliveryPoint.address;
    this.recipientFields.gpsLocation = deliveryPoint.gpsLocation;

    if(!this.floatingPointValidation(this.floatingPickUpPoint)) {
      return '';
    }
    if(!this.recipientFieldsValidation(this.recipientFields)) {
      return '';
    }

    const payload = {
      recipient: this.recipientFields,
      order: this.orderFields,
      items: this.itemFields,
      pickUpPoint: this.floatingPickUpPoint,
      dispatcherId: this.orderForReturn.dispatcherId
    };

    this.props.appActions.startSpinner();

    if (!LoopbackHttp.isDispatcher)
      return this.props.actions.createOrderByOperator(payload);
    else {
      return this.props.actions.createOrder(payload);
    }
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
      <ReturnOrderComponent
        fields={this.props.account}
        submit={this.submit}
        returnOrder={this.returnOrder}
        pickUpPoints={this.props.pickUpPoints}
        itemCount={this.itemCount}
        removeItem={this.removeItem}
        removeItemFromReturn={this.removeItemFromReturn}
        deliveryTimeValidator={this.deliveryTimeValidator}
        addNewItem={this.addNewItem}
        onDeliveryPointSelect={this.onDeliveryPointSelect}
        onDeliveryTimeSelect={this.onDeliveryTimeSelect}
        showMap={this.showMap}
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
      >
      {map}
      {floatingMap}
      </ReturnOrderComponent>
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
  itemCount: PropTypes.number,
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
