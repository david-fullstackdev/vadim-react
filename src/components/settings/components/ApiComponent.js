import React, {PropTypes} from 'react';
import { Jumbotron, Button, Row, PageHeader,FormGroup, FormControl, Col  } from 'react-bootstrap';
import { gettext } from '../../../i18n/service.js';
import _ from 'lodash';
import CopyToClipboard from 'react-copy-to-clipboard';

export default class ApiComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

  }

  render() {
    return (
      <Jumbotron>
        <div className="item_head_title">
          <h3>{gettext('API-INTEGRATION')}</h3>
        </div>
        <Row className="center_flex">
                <div>
                  <CopyToClipboard text={localStorage.getItem('auth_token')}
                   onCopy={() => this.props.showMessage({
                     message: gettext('COPIED-TO-CLIPBOARD'),
                     level: 'success'
                   })}>
                   <Button className="multi_btn margin_bottom_halfem">{localStorage.getItem('auth_token')}</Button>
                 </CopyToClipboard>
                </div>
                {/*<div className="milti_controls">
                 <Button className="multi_btn margin_bottom_halfem">+</Button>
                 <Button className="multi_btn">-</Button>
                </div>*/}
        </Row>
      </Jumbotron>
    );
  }
}




ApiComponent.propTypes = {

};
