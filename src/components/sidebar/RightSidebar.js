import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Sidebar } from './Sidebar';

export class RightSidebar extends React.Component {
    render() {
        const { isOpen, toggle, width } = this.props;
        const right = isOpen ? '0px' : "-" + width;
        const style = { left: "auto", right };
        const buttonIcon = isOpen ? 'right' : 'left';
        return (
            <Sidebar className="sidebar-right" isOpen={isOpen} style={style} buttonIcon={buttonIcon} toggle={toggle}>
                {this.props.children}
            </Sidebar>
        );
    }
}