// import React, { PropTypes } from 'react';
// import { Link } from 'react-router';
// import { Button, Form, Tooltip, OverlayTrigger, FormGroup, Glyphicon, FormControl, Col, PageHeader, ControlLabel, InputGroup, Alert } from 'react-bootstrap';
// import DateTimeField from 'react-bootstrap-datetimepicker';
// import Geosuggest from 'react-geosuggest';
// import '../styles/orderCreationFormStyles.scss';
// import _ from 'lodash';
// import { gettext } from '../i18n/service.js';
// import { SetCorrectDeliveryTime, ConvertExpPickUpTime } from '../businessLogic/convertExpPickUpTime.js';
// import getCurLang from '../businessLogic/getCurLang.js';
// import { rowReverseAR, selOnMapAR } from '../constants/formCreateStyle.js';
// import moment from 'moment';
// import LoopbackHttp from '../businessLogic/LoopbackHttp.js';
// import isEmpty from '../businessLogic/isObjectEmpty.js';
// import formatId from '../businessLogic/formatId.js';
// import getTooltip from '../businessLogic/getTooltip.js';
// import classnames from 'classnames';
//
//
// const divHide = {
//   display: 'none'
// };
// const divShow = {
//   display: 'block'
// };
//
// const deliveryTimes = [
//   "08:00-09:00",
//   "09:00-10:00",
//   "10:00-11:00",
//   "11:00-12:00",
//   "12:00-13:00",
//   "13:00-14:00",
//   "14:00-15:00",
//   "15:00-16:00",
//   "16:00-17:00",
//   "17:00-18:00",
//   "18:00-19:00",
//   "19:00-20:00",
//   "20:00-21:00",
//   "21:00-22:00",
//   "22:00-23:00"
// ];
//
// const oneHourTimes = [
//   "08:00-09:00",
//   "09:00-10:00",
//   "10:00-11:00",
//   "11:00-12:00",
//   "12:00-13:00",
//   "13:00-14:00",
//   "14:00-15:00",
//   "15:00-16:00",
//   "16:00-17:00",
//   "17:00-18:00",
//   "18:00-19:00",
//   "19:00-20:00",
// ];
//
// const threeHourTimes = [
//   "08:00-11:00",
//   "11:00-14:00",
//   "14:00-17:00",
//   "17:00-20:00",
// ];
//
// const selectName = 'expectedPickUpTimeWindow';
// const selectNameFalse = 'notExpectedPickUpTimeWindow';
//
// export default class OrderCreationForm extends React.Component {
//   constructor(props, context) {
//     super(props, context);
//
//     this.formattedDeliveryPointAddress = props.formattedDeliveryPointAddress;
//     this.isThreHourPicker = props.fields.pickUpTimeWindow === 3;
//     this.pickUpTimePickerVal = new Date().getHours();
//     this.props.onDeliveryTimeSelect(new Date().getHours());
//
//     this.deliveryTimePickerVal = null;
//     this.geosuggest = undefined;
//     this.isCashOnDelivery = false;
//     this.isExpressDelivery = false;
//     this.isVenicleType = false;
//     this.isFloating = false;
//     this.isUseDispatchersPoints = false;
//     this.isOutOfCity = false;
//
//     if (LoopbackHttp.isOperator) {
//       if (!isEmpty(this.props.orderForReturn)) {
//         this.dispatcher = props.getDispatcher(props.orderForReturn.dispatcherId);
//         this.recipient = props.getRecipient(props.orderForReturn.recipientId);
//         this.pickUpPoints = _.filter(props.pickUpPoints, (point) => {
//           return point.dispatcherId === this.dispatcher.id;
//         });
//         props.setFloatingPickUpPoint({ label: this.recipient.deliveryPoint, location: this.recipient.gpsLocation });
//       }
//     }
//
//     if (LoopbackHttp.isDispatcher) {
//       if (!isEmpty(this.props.orderForReturn)) {
//         this.dispatcher = props.account;
//         this.recipient = props.getRecipient(props.orderForReturn.recipientId);
//         this.pickUpPoints = _.filter(props.pickUpPoints, (point) => {
//           return point.dispatcherId === this.dispatcher.id;
//         });
//         props.setFloatingPickUpPoint({ label: this.recipient.deliveryPoint, location: this.recipient.gpsLocation });
//       }
//     }
//
//     this.state = {
//       today: new Date().valueOf(),
//       orderDate: new Date().valueOf(),
//       outOfCityCheck: false,
//       outOfCityForm: this.props.outOfCityForm,
//       selectedCountry: 'are'
//     }
//
//     _.bindAll(this, ['toggleCashOnDelivery', 'renderFooter', 'toggleExpressDelivery', 'toggleisUseDispatchersPoints',
//     'togleTimePickerChose', 'toggleVenicleType', 'togleOutOfSityCheck', 'toggleFloatingPoint']);
//
//
//     this.count = 0;
//   }
//
//
//   componentWillReceiveProps(nextProps) {
//     if (nextProps.formattedDeliveryPointAddress !== this.formattedDeliveryPointAddress) {
//       this.formattedDeliveryPointAddress = nextProps.formattedDeliveryPointAddress;
//       if (this.geosuggest) {
//         this.geosuggest.update(this.formattedDeliveryPointAddress);
//         this.forceUpdate();
//       }
//     }
//   }
//
//   toggleCashOnDelivery(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     this.isCashOnDelivery = !this.isCashOnDelivery;
//     setTimeout(() => {
//       this.forceUpdate();
//     }, 0);
//   }
//
//   toggleisUseDispatchersPoints(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     this.isUseDispatchersPoints = !this.isUseDispatchersPoints;
//     setTimeout(() => {
//       this.forceUpdate();
//     }, 0);
//   }
//
//   toggleExpressDelivery(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     this.isExpressDelivery = !this.isExpressDelivery;
//     this.pickUpTimePickerVal = new Date().getHours();
//     setTimeout(() => {
//       this.forceUpdate();
//     }, 0);
//   }
//
//   toggleFloatingPoint(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     this.isFloating = !this.isFloating;
//     setTimeout(() => {
//       this.forceUpdate();
//     }, 0);
//   }
//
//   toggleVenicleType(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     this.isVenicleType = !this.isVenicleType;
//     setTimeout(() => {
//       this.forceUpdate();
//     }, 0);
//   }
//
//   togleTimePickerChose(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     this.isThreHourPicker = !this.isThreHourPicker;
//
//     setTimeout(() => {
//       this.forceUpdate();
//     }, 0);
//   }
//
//   togleOutOfSityCheck(e) {
//
//     e.preventDefault();
//     e.stopPropagation();
//     this.isOutOfCity = !this.isOutOfCity;
//
//     const outOfCityForm = this.state.outOfCityForm;
//     outOfCityForm.present = this.isOutOfCity;
//     this.setState({ outOfCityForm });
//
//     setTimeout(() => {
//       this.forceUpdate();
//     }, 0);
//   }
//
//   setDeliveryTime(e) {
//     (this.pickUpTimePickerVal >= ConvertExpPickUpTime(e.target.value)) ?
//       (this.props.onDeliveryTimeSelect(this.props.deliveryTimeValidator(e, SetCorrectDeliveryTime(this.pickUpTimePickerVal)))) :
//       this.props.onDeliveryTimeSelect(e.target.value.split('-')[1]);
//   }
//
//   setPickUpTimePickerVal(e) {
//     this.pickUpTimePickerVal = ConvertExpPickUpTime(e.target.value);
//     this.props.onDeliveryTimeSelect(null);
//     this.forceUpdate();
//   }
//
//   outOfCityFormOnChange(name) {
//     return function (e) {
//       const outOfCityForm = this.state.outOfCityForm;
//       outOfCityForm[name] = e.target.value;
//       this.setState({ outOfCityForm });
//     }
//   }
//
//   renderOutOfCityForm() {
//     // return
//     return (
//       <div id="out-of-city-form">
//         <ControlLabel>
//           {gettext('COUNTRY')}
//         </ControlLabel>
//
//           <Geosuggest
//             style={{
//               display: 'block',
//               width: '100%'
//             }}
//             // country='us'
//             types={['(regions)']}
//             onSuggestSelect={this.onCountrySelect.bind(this)}
//             name="floatingPickUpPoint"
//             placeholder={gettext('ENTER-YOUR-COUNTRY')}
//             inputClassName="form-control floatingPickUpPoint"
//             required={true}
//
//           />
//
//
//
//         <ControlLabel>
//           {gettext('CITY')}
//         </ControlLabel>
//           <Geosuggest
//             ref={el => this._geoSuggestCity = el}
//             style={{
//               display: 'block',
//               width: '100%'
//             }}
//             country={this.state.selectedCountry}
//             types={['(cities)']}
//             onSuggestSelect={this.onCitySelect.bind(this)}
//             name="floatingPickUpPoint"
//             placeholder={gettext('ENTER-YOUR-CITY')}
//             inputClassName="form-control floatingPickUpPoint "
//           />
//
//         <ControlLabel>
//           {gettext('ADDRESS-LINE-FIRST')}
//         </ControlLabel>
//
//         <FormControl type="text"
//           defaultValue={this.state.outOfCityForm.addressFirst}
//           placeholder={gettext('ENTER-YOUR-LINE-FIRST')}
//           onChange={this.outOfCityFormOnChange('addressFirst').bind(this)}
//           required={true} className="_recipient_" name="out-adress-line-1" />
//         <ControlLabel>
//           {gettext('ADDRESS-LINE-SECOND')}
//         </ControlLabel>
//
//         <FormControl type="text"
//           defaultValue={this.state.outOfCityForm.addressSecond}
//           placeholder={gettext('ENTER-YOUR-LINE-SECOND')}
//           onChange={this.outOfCityFormOnChange('addressSecond').bind(this)}
//           className="_recipient_" name="out-adress-line-2" />
//
//         <ControlLabel>
//           {gettext('ZIP-CODE')}
//         </ControlLabel>
//         <FormControl type="text"
//           // pattern="([0-9]){5,5}"
//           defaultValue={this.state.outOfCityForm.zipCode}
//           placeholder={gettext('ENTER-YOUR-ZIPCODE')}
//           onChange={this.outOfCityFormOnChange('zipCode').bind(this)}
//           required={true} className="_recipient_" name="out-zip-code" />
//
//
//         <div className='outOfCityAlert'>
//           <Alert bsStyle="warning">
//             <span>Out of city delivery will add (SAR) to delivery cost {this.calculateOutOfCityCoast()}</span><br />
//           </Alert>
//         </div>
//
//       </div>
//     )
//   }
//
//   onCountrySelect(event) {
//
//     const { selectedCountry, outOfCityForm } = this.state;
//
//     event.gmaps.address_components.forEach(el => {
//       if (el.types[0] === 'country') {
//
//         let selectedCountry = el.short_name.toLowerCase();
//         outOfCityForm.country = event.label;
//         if (this.state.selectedCountry !== selectedCountry) {
//           outOfCityForm.city = '';
//           this._geoSuggestCity.clear();
//         }
//
//         this.setState({ selectedCountry, outOfCityForm });
//       }
//     })
//
//   }
//
//   onCitySelect(event) {
//     const { outOfCityForm } = this.state;
//     outOfCityForm.city = event.label;
//     this.setState({ outOfCityForm });
//   }
//
//   renderFooter() {
//     return (
//       <footer className={getCurLang() === 'ar' ? 'navReverseLinks' : ''} style={{ bottom: '4em' }}>
//         <span>
//           <Link to="/dispatcherDashboard">
//             {gettext('CANCEL')}
//           </Link>
//           <Button bsStyle="success" type="submit" style={getCurLang() === 'ar' ? { marginRight: "20px" } : { marginLeft: "20px" }}>
//             {gettext('SUBMIT')}
//           </Button>
//         </span>
//       </footer>
//     )
//   }
//
//   calculateOutOfCityCoast() {
//     const idx = _.findIndex(this.props.companies, (company) => company.default);
//     const commision = this.isExpressDelivery ? this.props.account.expressDeliveryCommission : this.props.account.deliveryCommission;
//
//     return (
//       idx >= 0 ? <strong>{commision + this.props.companies[idx].foreignDeliveryCost}</strong> : null
//     )
//   }
//
//   renderMap() {
//     const hideMap = classnames({
//       'create-order-hide-map': this.state.outOfCityForm.present
//     });
//
//     return (
//       <div className={hideMap}>
//         <ControlLabel>
//           {gettext('DELIVERY-POINT-ADDRESS')}
//         </ControlLabel>
//         <InputGroup style={getCurLang() === 'ar' ? rowReverseAR : {}}>
//           <Geosuggest
//             style={{
//               display: 'block',
//               width: '100%'
//             }}
//
//             onSuggestSelect={this.props.onDeliveryPointSelect}
//             name="deliveryPoint"
//             disabled={true}
//             placeholder={gettext('DELIVERY-POINT-ADDRESS')}
//             inputClassName="_recipient_ _order_ form-control"
//             initialValue={this.props.formattedDeliveryPointAddress}
//             required={!this.state.outOfCityForm.present}
//           />
//           <InputGroup.Addon onClick={this.props.showMap} style={getCurLang() === 'ar' ? selOnMapAR : {}}>
//             {gettext('SELECT-ON-MAP')}
//           </InputGroup.Addon>
//
//         </InputGroup>
//       </div>
//     )
//   }
//
//   submit(event) {
//     isEmpty(this.props.orderForReturn) ? this.props.submit(event) : this.props.returnOrder(event);
//   }
//
//   render() {
//
//     const pickUpPoints = _.map(Object.keys(this.props.pickUpPoints), (key) => (
//       <option
//         key={`${this.props.pickUpPoints[key].id}`}
//         disabled={this.props.setOfSelectedPickUpPoints.has(this.props.pickUpPoints[key].id)}
//         value={`${this.props.pickUpPoints[key].id}`}>
//         {this.props.pickUpPoints[key].title}
//       </option>
//     ));
//
//     const floatingPickUpPoint = (itemId) => (
//       <FormGroup controlId="formHorizontalEmail">
//         <ControlLabel>
//           {gettext('PICKUP-POINT-CONTACT')}
//         </ControlLabel>
//         <FormControl
//           type="text"
//           required={true}
//           onChange={(e) => {
//             this.props.setFloatingPointContactName(e, itemId)
//           }}
//           className="geosuggest"
//           placeholder={gettext('PICKUP-POINT-CONTACT')}
//           style={{ marginBottom: '1em', display: 'inline' }} />
//
//         <ControlLabel>
//           {gettext('PHONE')}
//         </ControlLabel>
//         <FormControl
//           type="text"
//           required={true}
//           onChange={(e) => {
//             this.props.setPickUpPointPhone(e, itemId);
//           }}
//           className="geosuggest"
//           placeholder={gettext('PHONE')}
//           style={{ marginBottom: '1em', display: 'inline' }} />
//         <ControlLabel>
//           {gettext('ADDRESS')}
//         </ControlLabel>
//         <InputGroup style={getCurLang() === 'ar' ? rowReverseAR : {}}>
//           <Geosuggest
//             style={{
//               display: 'block',
//               width: '100%'
//             }}
//             disabled={true}
//             onSuggestSelect={(e) => this.props.setFloatingPickUpPoint(e, itemId)}
//             name="floatingPickUpPoint"
//             placeholder={gettext('PICKUP-POINT')}
//             inputClassName="form-control floatingPickUpPoint"
//             initialValue={this.props.items[itemId].pickupPointId.address}
//             required={true}
//           />
//
//           <InputGroup.Addon onClick={() => { this.props.changeItemFocus(itemId); this.props.showFloatingMap(); }} style={getCurLang() === 'ar' ? selOnMapAR : {}}>
//             {gettext('SELECT-ON-MAP')}
//           </InputGroup.Addon>
//         </InputGroup>
//       </FormGroup>
//     );
//     const vehicles = _.map(this.props.vehicles, (vehicle) => (
//       <option key={`vehicle_${vehicle.type}`} value={vehicle.size}>
//         {vehicle.type}
//       </option>
//     ));
//     const correctDeliveryTimeOptions = _.map(deliveryTimes, (time) => {
//       return (
//         <option
//           className={
//             !(ConvertExpPickUpTime(time) > this.pickUpTimePickerVal) && !this.isExpressDelivery ? 'display_none' : ''
//           }
//           value={time}>
//           {time}
//         </option>
//       );
//     });
//
//     const correctThreeHourPickUpTimes = _.map(threeHourTimes, (time) => {
//       return (
//         <option
//           className={
//             !(parseInt(ConvertExpPickUpTime(time)) > new Date(this.state.orderDate).getHours())
//               && this.state.orderDate <= this.state.today ? 'display_none' : ''
//           }
//
//           style={
//             !(parseInt(ConvertExpPickUpTime(time)) > new Date(this.state.orderDate).getHours())
//               && this.state.orderDate <= this.state.today ? { display: 'none!important' } : {}
//           }
//           disabled={
//             !(parseInt(ConvertExpPickUpTime(time)) > new Date(this.state.orderDate).getHours())
//               && this.state.orderDate <= this.state.today ? true : false
//           }
//           value={time}>
//           {time}
//         </option>
//       );
//     });
//
//     const correctOneHourPickUpTimes = _.map(oneHourTimes, (time) => {
//       return (
//         <option
//           className={
//             !(parseInt(ConvertExpPickUpTime(time)) > new Date(this.state.orderDate).getHours())
//               && this.state.orderDate <= this.state.today ? 'display_none' : ''
//           }
//
//           style={
//             !(parseInt(ConvertExpPickUpTime(time)) > new Date(this.state.orderDate).getHours())
//               && this.state.orderDate <= this.state.today ? { display: 'none' } : {}
//           }
//
//           disabled={
//             !(parseInt(ConvertExpPickUpTime(time)) > new Date(this.state.orderDate).getHours())
//               && this.state.orderDate <= this.state.today ? true : false
//           }
//           value={time}>
//           {time}
//         </option>
//       );
//     });
//
//
//     ///items for create order action
//     const items = _.map(this.props.items, (item, i) => {
//       return (
//         <div key={`item${i}`}>
//           <FormGroup controlId="formControlsSelect">
//             <h3>{gettext('PICKUP-POINT')}
//               {i != 0 ? ' (+' + this.props.account.additionalPickupPointCost + ' ' + this.props.account.currency + ')' : ''}
//             </h3>
//
//             {!item.isFloating ?
//               <FormControl componentClass="select"
//                 disabled={item.isFloating}
//                 className={item.isFloating ? '' : "_item_"} name="pickupPointId" placeholder="select"
//                 onChange={(e) => this.props.onPickUpPointSelected(e, i)}>
//                 {pickUpPoints}
//               </FormControl>
//               : floatingPickUpPoint(i)
//             }
//           </FormGroup>
//
//           <FormGroup controlId="formHorizontalEmail">
//             <div className="checkbox" style={getCurLang() === 'ar' ? { marginRight: '2em' } : { marginLeft: '2em' }}>
//               <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-CREATE-FLOATINGPOINT'))}>
//                 <label>
//                   <input type="checkbox" name="floating_point" checked={item.isFloating} onChange={() => this.props.changePickupPointType(i)} />
//                   {gettext('USE-FLOATING-POINT')}<Glyphicon glyph="info-sign" />
//                 </label>
//               </OverlayTrigger>
//             </div>
//           </FormGroup>
//
//           <FormGroup controlId="formHorizontalTextarea">
//             <ControlLabel>
//               {gettext('PACKING-LIST')}
//             </ControlLabel>
//             <FormControl type="textarea"
//               required={true} style={{ resize: "vertical" }}
//               placeholder={gettext('PACKING-LIST')}
//               componentClass="textarea"
//               onChange={(e) => this.props.changeItemsPacklist(e, i)}
//               defaultValue={item.packingList}
//               className="_item_" name="packingList" />
//           </FormGroup>
//           {isEmpty(this.props.orderForReturn) ?
//             <FormGroup controlId="formControlsTextarea">
//               <ControlLabel>
//                 {gettext('COMMENT-BOX')}
//               </ControlLabel>
//               <FormControl type="textarea"
//                 componentClass="textarea"
//                 style={{ resize: "vertical" }}
//                 placeholder={gettext('LEAVE-COMMENT-IF-YOU-NEED')}
//                 onChange={(e) => this.props.changeItemsComment(e, i)}
//                 defaultValue={item.comment}
//                 className="_item_" name="comment" />
//             </FormGroup> : ''}
//           <div className="dotted-line"></div>
//         </div>
//       );
//     });
//
//     return (
//       <div className="orderCreationForm container" dir={getCurLang() === 'ar' ? 'rtl' : 'ltr'} style={{ height: '100%' }}>
//         <PageHeader>{isEmpty(this.props.orderForReturn) ? gettext('NEW-ORDER') : gettext('RETURN')}</PageHeader>
//         <Form onSubmit={isEmpty(this.props.orderForReturn) ? this.props.submit : this.props.returnOrder}
//           className={getCurLang() === 'ar' ? 'formReverse' : ''}>
//
//           <Col sm={6}>
//
//             <h2>{gettext('PACKAGE-DETAILS')}</h2>
//             <div className="dotted-line"></div>
//             {items}
//
//
//             <FormGroup controlId="formHorizontalEmail">
//               <Button bsStyle="danger" onClick={this.props.removeItem}>{gettext('ITEM.REMOVE-ITEM')}</Button>
//               <Button bsStyle="primary" disabled={this.isExpressDelivery} onClick={this.props.addNewItem} style={getCurLang() === 'ar' ? { marginRight: "20px" } : { marginLeft: "20px" }}>{gettext('ITEM.ADD-NEW-ITEM')}</Button>
//             </FormGroup>
//
//             <h2>{gettext('PICKUP')}</h2>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <ControlLabel>
//                 {gettext('DATE')}
//               </ControlLabel>
//               <DateTimeField
//                 mode="date"
//                 viewMode="days"
//                 minDate={moment().zone('+0300')}
//                 inputProps={{
//                   name: "expectedPickUpDate",
//                   className: "_order_ form-control",
//                   required: true
//                 }}
//                 onChange={
//                   (e) => this.setState({ orderDate: parseInt(e) })
//                 }
//               />
//             </FormGroup>
//             <FormGroup controlId="formControlsSelect">
//               <ControlLabel>{gettext('TIME-WINDOW')}</ControlLabel>
//               <FormControl
//                 componentClass="select"
//                 className="_order_"
//                 style={this.isThreHourPicker ? divShow : divHide}
//                 name={this.isThreHourPicker ? selectName : selectNameFalse}
//                 placeholder="select"
//                 disabled={this.isExpressDelivery}
//                 onChange={(e) => this.setPickUpTimePickerVal(e)}>
//                 <option disabled selected value> -- {gettext('SELECT-PICKUP-TIME')} -- </option>
//                 {correctThreeHourPickUpTimes}
//               </FormControl>
//
//               <FormControl
//                 componentClass="select"
//                 className="_order_"
//                 style={!this.isThreHourPicker ? divShow : divHide}
//                 name={!this.isThreHourPicker ? selectName : selectNameFalse}
//                 placeholder="select"
//                 disabled={this.isExpressDelivery}
//                 onChange={(e) => this.setPickUpTimePickerVal(e)}>
//                 <option disabled selected value> -- {gettext('SELECT-PICKUP-TIME')} -- </option>
//                 {correctOneHourPickUpTimes}
//               </FormControl>
//             </FormGroup>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <div className="checkbox" style={getCurLang() === 'ar' ? { marginRight: '2em' } : { marginLeft: '2em' }}>
//                 <OverlayTrigger placement="top"
//                   overlay={this.props.items.length === 1
//                     ? getTooltip(gettext('TOOLTIP-DELIVERNOW'))
//                     : getTooltip(gettext('TOOLTIP-EXPRESS-NOT-AVAILABLE'))
//                   }>
//                   <label>
//                     <input type="checkbox" name="express" checked={this.isExpressDelivery} disabled={this.isOutOfCity || this.props.items.length > 1} onChange={this.toggleExpressDelivery} className="_order_" />
//                     {gettext('DELIVER-NOW')} {" (" + this.props.fields.expressDeliveryCommission + " " + this.props.fields.currency + ")"}
//                     <Glyphicon glyph="info-sign" />
//                   </label>
//                 </OverlayTrigger>
//               </div>
//             </FormGroup>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <div className="checkbox" style={getCurLang() === 'ar' ? { marginRight: '2em' } : { marginLeft: '2em' }}>
//                 <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-SELECT-VEHICLE'))}>
//                   <label>
//                     <input type="checkbox" name="venicle" checked={this.isVenicleType} onChange={this.toggleVenicleType} className="_order_" />
//                     {gettext('SELECTBOX-VEHICLE-TYPE')} <Glyphicon glyph="info-sign" />
//                   </label>
//                 </OverlayTrigger>
//               </div>
//             </FormGroup>
//
//             <FormGroup controlId="formControlsSelect" style={!this.isVenicleType ? { visibility: 'hidden' } : {}}>
//               <select className="_order_ form-control" name="vehicleType">
//                 <option disabled selected value> -- {gettext('PLACEHOLDER.SELECT-OPTION')} -- </option>
//                 {vehicles}
//               </select>
//             </FormGroup>
//             <div className="dotted-line"></div>
//           </Col>
//
//           <Col sm={6}>
//
//             <h2>{gettext('RECIPIENT')}</h2>
//
//             <div className="dotted-line"></div>
//             <FormGroup controlId="formHorizontalEmail">
//               <ControlLabel>
//                 {gettext('NAME')}
//               </ControlLabel>
//               <FormControl type="string"
//                 pattern="[^0-9]{3,30}"
//                 defaultValue={this.dispatcher ? this.dispatcher.firstName : ''}
//                 required={true}
//                 placeholder={gettext('FIRST-NAME')}
//                 className="_recipient_" name="firstName" />
//             </FormGroup>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <ControlLabel>
//                 {gettext('MOBILE')}
//               </ControlLabel>
//               <FormControl type="text"
//                 pattern="([0-9]){7,20}"
//                 defaultValue={this.dispatcher ? this.dispatcher.mobile : ''}
//                 minLength={7}
//                 placeholder={gettext('MOBILE') + ' +XXXXXXXXXXX'}
//                 required={true} className="_recipient_" name="mobile" />
//             </FormGroup>
//
//             <FormGroup controlId="formHorizontalEmail">
//
//               <div className='checkbox outOfCityCheck' style={getCurLang() === 'ar' ? { marginRight: '2em' } : { marginLeft: '2em' }}>
//                 <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-OUTOFCITY'))}>
//                   <label>
//                     <input type="checkbox" disabled={this.isExpressDelivery} name="outOfCityCheck" className="_order_" checked={this.isOutOfCity} onChange={this.togleOutOfSityCheck} />
//                     {gettext('SELECT-OUT-OF-CITY')} <Glyphicon glyph="info-sign" />
//                   </label>
//                 </OverlayTrigger>
//               </div>
//
//               {
//                 this.isOutOfCity ? this.renderOutOfCityForm() : this.renderMap()
//               }
//
//               <div className="dotted-line"></div>
//             </FormGroup>
//
//             <h2>{gettext('DELIVERY')}</h2>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <ControlLabel>
//                 {gettext('DELIVERY-TIME')}
//               </ControlLabel>
//               <FormControl
//                 disabled={this.isExpressDelivery || this.isOutOfCity}
//                 componentClass="select"
//                 className="_order_"
//                 onChange={(e) => this.setDeliveryTime(e)}>
//                 <option disabled selected value> -- {gettext('SELECT-DELIVERY-TIME')} -- </option>
//                 {correctDeliveryTimeOptions}
//               </FormControl>
//             </FormGroup>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <div className="checkbox" style={getCurLang() === 'ar' ? { marginRight: '2em' } : { marginLeft: '2em' }}>
//                 <OverlayTrigger placement="top" overlay={getTooltip(gettext('TOOLTIP-COD'))}>
//                   <label>
//                     <input type="checkbox" name="cashOnDelivery" disabled={this.isOutOfCity} checked={this.isCashOnDelivery} onChange={this.toggleCashOnDelivery} className="_order_" />
//                     {gettext('CASH-ON-DELIVERY')} <Glyphicon glyph="info-sign" />
//                   </label>
//                 </OverlayTrigger>
//               </div>
//
//               {this.isCashOnDelivery ?
//                 <FormControl type="text" pattern="[0-9]{1,}" min="0" placeholder="SAR" className="_order_" disabled={!this.isCashOnDelivery} name="cashOnDeliveryAmount" />
//                 : ''}
//               <div className="dotted-line"></div>
//             </FormGroup>
//           </Col>
//
//           {this.props.children}
//           {this.renderFooter()}
//
//         </Form>
//       </div>
//     );
//   }
//
//
// }
//
// OrderCreationForm.propTypes = {
//   account: PropTypes.object,
//   submit: PropTypes.func,
//   returnOrder: PropTypes.func,
//   onInputChange: PropTypes.func,
//   pickUpPoints: PropTypes.object,
//   itemCount: PropTypes.number,
//   removeItem: PropTypes.func,
//   pickUpTimeValidator: PropTypes.func,
//   deliveryTimeValidator: PropTypes.func,
//   addNewItem: PropTypes.func,
//   onDeliveryPointSelect: PropTypes.func,
//   onDeliveryTimeSelect: PropTypes.func,
//   showMap: PropTypes.func,
//   formattedDeliveryPointAddress: PropTypes.string,
//   vehicles: PropTypes.array.isRequired,
//   setOfSelectedPickUpPoints: PropTypes.instanceOf(Set),
//   onPickUpPointSelected: PropTypes.func,
//   recipients: PropTypes.array,
//   getDispatcher: PropTypes.func,
//   getRecipient: PropTypes.func,
//   setFloatingPickUpPoint: PropTypes.func,
//   fields: PropTypes.object,
//   orderForReturn: PropTypes.object,
//   children: PropTypes.string,
//   removeItemFromReturn: PropTypes.func,
//   // onChangeDefaultZoom: PropTypes.funk,
//   outOfCityForm: PropTypes.object
// };
//
// const divHide = {
//   display: 'none'
// };
// const divShow = {
//   display: 'block'
// };
//
// const selectName = 'expectedPickUpTimeWindow';
// const selectNameFalse = 'notExpectedPickUpTimeWindow';
//
// export default class OrderCreationForm extends React.Component {
//   constructor(props, context) {
//     super(props, context);
//     this.formattedDeliveryPointAddress = props.formattedDeliveryPointAddress;
//     this.geosuggest = undefined;
//     this.isCashOnDelivery = false;
//     this.toggleCashOnDelivery = this.toggleCashOnDelivery.bind(this);
//     this.isThreHourPicker = props.fields.pickUpTimeWindow===3;
//     this.togleTimePickerChose = this.togleTimePickerChose.bind(this);
//     this.pickUpTimePickerVal = (props.fields.pickUpTimeWindow===3? null : null)
//     this.deliveryTimePickerVal = "10:00";
//     this.props.onDeliveryTimeSelect(props.fields.pickUpTimeWindow===3? null : null);
//   }
//
//   componentWillReceiveProps(nextProps) {
//     if (nextProps.formattedDeliveryPointAddress !== this.formattedDeliveryPointAddress) {
//       this.formattedDeliveryPointAddress = nextProps.formattedDeliveryPointAddress;
//       if (this.geosuggest) {
//         this.geosuggest.update(this.formattedDeliveryPointAddress);
//         this.forceUpdate();
//       }
//     }
//   }
//
//   toggleCashOnDelivery(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     this.isCashOnDelivery = !this.isCashOnDelivery;
//     setTimeout(() => {
//       this.forceUpdate();
//     }, 0);
//   }
//   togleTimePickerChose(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     this.isThreHourPicker = !this.isThreHourPicker;
//
//     setTimeout(() => {
//       this.forceUpdate();
//     }, 0);
//   }
//
//   setDeliveryTime(e){
//     console.log(this.pickUpTimePickerVal);
//     (this.pickUpTimePickerVal >= ConvertExpPickUpTime(e.target.value))?
//                         (this.props.onDeliveryTimeSelect(this.props.deliveryTimeValidator(e, SetCorrectDeliveryTime(this.pickUpTimePickerVal)))):
//                           this.props.onDeliveryTimeSelect(e.target.value.split('-')[1])
//   }
//
//   setPickUpTimePickerVal(e){
//     this.pickUpTimePickerVal = ConvertExpPickUpTime(e.target.value);
//     this.props.onDeliveryTimeSelect(null);
//     console.log(this.pickUpTimePickerVal);
//   }
//
//
//
//   render() {
//     const pickUpPoints = _.map(Object.keys(this.props.pickUpPoints), (key) => (
//       <option
//         key={`${this.props.pickUpPoints[key].id}`}
//         disabled={this.props.setOfSelectedPickUpPoints.has(this.props.pickUpPoints[key].id)}
//         value={`${this.props.pickUpPoints[key].id}`}>
//         {this.props.pickUpPoints[key].title}
//       </option>
//     ));
//     const vehicles = _.map(this.props.vehicles, (vehicle) => (
//       <option key={`vehicle_${vehicle.type}`} value={vehicle.size}>
//         {vehicle.type}
//       </option>
//     ));
//     let items = [];
//     for (let i = 0, n = this.props.itemCount; i < n; i++) {
//       items.push(
//         <div key={`item${i}`}>
//           <FormGroup controlId="formControlsSelect">
//             <ControlLabel>{ gettext('PICKUP-POINT') }</ControlLabel>
//             <FormControl componentClass="select" className="_item_" name="pickupPointId" placeholder="select" onChange={this.props.onPickUpPointSelected}>
//               {pickUpPoints}
//             </FormControl>
//           </FormGroup>
//           <FormGroup controlId="formHorizontalTextarea">
//             <ControlLabel>
//               { gettext('PACKING-LIST') }
//             </ControlLabel>
//             <FormControl type="textarea" required={true} style={{resize: "vertical"}} componentClass="textarea" className="_item_" name="packingList" />
//           </FormGroup>
//         </div>
//       );
//     }
//
//     return (
//
//       <div className="orderCreationForm container" dir = {getCurLang()==='ar'?'rtl':'ltr'} style={{height: '100%'}}>
//         <PageHeader>{ gettext('NEW-ORDER') }</PageHeader>
//         <Form onSubmit={this.props.submit} className ={getCurLang()==='ar'?'formReverse':''}>
//
//           <Col sm={6}>
//
//             <h2>{ gettext('PACKAGE-DETAILS') }</h2>
//
//             {items}
//
//             <FormGroup controlId="formHorizontalEmail">
//               <Button bsStyle="danger" onClick={this.props.removeItem}>{ gettext('ITEM.REMOVE-ITEM') }</Button>
//               <Button bsStyle="primary" onClick={this.props.addNewItem} style={getCurLang()==='ar'?{marginRight: "20px"}:{marginLeft: "20px"}}>{ gettext('ITEM.ADD-NEW-ITEM') }</Button>
//             </FormGroup>
//
//             <h2>{ gettext('PICKUP-TIME') }</h2>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <ControlLabel>
//                 { gettext('DATE') }
//               </ControlLabel>
//               <DateTimeField
//                 mode="date"
//                 viewMode="days"
//                 inputProps={{
//                   name: "expectedPickUpDate",
//                   className: "_order_ form-control",
//                   required: true
//                 }}
//                 />
//             </FormGroup>
//
//             <FormGroup controlId="formControlsSelect">
//               <ControlLabel>{ gettext('TIME-WINDOW') }</ControlLabel>
//               <FormControl
//                 componentClass="select"
//                 className="_order_"
//                 style={this.isThreHourPicker ? divShow : divHide}
//                 name={this.isThreHourPicker ? selectName : selectNameFalse}
//                 placeholder="select"
//                 onChange={(e) =>  this.setPickUpTimePickerVal(e)}>
//
//                   <option disabled selected value> -- {gettext('SELECT-PICKUP-TIME')} -- </option>
//                   <option value="08:00-11:00">08:00-11:00</option>
//                   <option value="11:00-14:00">11:00-14:00</option>
//                   <option value="14:00-17:00">14:00-17:00</option>
//                   <option value="17:00-20:00">17:00-20:00</option>
//               </FormControl>
//
//               <FormControl
//                 componentClass="select"
//                 className="_order_"
//                 style={!this.isThreHourPicker ? divShow : divHide}
//                 name={!this.isThreHourPicker ? selectName : selectNameFalse}
//                 placeholder="select"
//                 onChange={(e) =>  this.setPickUpTimePickerVal(e)}>
//
//                   <option disabled selected value> -- {gettext('SELECT-PICKUP-TIME')} -- </option>
//                   <option value="08:00-09:00">08:00-09:00</option>
//                   <option value="09:00-10:00">09:00-10:00</option>
//                   <option value="10:00-11:00">10:00-11:00</option>
//                   <option value="11:00-12:00">11:00-12:00</option>
//                   <option value="12:00-13:00">12:00-13:00</option>
//                   <option value="13:00-14:00">13:00-14:00</option>
//                   <option value="14:00-15:00">14:00-15:00</option>
//                   <option value="15:00-16:00">15:00-16:00</option>
//                   <option value="16:00-17:00">16:00-17:00</option>
//                   <option value="17:00-18:00">17:00-18:00</option>
//                   <option value="18:00-19:00">18:00-19:00</option>
//                   <option value="19:00-20:00">19:00-20:00</option>
//               </FormControl>
//             </FormGroup>
//
//             <FormGroup controlId="formControlsSelect">
//               <ControlLabel>{ gettext('VEHICLE-TYPE') }</ControlLabel>
//               <select required={true} className="_order_ form-control" name="vehicleType">
//                   <option disabled selected value> -- { gettext('PLACEHOLDER.SELECT-OPTION') } -- </option>
//                   {vehicles}
//               </select>
//             </FormGroup>
//           </Col>
//
//           <Col sm={6}>
//
//             <h2>{ gettext('RECIPIENT') }</h2>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <ControlLabel>
//                 { gettext('FIRST-NAME') }
//               </ControlLabel>
//               <FormControl type="string" required={true} className="_recipient_" name="firstName"/>
//             </FormGroup>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <ControlLabel>
//                 { gettext('LAST-NAME') }
//               </ControlLabel>
//               <FormControl type="string" required={true} className="_recipient_" name="lastName"/>
//             </FormGroup>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <ControlLabel>
//                 { gettext('MOBILE') }
//               </ControlLabel>
//               <FormControl type="string" minLength={7} required={true} className="_recipient_" name="mobile"/>
//             </FormGroup>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <ControlLabel>
//                 { gettext('DELIVERY-POINT-ADDRESS') }
//               </ControlLabel>
//               <InputGroup style = {getCurLang()==='ar'?rowReverseAR:{}}>
//                 <Geosuggest
//                   ref={(it) => {
//                     if (!it || this.geosuggest) {
//                       return;
//                     }
//                     this.geosuggest = it;
//                   }}
//                   style={{
//                     display: 'block',
//                     width: '100%'
//                   }}
//                   onSuggestSelect={this.props.onDeliveryPointSelect}
//                   name="deliveryPoint"
//                   placeholder=""
//                   inputClassName="_recipient_ _order_ form-control"
//                   required={true}
//                   />
//                 <InputGroup.Addon onClick={this.props.showMap} style = {getCurLang()==='ar'?selOnMapAR:{}}>
//                   { gettext('SELECT-ON-MAP') }
//                 </InputGroup.Addon>
//               </InputGroup>
//             </FormGroup>
//
//             <h2>{ gettext('DELIVERY-TIME') }</h2>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <ControlLabel>
//                 { gettext('DELIVERY-TIME') }
//               </ControlLabel>
//               <FormControl
//                 componentClass="select"
//                 className="_order_"
//                 placeholder="select"
//                 onChange={(e) =>  this.setDeliveryTime(e)}>
//                   <option disabled selected value> -- {gettext('SELECT-DELIVERY-TIME')} -- </option>
//                   <option value="08:00-09:00">08:00-09:00</option>
//                   <option value="09:00-10:00">09:00-10:00</option>
//                   <option value="10:00-11:00">10:00-11:00</option>
//                   <option value="11:00-12:00">11:00-12:00</option>
//                   <option value="12:00-13:00">12:00-13:00</option>
//                   <option value="13:00-14:00">13:00-14:00</option>
//                   <option value="14:00-15:00">14:00-15:00</option>
//                   <option value="15:00-16:00">15:00-16:00</option>
//                   <option value="16:00-17:00">16:00-17:00</option>
//                   <option value="17:00-18:00">17:00-18:00</option>
//                   <option value="18:00-19:00">18:00-19:00</option>
//                   <option value="19:00-20:00">19:00-20:00</option>
//                   <option value="20:00-21:00">20:00-21:00</option>
//                   <option value="21:00-22:00">21:00-22:00</option>
//                   <option value="22:00-23:00">22:00-23:00</option>
//               </FormControl>
//             </FormGroup>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <div className="checkbox" style={getCurLang()==='ar'?{marginRight: '2em'}:{marginLeft: '2em'}}>
//                 <label>
//                   <input type="checkbox" name="cashOnDelivery" checked={this.isCashOnDelivery} onChange={this.toggleCashOnDelivery} className="_order_"/>
//                   { gettext('CASH-ON-DELIVERY') }
//                 </label>
//               </div>
//               <FormControl type="number" min="0" placeholder="SAR" className="_order_" disabled={!this.isCashOnDelivery} name="cost"/>
//             </FormGroup>
//
//           </Col>
//
//           {this.props.children}
//
//           <footer className = {getCurLang()==='ar'?'navReverseLinks':''}>
//             <span>
//               <Link to="/dispatcherDashboard">
//                 { gettext('CANCEL') }
//               </Link>
//               <Button bsStyle="success" type="submit" style={getCurLang()==='ar'?{marginRight: "20px"}:{marginLeft: "20px"}}>
//                 { gettext('SUBMIT') }
//               </Button>
//             </span>
//           </footer>
//
//         </Form>
//       </div>
//     );
//   }
//
// }
//
//
// OrderCreationForm.propTypes = {
//   submit: PropTypes.func,
//   onInputChange: PropTypes.func,
//   pickUpPoints: PropTypes.object,
//   itemCount: PropTypes.number,
//   removeItem: PropTypes.func,
//   pickUpTimeValidator: PropTypes.func,
//   deliveryTimeValidator: PropTypes.func,
//   addNewItem: PropTypes.func,
//   onDeliveryPointSelect: PropTypes.func,
//   onDeliveryTimeSelect: PropTypes.func,
//   showMap: PropTypes.func,
//   formattedDeliveryPointAddress: PropTypes.string,
//   vehicles: PropTypes.array.isRequired,
//   setOfSelectedPickUpPoints: PropTypes.instanceOf(Set),
//   onPickUpPointSelected: PropTypes.func
// };
//
// const divHide = {
//   display: 'none'
// };
// const divShow = {
//   display: 'block'
// };
//
// const selectName = 'expectedPickUpTimeWindow';
// const selectNameFalse = 'notExpectedPickUpTimeWindow';
//
// export default class OrderCreationForm extends React.Component {
//   constructor(props, context) {
//     super(props, context);
//     this.formattedDeliveryPointAddress = props.formattedDeliveryPointAddress;
//     this.geosuggest = undefined;
//     this.isCashOnDelivery = false;
//     this.toggleCashOnDelivery = this.toggleCashOnDelivery.bind(this);
//     this.isThreHourPicker = props.fields.pickUpTimeWindow===3;
//     this.togleTimePickerChose = this.togleTimePickerChose.bind(this);
//     this.pickUpTimePickerVal = (props.fields.pickUpTimeWindow===3? null : null)
//     this.deliveryTimePickerVal = "10:00";
//     this.props.onDeliveryTimeSelect(props.fields.pickUpTimeWindow===3? null : null);
//   }
//
//   componentWillReceiveProps(nextProps) {
//     if (nextProps.formattedDeliveryPointAddress !== this.formattedDeliveryPointAddress) {
//       this.formattedDeliveryPointAddress = nextProps.formattedDeliveryPointAddress;
//       if (this.geosuggest) {
//         this.geosuggest.update(this.formattedDeliveryPointAddress);
//         this.forceUpdate();
//       }
//     }
//   }
//
//   toggleCashOnDelivery(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     this.isCashOnDelivery = !this.isCashOnDelivery;
//     setTimeout(() => {
//       this.forceUpdate();
//     }, 0);
//   }
//   togleTimePickerChose(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     this.isThreHourPicker = !this.isThreHourPicker;
//
//     setTimeout(() => {
//       this.forceUpdate();
//     }, 0);
//   }
//
//   setDeliveryTime(e){
//     console.log(this.pickUpTimePickerVal);
//     (this.pickUpTimePickerVal >= ConvertExpPickUpTime(e.target.value))?
//                         (this.props.onDeliveryTimeSelect(this.props.deliveryTimeValidator(e, SetCorrectDeliveryTime(this.pickUpTimePickerVal)))):
//                           this.props.onDeliveryTimeSelect(e.target.value.split('-')[1])
//   }
//
//   setPickUpTimePickerVal(e){
//     this.pickUpTimePickerVal = ConvertExpPickUpTime(e.target.value);
//     this.props.onDeliveryTimeSelect(null);
//     console.log(this.pickUpTimePickerVal);
//   }
//
//
//
//   render() {
//     const pickUpPoints = _.map(Object.keys(this.props.pickUpPoints), (key) => (
//       <option
//         key={`${this.props.pickUpPoints[key].id}`}
//         disabled={this.props.setOfSelectedPickUpPoints.has(this.props.pickUpPoints[key].id)}
//         value={`${this.props.pickUpPoints[key].id}`}>
//         {this.props.pickUpPoints[key].title}
//       </option>
//     ));
//     const vehicles = _.map(this.props.vehicles, (vehicle) => (
//       <option key={`vehicle_${vehicle.type}`} value={vehicle.size}>
//         {vehicle.type}
//       </option>
//     ));
//     let items = [];
//     for (let i = 0, n = this.props.itemCount; i < n; i++) {
//       items.push(
//         <div key={`item${i}`}>
//           <FormGroup controlId="formControlsSelect">
//             <ControlLabel>{ gettext('PICKUP-POINT') }</ControlLabel>
//             <FormControl componentClass="select" className="_item_" name="pickupPointId" placeholder="select" onChange={this.props.onPickUpPointSelected}>
//               {pickUpPoints}
//             </FormControl>
//           </FormGroup>
//           <FormGroup controlId="formHorizontalTextarea">
//             <ControlLabel>
//               { gettext('PACKING-LIST') }
//             </ControlLabel>
//             <FormControl type="textarea" required={true} style={{resize: "vertical"}} componentClass="textarea" className="_item_" name="packingList" />
//           </FormGroup>
//         </div>
//       );
//     }
//
//     return (
//
//       <div className="orderCreationForm container" dir = {getCurLang()==='ar'?'rtl':'ltr'} style={{height: '100%'}}>
//         <PageHeader>{ gettext('NEW-ORDER') }</PageHeader>
//         <Form onSubmit={this.props.submit} className ={getCurLang()==='ar'?'formReverse':''}>
//
//           <Col sm={6}>
//
//             <h2>{ gettext('PACKAGE-DETAILS') }</h2>
//
//             {items}
//
//             <FormGroup controlId="formHorizontalEmail">
//               <Button bsStyle="danger" onClick={this.props.removeItem}>{ gettext('ITEM.REMOVE-ITEM') }</Button>
//               <Button bsStyle="primary" onClick={this.props.addNewItem} style={getCurLang()==='ar'?{marginRight: "20px"}:{marginLeft: "20px"}}>{ gettext('ITEM.ADD-NEW-ITEM') }</Button>
//             </FormGroup>
//
//             <h2>{ gettext('PICKUP-TIME') }</h2>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <ControlLabel>
//                 { gettext('DATE') }
//               </ControlLabel>
//               <DateTimeField
//                 mode="date"
//                 viewMode="days"
//                 inputProps={{
//                   name: "expectedPickUpDate",
//                   className: "_order_ form-control",
//                   required: true
//                 }}
//                 />
//             </FormGroup>
//
//             <FormGroup controlId="formControlsSelect">
//               <ControlLabel>{ gettext('TIME-WINDOW') }</ControlLabel>
//               <FormControl
//                 componentClass="select"
//                 className="_order_"
//                 style={this.isThreHourPicker ? divShow : divHide}
//                 name={this.isThreHourPicker ? selectName : selectNameFalse}
//                 placeholder="select"
//                 onChange={(e) =>  this.setPickUpTimePickerVal(e)}>
//
//                   <option disabled selected value> -- {gettext('SELECT-PICKUP-TIME')} -- </option>
//                   <option value="08:00-11:00">08:00-11:00</option>
//                   <option value="11:00-14:00">11:00-14:00</option>
//                   <option value="14:00-17:00">14:00-17:00</option>
//                   <option value="17:00-20:00">17:00-20:00</option>
//               </FormControl>
//
//               <FormControl
//                 componentClass="select"
//                 className="_order_"
//                 style={!this.isThreHourPicker ? divShow : divHide}
//                 name={!this.isThreHourPicker ? selectName : selectNameFalse}
//                 placeholder="select"
//                 onChange={(e) =>  this.setPickUpTimePickerVal(e)}>
//
//                   <option disabled selected value> -- {gettext('SELECT-PICKUP-TIME')} -- </option>
//                   <option value="08:00-09:00">08:00-09:00</option>
//                   <option value="09:00-10:00">09:00-10:00</option>
//                   <option value="10:00-11:00">10:00-11:00</option>
//                   <option value="11:00-12:00">11:00-12:00</option>
//                   <option value="12:00-13:00">12:00-13:00</option>
//                   <option value="13:00-14:00">13:00-14:00</option>
//                   <option value="14:00-15:00">14:00-15:00</option>
//                   <option value="15:00-16:00">15:00-16:00</option>
//                   <option value="16:00-17:00">16:00-17:00</option>
//                   <option value="17:00-18:00">17:00-18:00</option>
//                   <option value="18:00-19:00">18:00-19:00</option>
//                   <option value="19:00-20:00">19:00-20:00</option>
//               </FormControl>
//             </FormGroup>
//
//             <FormGroup controlId="formControlsSelect">
//               <ControlLabel>{ gettext('VEHICLE-TYPE') }</ControlLabel>
//               <select required={true} className="_order_ form-control" name="vehicleType">
//                   <option disabled selected value> -- { gettext('PLACEHOLDER.SELECT-OPTION') } -- </option>
//                   {vehicles}
//               </select>
//             </FormGroup>
//           </Col>
//
//           <Col sm={6}>
//
//             <h2>{ gettext('RECIPIENT') }</h2>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <ControlLabel>
//                 { gettext('FIRST-NAME') }
//               </ControlLabel>
//               <FormControl type="string" required={true} className="_recipient_" name="firstName"/>
//             </FormGroup>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <ControlLabel>
//                 { gettext('LAST-NAME') }
//               </ControlLabel>
//               <FormControl type="string" required={true} className="_recipient_" name="lastName"/>
//             </FormGroup>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <ControlLabel>
//                 { gettext('MOBILE') }
//               </ControlLabel>
//               <FormControl type="string" minLength={7} required={true} className="_recipient_" name="mobile"/>
//             </FormGroup>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <ControlLabel>
//                 { gettext('DELIVERY-POINT-ADDRESS') }
//               </ControlLabel>
//               <InputGroup style = {getCurLang()==='ar'?rowReverseAR:{}}>
//                 <Geosuggest
//                   ref={(it) => {
//                     if (!it || this.geosuggest) {
//                       return;
//                     }
//                     this.geosuggest = it;
//                   }}
//                   style={{
//                     display: 'block',
//                     width: '100%'
//                   }}
//                   onSuggestSelect={this.props.onDeliveryPointSelect}
//                   name="deliveryPoint"
//                   placeholder=""
//                   inputClassName="_recipient_ _order_ form-control"
//                   required={true}
//                   />
//                 <InputGroup.Addon onClick={this.props.showMap} style = {getCurLang()==='ar'?selOnMapAR:{}}>
//                   { gettext('SELECT-ON-MAP') }
//                 </InputGroup.Addon>
//               </InputGroup>
//             </FormGroup>
//
//             <h2>{ gettext('DELIVERY-TIME') }</h2>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <ControlLabel>
//                 { gettext('DELIVERY-TIME') }
//               </ControlLabel>
//               <FormControl
//                 componentClass="select"
//                 className="_order_"
//                 placeholder="select"
//                 onChange={(e) =>  this.setDeliveryTime(e)}>
//                   <option disabled selected value> -- {gettext('SELECT-DELIVERY-TIME')} -- </option>
//                   <option value="08:00-09:00">08:00-09:00</option>
//                   <option value="09:00-10:00">09:00-10:00</option>
//                   <option value="10:00-11:00">10:00-11:00</option>
//                   <option value="11:00-12:00">11:00-12:00</option>
//                   <option value="12:00-13:00">12:00-13:00</option>
//                   <option value="13:00-14:00">13:00-14:00</option>
//                   <option value="14:00-15:00">14:00-15:00</option>
//                   <option value="15:00-16:00">15:00-16:00</option>
//                   <option value="16:00-17:00">16:00-17:00</option>
//                   <option value="17:00-18:00">17:00-18:00</option>
//                   <option value="18:00-19:00">18:00-19:00</option>
//                   <option value="19:00-20:00">19:00-20:00</option>
//                   <option value="20:00-21:00">20:00-21:00</option>
//                   <option value="21:00-22:00">21:00-22:00</option>
//                   <option value="22:00-23:00">22:00-23:00</option>
//               </FormControl>
//             </FormGroup>
//
//             <FormGroup controlId="formHorizontalEmail">
//               <div className="checkbox" style={getCurLang()==='ar'?{marginRight: '2em'}:{marginLeft: '2em'}}>
//                 <label>
//                   <input type="checkbox" name="cashOnDelivery" checked={this.isCashOnDelivery} onChange={this.toggleCashOnDelivery} className="_order_"/>
//                   { gettext('CASH-ON-DELIVERY') }
//                 </label>
//               </div>
//               <FormControl type="number" min="0" placeholder="SAR" className="_order_" disabled={!this.isCashOnDelivery} name="cashOnDeliveryAmount"/>
//             </FormGroup>
//
//           </Col>
//
//           {this.props.children}
//
//           <footer className = {getCurLang()==='ar'?'navReverseLinks':''}>
//             <span>
//               <Link to="/dispatcherDashboard">
//                 { gettext('CANCEL') }
//               </Link>
//               <Button bsStyle="success" type="submit" style={getCurLang()==='ar'?{marginRight: "20px"}:{marginLeft: "20px"}}>
//                 { gettext('SUBMIT') }
//               </Button>
//             </span>
//           </footer>
//
//         </Form>
//       </div>
//     );
//   }
//
// }
//
//
// OrderCreationForm.propTypes = {
//   submit: PropTypes.func,
//   onInputChange: PropTypes.func,
//   pickUpPoints: PropTypes.object,
//   itemCount: PropTypes.number,
//   removeItem: PropTypes.func,
//   pickUpTimeValidator: PropTypes.func,
//   deliveryTimeValidator: PropTypes.func,
//   addNewItem: PropTypes.func,
//   onDeliveryPointSelect: PropTypes.func,
//   onDeliveryTimeSelect: PropTypes.func,
//   showMap: PropTypes.func,
//   formattedDeliveryPointAddress: PropTypes.string,
//   vehicles: PropTypes.array.isRequired,
//   setOfSelectedPickUpPoints: PropTypes.instanceOf(Set),
//   onPickUpPointSelected: PropTypes.func
// };
