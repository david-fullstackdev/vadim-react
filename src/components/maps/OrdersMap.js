import React, { PropTypes } from 'react';
import { withGoogleMap, GoogleMap, Marker, GoogleMapLoader, InfoWindow, Polygon, Polyline, Circle } from 'react-google-maps';
import { parseExpectedPickUpTime } from '../../businessLogic/expectedPickUpTimeParser.js';
import formatCamelCase from '../../businessLogic/formatCamelCase.js';
import formatId from '../../businessLogic/formatId.js';
import MarkerCategoryModal from './markerCategoryModal.js';
import {
  markerIcons,
  buildMapMarkersList,
  checkIfOrderIsSelectedOnTable,
  showTeam
} from '../../businessLogic/mapMarkers.js';
import './OrdersMap.scss';
import { Carousel, Checkbox, ButtonGroup, Button } from 'react-bootstrap';
import _ from 'lodash';
import { gettext, getStatus } from '../../i18n/service.js';
import getCurLang from '../../businessLogic/getCurLang.js';
import { darkTheme } from '../../constants/mapStyles.js';
import { arrayToDictionary } from '../../utils/array';
const mapStatuses = arrayToDictionary(['new', 'assigned', 'onWayToDelivery', 'waitingForPickup']);

const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={7}
    defaultCenter={props.polygon ? props.polygon[0] : { lat: 24.727318, lng: 46.709809 }}
    defaultZoom={props.defaultZoom}
    onClick={props.onMapClick}
    defaultOptions={{ scrollwheel: false, styles: props.theme }}>
    {props.polygon ?
      <Polygon
        path={props.polygon} /> : ''}
    {
      props.nearestDriversPosition ?
      <Polyline
        path={props.nearestDriversPosition} 
        geodesic={true}
        strokeColor='#FF0000'
        strokeOpacity= {1}
        strokeWeight={2} />: ''
    }
    {
      props.nearestDriversPosition ?
      props.nearestDriversPosition.map((position,index)=>{
        return <Circle
          center={position}
          radius={40}
         options={{
           fillColor: '#f00',
           strokeColor: '#f00',
         }}
       />
      }):''
    }
        <Button className="showCategoryModal" onClick={props.toggleCategoryModal}>
          {"<"}
        </Button>
        <MarkerCategoryModal showModal={props.showModal} changeCategoryState={props.changeCategoryState} showOrderOption={props.showOrderOption}/>
    {props.markers.map((marker, index) => {

      const stringifiedLocation = JSON.stringify(marker.position);
      const ref = `marker_${index}`;
      const popup = props.setOfLocationsToShowPopup.has(stringifiedLocation) ? props.renderInfoWindow(ref, marker) : null;
      return (
        <Marker
          position={marker.position}
          key={index}
          opacity={marker.opacity}
          defaultAnimation={4}
          icon={marker.icon}
          onClick={() => { props.onMarkerClick(stringifiedLocation); }}>
          {popup}
        </Marker>
      );
    })
    }
    {_.map(props.driversLocations, (d) => {
      const driver = _.find(props.users, { id: d.driverId });
      if (!driver || driver.driverStatus !== 'active') {
        return null;
      }
      if((props.driverShowType=="fulltime")&&driver&&(driver.isFullTime!=true)){
        return
      }

      if((props.driverShowType=="freelancer")&&driver&&(driver.isFullTime==true)){
        return
      }
      const ref = `driver_${d.id}`;
      const position = { lat: d.lat, lng: d.lng };
      const popup = props.setOfDriverLocationIdsToShowPopup.has(d.id) ? props.renderDriverInfoWindow(ref, d) : null;
      return (
        <Marker
          key={ref}
          position={position}
          icon={markerIcons.carIcon}
          onClick={() => props.onDriverMarkerClick(d.id, d.driverId)}>
          {popup}
        </Marker>
      );
    })}
    {
      props.nearestDrivers.map((nearestDriver, index) => {
        return (
          <Marker
            key={nearestDriver.id}
            position={nearestDriver.driverGpsLocations.gpsLocation}
            icon={'./title1.png'}
            label={nearestDriver.google.rows[0].elements[0].distance.text+' ,'+nearestDriver.google.rows[0].elements.length+', '+nearestDriver.google.rows[0].elements[0].duration.text}
            />
        );
      })
    })}
  </GoogleMap>
));


