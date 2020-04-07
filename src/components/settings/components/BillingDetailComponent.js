import React, {PropTypes} from 'react';
import { Jumbotron, Button, Row, PageHeader,FormGroup, FormControl, Col, ControlLabel, Link  } from 'react-bootstrap';
import {Table, Tr, Td, Th, Thead} from 'reactable';
import { gettext } from '../../../i18n/service.js';
import getCurLang from '../../../businessLogic/getCurLang.js';
import _ from 'lodash';
import { SHA256 } from 'crypto-js';

export default class BillingDetailComponent extends React.Component {
  constructor(props, context) {
    super(props, context);


  }
  paynow() {
    this.props.router.push('/pay');
  }

  getDayOrders(orders){
    var weekOrders = [[],[],[],[],[],[],[]];

    var that=this;
    orders.map(function(order, index){
      weekOrders[new Date(Date.parse(order.createdAt)).getDay()].push(order);
    })
    return weekOrders;
  }
  render() {

    return (
      <div className='billing_detail'>
        <Jumbotron>
          <ControlLabel><h3>{"Week "+this.props.selectedWeek}</h3></ControlLabel>
          <Row className="center_flex">
            <Col sm={10}>
              <Col sm={12}>
                <ControlLabel className="billing_detail_label"><h4>Billing Details</h4></ControlLabel>
                { this.props.detailbill.status === 'unpaid'?
                  <Button className="pay_now" onClick={() => this.paynow()} bsStyle="primary">{gettext('BILL-PAY-NOW')}</Button> : ''
                }
                <ControlLabel className="due_balance"><h4>{getCurLang()==='ar'?"Due Balance "+this.props.detailbill.cost+" ريال":"Due Balance "+this.props.detailbill.cost+" SAR"}</h4></ControlLabel>

              </Col>
            </Col>
          </Row>
          <br/>
          <Row className="center_flex">
            <Col sm={10}>
              <Col sm={12}>
                <div className="table_container">
                  <Table className="company_table table-fixedheader_bill">
                    <Thead>
                      <Th column={gettext('BILL-DAY')}>
                        <span title={gettext('BILL-DAY')}>{gettext('BILL-DAY')}</span>
                      </Th>
                      <Th column={gettext('BILL-DELIVERED-ORDERS')}>
                        <span title={gettext('BILL-DELIVERED-ORDERS')}>{gettext('BILL-DELIVERED-ORDERS')}</span>
                      </Th>
                      <Th column={gettext('BILL-RETURNED-ORDERS')}>
                        <span title={gettext('BILL-RETURNED-ORDERS')}>{gettext('BILL-RETURNED-ORDERS')}</span>
                      </Th>
                      <Th column={gettext('BILL-CANCELED-ORDERS')}>
                        <span title={gettext('BILL-CANCELED-ORDERS')}>{gettext('BILL-CANCELED-ORDERS')}</span>
                      </Th>
                      <Th column={gettext('BILL-ADDITIONAL-PICKUP')}>
                        <span title={gettext('BILL-ADDITIONAL-PICKUP')}>{gettext('BILL-ADDITIONAL-PICKUP')}</span>
                      </Th>
                      <Th column={gettext('BILL-TOTAL-PRICE')}>
                        <span title={gettext('BILL-TOTAL-PRICE')}>{gettext('BILL-TOTAL-PRICE')}</span>
                      </Th>
                    </Thead>
                    <Tr>
                      <Td column={gettext('BILL-DAY')}>
                        {gettext('MONDAY')}
                      </Td>
                      <Td column={gettext('BILL-DELIVERED-ORDERS')}>
                        {this.props.detailbill.monday.delivered.count}
                      </Td>
                      <Td column={gettext('BILL-RETURNED-ORDERS')}>
                        {this.props.detailbill.monday.returned.count}
                      </Td>
                      <Td column={gettext('BILL-CANCELED-ORDERS')}>
                        {this.props.detailbill.monday.canceled.count}
                      </Td>
                      <Td column={gettext('BILL-ADDITIONAL-PICKUP')}>
                        {(this.props.detailbill.monday.canceled.additionals?this.props.detailbill.monday.canceled.additionals:0)+(this.props.detailbill.monday.delivered.additionals?this.props.detailbill.monday.delivered.additionals:0)+(this.props.detailbill.monday.returned.additionals?this.props.detailbill.monday.returned.additionals:0)}
                      </Td>
                      <Td column={gettext('BILL-TOTAL-PRICE')}>
                        {getCurLang()==='ar'?(this.props.detailbill.monday.canceled.sum+this.props.detailbill.monday.returned.sum+this.props.detailbill.monday.delivered.sum) + ' ريال': (this.props.detailbill.monday.canceled.sum+this.props.detailbill.monday.returned.sum+this.props.detailbill.monday.delivered.sum) + ' SAR'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td column={gettext('BILL-DAY')}>
                        {gettext('TUESDAY')}
                      </Td>
                      <Td column={gettext('BILL-DELIVERED-ORDERS')}>
                        {this.props.detailbill.tuesday.delivered.count}
                      </Td>
                      <Td column={gettext('BILL-RETURNED-ORDERS')}>
                        {this.props.detailbill.tuesday.returned.count}
                      </Td>
                      <Td column={gettext('BILL-CANCELED-ORDERS')}>
                        {this.props.detailbill.tuesday.canceled.count}
                      </Td>
                      <Td column={gettext('BILL-ADDITIONAL-PICKUP')}>
                        {(this.props.detailbill.tuesday.canceled.additionals?this.props.detailbill.tuesday.canceled.additionals:0)+(this.props.detailbill.tuesday.delivered.additionals?this.props.detailbill.tuesday.delivered.additionals:0)+(this.props.detailbill.tuesday.returned.additionals?this.props.detailbill.tuesday.returned.additionals:0)}
                      </Td>
                      <Td column={gettext('BILL-TOTAL-PRICE')}>
                        {getCurLang()==='ar'?(this.props.detailbill.tuesday.canceled.sum+this.props.detailbill.tuesday.returned.sum+this.props.detailbill.tuesday.delivered.sum) + ' ريال': (this.props.detailbill.tuesday.canceled.sum+this.props.detailbill.tuesday.returned.sum+this.props.detailbill.tuesday.delivered.sum)+' SAR'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td column={gettext('BILL-DAY')}>
                        {gettext('WEDNESDAY')}
                      </Td>
                      <Td column={gettext('BILL-DELIVERED-ORDERS')}>
                        {this.props.detailbill.wednesday.delivered.count}
                      </Td>
                      <Td column={gettext('BILL-RETURNED-ORDERS')}>
                        {this.props.detailbill.wednesday.returned.count}
                      </Td>
                      <Td column={gettext('BILL-CANCELED-ORDERS')}>
                        {this.props.detailbill.wednesday.canceled.count}
                      </Td>
                      <Td column={gettext('BILL-ADDITIONAL-PICKUP')}>
                        {(this.props.detailbill.wednesday.canceled.additionals?this.props.detailbill.wednesday.canceled.additionals:0)+(this.props.detailbill.wednesday.delivered.additionals?this.props.detailbill.wednesday.delivered.additionals:0)+(this.props.detailbill.wednesday.returned.additionals?this.props.detailbill.wednesday.returned.additionals:0)}
                      </Td>
                      <Td column={gettext('BILL-TOTAL-PRICE')}>
                        {getCurLang()==='ar'?(this.props.detailbill.wednesday.canceled.sum+this.props.detailbill.wednesday.returned.sum+this.props.detailbill.wednesday.delivered.sum) + ' ريال':  (this.props.detailbill.wednesday.canceled.sum+this.props.detailbill.wednesday.returned.sum+this.props.detailbill.wednesday.delivered.sum)+' SAR'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td column={gettext('BILL-DAY')}>
                        {gettext('THURSDAY')}
                      </Td>
                      <Td column={gettext('BILL-DELIVERED-ORDERS')}>
                        {this.props.detailbill.thursday.delivered.count}
                      </Td>
                      <Td column={gettext('BILL-RETURNED-ORDERS')}>
                        {this.props.detailbill.thursday.returned.count}
                      </Td>
                      <Td column={gettext('BILL-CANCELED-ORDERS')}>
                        {this.props.detailbill.thursday.canceled.count}
                      </Td>
                      <Td column={gettext('BILL-ADDITIONAL-PICKUP')}>
                        {(this.props.detailbill.thursday.canceled.additionals?this.props.detailbill.thursday.canceled.additionals:0)+(this.props.detailbill.thursday.delivered.additionals?this.props.detailbill.thursday.delivered.additionals:0)+(this.props.detailbill.thursday.returned.additionals?this.props.detailbill.thursday.returned.additionals:0)}
                      </Td>
                      <Td column={gettext('BILL-TOTAL-PRICE')}>
                        {getCurLang()==='ar'?(this.props.detailbill.thursday.canceled.sum+this.props.detailbill.thursday.returned.sum+this.props.detailbill.thursday.delivered.sum) + ' ريال': (this.props.detailbill.thursday.canceled.sum+this.props.detailbill.thursday.returned.sum+this.props.detailbill.thursday.delivered.sum)+' SAR'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td column={gettext('BILL-DAY')}>
                        {gettext('FRIDAY')}
                      </Td>
                      <Td column={gettext('BILL-DELIVERED-ORDERS')}>
                        {this.props.detailbill.friday.delivered.count}
                      </Td>
                      <Td column={gettext('BILL-RETURNED-ORDERS')}>
                        {this.props.detailbill.friday.returned.count}
                      </Td>
                      <Td column={gettext('BILL-CANCELED-ORDERS')}>
                        {this.props.detailbill.friday.canceled.count}
                      </Td>
                      <Td column={gettext('BILL-ADDITIONAL-PICKUP')}>
                        {(this.props.detailbill.friday.canceled.additionals?this.props.detailbill.friday.canceled.additionals:0)+(this.props.detailbill.friday.delivered.additionals?this.props.detailbill.friday.delivered.additionals:0)+(this.props.detailbill.friday.returned.additionals?this.props.detailbill.friday.returned.additionals:0)}
                      </Td>
                      <Td column={gettext('BILL-TOTAL-PRICE')}>
                        {getCurLang()==='ar'?(this.props.detailbill.friday.canceled.sum+this.props.detailbill.friday.returned.sum+this.props.detailbill.friday.delivered.sum) + ' ريال': (this.props.detailbill.friday.canceled.sum+this.props.detailbill.friday.returned.sum+this.props.detailbill.friday.delivered.sum)+' SAR'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td column={gettext('BILL-DAY')}>
                        {gettext('SATURDAY')}
                      </Td>
                      <Td column={gettext('BILL-DELIVERED-ORDERS')}>
                        {this.props.detailbill.saturday.delivered.count}
                      </Td>
                      <Td column={gettext('BILL-RETURNED-ORDERS')}>
                        {this.props.detailbill.saturday.returned.count}
                      </Td>
                      <Td column={gettext('BILL-CANCELED-ORDERS')}>
                        {this.props.detailbill.saturday.canceled.count}
                      </Td>
                      <Td column={gettext('BILL-ADDITIONAL-PICKUP')}>
                        {(this.props.detailbill.saturday.canceled.additionals?this.props.detailbill.saturday.canceled.additionals:0)+(this.props.detailbill.saturday.delivered.additionals?this.props.detailbill.saturday.delivered.additionals:0)+(this.props.detailbill.saturday.returned.additionals?this.props.detailbill.saturday.returned.additionals:0)}
                      </Td>
                      <Td column={gettext('BILL-TOTAL-PRICE')}>
                        {getCurLang()==='ar'?(this.props.detailbill.saturday.canceled.sum+this.props.detailbill.saturday.returned.sum+this.props.detailbill.saturday.delivered.sum) + ' ريال': (this.props.detailbill.saturday.canceled.sum+this.props.detailbill.saturday.returned.sum+this.props.detailbill.saturday.delivered.sum)+' SAR'}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td column={gettext('BILL-DAY')}>
                        {gettext('SUNDAY')}
                      </Td>
                      <Td column={gettext('BILL-DELIVERED-ORDERS')}>
                        {this.props.detailbill.sunday.delivered.count}
                      </Td>
                      <Td column={gettext('BILL-RETURNED-ORDERS')}>
                        {this.props.detailbill.sunday.returned.count}
                      </Td>
                      <Td column={gettext('BILL-CANCELED-ORDERS')}>
                        {this.props.detailbill.sunday.canceled.count}
                      </Td>
                      <Td column={gettext('BILL-ADDITIONAL-PICKUP')}>
                        {(this.props.detailbill.sunday.canceled.additionals?this.props.detailbill.sunday.canceled.additionals:0)+(this.props.detailbill.sunday.delivered.additionals?this.props.detailbill.sunday.delivered.additionals:0)+(this.props.detailbill.sunday.returned.additionals?this.props.detailbill.sunday.returned.additionals:0)}
                      </Td>
                      <Td column={gettext('BILL-TOTAL-PRICE')}>
                        {getCurLang()==='ar'?(this.props.detailbill.sunday.canceled.sum+this.props.detailbill.sunday.returned.sum+this.props.detailbill.sunday.delivered.sum) + ' ريال': (this.props.detailbill.sunday.canceled.sum+this.props.detailbill.sunday.returned.sum+this.props.detailbill.sunday.delivered.sum)+' SAR'}
                      </Td>
                    </Tr>


                    <Tr className="total">
                      <Td column={gettext('BILL-DAY')}>
                        {gettext('TOTAL')}
                      </Td>
                      <Td column={gettext('BILL-DELIVERED-ORDERS')}>
                        {this.props.detailbill.delivered}
                      </Td>
                      <Td column={gettext('BILL-RETURNED-ORDERS')}>
                        {this.props.detailbill.returned}
                      </Td>
                      <Td column={gettext('BILL-CANCELED-ORDERS')}>
                        {this.props.detailbill.canceled}
                      </Td>
                      <Td column={gettext('BILL-ADDITIONAL-PICKUP')}>
                        {this.props.detailbill.additionals}
                      </Td>
                      <Td column={gettext('BILL-TOTAL-PRICE')}>
                        {getCurLang()==='ar'?this.props.detailbill.cost + ' ريال':  this.props.detailbill.cost+' SAR'}
                      </Td>
                    </Tr>
                  </Table>

                </div>
              </Col>
            </Col>
          </Row>
        </Jumbotron>
      </div>
    );
  }
}




BillingDetailComponent.propTypes = {

};
