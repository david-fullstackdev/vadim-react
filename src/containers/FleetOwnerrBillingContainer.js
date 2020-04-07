import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BillingForm } from '../components/billingForm';
// import { addBillingCall } from '../businessLogic/addBiling';

import * as fleetActions from '../actions/fleetOwnerActions';

export class FleetOwnerBilingContainer extends React.Component {
    constructor(props, context) {
        super(props, context);

        _.bindAll(this, ['formSubmit']);

    }

    formSubmit(values) {
        // this.props.dispatch(fleetActions.addBilling(values))
    }


    render() {
        return (
            <div>
                <BillingForm onSubmit={this.formSubmit} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        fleetActions: bindActionCreators(fleetActions, dispatch)
    };
}

export default connect(
    // mapStateToProps,
    // mapDispatchToProps
)(FleetOwnerBilingContainer);
