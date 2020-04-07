import React, {PropTypes} from 'react';
import { gettext } from '../../i18n/service.js';
import { Button, Col, PageHeader, Tooltip, OverlayTrigger, Form, FormGroup, Modal, FormControl, InputGroup } from 'react-bootstrap';
import getCurLang from '../../businessLogic/getCurLang.js';
import _ from 'lodash';

export default class ThemeChangerModal extends React.Component {
  constructor(props, context) {
    super(props, context);
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
    return (
      <div style={{display: 'inline'}}>
        <Button
          bsStyle="danger margin_bottom_halfem delete_btn"
          onClick={this.open}
          style={getCurLang()==='ar'?{float:'left'}:{float:'right'}} />

        <Modal show={this.state.showModal} onHide={this.close} dir={getCurLang()==='ar'?'rtl':'ltr'}>
          <Modal.Body>
            <p>{gettext('CHANGE-THEME')}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>{gettext('NO')}</Button>
            <Button
              onClick={(e) => {
                this.close();
              }}
              bsStyle="danger">{gettext('YES')}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
