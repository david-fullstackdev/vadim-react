import React, { PropTypes } from 'react';
import { Jumbotron, Button, Row, PageHeader, FormGroup, FormControl, Col, ControlLabel } from 'react-bootstrap';
import { gettext } from '../../../i18n/service.js';
import _ from 'lodash';
import moment from 'moment';
import LoopbackHttp, { getUserType } from '../../../businessLogic/LoopbackHttp';
import { firstToUpper } from '../../../businessLogic/stringMethods';

import * as Validation from '../../../businessLogic/fieldValidation.js';
import UserCardsComponent from './UserCardsComponent';
import ReactTelInput from 'react-telephone-input';
import Avatar from './AvatarComponent';
import Switcher from 'react-switcher';


export default class UserProfileComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.editProfile = false;
    _.bindAll(this, ['renderProfile', 'renderEditProfile', 'flipEditBool', 'updateProfile', 'validateProfileFields',
      'resetState', 'changeAvatar']);
    this.state = props.account;
    this.baseState = this.state;
  }

  changeAvatar(base64) {
    this.setState({ avatar: base64 });
  }

  flipEditBool() {
    this.editProfile = !this.editProfile;
    this.forceUpdate();
  }

  updateProfile() {
    if (!this.validateProfileFields())
      return false;
    else {
      let usetType = getUserType() === 'operator' ? 'Operator' : 'FleetOwner';
      this.props.changeAvatar(this.props.account.id, usetType, this.state.avatar);
      delete this.state['confirmPassword'];
      this.state.avatar = this.props.account.avatar;
      this.props.startSpinner();
      this.props.updateUserProfile(this.props.account.id, this.state);
      if (this.state.dashboardType !== this.props.account.dashboardType) {
        localStorage.setItem('dashboardType', this.state.dashboardType);
        window.location.replace(document.location.origin);
      }

      if (this.state.language !== this.props.account.language) {
        localStorage.setItem('user-language', this.state.language);
        window.location.replace(document.location.origin);
      }
      this.props.getAccount();
      this.props.endSpinner();
      this.flipEditBool();
    }
  }

  validateProfileFields() {
    return (LoopbackHttp.isFleet
      ? Validation.nameValidation(this.state.name, this.props.showMessage)
      : Validation.nameValidation(this.state.firstName, this.props.showMessage))
      && Validation.phoneValdation(this.state.phone, this.props.showMessage)
      && Validation.passValdation(this.state.password, this.state.confirmPassword, this.props.showMessage);
  }

  resetState() {
    this.setState(this.baseState);
  }

  renderProfile() {
    return (
      <div>
        <Row className="center_flex">
          <Avatar avatar={this.state.avatar} changeAvatar={this.changeAvatar} />
        </Row>
        <Row>
          <div className="user_data center_div">
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('NAME')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{getUserType() === 'fleetowner' ? this.state.name : this.state.firstName}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('PHONE')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.state.phone}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('REGISTERED')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{moment(this.state.createdAt).zone('0300').format('L')}</h4></label>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('EMAIL')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.state.email}</h4></label>
              </Col>
            </Row>

            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('THEME')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.state.dashboardType}</h4></label>
              </Col>
            </Row>

            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('LANGUAGE')}</h4></ControlLabel>
              </Col>
              <Col sm={6}>
                <label><h4>{this.state.language}</h4></label>
              </Col>
            </Row>

          </div>
        </Row>
        <div className="edit_link">
          <a onClick={() => this.flipEditBool()}><h4>{gettext('EDIT')}</h4></a>
        </div>
      </div>
    )
  }

  renderEditProfile() {
    return (
      <div>
        <Row className="center_flex">
          <Avatar avatar={this.state.avatar} changeAvatar={this.changeAvatar} edit={true} />
        </Row>
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
                  defaultValue={getUserType() === 'fleetowner' ? this.state.name : this.state.firstName}
                  onChange={(e) =>
                    getUserType() === 'fleetowner'
                      ? this.setState({ name: e.target.value })
                      : this.setState({ firstName: e.target.value })
                  }
                  placeholder={gettext('NAME')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('PHONE')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <ReactTelInput
                  required={true}
                  defaultCountry="sa"
                  initialValue={"" + this.state.phone + ""}
                  flagsImagePath='./flags.png'
                  onChange={(telNumber, selectedCountry) => {
                    this.setState({ phone: parseInt(telNumber.replace(/[^0-9]/g, ''), 10) })
                  }}
                />
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
                <ControlLabel><h4>{gettext('EMAIL')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl
                  type="email"
                  required={true}
                  defaultValue={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                  placeholder={gettext('EMAIL')} />
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('NOTIFICATIONS')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <div className="switcher">
                  <Switcher
                    on={this.state.soundsNotifications}
                    onClick={() => {
                      this.setState({ soundsNotifications: !this.state.soundsNotifications });
                      localStorage.setItem('sound_notifications', !this.state.soundsNotifications);
                    }}>
                  </Switcher>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <ControlLabel><h4>{gettext('LANGUAGE')}</h4></ControlLabel>
              </Col>
              <Col sm={8}>
                <FormControl componentClass="select" name="vehicleType" placeholder="select"
                  onChange={(e) => {
                    this.setState({ language: e.target.value });
                    localStorage.setItem('user-language', e.target.value);
                  }}
                  value={this.state.language}>
                  <option value={'en'}>EN</option>
                  <option value={'ar'}>AR</option>
                </FormControl>
              </Col>
            </Row>
            {LoopbackHttp.isFleet ?
              <Row>
                <Col sm={4}>
                  <ControlLabel><h4>{gettext('THEME')}</h4></ControlLabel>
                </Col>
                <Col sm={8}>
                  <FormControl componentClass="select" name="vehicleType" placeholder="select"
                    onChange={(e) => this.setState({ dashboardType: e.target.value })}
                    value={this.state.dashboardType}>
                    <option value={'onDemand'}>{gettext('ON-DEMAND')}</option>
                    <option value={'regular'}>{gettext('DELIVERY-COMPANY-DASH')}</option>

                  </FormControl>
                </Col>
              </Row>
              : ''}
          </div>
        </Row>
        <div className="actions">
          <Button bsStyle="primary" onClick={() => this.updateProfile()}>{gettext('SAVE')}</Button>
          <Button bsStyle="danger" onClick={() => this.flipEditBool()}>{gettext('CANCEL')}</Button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <Jumbotron className="user_profile">
          <div className="item_head_title">
            <h3>{gettext('USER-PROFILE')}</h3>
          </div>
          {!this.editProfile ? this.renderProfile() : this.renderEditProfile()}
        </Jumbotron>
        {LoopbackHttp.isFleet
          ? <UserCardsComponent
            addBilling={this.props.addBilling}
            startSpinner={this.props.startSpinner}
            router={this.props.router}
            deleteCard={this.props.deleteCard}
            account={this.props.account}
            getCards={this.props.getCards} />
          : ''}
      </div>
    );
  }
}




UserProfileComponent.propTypes = {

};
