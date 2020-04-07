import React, {PropTypes} from 'react';
import { Jumbotron, Button, Row, PageHeader,FormGroup, FormControl, Col, ControlLabel, Link  } from 'react-bootstrap';
import { gettext } from '../../../i18n/service.js';
import {Table, Tr, Td, Th, Thead} from 'reactable';
import getCurLang from '../../../businessLogic/getCurLang.js';
import _ from 'lodash';
import { SHA256 } from 'crypto-js';
import BillingDetailComponent from './BillingDetailComponent.js';

export default class BillingComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.createNewCard = false;

    this.state = {
      detailbill: null,
      selectedWeek: null
    }

    // this.props.getBills()
    _.bindAll(this, ['submit', 'renderBillingForm']);
  }

  submit(e) {
      e.preventDefault();
      e.stopPropagation();
        const elems = Array.from(e.target.elements);
        let fields = elems.reduce((prev, curr) => {
          if (!curr.name) {
            return prev;
          }
          return prev;
        }, {});
      return true;
      this.props.onSubmit(values);
  }

  renderBillingForm() {
    return (
      <Jumbotron>
        <Row>
          <Col sm={6}>
            <h6><span>{gettext('TOTAL-PROCESSED-ORDERS')+':'}</span></h6>
            <h6><span>{gettext('TOTAL-PICKUP-POINTS')+':'}</span></h6>
            <h6><span>{gettext('DELIVERED-ORDERS')+':'}</span></h6>
            <h6><span>{gettext('RETURNED-ORDERS')+':'}</span></h6>
            <h6><span>{gettext('AVERAGE-ORDER-COST')+':'}</span></h6>
          </Col>
          <Col sm={6}>
            <h6><span>1</span></h6>
            <h6><span>1</span></h6>
            <h6><span>1</span></h6>
            <h6><span>1</span></h6>
            <h6><span>1</span></h6>
          </Col>
        </Row>
      </Jumbotron>
    );
  }
  getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0,0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return [d.getFullYear(), weekNo];
  }
  getWeekOrders(n){
    var orders = [];
    for (var i = this.getCurrentWeekNumber(); i >= 1; i--) {
      orders.push([]);
    }
    var that=this;
    var currentWeekNumber = this.getCurrentWeekNumber();
    this.props.orders.map(function(order, index){
      if((order.createdAt) && (that.getWeekNumber(new Date(Date.parse(order.createdAt)))[1] <= currentWeekNumber)){
        orders[that.getWeekNumber(new Date(Date.parse(order.createdAt)))[1]-1].push(order);
      }
    })
    return orders;
  }
  setOrderToDetail(detailbill, i){
    this.setState({detailbill:detailbill, selectedWeek: i})
  }
  showBills(bills){
    var that = this;
    var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    if(bills){
      return bills.billings.map(function(billing, index){
        var firstday = new Date(Date.parse(billing.startTime));
        var lastday = new Date(Date.parse(billing.endTime));
        return  <Tr className = {(that.state.detailbill&&billing.id===that.state.detailbill.id)?'active':''} data-key={index} key={index} onClick = {() => that.setOrderToDetail(billing, that.getWeekNumber(firstday)[1])}>
                  <Td column={gettext('WEEK')}>
                    {"Week "+that.getWeekNumber(firstday)[1]}
                  </Td>
                  <Td column={gettext('DATE')}>
                    {monthNames[firstday.getMonth()] + ' ' + firstday.getUTCDate() + ' - ' + monthNames[lastday.getMonth()] + ' ' + lastday.getUTCDate()}
                  </Td>
                  <Td className={billing.status} column={gettext('STATUS')}>
                    {billing.status}
                  </Td>
                  <Td column={gettext('BALANCE')}>
                    {getCurLang()==='ar'?billing.cost + ' ريال':billing.cost+' SAR'}
                  </Td>
                </Tr>
      })
    }
  }
  render() {
    var bills=this.props.bills;
    return (
      <div className='dispatcher_profile'>
        <Jumbotron>
          <div className="item_head_title">
            <h3>{gettext('BILLING')}</h3>
          </div>
          <Row className="center_flex display_none">
              <Col sm={8}>
                <div>
                  <div className="multi_select">
                    <FormGroup controlId="formControlsSelectMultiple">
                      <FormControl componentClass="select" multiple>

                      </FormControl>
                    </FormGroup>
                  </div>
                  <div className="milti_controls">
                   <Button className="multi_btn margin_bottom_halfem">+</Button>
                   <Button className="multi_btn margin_bottom_halfem">-</Button>
                  </div>
                </div>
              </Col>
          </Row>
          {/*<Row className="center_flex margin_bottom_em">
            <Col sm={10}>
              <Col sm={12}>
                <FormControl
                   type="text"
                   required={true}
                   placeholder={gettext('SEARCH')}
                   onChange={(e) => this.setState({filterValue: e.target.value})}/>
              </Col>
            </Col>
          </Row>*/}
          <Row className="center_flex">
            <Col sm={10}>
              <Col sm={12}>
                <div className="table_container">
                  <Table className="company_table table-fixedheader-bill-table">
                    <Thead>
                      <Th column={gettext('WEEK')}>
                        <span title={gettext('NAME')}>{gettext('WEEK')}</span>
                      </Th>
                      <Th column={gettext('DATE')}>
                        <span title={gettext('CITY')}>{gettext('DATE')}</span>
                      </Th>
                      <Th column={gettext('STATUS')}>
                        <span title={gettext('STATUS')}>{gettext('STATUS')}</span>
                      </Th>
                      <Th column={gettext('BALANCE')}>
                        <span title={gettext('BALANCE')}>{gettext('BALANCE')}</span>
                      </Th>
                    </Thead>
                    {
                      this.showBills(bills)
                    }
                  </Table>
                </div>
                
              </Col>
            </Col>
          </Row>
        </Jumbotron>
        {this.state.detailbill?<BillingDetailComponent router={this.props.router} selectedWeek={this.state.selectedWeek} detailbill={this.state.detailbill}/>:''}
      </div>
    );
  }
}




BillingComponent.propTypes = {
  orders: PropTypes.array
};
