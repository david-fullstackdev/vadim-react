import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { gettext } from '../i18n/service.js';
import getCurLang from '../businessLogic/getCurLang.js';
import { rowReverseAR, selOnMapAR } from '../constants/formCreateStyle.js';
import { Jumbotron, Button, Form, Row, FormGroup, FormControl, Col, ControlLabel, PageHeader, InputGroup } from 'react-bootstrap';
import { SHA256 } from 'crypto-js';
import { bindAll } from 'lodash';

export class BillingForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
          service_command: 'TOKENIZATION',
          language: 'en',
          merchant_identifier: 'UolNguwn',
          access_code: '1h9YLrGrpTSqrNcNHM8X',
          merchant_reference: Math.random().toString(36).slice(2),
          card_security_code: '123',
          card_number: '4005550000000001',
          expiry_date: '1705',
          remember_me: 'YES',
          card_holder_name: 'Vlad',
          signature: undefined,
          return_url: 'http://localhost:3000'
        }


        bindAll(this, ['convert'])
    }

    submit(e) {
        e.preventDefault();
        e.stopPropagation();
          const elems = Array.from(e.target.elements);
          let fields = elems.reduce((prev, curr) => {
            if (!curr.name) {
              return prev;
            }
            return prev;
          }, {});
        return true;
        this.props.onSubmit(values);
    }

    convert(event) {
        ///////////
        let signature = 'PASS'+'access_code='+ this.state.access_code
                        +'language='+ this.state.language
                        +'merchant_identifier='+ this.state.merchant_identifier
                        +'merchant_reference='+ this.state.merchant_reference
                        +'return_url='+ this.state.return_url
                        +'service_command='+ this.state.service_command+'PASS';

        this.setState({signature: SHA256(signature).toString()});
    }



    render() {
//onSubmit={(e)=> this.submit(e)}
        return (
            <div>
              <div className="item_head_title">
                <h3>{gettext('NEW-BILLING')}</h3>
              </div>
              <div className='billing_container'>
                <form
                  action = 'https://sbcheckout.PayFort.com/FortAPI/paymentPage'
                  method="post" ref={ref => { this.form = ref; }}>

                  <FormGroup controlId="formHorizontalEmail">
                      <Col componentClass={ControlLabel} sm={3}>
                        {gettext('CARD-NUMBER')}
                      </Col>
                      <Col sm={9}>
                        <FormControl type="text" placeholder={gettext('CARD-NUMBER')} value={this.state.card_number} name="card_number" />
                      </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalEmail">
                      <Col componentClass={ControlLabel} sm={3}>
                        {gettext('expiry_date')}
                      </Col>
                      <Col sm={9}>
                        <FormControl type="text" placeholder={gettext('expiry_date')}  value={this.state.expiry_date} name="expiry_date" />
                      </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalEmail">
                      <Col componentClass={ControlLabel} sm={3}>
                        {gettext('card_security_code')}
                      </Col>
                      <Col sm={9}>
                        <FormControl type="text" placeholder={gettext('card_security_code')}  value={this.state.card_security_code} name="card_security_code" />
                      </Col>
                  </FormGroup>
                  <FormGroup controlId="formHorizontalEmail">
                      <Col componentClass={ControlLabel} sm={3}>
                        {gettext('card_holder_name')}
                      </Col>
                      <Col sm={9}>
                        <FormControl type="text" placeholder={gettext('card_holder_name')}  value={this.state.card_holder_name} name="card_holder_name" />
                      </Col>
                  </FormGroup>
                  <input type="hidden" value={this.state.service_command} name="service_command" />
                  <input type="hidden" value={this.state.service_command} name="service_command" />
                  <input type="hidden" value={this.state.merchant_identifier} name="merchant_identifier" />
                  <input type="hidden" value={this.state.access_code} name="access_code" />
                  <input type="hidden" value={this.state.merchant_reference} name="merchant_reference" />
                  <input type="hidden" value={this.state.language} name="language" />
                  <input type="hidden" value={this.state.return_url} name="return_url" />
                  <input type="hidden" value={this.state.signature} name="signature" />

                  <FormGroup controlId="formHorizontalEmail">
                      <Col componentClass={ControlLabel} sm={3}>
                        {gettext('remember_me')}
                      </Col>
                      <Col sm={9}>
                        <FormControl type="text" placeholder={gettext('remember_me')}  value={this.state.remember_me} name="remember_me" />
                      </Col>
                  </FormGroup>
                    <div>
                        <span>
                            <Link to="/fleetOwnerDashboard">
                                {gettext('CANCEL')}
                            </Link>
                            <Button bsStyle="success" onClick={() => this.convert()} type="submit">
                                {gettext('SUBMIT')}
                            </Button>
                        </span>
                    </div>
                </form>
            </div>
          </div>
        );
    }
}


BillingForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
};
