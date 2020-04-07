import React, {PropTypes} from 'react';
import { gettext } from '../../i18n/service.js';
import { Button, Col, PageHeader, Tooltip, OverlayTrigger, Form, FormGroup, Modal, FormControl, InputGroup } from 'react-bootstrap';
import getCurLang from '../../businessLogic/getCurLang.js';
import _ from 'lodash';

export default class MarkerCategoryModal extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  changeCategoryState(category, value) {
    this.props.changeCategoryState(category, value)
  }
  render() {
    return (
      <div className="markerCategoryModal" style={this.props.showModal?{display:'block'}:{display:'none'}}>
        <div>
          <p className="title">Orders</p>
          <p><input type="checkbox" checked = {this.props.showOrderOption.assigned} onChange={e => this.changeCategoryState('assigned', e.target.checked)}/> Assigned </p>
          <p><input type="checkbox" checked = {this.props.showOrderOption.unassigned} onChange={e => this.changeCategoryState('unassigned', e.target.checked)}/> Unassigned</p>
          <p><input type="checkbox" checked = {this.props.showOrderOption.deliveryPoint} onChange={e => this.changeCategoryState('deliveryPoint', e.target.checked)}/> DeliveryPoint</p>
          <p><input type="checkbox" checked = {this.props.showOrderOption.waitingForPickup} onChange={e => this.changeCategoryState('waitingForPickup', e.target.checked)}/> WaitingForPickup</p>
          <p><input type="checkbox" checked = {this.props.showOrderOption.onWayToDelivery} onChange={e => this.changeCategoryState('onWayToDelivery', e.target.checked)}/> OnWayToDelivery</p>
        </div>
      </div>
    );
  }
}
