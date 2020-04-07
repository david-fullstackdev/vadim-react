import React, {PropTypes} from 'react';
import { gettext } from '../../i18n/service.js';
import { Link } from 'react-router';
import { Button, Col, PageHeader, Tooltip, OverlayTrigger, Form, FormGroup, Modal, FormControl, InputGroup } from 'react-bootstrap';
import getCurLang from '../../businessLogic/getCurLang.js';
import _ from 'lodash';

export default class OrderDetailModal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.pickUpPoints = props.pickUpPoints;
    this.state = {
      showModal:false
    }

    _.bindAll(this, ['close', 'open']);
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  render() {
    const order = this.props.order;

    return (
      <div style={{display: 'inline'}}>
        <Link onClick={this.open} to="#">
          <img src="./side_menu.svg" />
        </Link>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
