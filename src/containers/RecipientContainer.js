import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as recipientActions from '../actions/recipientActions';
import * as appActions from '../actions/appActions';
import RecipientComponent from '../components/recipient/RecipientComponent';
import { gettext } from '../i18n/service';

export class RecipientContainer extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.props.recipientActions.getDispatcher(document.location.href.split('/')[5]);
    this.pickUpTimePickerVal = undefined;
    this.formattedAddres = undefined;
    this.setDeliveryTime = this.setDeliveryTime.bind(this);
    this.setFormattedAddress = this.setFormattedAddress.bind(this);
    this.setLocationLatLng = this.setLocationLatLng.bind(this);
    this.submit = this.submit.bind(this);
    this.isUpdated = false;
    this.locationLatLng = [];
    this.addressFromOrder = undefined;
    this.successMsg = this.successMsg.bind(this);
    this.redirectToLogIn = this.redirectToLogIn.bind(this);
    this.deliveryTimeValidator = this.deliveryTimeValidator.bind(this);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    this.addressFromOrder = nextProps.order.deliveryPoint;
  }

  setDeliveryTime(e){
    this.pickUpTimePickerVal = e.target.value.split('-')[1];
  }

  setFormattedAddress(addr) {
    this.formattedAddres = addr;
  }

  setLocationLatLng(loc) {
    this.locationLatLng = loc;
  }

  successMsg() {
    return this.props.showMessage({
      message: gettext('RECIPIENT-UPDATE-SUCCESS'),
      level: 'error'
    });
  }

  redirectToLogIn() {
    window.setTimeout(() => {
      this.props.router.push('/login');
      window.location = "http://dook.sa/";
    },2000);
  }

  deliveryTimeValidator(e, val) {
    e.target.value = val;
    this.props.showMessage({
      message: gettext('DELIVERY-TIME-LESS-THEN-PICKUPTIME'),
      level: 'error'
    });
    return val;
  }

  submit(e) {
    e.preventDefault();

    const recipientData = {
      deliveryPoint: this.formattedAddres,
      gpsLocation: this.locationLatLng
    };

    this.props.recipientActions.updateRecipient(this.props.order.recipientId, recipientData);
    // this.props.recipientActions.updateOrderFromRecipient(this.props.order.id, this.props.order.recipientId, orderData);

    this.isUpdated = true;



    this.forceUpdate();
  }

  render() {
    const order = (this.isUpdated===false)?
        <RecipientComponent
          recipients={this.props.recipient}
          orders={this.props.order}
          dispatcher={this.props.dispatcher}
          setDeliveryTime={this.setDeliveryTime}
          setFormattedAddress={this.setFormattedAddress}
          submit={this.submit}
          location={this.locationLatLng}
          formattedAddress={this.formattedAddres}
          deliveryTimeValidator={this.deliveryTimeValidator}
          logo={this.props.dooklogo}
          setLocationLatLng={this.setLocationLatLng}
          endSpinner={this.props.appActions.endSpinner}
          />
      :<div className="success_block">
        <h1>{gettext('RECIEVE-ORDER-SOON')}</h1>
        <h3>Redirecting...</h3>{this.redirectToLogIn()}
       </div>;
      return (
        <div>
          {order}
        </div>
      );
    }
}

RecipientContainer.propTypes = {
  appActions: PropTypes.object.isRequired,
  showMessage: PropTypes.func.isRequired,
  order: PropTypes.object,
  recipient: PropTypes.object,
  dispatcher: PropTypes.object,
  history: PropTypes.object,
  dooklogo: PropTypes.string,
  recipientActions: PropTypes.object
};

function mapStateToProps(state) {
  return {
    groupages: state.appReducer.groupages,
    order: state.recipientReducer.order,
    recipient: state.recipientReducer.recipient,
    dispatcher: state.recipientReducer.dispatcher,
    dooklogo: state.recipientReducer.dooklogo
  };
}

function mapDispatchToProps(dispatch) {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    recipientActions: bindActionCreators(recipientActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipientContainer);
