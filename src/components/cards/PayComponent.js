import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';;
import React, {PropTypes} from 'react';
import { Jumbotron, Button, Row, PageHeader,FormGroup, FormControl, Col, ControlLabel, Link, InputGroup  } from 'react-bootstrap';
import { gettext } from '../../i18n/service.js';
import _ from 'lodash';
import { SHA256 } from 'crypto-js';
import * as appActions from '../../actions/appActions';
import './AddCardComponent.scss';

class PayComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.showFakeExpiryDate = true;

    this.state = {
      service_command: 'TOKENIZATION',
      language: 'en',
      merchant_identifier: 'swfAPnVc',
      access_code: 'Frck0plLzRL5Qp9adJ7u',
      merchant_reference: Math.random().toString(36).slice(2),
      card_security_code: undefined,
      card_number: undefined,
      expiry_date: undefined,
      remember_me: 'NO',
      card_holder_name: undefined,
      signature: undefined,
      return_url: document.location.origin
    }
    _.bindAll(this, ['renderNewCardForm', 'convert', 'submit', 'cancel', 'converExpiryDate', 'hideFakeExpiryDate']);
  }

  componentWillReceiveProps() {
    if(!this.props.loaded)
      this.props.appActions.endSpinner();
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

  cancel() {
    this.props.router.push('/fleetSettings');
  }

  converExpiryDate(date) {
    if(date.length===2)
     date += '/';

    this.setState({expiry_date: date});
  }

  hideFakeExpiryDate() {
    this.showFakeExpiryDate = false;
    this.forceUpdate();
  }

  convert() {
    if(this.state.expiry_date.length===5) {
      let date = parseInt(this.state.expiry_date.slice(-2)+this.state.expiry_date.substring(0,2));
      this.setState({expiry_date: date});
      this.hideFakeExpiryDate();
    }

    let signature = 'PASS'+'access_code='+ this.state.access_code
                      +'language='+ this.state.language
                      +'merchant_identifier='+ this.state.merchant_identifier
                      +'merchant_reference='+ this.state.merchant_reference
                      +'return_url='+ this.state.return_url
                      +'service_command='+ this.state.service_command+'PASS';

    this.setState({signature: SHA256(signature).toString()});
  }

  renderNewCardForm() {
    return (
      <Jumbotron className="position_relative">
        <form onSubmit={() => localStorage.setItem('purchase', 1)} action='https://sbcheckout.PayFort.com/FortAPI/paymentPage' method="post">
          <Row>
            <div className="user_data center_div">
              <Row className="center_flex">
                <Col sm={9}>
                  <ControlLabel><h4>{gettext('CARD-NUMBER')}</h4></ControlLabel>
                  <FormControl
                     type="number"
                     required={true}
                     value={this.state.card_number}
                     onChange={(e) => this.setState({card_number: e.target.value})}
                     name="card_number"
                     maxLength={16}
                     placeholder={gettext('CARD-NUMBER')}/>
                </Col>
              </Row>
              <Row className="center_flex">
                <Col sm={9}>
                  <Col sm={6} className="zero_padding">
                    <ControlLabel><h4>{gettext('EXPIRY-DATE')}</h4></ControlLabel>
                    { this.showFakeExpiryDate?
                        <FormControl
                         type="text"
                         required={true}
                         value={this.state.expiry_date}
                         maxLength={5}
                         onChange={(e) => {
                           this.converExpiryDate(e.target.value);
                         }}
                         name="expiry_date"
                         placeholder={'MM/YY'}/> : ''
                     }
                  </Col>
                  <Col sm={6} className="zero_padding">
                    <ControlLabel><h4>{gettext('CARD-SECURITY-CODE')}</h4></ControlLabel>
                     <FormControl
                        type="number"
                        required={true}
                        value={this.state.card_security_code}
                        maxLength={3}
                        onChange={(e) => this.setState({card_security_code: e.target.value})}
                        name="card_security_code"
                        placeholder={gettext('CVV')}/>
                  </Col>
                </Col>
              </Row>
              <Row className="center_flex">
                <Col sm={9}>
                  <ControlLabel><h4>{gettext('CARD-HOLDER-NAME')}</h4></ControlLabel>
                  <FormControl
                     type="text"
                     required={true}
                     value={this.state.card_holder_name}
                     onChange={(e) => this.setState({card_holder_name: e.target.value.toUpperCase()})}
                     name="card_holder_name"
                     placeholder={gettext('CARD-HOLDER-NAME')}/>
                </Col>
              </Row>
            </div>
            <input type="hidden" value={this.state.expiry_date} name="expiry_date" />
            <input type="hidden" value={this.state.service_command} name="service_command" />
            <input type="hidden" value={this.state.merchant_identifier} name="merchant_identifier" />
            <input type="hidden" value={this.state.access_code} name="access_code" />
            <input type="hidden" value={this.state.merchant_reference} name="merchant_reference" />
            <input type="hidden" value={this.state.language} name="language" />
            <input type="hidden" value={this.state.return_url} name="return_url" />
            <input type="hidden" value={this.state.signature} name="signature" />
            <input type="hidden" value={this.state.remember_me} name="remember_me" />
          </Row>
          <div className="actions">
            <Button type="submit" onClick={() => this.convert()} bsStyle="primary">{gettext('PAY')}</Button>
            <Button bsStyle="danger" onClick={() => this.cancel()}>{gettext('CANCEL')}</Button>
          </div>
        </form>
      </Jumbotron>
    );
  }

  render() {
    return (
      <div className='new_card_component'>
        <div className="item_head_title">
          <h3>{/*gettext('ADD-NEW-CARD')*/}</h3>
        </div>
        {this.renderNewCardForm()}
      </div>
    );
  }
}




PayComponent.propTypes = {

};

function mapStateToProps(state) {
  return {
    account: state.appReducer.account,
    loaded: state.appReducer.loaded
  };
}


function mapDispatchToProps(dispatch) {
  return {
    appActions: bindActionCreators(appActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PayComponent);