export default class OrdersMap extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.renderInfoWindow = this.renderInfoWindow.bind(this);
    this.renderDriverInfoWindow = this.renderDriverInfoWindow.bind(this);
    _.bindAll(this, ['changeMapStyle', 'handleMapMounted']);
  }
  handleMapMounted(map) {
    this._map = map;
  }

  shouldComponentUpdate(nextProps) {
    const props = this.props;
    return props.users !== nextProps.users
      || props.orders !== nextProps.orders
      || props.driversLocations !== nextProps.driversLocations
      || props.selectedOrders !== nextProps.selectedOrders
      || props.allPickUpPoints !== nextProps.allPickUpPoints
      || props.setOfLocationsToShowPopup !== nextProps.setOfLocationsToShowPopup
      || props.setOfDriverLocationIdsToShowPopup !== nextProps.setOfDriverLocationIdsToShowPopup
      || props.company !== nextProps.company
      || props.recipients !== nextProps.recipients
      || props.polygon !== nextProps.polygon
      || props.selectedDriver !== nextProps.selectedDriver
      || props.nearestDrivers !== nextProps.nearestDrivers
      || props.showModal !== nextProps.showModal;
  }
  renderInfoWindow(ref, marker) {
    const renderedPages = _.map(marker.orders, ({ order, markerType, item }, index) => {
      const dispatcher = _.find(this.props.users, { id: order.dispatcherId }) || {};
      const address = marker.address;
      const packingList = (item && item.packingList) ? (
        <span><strong>{item.packingList}</strong><br /></span>
      ) : null;
      const itemCount = order.items ? order.items.length : '0';
      return (
        <Carousel.Item key={`carousel_item_${order.id}_${index}`}>
          <Checkbox
            checked={checkIfOrderIsSelectedOnTable(order, this.props.selectedOrders)}
            onChange={(e) => this.props.handleOrderSelectChange(order, e)}
          >{gettext('ORDER.SELECT-ORDER')}</Checkbox>
          <a href="#" onClick={(e) => this.props.onOrderDetailLinkClick(order, e)}>
            <strong>{formatCamelCase(markerType)}</strong>
            <br />
            {packingList}
            <strong>{gettext('ORDER-#')} {formatId(order.id)}</strong>
            <br />
            <strong>{getStatus(order.orderStatus)}</strong>
            <strong>{` ${itemCount} ${gettext('ITEM.ITEMS')}`}</strong>
            <br />
            {gettext('PICKUP-TIME')}: <strong>{parseExpectedPickUpTime(order.expectedPickUpTime)}</strong>
            <br />
            {gettext('DISPATCHER')}: <strong>{`${dispatcher.firstName}`}</strong>
            <br />
            {address}
          </a>
        </Carousel.Item>
      );
    });
    return (
      <InfoWindow
        key={`${ref}_info_window`}
        onCloseclick={() => this.props.handleMarkerClose(JSON.stringify(marker.position))}
      >
        <Carousel interval={0} direction={null} indicators={true}
          className="mapPopupCarousel">
          {renderedPages}
        </Carousel>
      </InfoWindow>
    );
  }

  showNearestDrivers(e) {
    this.props.getNearestDrivers(e,e)
  }
  renderDriverInfoWindow(ref, driverLocation) {
    const driver = _.find(this.props.users, { id: driverLocation.driverId });
    const driverForWindow = driver ? driver : gettext('CANNOT-GET-DRIVER');
    return (
      <InfoWindow key={`${ref}_driver_info_window`}
        onCloseclick={() => this.props.handleDriverMarkerClose(driverLocation.id)}>
        <div>{driverForWindow.firstName}</div>
      </InfoWindow>
    );
  }

  changeMapStyle(style) {
    localStorage.setItem('map_style', style);
    this.forceUpdate();
    window.location.reload();
  }

  render() {
    const ordersForMap = _.filter(this.props.orders, (order) => mapStatuses[order.orderStatus]);
    const orders = this.selectedDriver
      ? _.filter(ordersForMap, { driverId: this.selectedDriver.id })
      : ordersForMap;
    const driversLocations = this.selectedDriver
      ? _.filter(this.props.driversLocations, { driverId: this.selectedDriver.id })
      : this.props.driversLocations;

    let markers = buildMapMarkersList(
      orders,
      this.props.recipients,
      this.props.allPickUpPoints,
      this.props.selectedOrders
    );


    if (this.props.selectedDriver) {
      var bounds = new window.google.maps.LatLngBounds();
      bounds.extend(new window.google.maps.LatLng(driversLocations[0].lat, driversLocations[0].lng));

      _.forEach(markers, (m) => {
        if (m.position)
          bounds.extend(new window.google.maps.LatLng(m.position.lat, m.position.lng));
      });

      if (this._map) {
        this._map.fitBounds(bounds);
      }
    }
    if (this.props.polygon) {
      showTeam(markers, this.props.polygon, this._map);
    }
    if (_.some(markers, 'isSelected')) {
      let selectedMarkers = _.filter(markers, { 'isSelected': true });
      var bounds = new window.google.maps.LatLngBounds();
      _.forEach(selectedMarkers, (m) => {
        if (m.position)
          bounds.extend(new window.google.maps.LatLng(m.position.lat, m.position.lng));
      });

      if (this._map) {
        this._map.fitBounds(bounds);
      }
    }

    let mapStyle = localStorage.getItem('map_style');
    let theme = {};
    if (mapStyle === 'regular') {
      theme = {};
    } else if (mapStyle === 'dark') {
      theme = darkTheme;
    }
    let nearestDriversPosition=[];
    this.props.nearestDrivers.map((nearestDriver, index) => {
      nearestDriversPosition.push(nearestDriver.driverGpsLocations.gpsLocation)
    })
    return (
      <div>
        <div className="map_style_controls">
          <ButtonGroup bsSize="small">
            <Button bsStyle={!mapStyle || mapStyle === 'regular' ? 'success' : 'default'}
              onClick={() => this.changeMapStyle('regular')}>
              {gettext('REGULAR')}
            </Button>
            <Button bsStyle={mapStyle === 'dark' ? 'success' : 'default'}
              onClick={() => this.changeMapStyle('dark')}>
              {gettext('DARK')}
            </Button>
          </ButtonGroup>
        </div>
        <GettingStartedGoogleMap
          containerElement={
            <div
              dir={getCurLang() === 'ar' ? 'rtl' : 'ltr'}
              className="mapContainer" />
          }
          mapElement={
            <div style={{ height: this.props.fullSize ? '180%' : '100%' }} />
          }
          nearestDriversPosition={nearestDriversPosition}
          nearestDrivers={this.props.nearestDrivers}
          showOrderOption={this.props.showOrderOption}
          changeCategoryState={this.props.changeCategoryState}
          driverShowType={this.props.driverShowType}
          onMapClick={this.props.closeAllInfoWindows}
          driversLocations={driversLocations}
          setOfDriverLocationIdsToShowPopup={this.props.setOfDriverLocationIdsToShowPopup}
          renderDriverInfoWindow={this.renderDriverInfoWindow}
          onDriverMarkerClick={this.props.onDriverMarkerClick}
          users={this.props.users}
          defaultZoom={this.props.defaultZoom}
          theme={theme}
          toggleCategoryModal={this.props.toggleCategoryModal}
          showModal={this.props.showModal}
          onMarkerClick={(e)=>{this.props.onMarkerClick(e);this.showNearestDrivers(e);}}
          setOfLocationsToShowPopup={this.props.setOfLocationsToShowPopup}
          renderInfoWindow={this.renderInfoWindow}
          markers={_.filter(markers, (marker) => {
            return !marker.hide
          })}
          onMapMounted={this.handleMapMounted}
          polygon={this.props.polygon} />
      </div>
    );
  }
}

OrdersMap.propTypes = {
  orders: PropTypes.array,
  defaultZoom: PropTypes.number,
  onMapClick: PropTypes.func,
  allPickUpPoints: PropTypes.object,
  onMarkerClick: PropTypes.func,
  onDriverMarkerClick: PropTypes.func,
  onMarkerRightClick: PropTypes.func,
  handleMarkerClose: PropTypes.func,
  handleDriverMarkerClose: PropTypes.func,
  handleOrderSelectChange: PropTypes.func.isRequired,
  onOrderDetailLinkClick: PropTypes.func,
  groupages: PropTypes.array,
  selectedOrders: PropTypes.array,
  driversLocations: PropTypes.array,
  recipients: PropTypes.array,
  users: PropTypes.array,
  setOfLocationsToShowPopup: PropTypes.instanceOf(Set),
  setOfDriverLocationIdsToShowPopup: PropTypes.instanceOf(Set)
};
