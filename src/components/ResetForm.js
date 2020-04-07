import React, { PropTypes } from 'react';
import { gettext } from '../i18n/service.js';
import getCurLang from '../businessLogic/getCurLang.js';
import { Button, Form, FormGroup, FormControl, Col, ControlLabel, Checkbox, Panel } from 'react-bootstrap';
import { paddingZero, textToLeft, leftMarginRadio} from '../constants/loginStyle.js';


var lan = getCurLang();


export default function ResetForm(props) {
  return (
    <Panel className="centerLogInForm">
      <Form horizontal className="insideLogInForm"  action="" dir = {getCurLang()==='ar'?'rtl':'ltr'}  onSubmit={props.submit}>
                <FormGroup controlId="formHorizontalEmail">
          {(lan==='en')?
            <Col componentClass={ControlLabel}  sm={2} style={textToLeft}>
              { gettext('EMAIL') }
            </Col>:
            <Col sm={8}>
              <FormControl type="email" placeholder="Email" name="email"  />
            </Col>
          }
          {(lan==='ar')?
            <Col componentClass={ControlLabel} sm={2} style={paddingZero}>
              { gettext('EMAIL') }
            </Col>:
            <Col sm={8}>
              <FormControl type="email" placeholder="Email" name="email" />
            </Col>
          }
        </FormGroup>



            <FormGroup>
              {(lan==='en')?
                <Col componentClass={ControlLabel}  sm={2} style={textToLeft}/>
                :
                <Col sm={8}>
                  <Button type="submit" className="spaceRight">
                    { gettext('AUTH.RESET_PASSWORD') }
                  </Button>
                  <Button onClick={props.reset_close} className="spaceRight">
                    { gettext('AUTH.CLOSE') }
                  </Button>
                </Col>
              }
              {(lan==='ar')?
                <Col  sm={2} />
                :
                <Col sm={8}>
                  <Button onClick={props.reset_close} className="spaceRight">
                    { gettext('AUTH.CLOSE') }
                  </Button>
                  <Button type="submit" className="spaceRight">
                    { gettext('AUTH.RESET_PASSWORD') }
                  </Button>
                </Col>
              }
            </FormGroup>
          </Form>
        </Panel>
  );
}


ResetForm.propTypes = {
  submit: PropTypes.func
};
