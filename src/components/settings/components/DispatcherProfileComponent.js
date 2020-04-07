import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Jumbotron, Button, Row, PageHeader, FormGroup, FormControl, Col, ControlLabel, InputGroup } from 'react-bootstrap';
import { gettext } from '../../../i18n/service.js';
import DeleteConfirmation from '../../modals/DeletePickupPointModal';
import _ from 'lodash';
import moment from 'moment';
import Geosuggest from 'react-geosuggest';
import { getUserType } from '../../../businessLogic/LoopbackHttp';
import * as Validation from '../../../businessLogic/fieldValidation.js';
import MapModalComponent from '../../../components/MapModalComponent';
import Avatar from './AvatarComponent';

class DispatcherProfileComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.editDispatcher = false;
    this.isShowingMap = false;

    this.newPickupPoint = {};
    this.selectedPickupPoint = {};
    this.pickUpPoints = _(props.pickUpPoints).toArray().value();

    this.editProfile = false;
    _.bindAll(this, ['renderProfile', 'renderEditProfile', 'flipEditBool', 'updateDispatcher', 'validateDispatcherFields',
      'resetState', 'renderPickUpPoints', 'renderEditPickUpPoints', 'renderNewPickupPoint', 'flipEditDispatcher',
      'resetBools', 'cancelNewPoint', 'deletePoint', 'onMapClick', 'showMapEdit', 'hideMapEdit', 'changeAvatar']);

    this.geocoder = new window.google.maps.Geocoder();


    this.state = props.account;
    this.baseState = this.state;
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.createdPickUpPoint !== this.props.createdPickUpPoint) {
      this.pickUpPoints.push(nextProps.createdPickUpPoint);
      this.props.endSpinner();
    }
  }

  changeAvatar(base64) {
    this.setState({ avatar: base64 });
  }

  flipEditBool() {
    this.editProfile = !this.editProfile;
    this.forceUpdate();
  }

  updateDispatcher() {
    if (!this.validateDispatcherFields())
      return false;
    else {
      this.props.changeAvatar(this.props.account.id, 'Dispatcher', this.state.avatar);
      delete this.state['confirmPassword'];
      delete this.state['expressDeliveryCommission'];
      delete this.state['deliveryCommission'];
      delete this.state.avatar;
      this.props.startSpinner();
      this.props.updateDispatcher(this.props.account.id, this.state);
      this.resetBools();
      this.resetState();
    }
  }

  validateDispatcherFields() {
    return Validation.emailValdation(this.state.email, this.props.showMessage)
      && Validation.nameValidation(this.state.firstName, this.props.showMessage)
      && Validation.passValdation(this.state.password, this.state.confirmPassword, this.props.showMessage)
      && Validation.mobileValdation(this.state.mobile, this.props.showMessage)
      && Validation.phoneValdation(this.state.phone, this.props.showMessage)
      && Validation.countryValdation(this.state.countryId, this.props.showMessage)
      && Validation.cityValdation(this.state.cityId, this.props.showMessage)
      && Validation.teamValdation(this.state.teamId, this.props.showMessage);
  }

  cancelNewPoint() {
    this.newPickupPoint = { conpanyId: this.props.company.id };
    this.forceUpdate();
  }

  deletePoint(point) {
    _.pull(this.pickUpPoints, point);
    this.forceUpdate();
  }

  resetState() {
    this.setState(this.baseState);
  }

  flipEditDispatcher() {
    this.editDispatcher = !this.editDispatcher;
    this.forceUpdate();
  }

  resetBools() {
    this.editDispatcher = false;
  }

  onMapClick({ latLng }) {
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng()
    };

    this.geocoder.geocode({ location: location }, (results) => {
      if (this.newPickupPoint.toCreate) {
        this.newPickupPoint.gpsLocation = location;
        this.newPickupPoint.address = results[0].formatted_address;
      }

      if (this.selectedPickupPoint.id) {
        this.selectedPickupPoint.gpsLocation = location;
        this.selectedPickupPoint.address = results[0].formatted_address;
      }
      this.hideMapEdit();
    });
  }

  showMapEdit() {
    this.isShowingMap = true;
    this.forceUpdate();
  }

  hideMapEdit() {
    this.isShowingMap = false;
    this.forceUpdate();
  }

  renderProfile() {
    return (
      <Jumbotron className="position_relative">

        <div className="text_align_center margin_bottom_em">
          <h3>{gettext('USER-INFO')}</h3>
        </div>
        <Row className="center_flex">
          <Avatar avatar={this.state.avatar} changeAvatar={this.changeAvatar} />
        </Row>
        <Row>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('EMAIL')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.account.email}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.account.firstName}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('SHOP-NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.account.shopName}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('MOBILE')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.account.mobile}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('PHONE-NUMBER')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.account.phone}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('COUNTRY')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.getCountryByCityId(this.props.account.countryId)}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('CITY')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.getCityById(this.props.account.cityId)}</h4></label>
              </Col>
            </Row>
          </div>
          <div className="botom_line" />
          <div className="text_align_center margin_bottom_em">
            <h3>{gettext('COST-INFO')}</h3>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('DELIVERY-COST')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.account.deliveryCommission}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('EXPRESS-DELIVERY-COST')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.props.account.expressDeliveryCommission}</h4></label>
              </Col>
            </Row>
          </div>

          <div className="botom_line" />
          {this.renderPickUpPoints()}
        </Row>
        <div className="edit_link">
          <a onClick={() => this.flipEditDispatcher()}><h4>{gettext('EDIT')}</h4></a>
        </div>
      </Jumbotron>
    )
  }

  renderEditProfile() {
    if (!this.state.countryId && this.props.countries.length === 1)
      this.setState({ countryId: this.props.countries[0].id })
    return (
      <Jumbotron className="position_relative">

        <div className="text_align_center margin_bottom_em">
          <h2>{gettext('EDIT-DISPATCHER')}</h2>
        </div>
        <Row className="center_flex">
          <Avatar avatar={this.state.avatar} changeAvatar={this.changeAvatar} edit={true} />
        </Row>
        <div className="text_align_center margin_bottom_em">
          <h4>{gettext('USER-INFO')}</h4>
        </div>
        <Row>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('EMAIL')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.props.account.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                  placeholder={gettext('EMAIL')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('PASSWORD')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="password"
                  required={true}
                  onChange={(e) => this.setState({ password: e.target.value })}
                  placeholder={gettext('PASSWORD')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('CONFIRM-PASSWORD')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="password"
                  required={true}
                  onChange={(e) => this.setState({ confirmPassword: e.target.value })}
                  placeholder={gettext('CONFIRM-PASSWORD')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.props.account.firstName}
                  onChange={(e) => this.setState({ firstName: e.target.value })}
                  placeholder={gettext('NAME')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('SHOP-NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.props.account.shopName}
                  onChange={(e) => this.setState({ shopName: e.target.value })}
                  placeholder={gettext('SHOP-NAME')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('MOBILE')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.props.account.mobile}
                  onChange={(e) => this.setState({ mobile: e.target.value })}
                  placeholder={gettext('MOBILE')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('PHONE-NUMBER')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  defaultValue={this.props.account.phone}
                  onChange={(e) => this.setState({ phone: e.target.value })}
                  placeholder={gettext('PHONE-NUMBER')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('COUNTRY')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  componentClass="select"
                  className="_order_"
                  placeholder="select"
                  onChange={(e) => this.setState({ countryId: e.target.value })}
                  name="country">
                  {this.props.getCountries(this.props.account.countryId)}
                </FormControl>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('CITY')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  componentClass="select"
                  className="_order_"
                  placeholder="select"
                  onChange={(e) => this.setState({ cityId: e.target.value })}
                  name="city">
                  {this.props.getCities(this.state.countryId, this.props.account.cityId)}
                </FormControl>
              </Col>
            </Row>
          </div>
          <div className="botom_line" />
          <div className="text_align_center margin_bottom_em">
            <h4>{gettext('COST-INFO')}</h4>
          </div>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('DELIVERY-COST')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  disabled
                  defaultValue={this.props.account.deliveryCommission}
                  onChange={(e) => this.setState({ deliveryCommission: e.target.value })}
                  placeholder={gettext('DELIVERY-COST')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('EXPRESS-DELIVERY-COST')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="text"
                  required={true}
                  disabled
                  defaultValue={this.props.account.expressDeliveryCommission}
                  onChange={(e) => this.setState({ expressDeliveryCommission: e.target.value })}
                  placeholder={gettext('EXPRESS-DELIVERY-COST')} />
              </Col>
            </Row>
          </div>

          <div className="botom_line" />
          <div className="text_align_center margin_bottom_em">
            <h3>{gettext('PICK-UP-POINTS')}</h3>
          </div>
          {this.renderEditPickUpPoints()}
        </Row>
        <div className="actions">
          <Button bsStyle="primary" onClick={() => this.updateDispatcher()}>{gettext('SAVE')}</Button>
          <Button bsStyle="danger" onClick={() => { this.resetState(); this.flipEditDispatcher(); }}>{gettext('CANCEL')}</Button>
        </div>
      </Jumbotron>
    )
  }

  renderPickUpPoints() {
    return (
      <div>
        <div className="text_align_center margin_bottom_em">
          <h3>{gettext('PICK-UP-POINTS')}</h3>
        </div>
        {_.map(this.pickUpPoints, (point, i) => {
          return (
            <div className="user_data center_div">
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('TITLE')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{point.title}</h4></label>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('CONTACT-NAME')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{point.contactName}</h4></label>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('PHONE')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{point.phone}</h4></label>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('ADDRESS')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{point.address}</h4></label>
                </Col>
              </Row>
              {
                i !== (this.pickUpPoints.length - 1) ?
                  <div className="botom_line" /> : ''
              }
            </div>
          )
        })
        }
      </div>
    );
  }

  renderEditPickUpPoints() {
    return (
      <div>
        {_.map(this.pickUpPoints, (point, i) => {
          return (
            <div className="user_data center_div" key={point.id}>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('TITLE')}</h4></ControlLabel>
                </Col>
                <Col sm={8}>
                  <FormControl
                    type="text"
                    required={true}
                    defaultValue={point.title}
                    disabled={this.selectedPickupPoint.id !== point.id}
                    className="geosuggest pickup_title"
                    onChange={(e) => this.selectedPickupPoint.title = e.target.value}
                    placeholder={gettext('TITLE')} />
                  <div style={{ display: 'inline' }}>
                    <Button
                      bsStyle="primary edit_btn"
                      onClick={() => {
                        this.selectedPickupPoint = point;
                        this.forceUpdate();
                      }} />
                  </div>
                  <DeleteConfirmation
                    ppoint={point}
                    deletePickUpPoint={this.props.deletePickUpPoint}
                    deleteLocalPickUpPoint={this.props.deleteLocalPickUpPoint}
                    deletePoint={this.deletePoint} />
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('CONTACT-NAME')}</h4></ControlLabel>
                </Col>
                <Col sm={8}>
                  <FormControl
                    type="text"
                    required={true}
                    defaultValue={point.contactName}
                    disabled={this.selectedPickupPoint.id !== point.id}
                    onChange={(e) => this.selectedPickupPoint.contactName = e.target.value}
                    placeholder={gettext('CONTACT-NAME')} />
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('PHONE')}</h4></ControlLabel>
                </Col>
                <Col sm={8}>
                  <FormControl
                    type="text"
                    required={true}
                    defaultValue={point.phone}
                    disabled={this.selectedPickupPoint.id !== point.id}
                    onChange={(e) => this.selectedPickupPoint.phone = e.target.value}
                    placeholder={gettext('PHONE')} />
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('ADDRESS')}</h4></ControlLabel>
                </Col>
                <Col sm={8}>
                  <InputGroup>
                    <Geosuggest
                      required={true}
                      name="defaultPickUpPoint"
                      placeholder={gettext('ADDRESS')}
                      inputClassName="_recipient_ _order_ form-control"
                      initialValue={point.address}
                      disabled={this.selectedPickupPoint.id !== point.id}
                      onSuggestSelect={(opts) => {
                        this.selectedPickupPoint.gpsLocation = opts.location;
                        this.selectedPickupPoint.address = opts.label;
                      }} />

                    <InputGroup.Addon onKeyDown={(e) => props.onKeyDown(e)}
                      disabled={this.selectedPickupPoint.id !== point.id}
                      onClick={() => this.showMapEdit()}>
                      {gettext('SELECT-ON-MAP')}
                    </InputGroup.Addon>
                  </InputGroup>
                </Col>
              </Row>
              {
                this.selectedPickupPoint.id === point.id ?
                  <Row>
                    <Col sm={12} className="right_content">
                      <Button className="margin_left_right"
                        bsStyle="primary"
                        onClick={() => {
                          if (!Validation.pickupPointValidation(this.selectedPickupPoint, this.props.showMessage))
                            return false;
                          else {
                            this.props.startSpinner();
                            this.props.updatePickUpPoint(this.selectedPickupPoint);
                            this.selectedPickupPoint = {};
                            this.forceUpdate();
                          }
                        }}>
                        {gettext('UPDATE')}
                      </Button>
                      <Button className="margin_left_right"
                        bsStyle="default"
                        onClick={() => {
                          this.selectedPickupPoint = {};
                          this.forceUpdate();
                        }}>
                        {gettext('CANCEL')}
                      </Button>
                    </Col>
                  </Row> : ''
              }
              <div className="botom_line" />
            </div>
          )
        })
        }
        {
          this.newPickupPoint.toCreate ?
            this.renderNewPickupPoint() : ''
        }

        {
          this.newPickupPoint.toCreate ?
            <div className="user_data center_div">
              <Row>
                <Col sm={12} className="right_content">
                  <Button className="margin_left_right"
                    bsStyle="primary"
                    onClick={() => {
                      if (!Validation.pickupPointValidation(this.newPickupPoint, this.props.showMessage))
                        return false;
                      {
                        this.props.startSpinner();
                        this.newPickupPoint.dispatcherId = this.props.account.id;
                        this.newPickupPoint.companyId = this.props.company.id;
                        this.props.createDefaultPickUpPoint(this.newPickupPoint);
                        this.cancelNewPoint();
                      }
                    }}>
                    {gettext('CREATE')}
                  </Button>
                  <Button className="margin_left_right"
                    bsStyle="default"
                    onClick={() => this.cancelNewPoint()}>
                    {gettext('CANCEL')}
                  </Button>
                  <div className="botom_line" />
                </Col>
              </Row>
            </div>
            : ''
        }
        {
          !this.newPickupPoint.toCreate ?
            <div className="user_data center_div">
              <Row>
                <Col sm={12} className="right_content">
                  <Button onClick={() => { this.newPickupPoint.toCreate = true; this.forceUpdate(); }}>+</Button>
                </Col>
              </Row>
            </div> : ''
        }
      </div>
    );
  }

  renderNewPickupPoint() {
    this.newPickupPoint.toCreate = true;
    this.newPickupPoint.companyId = this.props.company.id;
    return (
      <div className="user_data center_div">
        <Row>
          <Col sm={4}>
            <ControlLabel><h4>{gettext('TITLE')}</h4></ControlLabel>
          </Col>
          <Col sm={8}>
            <FormControl
              type="text"
              required={true}
              onChange={(e) => this.newPickupPoint.title = e.target.value}
              placeholder={gettext('TITLE')} />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <ControlLabel><h4>{gettext('CONTACT-NAME')}</h4></ControlLabel>
          </Col>
          <Col sm={8}>
            <FormControl
              type="text"
              required={true}
              onChange={(e) => this.newPickupPoint.contactName = e.target.value}
              placeholder={gettext('CONTACT-NAME')} />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <ControlLabel><h4>{gettext('PHONE')}</h4></ControlLabel>
          </Col>
          <Col sm={8}>
            <FormControl
              type="text"
              required={true}
              onChange={(e) => this.newPickupPoint.phone = e.target.value}
              placeholder={gettext('PHONE')} />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <ControlLabel><h4>{gettext('ADDRESS')}</h4></ControlLabel>
          </Col>
          <Col sm={8}>
            <InputGroup>
              <Geosuggest
                required={true}
                name="defaultPickUpPoint"
                placeholder={gettext('ADDRESS')}
                inputClassName="_recipient_ _order_ form-control"
                initialValue={this.newPickupPoint.address}
                onSuggestSelect={(opts) => {
                  this.newPickupPoint.gpsLocation = opts.location;
                  this.newPickupPoint.address = opts.label;
                }
                } />
              <InputGroup.Addon onKeyDown={(e) => props.onKeyDown(e)}
                onClick={() => this.showMapEdit()}>
                {gettext('SELECT-ON-MAP')}
              </InputGroup.Addon>
            </InputGroup>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const maps = this.isShowingMap ?
      (
        <MapModalComponent
          onMapClick={this.onMapClick}
          onClickOutsideOfMap={this.hideMapEdit}
          onCancel={this.hideMapEdit}
          hideMapEdit={this.hideMapEdit}
        />
      )
      : '';
    return (
      <div className="dispatcher_profile">
        {!this.editDispatcher ? this.renderProfile() : this.renderEditProfile()}
        {maps}
      </div>
    );
  }
}




DispatcherProfileComponent.propTypes = {

};

function mapStateToProps(state) {
  return {
    createdPickUpPoint: state.appReducer.createdPickUpPoint
  };
}

export default connect(
  mapStateToProps
)(DispatcherProfileComponent);
