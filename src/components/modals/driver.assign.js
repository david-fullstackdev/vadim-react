import React, { Component, PropTypes } from 'react';
import { Modal, Panel, PageHeader, Button, Col, Row } from 'react-bootstrap';

import getCurLang from '../../businessLogic/getCurLang.js';
import { gettext } from '../../i18n/service.js';

export class AssignToDriverModalComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: this.props.isOpen,
            selectedDriver: null
        }

    }

    selectDriver(driver) {
        const selectedDriver = driver;
        this.setState({ selectedDriver })
    }
    assign() {
        const { selectedDriver } = this.state;
        const { onAssign } = this.props;
        const driverId = selectedDriver ? selectedDriver.id : null;

        onAssign(driverId);
    }

    getVenicleIcon(driver) {
        const { vehicles } = this.props;
        return _.find(vehicles, { size: +driver.vehicleType }) || {};
    }

    render() {

        const { onClose, drivers, vehicles, ordersCount } = this.props;
        const { selectedDriver } = this.state;
        return (
            <Modal show={true} dir={getCurLang() === 'ar' ? 'rtl' : 'ltr'}>
                <Modal.Body>
                    {
                        _.map(drivers, (driver, i) => {

                            const driverVehicle = this.getVenicleIcon(driver);
                            const isSelected = (selectedDriver && selectedDriver.id === driver.id);
                            const className = isSelected ? 'driver highlighted_driver' : 'driver';

                            return (
                                <Row key={i} onClick={this.selectDriver.bind(this, driver)} className={className}>
                                    <Col sm={6}>
                                        <img alt={driverVehicle.type} src={driverVehicle.icon} />
                                    </Col>
                                    <Col sm={6}>
                                        <span>{`${driver.firstName}`}</span>
                                    </Col>
                                </Row>
                            )
                        })
                    }
                    <div>
                      <Row className="order_count">
                        <Col sm={6}>
                          <h4>{gettext('ORDERS-COUNT')+ " " +ordersCount}</h4>
                        </Col>
                      </Row>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onClose} bsStyle="danger">{gettext('CANCEL')}</Button>
                    <Button onClick={this.assign.bind(this)} bsStyle="success">{gettext('DRIVER.ASSIGN-DRIVER')}</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

AssignToDriverModalComponent.propTypes = {
    drivers: PropTypes.array.isRequired,
    vehicles: PropTypes.array.isRequired,
    ordersCount: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    onAssign: PropTypes.func.isRequired,
};
