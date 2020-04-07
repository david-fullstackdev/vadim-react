import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Sidebar } from './Sidebar';

export class LeftSidebar extends React.Component {
    render() {
        const { isOpen, toggle, width } = this.props;
        const left = isOpen ? '0px' : "-" + width;
        const style = { left, right: "auto" };
        const buttonIcon = isOpen ? 'left' : 'right';
        return (
            <Sidebar className="sidebar-left" isOpen={isOpen} style={style} buttonIcon={buttonIcon} toggle={toggle}>
                {this.props.children}
            </Sidebar>
        );
    }
}