import React, { PropTypes } from 'react';
import { gettext } from '../i18n/service.js';
import getCurLang from '../businessLogic/getCurLang.js';
import { Button, Form, FormGroup, FormControl, Col, ControlLabel, Checkbox, Panel } from 'react-bootstrap';
import { paddingZero, textToLeft, leftMarginRadio} from '../constants/loginStyle.js';


var lan = getCurLang();


export default function ConfirmationForm(props) {
  return (
    <Panel className="centerConfirmationForm">
      <Form horizontal className="insideConfirmationForm"  action="" dir = {getCurLang()==='ar'?'rtl':'ltr'}  onSubmit={props.submit}>
        <ControlLabel>
          {gettext('AUTH.ENTERCODE')}
        </ControlLabel>
        <FormGroup controlId="formHorizontalCode">
          <FormControl type="text"  name="code" />
        </FormGroup>
        <FormGroup>
            
          <Button className="submit" type="submit">
            { gettext('SUBMIT') }
          </Button>
          <Button className="resend" type="submit">
            { gettext('AUTH.CONFIRMATION') }
          </Button>
      
        </FormGroup>
      </Form>
    </Panel>
  );
}


ConfirmationForm.propTypes = {
  submit: PropTypes.func
};
