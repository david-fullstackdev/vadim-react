import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/createOrderActions';
import * as appActions from '../actions/appActions';
import UpdateOrderForm from '../components/UpdateOrderComponent';
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

  // if(curr.attributes.itemid) {
  //   prev.id = curr.attributes.itemid.nodeValue;
  // }
  return prev;
}, {});

const extractExpectedPickUpTime = (fields) => {
  const expectedPickUpTime = {
    startTime: Date.parse(`${fields.expectedPickUpDate} ${fields.expectedPickUpTimeWindow.split('-')[0]}`),
    endTime: Date.parse(`${fields.expectedPickUpDate} ${fields.expectedPickUpTimeWindow.split('-')[1]}`)
  };
  let newFields = objectAssign({}, fields, { expectedPickUpTime });
  delete newFields.expectedPickUpDate;
  delete newFields.expectedPickUpTimeWindow;
  if (isNaN(newFields.expectedPickUpTime.startTime) || isNaN(newFields.expectedPickUpTime.endTime)) {
    // throw new Error(`Can't parse pickUpTime`);
    console.log(`Can't parse pickUpTime`);
  }
  return newFields;
};


export class UpdateOrderContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.recipientGpsLocation = {};
    this.selectedDeliveryTime = null;
    this.isShowingMap = false;
    this.isShowingFloatingMap = false;
    this.geocoder = new window.google.maps.Geocoder();
    this.setOfSelectedPickUpPoints = new Set();
    this.formattedDeliveryPointAddress = '';
    this.itemCount = 1;
    this.floatingPickUpPoint = _.find(this.props.pickUpPoints, { 'title': 'Floating'});
    this.floatingPointPhone = this.floatingPickUpPoint?this.floatingPickUpPoint.phone:undefined;
    this.floatingPointContactName = this.floatingPickUpPoint?this.floatingPickUpPoint.contactName:undefined;

    this.oldOrder = props.orderForUpdate;

    this.orderForUpdate = props.orderForUpdate;
    this.orderForUpdate.items = _.uniqBy(this.orderForUpdate.items, function(item){
        return item.id;
    });
    this.focusedItem = 0;


    this.itemsToDeleteOnUpdate = [];
    this.itemsToUpdate = [];
    this.itemsAddToUpdate = [];


    this.props.appActions.removeOrderForUpdate();


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

    const forBind = ['addNewItemToUpdate', 'changeItemsComment', 'itemsFloatingPointsValidation', 'changeItemsPacklist', 'changeItemFocus', 'createFloatingPropertyInItems', 'changePickupPointType', 'joinItems', 'setPickUpPointPhone', 'setFloatingPointContactName', 'updateOrder', 'removeItemFromUpdate', 'deliveryTimeValidator', 'onDeliveryPointSelect', 'onDeliveryTimeSelect', 'showMap', 'hideMap', 'onMapClick', 'getDispatcher', 'getRecipient', 'setFloatingPickUpPoint', 'onPickUpPointSelected','showFloatingMap','showFloatingMap', 'recipientFieldsValidation', 'onFloatingMapClick','hideFloatingMap'];
    _.bindAll(this, forBind);

    this.createFloatingPropertyInItems();

    if (LoopbackHttp.isOperator || LoopbackHttp.isAdministrator) {
      this.dispatcher = this.getDispatcher(this.orderForUpdate.dispatcherId);
    }

    if (LoopbackHttp.isDispatcher) {
      this.dispatcher = props.account;
    }

    this.pickUpPoints = _.filter(props.pickUpPoints, (point) => {
      return point.dispatcherId === this.dispatcher.id;
    });


  }

  componentWillReceiveProps(nextProps) {
  }

  showMap() {
    this.isShowingMap = true;
    this.forceUpdate();
  }

  showFloatingMap() {
    this.isShowingFloatingMap = true;
    this.forceUpdate();
  }

  changeItemFocus(i) {
    this.focusedItem = i;
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
      this.recipientGpsLocation = location;
      this.hideMap();
    });

    this.forceUpdate();

  }

  onFloatingMapClick({latLng}) {
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng()
    };

    if(typeof this.orderForUpdate.items[this.focusedItem].pickupPointId === 'string') {

    }

    this.geocoder.geocode({location: location}, (results) => {
      this.orderForUpdate.items[this.focusedItem].pickupPointId.address = results[0].formatted_address;
      this.orderForUpdate.items[this.focusedItem].pickupPointId.gpsLocation = location;

      this.hideFloatingMap();
    });

    this.forceUpdate();
  }

  hideFloatingMap() {
    this.isShowingFloatingMap = false;
    this.forceUpdate();
  }

  createFloatingPropertyInItems() {

    let items = [];
    _.map(this.orderForUpdate.items, (item) => {
        let floating = _.find(this.props.pickUpPoints, {id: item.pickupPointId, title: 'Floating'});
        if(floating!==undefined) {
          item.isFloating = true;
          item.pickupPointId = floating;
          items.push(item);
        }
        else {
          item.isFloating = false;
          items.push(item);
        }
    });

    this.orderForUpdate.items = items;

  }

  changePickupPointType(i) {
    this.orderForUpdate.items[i].isFloating = !this.orderForUpdate.items[i].isFloating;
    if(this.orderForUpdate.items[i].isFloating)
      this.orderForUpdate.items[i].pickupPointId = {};
    this.forceUpdate();
  }

  setFloatingPickUpPoint(e, i) {
    if(typeof this.orderForUpdate.items[i].pickupPointId === 'string') {

    }

    this.orderForUpdate.items[i].pickupPointId.gpsLocation = e.location;
    this.orderForUpdate.items[i].pickupPointId.address = e.label;

    this.forceUpdate();
  }

  setPickUpPointPhone(e, i) {
    if(typeof this.orderForUpdate.items[i].pickupPointId === 'string') {

    }
    this.orderForUpdate.items[i].pickupPointId.phone = e.target.value;
    this.forceUpdate();
  }

  setFloatingPointContactName(e, i) {
    if(typeof this.orderForUpdate.items[i].pickupPointId === 'string') {

    }

    this.orderForUpdate.items[i].pickupPointId.contactName = e.target.value;
    this.forceUpdate();
  }

  addNewItemToUpdate() {
    this.orderForUpdate.items.push({isFloating: false});
    this.forceUpdate();
  }

  joinItems(items) {
    let toAdd = [];
    let toUpdate = [];
    let points = [];

    _.map(items, (item) => {
      if(!item.id)
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
      toDelete: this.itemsToDeleteOnUpdate
    };
  }

  removeItemFromUpdate(e, itemForDelete) {
    if (this.orderForUpdate.items.length === 1) {
      return this.props.showMessage({
        message: gettext('ORDER-MUST-HAVE-AT-LEAST-ONE-ITEM'),
        level: 'error'
      });
    }

    let itemToDelete = undefined;
    _.map(this.orderForUpdate.items, (item) => {

      if (item.id === itemForDelete.id)
        itemToDelete = item;

    });

    if(itemForDelete) {
      this.itemsToDeleteOnUpdate.push(itemForDelete.id);
      _.pull(this.orderForUpdate.items, itemToDelete);
    }

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
    if(label)
      this.formattedDeliveryPointAddress = label;

    if(location) {
      this.recipientGpsLocation.lat = location.lat;
      this.recipientGpsLocation.lng = location.lng;
    }
  }


  onDeliveryTimeSelect(time) {
    this.selectedDeliveryTime = time;
  }

  onPickUpPointSelected(e, i) {
    if(e) {
      this.orderForUpdate.items[i].pickupPointId = e.target.value;
      this.forceUpdate();
    }
  }

  changeItemsComment(e, i) {
    this.orderForUpdate.items[i].comment = e.target.value;
    this.forceUpdate();
  }

  changeItemsPacklist(e, i){
    this.orderForUpdate.items[i].packingList = e.target.value;
    this.forceUpdate();
  }

  itemsFloatingPointsValidation(items) {
    let error = true;
    _.map(items, (item) => {
      if(item.isFloating) {
        if(item.pickupPointId.phone&&!/^[0-9]{7,20}$/.test(item.pickupPointId.phone)) {
          this.props.showMessage({
            message: gettext('INSERT-CORRECT-PHONE'),
            level: 'error'
          });
          error = false;
        }
        if(item.pickupPointId.contactName&&!/^([^0-9]{3,30})$/.test(item.pickupPointId.contactName)) {
          this.props.showMessage({
            message: gettext('INSERT-CORRECT-NAME'),
            level: 'error'
          });
          error = false;
        }
        if(item.pickupPointId.contactName&&/^\s+$/.test(item.pickupPointId.contactName)) {
          this.props.showMessage({
            message: gettext('INSERT-CORRECT-NAME'),
            level: 'error'
          });
          error = false;
        }
      }
    });
    return error;
  }

  recipientFieldsValidation(recipient) {
    let error = true;
    if(!/^[0-9]{7,30}$/.test(recipient.mobile)) {
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

  updateOrder(e) {
      e.preventDefault();

      let recipientFields = [];
      let orderFields = [];
      let itemsToUpdate = [];


      _(e.target.elements).toArray().forEach((elem) => {
        if (elem.classList.contains('_order_')) {
          orderFields.push(elem);
        } if (elem.classList.contains('_recipient_')) {
          recipientFields.push(elem);
        }
      });

      const extractedOrderFields = extractInputValues(orderFields);
      if (extractedOrderFields.express) {
        var curStartHours = new Date().getHours();
        extractedOrderFields.expectedPickUpTimeWindow = curStartHours + ':00-' + (curStartHours + 1) + ':00';
        this.selectedDeliveryTime = (curStartHours + 1).toString() + ':00';
      }

      this.orderFields = extractExpectedPickUpTime(extractedOrderFields);
      this.orderFields.orderCreatedTime = +moment().zone('+0300').format('x');
      this.orderFields.cashOnDeliveryAmount = this.orderFields.cashOnDeliveryAmount ? +this.orderFields.cashOnDeliveryAmount : 0;
      this.orderFields.deliveryTime = Date.parse(`${extractedOrderFields.expectedPickUpDate} ${this.selectedDeliveryTime}`);
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

        this.recipientFields.deliveryPoint = this.formattedDeliveryPointAddress;
        this.recipientFields.gpsLocation = this.recipientGpsLocation;
        if (!this.recipientGpsLocation.lat) {
          return this.props.showMessage({
            message: gettext('SELECT-DELIVERY-POINT'),
            level: 'error'
          });
        }
      }

    if(!this.itemsFloatingPointsValidation(this.orderForUpdate.items)) {
      return '';
    }
    if(!this.recipientFieldsValidation(this.recipientFields)) {
      return '';
    }

    let items = this.joinItems(this.orderForUpdate.items);

    if(!items)
      return;

    const payload = {
      orderId: this.oldOrder.id,
      updatedOrder: {
        items: items,
        recipient: this.recipientFields,
        order: this.orderFields
      }
    };


    if (payload.updatedOrder.order.cashOnDelivery && !payload.updatedOrder.order.cashOnDeliveryAmount) {
      return this.props.showMessage({
        message: gettext('ENTER-ORDER-COST'),
        level: 'error'
      });
    }
    if (payload.updatedOrder.order.cashOnDeliveryAmount < 0) {
      return this.props.showMessage({
        message: gettext('NEGATIVE-COD'),
        level: 'error'
      });
    }

    this.props.appActions.startSpinner();
    this.props.appActions.updateOrderAndLog(payload);
    this.props.router.push('/dispatcherDashboard');
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
      <UpdateOrderForm
        fields={LoopbackHttp.isDispatcher?this.props.account:this.getDispatcher(this.orderForUpdate.dispatcherId)}
        pickUpPoints={this.pickUpPoints}
        removeItemFromUpdate={this.removeItemFromUpdate}
        deliveryTimeValidator={this.deliveryTimeValidator}
        onDeliveryPointSelect={this.onDeliveryPointSelect}
        onDeliveryTimeSelect={this.onDeliveryTimeSelect}
        showMap={this.showMap}
        showFloatingMap={this.showFloatingMap}
        formattedDeliveryPointAddress={this.formattedDeliveryPointAddress}
        vehicles={this.props.vehicles}
        setOfSelectedPickUpPoints={this.setOfSelectedPickUpPoints}
        orderForUpdate={this.orderForUpdate}
        getDispatcher={this.getDispatcher}
        getRecipient={this.getRecipient}
        floatingPickUpPoint={this.floatingPickUpPoint}
        setFloatingPickUpPoint={this.setFloatingPickUpPoint}
        account={this.props.account}
        isOutOfCityDelivery={this.state.isOutOfCityDelivery}
        onPickUpPointSelected={this.onPickUpPointSelected}
        outOfCityForm={this.state.outOfCityForm}
        companies={this.props.companies}
        addNewItemToUpdate={this.addNewItemToUpdate}
        updateOrder={this.updateOrder}
        setFloatingPointContactName={this.setFloatingPointContactName}
        setPickUpPointPhone={this.setPickUpPointPhone}

        createFloatingPropertyInItems={this.createFloatingPropertyInItems}
        changePickupPointType={this.changePickupPointType}
        changeItemFocus={this.changeItemFocus}
        changeItemsPacklist={this.changeItemsPacklist}
        changeItemsComment={this.changeItemsComment}
        dispatcher={this.dispatcher}
      >
      {map}
      {floatingMap}
      </UpdateOrderForm>
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



UpdateOrderContainer.propTypes = {
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
  orderForUpdate: PropTypes.object,
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
    orderForUpdate: state.appReducer.orderForUpdate,
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
)(UpdateOrderContainer);
