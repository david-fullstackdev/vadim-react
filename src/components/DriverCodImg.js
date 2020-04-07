import React, { Component, PropTypes } from 'react';
import { gettext } from '../i18n/service';
import getTooltip from '../businessLogic/getTooltip.js';
import { Row, FormControl, Col, ControlLabel, Glyphicon, OverlayTrigger } from 'react-bootstrap';
export class DriverCodImg extends Component {

  getDriverCodImg(driver, company, styleImg) {
    if (driver.cashOnDelivery) {
      if (driver.cashOnDelivery < company.cashOnDeliveryCap) {
        const persent = company.cashOnDeliveryCap - (company.cashOnDeliveryCap * 0.1);
        if (driver.cashOnDelivery >= persent) {
          let tooltip = gettext('DRIVER-CAP-WARNING-TOOLTIP');
          try {
            tooltip = tooltip.replace('{$COMPANY.CASHONDELIVERYCAP}', company.cashOnDeliveryCap);
            tooltip = tooltip.replace('{$DRIVER.CASHONDELIVERY}', driver.cashOnDelivery);
          }
          catch (error) { console.log(error) }
          return (
            <OverlayTrigger placement="top" overlay={getTooltip(tooltip)}>
              <img style={styleImg} className="driver_warn_icon" alt="warning" src="./warning2.png" />
            </OverlayTrigger>
          )
        }
      } else if (driver.cashOnDelivery >= company.cashOnDeliveryCap) {
        const tooltip = gettext('DRIVER-CAP-DANGER-TOOLTIP');
        return (
          <OverlayTrigger placement="top" overlay={getTooltip(tooltip)}>
            <img style={styleImg} className="driver_warn_icon" alt="danger" src="./danger2.png" />
          </OverlayTrigger>
        )
      }
    }
    return null;
  }
  render() {
    const { driver, company, style, styleImg } = this.props;
    return <span style={style}>{this.getDriverCodImg(driver, company, styleImg)}</span>;
  }
}
DriverCodImg.propTypes = {
  driver: PropTypes.object,
  company: PropTypes.object,
};
