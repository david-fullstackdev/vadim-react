import React, { PropTypes } from 'react';
import _ from 'lodash';
import './OrdersExpander.scss';
import { Collapse } from 'react-collapse';

export class OrdersExpander extends React.Component {
    constructor() {
        super();
        this.state = { isOpened: false };
    }

    toggle() {
        this.setState({ isOpened: !this.state.isOpened });
    }

    render() {
        const icon = this.state.isOpened ? 'chevron-down' : 'menu-right';
        return (
            <div className="sidebar-orders-expander">
                <div className="expand-button" onClick={() => this.toggle()}>{this.props.text}<span className={"glyphicon glyphicon-" + icon}></span></div>
                <Collapse isOpened={this.state.isOpened} fixedHeight={this.props.height}>
                    {this.props.children}
                </Collapse>
            </div>
        );
    }
}

OrdersExpander.propTypes = {
    text: PropTypes.string,
};