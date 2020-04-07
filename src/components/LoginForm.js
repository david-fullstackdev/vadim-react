import React, { PropTypes } from 'react';
import { gettext } from '../i18n/service.js';
import getCurLang from '../businessLogic/getCurLang.js';
import { Button, Form, FormGroup, FormControl, Col, ControlLabel, Checkbox, Panel } from 'react-bootstrap';
import { paddingZero, textToLeft, leftMarginRadio} from '../constants/loginStyle.js';


var lan = getCurLang();


export default function LoginForm(props) {
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

        <FormGroup controlId="formHorizontalPassword">
          {(lan==='en')?
            <Col componentClass={ControlLabel} sm={2} style={textToLeft}>
              { gettext('PASSWORD') }
            </Col>:
            <Col sm={8}>
              <FormControl type="password" placeholder="Password" name="password"/>
            </Col>
          }
          {(lan==='ar')?
            <Col componentClass={ControlLabel} sm={2} style={paddingZero}>
              { gettext('PASSWORD') }
            </Col>:
            <Col sm={8}>
              <FormControl type="password" placeholder="Password" name="password"/>
            </Col>
          }
        </FormGroup>



            <FormGroup style={lan==='en'?{paddingRight: '4em'}:{paddingRight: '3em'}}>
              <Col smOffset={3} sm={5}>
                <Checkbox className="loginCheck" name="rememberMe" nopadding style={(lan==='ar')?leftMarginRadio:{}}>
                  { gettext('AUTH.REMEMBER-ME') }
                </Checkbox>
              </Col>
            </FormGroup>

            <FormGroup>
              {(lan==='en')?
                <Col componentClass={ControlLabel}  sm={2} style={textToLeft}/>
                :
                <Col sm={8}>
                  <Button type="submit" className="spaceRight">
                    { gettext('AUTH.SIGN-IN') }
                  </Button>
                  <Button onClick={props.reset_password} className="spaceRight">
                    { gettext('AUTH.RESET_PASSWORD') }
                  </Button>
                </Col>
              }
              {(lan==='ar')?
                <Col  sm={2} />
                :
                <Col sm={8}>
                  <Button type="submit" className="spaceRight">
                    { gettext('AUTH.SIGN-IN') }
                  </Button>
                  <Button onClick={props.reset_password} className="spaceRight">
                    { gettext('AUTH.RESET_PASSWORD') }
                  </Button>
                </Col>
              }
            </FormGroup>
          </Form>
        </Panel>
  );
}


LoginForm.propTypes = {
  submit: PropTypes.func
};
