import React, {PropTypes} from 'react';
import { Panel, Button, Col, Row } from 'react-bootstrap';
import OrderDetailsComponent from '../orderDetails/OperatorOrderDetailsComponent';
import {DriverTrackingTable} from '../driverTrackingTable/DriverTrackingTable.js';
import './GroupageDetailsComponent.scss';
import _ from 'lodash';
import { gettext } from '../../i18n/service';
import getCurLang from '../../businessLogic/getCurLang.js';
import { summCashOn } from '../../businessLogic/formatCashOnDelivery.js';

const fakeDriver = {
  firstName: gettext('STATUS.UNASSIGNED'),
  lastName: '',
  phone: gettext('STATUS.UNASSIGNED')
};

const fakeOperator = {
  firstName: gettext('CANNOT-GET-OPERATOR'),
  lastName: '',
  phone: gettext('CANNOT-GET-OPERATOR')
};

var lan = getCurLang();

export default function GroupageDetailsComponent({users, groupage, assignGroupage, unassignGroupage, pickUpPoints, recipients, vehicles, orders, gpsLogs}) {
  const driver = _.find(users, {id: groupage.driverId}) || fakeDriver;
  const operator = _.find(users, {id: groupage.operatorId}) || fakeOperator;
  const driverName = `${driver.firstName} ${driver.lastName}`;
  const operatorName = `${operator.firstName} ${operator.lastName}`;
  return (
    <div className="groupageDetailsPage" dir={(lan==='ar')?'rtl':'ltr'}>
      <Panel header={
          <strong>{ gettext('GROUPAGE-#') } {groupage.id.slice(groupage.id.length - 5, groupage.id.length)}</strong>
        }>
        <Row>
          <Col sm={4}>
            <div>
              <span className="description">{ gettext('DRIVER') }: </span>{driverName}
            </div>
            <div>
              <span className="description">{ gettext('OPERATOR') }: </span>{operatorName}
            </div>
            <div>
              <span className="description">{ gettext('DELIVERY-COST') }: </span>{groupage.deliveryCommission} SAR
            </div>
            <div>
              <span className="description">{ gettext('DRIVER-COMMISSION') }: </span>{groupage.driverReward}
            </div>
            <div>
              <span className="description">{ gettext('COMPANY-PROCEEDS') }: </span>{groupage.companyProceeds}
            </div>

          </Col>
          <Col sm={4}>
            <div>
              <span className="description">{ gettext('DRIVER.DRIVER-PHONE') }: </span>{driver.phone}
            </div>
            <div>
              <span className="description">{ gettext('OPERATOR.OPERATOR-PHONE') }: </span>{operator.phone}
            </div>
            <div>
              <span className="description">{ gettext('TOTAL-CASH-ON-DELIVERY') }: </span>{summCashOn(orders)}
            </div>
          </Col>
          { groupage.groupageStatus!=='done' ?
            <Col sm={4} className="buttonsContainer">
              <div>
                <Button bsStyle="success" disabled={groupage.groupageStatus==='assigned'} onClick={() => assignGroupage(groupage,orders)}>{ gettext('DRIVER.ASSIGN-DRIVER') }</Button>
              </div>
              <div>
                <Button bsStyle="danger" disabled={groupage.groupageStatus==='unassigned'}  onClick={() => unassignGroupage(groupage.id, groupage.groupageStatus)}>{ gettext('DRIVER.UNASSIGN-DRIVER') }</Button>
              </div>
            </Col> : ''
          }
        </Row>

        {_.map(orders, (order) =>
          <OrderDetailsComponent
            key={order.id}
            order={order}
            pickUpPoints={pickUpPoints}
            recipients={recipients}
            users={users}
            vehicles={vehicles}
            />
        )}
        {(gpsLogs)?
        <DriverTrackingTable
          gpsLogs={gpsLogs}
          />:''}
      </Panel>
    </div>

  );
}




GroupageDetailsComponent.propTypes = {
  groupage: PropTypes.object,
  orders: PropTypes.array,
  pickUpPoints: PropTypes.object,
  recipients: PropTypes.array,
  users: PropTypes.array,
  assignGroupage: PropTypes.func,
  unassignGroupage: PropTypes.func,
  showOnMap: PropTypes.func,
  vehicles: PropTypes.array.isRequired,
  gpsLogs: PropTypes.array
};
