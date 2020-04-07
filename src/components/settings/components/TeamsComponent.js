import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import { Jumbotron, Button, Row, PageHeader,FormGroup, FormControl, Col, ControlLabel, InputGroup } from 'react-bootstrap';
import {Table, Tr, Td, Th, Thead} from 'reactable';
import { gettext } from '../../../i18n/service.js';
import DeleteConfirmation from '../../modals/DeletePickupPointModal';
import _ from 'lodash';
import formatCamelCase from '../../../businessLogic/formatCamelCase.js';
import * as Validation from '../../../businessLogic/fieldValidation.js';
import isEmpty from '../../../businessLogic/isObjectEmpty.js';
import ScrollableAnchor, { configureAnchors, goToAnchor } from 'react-scrollable-anchor'
import Geosuggest from 'react-geosuggest';
import MapModalComponent from '../../../components/MapModalComponent';
import { Scrollbars } from 'react-custom-scrollbars';
import Switcher from 'react-switcher';
import CitiesComponent from './CitiesComponent';


class TeamsComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.selectedTeam = undefined;
    this.selectedUserForAssign = undefined;
    this.selectedUserForUnAssign = undefined;
    this.isShowingMap = false;
    this.isShowingPolygonMap = false;

    this.newPickupPoint = {};
    this.selectedPickupPoint = {};
    this.pickUpPoints = [];

    this.createTeam = false;
    this.editTeam = false;
    this.selectedCountry = undefined;

    this.teamFilters = {
      members: undefined,
      notMembers: undefined
    };

    this.geocoder = new window.google.maps.Geocoder();

    _.bindAll(this, ['getSelectedTeam', 'flipEditTeam', 'renderTeamEditForm', 'renderTeamLists', 'flipCreateTeam', 'deleteTeam', 'resetBools',
                      'resetState', 'updateTeam', 'validateTeamFields', 'createNewTeam', 'renderPickUpPoints', 'renderEditPickUpPoints',
                      'addToTeam', 'getUserForAssign', 'getUserForUnAssign', 'getTeamLength', 'onMapClick', 'showMapEdit',
                      'hideMapEdit', 'renderNewPickupPoint', 'cancelNewPoint', 'deletePoint', 'renderActivateButtons', 'renderEnableHub', 'activateDeactivateAutoassign',
                      'hidePolygonMapEdit', 'showPolygonMapEdit', 'removePolygon', 'setPolygon', 'setCity', 'enableHub']);

    this.state = {
      name: undefined,
      countryId: undefined,
      cityId: undefined,
      filterValue: undefined,
      polygon: undefined,
      default: true,
      hubGeoPoint: {lat: undefined, lng:undefined},
      hubRadius: undefined
    };

    this.baseState = this.state;
  }

  componentWillReceiveProps(nextProps, nextState) {
    if(nextProps.createdPickUpPoint !== this.props.createdPickUpPoint) {
      this.pickUpPoints.push(nextProps.createdPickUpPoint);
      this.props.endSpinner();
    }

    if(nextProps.teamCreated !== this.props.teamCreated && !_.some(this.props.teams, { id: nextProps.teamCreated.id })) {
      this.props.addNewTeamToStore(nextProps.teamCreated);
    }
  }

  setPolygon(polygon) {
    this.setState({polygon: polygon})
  }

  renderActivateButtons() {
    return (
      <div className="switcher">
        <Switcher
          on={this.selectedTeam.autoAssign}
          onClick={() => this.activateDeactivateAutoassign()}>
        </Switcher>
      </div>
    )
  }
  renderEnableHub(){
    return (
      <div className="switcher">
        <Switcher
          on={this.selectedTeam.hubStatus}
          onClick={() => this.enableHub()}>
        </Switcher>
      </div>
    )
  }

  activateDeactivateAutoassign() {
    this.props.startSpinner();
    this.props.updateTeam(this.selectedTeam.id, {autoAssign: !this.selectedTeam.autoAssign});
  }
  enableHub() {

  }
  deletePoint(point) {
    _.pull(this.pickUpPoints, point);
    this.forceUpdate();
  }

  onMapClick({latLng}) {
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng()
    };

    this.geocoder.geocode({location: location}, (results) => {
      if(this.newPickupPoint.toCreate) {
        this.newPickupPoint.gpsLocation = location;
        this.newPickupPoint.address = results[0].formatted_address;
      }

      if(this.selectedPickupPoint.id) {
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

  showPolygonMapEdit() {
    this.isShowingPolygonMap = true;
    this.forceUpdate();
  }

  hideMapEdit() {
    this.isShowingMap = false;
    this.forceUpdate();
  }

  hidePolygonMapEdit() {
    this.isShowingPolygonMap = false;
    this.forceUpdate();
  }

  cancelNewPoint() {
    this.newPickupPoint = {};
    this.forceUpdate();
  }

  getSelectedTeam(id) {
    this.resetBools();
    this.selectedTeam = _.find(this.props.teams, { 'id': id });
    this.props.fetchCityForInfo(this.selectedTeam.cityId);
    this.setState({default:this.selectedTeam.default})
    this.pickUpPoints = _(this.props.pickUpPoints).toArray().filter({teamId: id}).value();
    this.setState(this.selectedTeam);
  }

  removePolygon() {
    let newState = this.state;
    delete newState.polygon;
    this.setState(newState);
  }

  setCity(city) {
    this.setState({cityId: city.id})
  }

  getUserForAssign(id) {
    this.selectedUserForAssign = _.find(this.props.users, { 'id': id });
    this.setState({});
  }

  getUserForUnAssign(id) {
    this.selectedUserForUnAssign = _.find(this.props.users, { 'id': id });
    this.setState({});
  }

  getTeamLength() {
    let userCount = 0;

    _.map(this.props.users, (user) => {
      if(user.teamId === this.selectedTeam.id)
        userCount++;
    });

    return userCount;
  }

  flipCreateTeam() {
    this.createTeam = !this.createTeam;
    this.resetState();
  }

  flipEditTeam() {
    this.resetBools();
    this.editTeam = !this.editTeam;
    this.forceUpdate();
  }

  addToTeam() {
    this.props.startSpinner();
    this.props.addToTeam(this.selectedTeam.id, this.selectedUserForAssign.role, this.selectedUserForAssign.id);
  }

  removeFromTeam() {
    this.props.startSpinner();
    this.props.removeFromTeam(this.selectedTeam.id, this.selectedUserForUnAssign.role, this.selectedUserForUnAssign.id);
  }

  createNewTeam() {
    if(!this.validateTeamFields())
      return false;
    else {
      delete this.state.filterValue;
      this.props.startSpinner();
      this.props.createTeam(this.props.company.id, this.state);
      this.resetBools();
      this.resetState();
    }
  }

  updateTeam() {
    if(!this.validateTeamFields())
      return false;
    else {
      delete this.state.filterValue;
      this.props.startSpinner();
      this.props.updateTeam(this.selectedTeam.id, this.state);
      let teamId = this.state.id;
      this.props.fetchCityForInfo(this.state.cityId);
      this.resetBools();
      this.resetState();
      // this.getSelectedTeam(teamId);
    }
  }

  deleteTeam() {
    if(this.getTeamLength() > 0)
      return this.props.showMessage({
        message: gettext('TEAM-HAVE-USERS'),
        level: 'error'
      });
    this.props.startSpinner();
    this.props.deleteTeam(this.selectedTeam.id);
    this.resetBools();
    this.resetState();
  }

  validateTeamFields() {
    return Validation.nameValidation(this.state.name, this.props.showMessage)
            && Validation.countryValdation(this.state.countryId, this.props.showMessage)
            && Validation.cityValdation(this.state.cityId, this.props.showMessage);
  }

  resetState() {
    this.selectedTeam = undefined;
    for ( var prop in this.state ) {
      delete this.state[prop];
    }
    this.setState(this.baseState);
  }

  resetBools() {
    this.createTeam = false;
    this.editTeam = false;
  }

  renderTeamForm() {
    return (
      <div className="dispatcher_profile">
        <ScrollableAnchor id={'teams_anchor'}>
          <div />
        </ScrollableAnchor>
        <Jumbotron className="position_relative">
          <div className="text_align_center margin_bottom_em">
            <h3>{gettext('TEAM-INFO')}</h3>
          </div>
          <Row>
            <div className="user_data center_div">
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('NAME')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{this.selectedTeam.name}</h4></label>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('COUNTRY')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{this.props.getCountryByCityId(this.selectedTeam.countryId)}</h4></label>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('CITY')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{this.props.getCityById(this.props.cityForInfo)}</h4></label>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('AUTO-ASSIGN')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  {this.renderActivateButtons()}
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('HUB-ENABLE')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  {this.renderEnableHub()}
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('HUB-RADIUS')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{this.selectedTeam.hubRadius}</h4></label>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('HUBGEOPOINT-LAT')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{this.selectedTeam.hubGeoPoint.lat}</h4></label>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('HUBGEOPOINT-LNG')}</h4></ControlLabel>
                </Col>
                <Col sm={6}>
                  <label><h4>{this.selectedTeam.hubGeoPoint.lng}</h4></label>
                </Col>
              </Row>
            </div>
            <div className="botom_line" />
            {this.renderTeamLists()}
            <div className="botom_line" />
            { this.renderPickUpPoints()}
          </Row>
          <div className="edit_link">
            <a onClick={() => this.flipEditTeam()}><h4>{gettext('EDIT')}</h4></a>
          </div>
        </Jumbotron>
      </div>
    );
  }

  renderTeamEditForm() {
    return (
      <div className="dispatcher_profile">
        <ScrollableAnchor id={'teams_anchor'}>
          <div />
        </ScrollableAnchor>
        <Jumbotron className="position_relative">
          <div className="text_align_center margin_bottom_em">
            <h3>{gettext('EDIT-TEAM')}</h3>
          </div>
          <Row>
            <div className="user_data center_div">
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('NAME')}</h4></ControlLabel>
                </Col>
                <Col sm={8}>
                  <FormControl
                     type="text"
                     required={true}
                     defaultValue={this.selectedTeam.name}
                     onChange={(e) => this.setState({name: e.target.value})}
                     placeholder={gettext('NAME')}/>
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
                    onChange={(e) => {
                      this.setState({countryId: e.target.value});
                      this.props.getCitiesByText('', e.target.value);
                    }}
                    value={this.state.countryId}
                    name="country">
                      { this.props.getCountries(this.selectedTeam.countryId) }
                  </FormControl>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('CITY')}</h4></ControlLabel>
                </Col>
                <Col sm={8}>
                  <CitiesComponent
                    cities={this.props.cities}
                    getCitiesByText={this.props.getCitiesByText}
                    countryId={this.state.countryId}
                    getCityById={this.props.getCityById}
                    onSelect={this.setCity}
                    currentCity={this.props.cityForInfo}/>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('ZONE')}</h4></ControlLabel>
                </Col>
                <Col sm={8}>
                  <Button onClick={() => {this.showPolygonMapEdit()}}>{gettext('SELECT-TEAM-ZONE')}</Button>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('DEFAULTTEAM')}</h4></ControlLabel>
                </Col>
                <Col sm={8} className="setAsDefault">
                  <input type="checkbox"
                    checked={this.state.default}
                    onChange={() => {console.log('change');this.setState({default: !this.state.default})}}/>
                  {gettext('SET-TEAM-AS-DEFAULT')}
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('HUB-RADIUS')}</h4></ControlLabel>
                </Col>
                <Col sm={8}>
                  <FormControl
                     type="text"
                     required={true}
                     defaultValue={this.selectedTeam.hubRadius}
                     onChange={(e) => this.setState({hubRadius: e.target.value})}
                     placeholder={gettext('HUB-RADIUS')}/>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('HUBGEOPOINT-LAT')}</h4></ControlLabel>
                </Col>
                <Col sm={8}>
                  <FormControl
                     type="text"
                     required={true}
                     defaultValue={this.selectedTeam.hubGeoPoint.lat}
                     onChange={(e) => this.setState({hubGeoPoint: {lat: e.target.value, lng: this.state.hubGeoPoint.lng}})}
                     placeholder={gettext('HUBGEOPOINT-LAT')}/>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('HUBGEOPOINT-LNG')}</h4></ControlLabel>
                </Col>
                <Col sm={8}>
                  <FormControl
                     type="text"
                     required={true}
                     defaultValue={this.selectedTeam.hubGeoPoint.lng}
                     onChange={(e) => this.setState({hubGeoPoint: {lat: this.state.hubGeoPoint.lat, lng: e.target.value}})}
                     placeholder={gettext('HUBGEOPOINT-LNG')}/>
                </Col>
              </Row>
            </div>
            <div className="botom_line" />
            {this.renderTeamLists()}
            <div className="botom_line" />
            <div className="text_align_center margin_bottom_em">
              <h3>{gettext('PICK-UP-POINTS')}</h3>
            </div>
            {this.renderEditPickUpPoints()}
          </Row>
        </Jumbotron>
      </div>
    );
  }

  renderTeamCreateForm() {
    return (
      <div className="dispatcher_profile">
        <ScrollableAnchor id={'teams_anchor'}>
          <div />
        </ScrollableAnchor>
        <Jumbotron className="position_relative">
          <div className="text_align_center margin_bottom_em">
            <h3>{gettext('NEW-TEAM')}</h3>
          </div>
          <Row>
            <div className="user_data center_div">
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('NAME')}</h4></ControlLabel>
                </Col>
                <Col sm={8}>
                  <FormControl
                     type="text"
                     required={true}
                     onChange={(e) => this.setState({name: e.target.value})}
                     placeholder={gettext('NAME')}/>
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
                    onChange={(e) => {
                      this.setState({countryId: e.target.value});
                      this.props.getCitiesByText('', e.target.value);
                    }}
                    name="country">
                      <option disabled selected value={undefined}>{gettext('SELECT-COUNTRY')}</option>
                      { this.props.getCountries() }
                  </FormControl>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('CITY')}</h4></ControlLabel>
                </Col>
                <Col sm={8}>
                  <CitiesComponent
                    cities={this.props.cities}
                    getCitiesByText={this.props.getCitiesByText}
                    countryId={this.state.countryId}
                    getCityById={this.props.getCityById}
                    onSelect={this.setCity}/>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('ZONE')}</h4></ControlLabel>
                </Col>
                <Col sm={8}>
                  <Button onClick={() => {this.showPolygonMapEdit()}}>{gettext('SELECT-TEAM-ZONE')}</Button>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('DEFAULTTEAM')}</h4></ControlLabel>
                </Col>
                <Col sm={8} className="setAsDefault">
                  <input type="checkbox"
                    checked={this.state.default}
                    onChange={() => this.setState({default: !this.state.default})}/>
                  {gettext('SET-TEAM-AS-DEFAULT')}
                </Col>

              </Row>
            </div>
          </Row>
          <div className="actions">
            <Button bsStyle="primary" onClick={() => this.createNewTeam()}>{gettext('SAVE')}</Button>
            <Button bsStyle="danger" onClick={() => {this.resetState(); this.flipEditTeam();}}>{gettext('CANCEL')}</Button>
          </div>
        </Jumbotron>
      </div>
    );
  }

  renderTeamLists() {
    let teamUsers = _.filter(this.props.users, (user) => {
      return user.teamId === this.selectedTeam.id;
    });

    const usersInTeam = _.map(teamUsers, (user) => {
        if(this.teamFilters.members) {
          if( user.firstName && (user.firstName.toUpperCase().indexOf(this.teamFilters.members.toUpperCase()) != -1
          || user.role.toUpperCase().indexOf(this.teamFilters.members.toUpperCase()) != -1 ))
            return <option value={user.id}>{formatCamelCase(user.role)} {user.firstName}</option>
        }
        else return (
          <option value={user.id}>{formatCamelCase(user.role)} {user.firstName}</option>
        );
    });

    let usersToAdd = _.uniqBy(this.props.users, 'id');
    usersToAdd = _.map(usersToAdd, (user) => {
      if(user.teamId !== this.selectedTeam.id) {
        let isUserInTeam = _.find(teamUsers, {id: user.id});
        if(this.teamFilters.notMembers) {
          if( user.firstName && (user.firstName.toUpperCase().indexOf(this.teamFilters.notMembers.toUpperCase()) != -1
          || user.role.toUpperCase().indexOf(this.teamFilters.notMembers.toUpperCase()) != -1 ))
            return <option disabled={isUserInTeam} value={user.id}>{formatCamelCase(user.role)} {user.firstName}</option>
        }
        else return (
            <option disabled={isUserInTeam} value={user.id}>{formatCamelCase(user.role)} {user.firstName}</option>
          );
      }
    });



    return (
      <div className="user_data center_div">
        <Row>
          <Col sm={5}>
            <ControlLabel><h4>{gettext('TEAM-MEMBERS')}: {usersInTeam.length}</h4></ControlLabel>
            <FormControl
               type="text"
               placeholder={gettext('SEARCH')}
               onChange={(e) => {
                 this.teamFilters.members = e.target.value;
                 this.forceUpdate();
               }}/>
            <div className="team_user_select">
              <FormGroup controlId="formControlsSelectMultiple">
                <FormControl disabled={!this.editTeam} componentClass="select" multiple
                  onChange={(e) => this.getUserForUnAssign(e.target.value)}>
                  {usersInTeam}
                </FormControl>
              </FormGroup>
            </div>
          </Col>
          <Col sm={2}>
          { this.editTeam?
            <div className="teamlist_controls">
              <div className="teamlist_button_container">
                <Button bsStyle="primary"
                  onClick={() => this.removeFromTeam()}></Button>
              </div>
              <div className="teamlist_button_container">
                <Button bsStyle="primary"
                  onClick={() => this.addToTeam()}></Button>
              </div>
            </div> : ''
          }
          </Col>
          <Col sm={5}>
            <ControlLabel><h4>{gettext('ALL-USERS')}</h4></ControlLabel>
            <FormControl
               type="text"
               placeholder={gettext('SEARCH')}
               onChange={(e) => {
                 this.teamFilters.notMembers = e.target.value;
                 this.forceUpdate();
               }}/>
            <div className="team_user_select">
              <FormGroup controlId="formControlsSelectMultiple">
                <FormControl disabled={!this.editTeam} componentClass="select" multiple
                  onChange={(e) => this.getUserForAssign(e.target.value)}>
                  {usersToAdd}
                </FormControl>
              </FormGroup>
            </div>
          </Col>
        </Row>
        { this.editTeam?
          <div className="actions">
            <Button bsStyle="primary" onClick={() => this.updateTeam()}>{gettext('SAVE')}</Button>
            <Button bsStyle="danger" onClick={() => {this.resetState(); this.flipEditTeam();}}>{gettext('CANCEL')}</Button>
          </div> : ''
        }
      </div>
    );
  }

  renderPickUpPoints() {
    return (
      <div>
        <div className="text_align_center margin_bottom_em">
          <h3>{gettext('PICK-UP-POINTS')}</h3>
        </div>
        { _.map(this.pickUpPoints, (point, i) => {
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
                  i !== (this.pickUpPoints.length-1) ?
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
        { _.map(this.pickUpPoints, (point, i) => {
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
                     className="geosuggest pickup_title"
                     disabled={this.selectedPickupPoint.id !== point.id}
                     onChange={(e) => this.selectedPickupPoint.title = e.target.value}
                     placeholder={gettext('TITLE')}/>
                  <div style={{display: 'inline'}}>
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
                    deletePoint={this.deletePoint}/>
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
                     placeholder={gettext('CONTACT-NAME')}/>
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
                     placeholder={gettext('PHONE')}/>
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
                      }}/>

                      <InputGroup.Addon onKeyDown={(e) => props.onKeyDown(e)}
                        disabled={this.selectedPickupPoint.id !== point.id}
                        onClick={() => this.showMapEdit()}>
                        { gettext('SELECT-ON-MAP') }
                      </InputGroup.Addon>
                    </InputGroup>
                </Col>
              </Row>
              {
                this.selectedPickupPoint.id === point.id?
                    <Row>
                      <Col sm={12} className="right_content">
                        <Button className="margin_left_right"
                          bsStyle="primary"
                          onClick={() => {
                            if(!Validation.pickupPointValidation(this.selectedPickupPoint, this.props.showMessage))
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
        this.newPickupPoint.toCreate?
          this.renderNewPickupPoint() : ''
      }

      {
        this.newPickupPoint.toCreate?
          <div className="user_data center_div">
            <Row>
              <Col sm={12} className="right_content">
                <Button className="margin_left_right"
                  bsStyle="primary"
                  onClick={() => {
                    if(!Validation.pickupPointValidation(this.newPickupPoint, this.props.showMessage))
                      return false;
                    {
                      this.props.startSpinner();
                      this.newPickupPoint.teamId = this.selectedTeam.id;
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
                <Button onClick={() => {this.newPickupPoint.toCreate = true; this.forceUpdate();}}>+</Button>
              </Col>
            </Row>
          </div>: ''
      }
      </div>
    );
  }

  renderNewPickupPoint() {
    this.newPickupPoint.toCreate = true;
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
                 placeholder={gettext('TITLE')}/>
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
                 placeholder={gettext('CONTACT-NAME')}/>
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
                 placeholder={gettext('PHONE')}/>
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
                  onSuggestSelect={(opts) =>
                    {
                      this.newPickupPoint.gpsLocation = opts.location;
                      this.newPickupPoint.address = opts.label;
                    }
                  }/>
                  <InputGroup.Addon onKeyDown={(e) => props.onKeyDown(e)}
                    onClick={() => this.showMapEdit()}>
                    { gettext('SELECT-ON-MAP') }
                  </InputGroup.Addon>
                </InputGroup>
            </Col>
          </Row>
        </div>
    );
  }


  render() {
    let filteredTeams = _.filter(this.props.teams, (team) => {
      return this.state.filterValue
              ? team.name.toUpperCase().indexOf(this.state.filterValue.toUpperCase()) != -1
                  || this.props.getCityById(team.cityId).toUpperCase().indexOf(this.state.filterValue.toUpperCase()) != -1
              :true;
    });
    const teams = _.map(filteredTeams, (team) => {
      const isTeamSelected = team === this.selectedTeam;
      const className = isTeamSelected ? 'active' : '';
      return (
        <Tr className={className} onClick={(e) => this.getSelectedTeam(team.id)}>
          <Td column={gettext('NAME')}>
            { team.name }
          </Td>
        </Tr>
      );
    });

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

    const mapsForPolygon = this.isShowingPolygonMap ?
      (
        <MapModalComponent
          onMapClick={this.removePolygon}
          isDraw={true}
          polygon={this.state.polygon}
          onClickOutsideOfMap={this.hidePolygonMapEdit}
          onCancel={this.hidePolygonMapEdit}
          hideMapEdit={this.hidePolygonMapEdit}
          removePolygon={this.removePolygon}
          setPolygon={this.setPolygon}
        />
      )
      : '';

    return (
      <div>
        <Jumbotron className="company_profile">
          <div className="item_head_title">
            <h3>{gettext('TEAMS')}</h3>
          </div>
          <Row className="center_flex margin_bottom_em">
            <Col sm={10}>
              <Col sm={12}>
                <FormControl
                   type="text"
                   required={true}
                   placeholder={gettext('SEARCH')}
                   onChange={(e) => this.setState({filterValue: e.target.value})}/>
              </Col>
            </Col>
          </Row>
          <Row className="center_flex">
              <Col sm={10}>
                <Col sm={12}>
                  <div className="table_container">
                      <Table className="company_table table-fixedheader">
                        <Thead>
                          <Th column={gettext('NAME')}>
                            <span title={gettext('NAME')}>{gettext('NAME')}</span>
                          </Th>
                        </Thead>
                        {teams}
                      </Table>
                  </div>
                  <div className="milti_controls">
                   <Button className="multi_btn margin_bottom_halfem" onClick={() => {this.flipCreateTeam()}}>+</Button>
                   <Button className="multi_btn margin_bottom_halfem" onClick={() => {this.deleteTeam()}}>-</Button>
                  </div>
                </Col>
              </Col>
          </Row>
        </Jumbotron>
        {
          this.createTeam ? this.renderTeamCreateForm() : ''
        }
        {
          this.selectedTeam
            ? this.editTeam ? this.renderTeamEditForm():this.renderTeamForm()
            : ''
        }

        {maps}
        {mapsForPolygon}
      </div>
    );
  }
}




TeamsComponent.propTypes = {

};

function mapStateToProps(state) {
  return {
    createdPickUpPoint: state.appReducer.createdPickUpPoint,
    teamCreated: state.appReducer.teamCreated
  };
}

export default connect(
  mapStateToProps
)(TeamsComponent);
