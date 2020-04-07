import React, { PropTypes } from 'react';
import './sidebar.scss';

export class Sidebar extends React.Component {
    render() {
        const { isOpen, className, style, toggle, buttonIcon, children } = this.props;
        const open = (isOpen ? " sidebar-open" : "");
        const resultClass = "sidebar " + className + open;
        return (
            <div className={resultClass} style={style}>
                <a className="sidebar-button" onClick={toggle}>
                    <span className={'glyphicon glyphicon-menu-' + buttonIcon} aria-hidden="true"></span>
                </a>
                <div className="sidebar-content">
                    {children}
                </div>
            </div>
        );
    }
}
