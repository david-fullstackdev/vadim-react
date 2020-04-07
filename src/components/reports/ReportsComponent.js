import React, {PropTypes} from 'react';
import { Button, PageHeader, Badge, Form, FormControl, ListGroup, ListGroupItem } from 'react-bootstrap';
import { gettext } from '../../i18n/service.js';
import getCurLang from '../../businessLogic/getCurLang.js';
import LoopbackHttp from '../../businessLogic/LoopbackHttp.js';
import createDataForCSV from '../../businessLogic/prepareDataForCSVReport.js';

import './ReportsComponent.scss';
import DateTimeField from 'react-bootstrap-datetimepicker';
import Autocomplete from 'react-autocomplete';
import moment from 'moment';
import MetricsGraphics from 'react-metrics-graphics';
import CsvDownloader from 'react-csv-downloader';
import {CSVLink} from 'react-csv';

export default class ReportsComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.renderFilter = this.renderFilter.bind(this);
    this.matchStateToTerm = this.matchStateToTerm.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.getDatesFromPeriod = this.getDatesFromPeriod.bind(this);

    this.filterValues = {};
    this.state = {
      editList: false,
      showTotalDeliveryCost: true,
      showSettlement: true,
      showTotalExpressCost: true,
      showTotalDeliveredOrders: true,
      showTotalReturnedOrders: true,
      showTotalCanceledOrders: true,
      showTotalOrdersWithCod: true,
      showTotalCodAmount: true,
      showTotalExpressOrders: true,
      showTotalOutOfCityOrders: true,
      showTotalRegularOrders: true,
      emailValue: undefined,
      byValue: props.byValue,
      userId: undefined,
      startDate: parseInt(moment().startOf('day').format('x')),
      endDate: parseInt(moment().endOf('day').format('x'))
    }

    this.applyFilter();

    if(!localStorage.getItem('statistic_settings')) {
      localStorage.setItem('statistic_settings', JSON.stringify(this.state));
    }
    else
      this.state = JSON.parse(localStorage.getItem('statistic_settings'));
  }

  matchStateToTerm(state, value) {
    return (
        state.email.toLowerCase().indexOf(value.toLowerCase()) !== -1
      )
  }

  applyFilter() {
    this.props.startSpinner();

    let userId = LoopbackHttp.isDispatcher?this.props.account.id:undefined;
    if(this.state.emailValue) {
      userId = this.state.userId;
    }
    this.props.getStatistics(this.state.startDate, this.state.endDate, userId);
  }

  getDatesFromPeriod(period, count) {
    this.setState({
      startDate: new Date(moment().subtract(count, period).startOf(period)).valueOf(),
      endDate: new Date(moment().subtract(count, period).endOf(period)).valueOf()
    })
  }

  renderFilter() {
    var styles = {
      item: {
        padding: '2px 6px',
        cursor: 'default'
      },

      highlightedItem: {
        color: 'white',
        background: 'hsl(200, 50%, 50%)',
        padding: '2px 6px',
        cursor: 'default'
      },

      menu: {
        border: 'solid 1px #ccc'
      }
    }
    return (
      <Form
       className ={getCurLang()==='ar'?'formReverse':''}>
          <div>
          <div className="filter_input">
            <FormControl
              componentClass="select"
              name="byValue"
              onChange={(event) =>  {
                if(event.target.value==='week')
                    this.getDatesFromPeriod('week', 0);
                else if(event.target.value==='month')
                    this.getDatesFromPeriod('month', 0);
                else if(event.target.value==='day') {
                  this.setState({
                    startDate: parseInt(moment().startOf('day').format('x')),
                    endDate: parseInt(moment().endOf('day').format('x')),
                  });
                }
                else if(event.target.value==='year')
                     this.getDatesFromPeriod('year', 0);
                else if(event.target.value==='lastweek')
                    this.getDatesFromPeriod('week', 1);
                else if(event.target.value==='lastmonth')
                    this.getDatesFromPeriod('month', 1);
                else if(event.target.value==='lastyear')
                    this.getDatesFromPeriod('year', 1);

                    this.setState({byValue: event.target.value})
              }}>
                <option value="day" selected={this.state.byValue === "day"}>{gettext('BY-DAY')}</option>
                <option value="week" selected={this.state.byValue === "week"}>{gettext('THIS-WEEK')}</option>
                <option value="month" selected={this.state.byValue === "month"}>{gettext('THIS-MONTH')}</option>
                <option value="year" selected={this.state.byValue === "year"}>{gettext('THIS-YEAR')}</option>
                <option value="lastweek" selected={this.state.byValue === "lastweek"}>{gettext('LAST-WEEK')}</option>
                <option value="lastmonth" selected={this.state.byValue === "lastmonth"}>{gettext('LAST-MONTH')}</option>
                <option value="lastyear" selected={this.state.byValue === "lastyear"}>{gettext('LAST-YEAR')}</option>
                <option value="period" selected={this.state.byValue === "period"}>{gettext('BY-PERIOD')}</option>
            </FormControl>
          </div>
          { !LoopbackHttp.isDispatcher ?
            <div className="filter_input_email">
                <Autocomplete
                  value={this.state.emailValue}
                  inputProps={{ name:'emailValue', id: 'email-autocomplete', placeholder: gettext('ENTER-USER-EMAIL') }}
                  items={_.uniqBy(this.props.users, 'id')}
                  getItemValue={(item) => item.email}
                  onChange={(event, value) => this.setState({ emailValue: value, userId: undefined })}
                  onSelect={(value, item) => this.setState({emailValue:item.email, userId: item.id})}
                  shouldItemRender={this.matchStateToTerm}
                  open={this.state.emailValue && this.state.emailValue.length > 0 && !this.state.userId}
                  renderItem={(item, isHighlighted) => (
                    <div style={isHighlighted ? styles.highlightedItem : styles.item}
                    key={item.id + item.email+ Math.random().toString()}>{item.email}</div>
                  )}
                />
            </div>
            : ''
          }

            <Button
              bsStyle="success"
              onClick={() => this.applyFilter()}
              >
            { gettext('FILTER') }
            </Button>
            { this.state.byValue==="day" || this.state.byValue === 'day'?
              <div className="datetime">
                <DateTimeField
                  mode="date"
                  viewMode="days"
                  maxDate={moment().zone('+0300')}
                  name="dateValue"
                  defaultText={moment(this.state.startDate).zone('+0300').format('L')}
                  inputFormat="MM/DD/YYYY"
                  inputProps={{
                    name: "reportsDateFilter",
                    className: "form-control filter_input"
                  }}
                  onChange={(event) =>  {
                    this.setState({
                      startDate: parseInt(moment(parseInt(event)).startOf('day').format('x')),
                      endDate: parseInt(moment(parseInt(event)).endOf('day').format('x')),
                    });
                  }}/>
                </div> : ""
              }
              { this.state.byValue==="period"?
                <div className="datetime">
                  <label>{gettext('FROM')}</label>
                  <DateTimeField
                    mode="date"
                    viewMode="days"
                    maxDate={moment().zone('+0300')}
                    name="dateValue"
                    defaultText={moment(this.state.startDate).zone('+0300').format('L')}
                    inputFormat="MM/DD/YYYY"
                    inputProps={{
                      name: "reportsDateFilter",
                      className: "form-control filter_input margin_bottom_halfem"
                    }}
                    onChange={(event) =>  {
                      this.setState({
                        startDate: parseInt(moment(parseInt(event)).startOf('day').format('x'))
                      });
                    }}/>
                  <label>{gettext('TO')}</label>
                  <DateTimeField
                    mode="date"
                    viewMode="days"
                    maxDate={moment().zone('+0300')}
                    name="dateValue"
                    defaultText={moment(this.state.endDate).zone('+0300').format('L')}
                    inputFormat="MM/DD/YYYY"
                    inputProps={{
                      name: "reportsDateFilterEnd",
                      className: "form-control filter_input"
                    }}
                    onChange={(event) =>  {
                      this.setState({
                        endDate: parseInt(moment(parseInt(event)).endOf('day').format('x'))
                      });
                    }}/>
                  </div> : ""
                }
            </div>
          </Form>
    )
  }

  render() {
    const DispatcherInfo = () => {
        return  (
              <div className="report_list_container dispatcher_info">
                <ListGroup>
                    <ListGroupItem>
                      <p><strong>{gettext("NAME")}</strong>: {this.props.statistics.user.instance.firstName||this.props.statistics.user.instance.name}</p>
                    </ListGroupItem>
                    <ListGroupItem>
                      <p><strong>{gettext("MOBILE")}</strong>: {this.props.statistics.user.instance.phone
                                                                      ?this.props.statistics.user.instance.phone : this.props.statistics.user.instance.mobile}</p>
                    </ListGroupItem>
                    <ListGroupItem>
                      <p><strong>{gettext("DELIVERY-COST")}</strong>: {
                        this.props.statistics.user.instance.deliveryCommission
                          ?this.props.statistics.user.instance.deliveryCommission
                          :this.props.company.deliveryCommission
                      }</p>
                    </ListGroupItem>
                    <ListGroupItem>
                      <p><strong>{gettext("EXPRESS-DELIVERY-COST")}</strong>: {
                        this.props.statistics.user.instance.expressDeliveryCommission
                          ?this.props.statistics.user.instance.expressDeliveryCommission
                          :this.props.company.expressDeliveryCommission
                      }</p>
                    </ListGroupItem>
                    <ListGroupItem>
                      <p><strong>{gettext("ADDITIONAL-PICKUP-POINT-COST")}</strong>: {

                          this.props.statistics.user.instance.additionalPickupPointCost
                            ?this.props.statistics.user.instance.additionalPickupPointCost
                            :this.props.company.expressDeliveryCommission
                      }</p>
                    </ListGroupItem>
                </ListGroup>
              </div>
          );
    };

  return (
    <div className="ReportsComponent">
      <PageHeader>{ gettext('DOOK-REPORTS') }</PageHeader>
        <div className="filter_container">
            {this.renderFilter()}
        </div>

        <div className="dates">
          <h2>
          { this.state.byValue==='day'
              ? moment(this.state.startDate).zone('+0300').format('L')
              : moment(this.state.startDate).zone('+0300').format('L') + " - " + moment(this.state.endDate).zone('+0300').format('L')
          }
          </h2>
        </div>

        <div className="lists">
        {
          (this.state.emailValue || this.state.userId) && this.props.statistics?
            DispatcherInfo()
            :''
        }

        <div className="report_list_container">
          <ListGroup>
              {/*}<ListGroupItem className={!this.state.editList && !this.state.showTotalRegularOrders? 'display_none' : ''}>
                <p>{gettext("TOTAL-REGULAR-ORDERS")}
                {
                  this.state.editList
                  ?<input type="checkbox"
                    checked={this.state.showTotalRegularOrders}
                    className="float_right check_doublescale"
                    onChange={() => {
                      this.setState({showTotalRegularOrders: !this.state.showTotalRegularOrders});
                    }}/>
                  :<Badge>{(this.props.statistics && this.props.statistics.delivered?this.props.statistics.delivered.regular:0)
                            + (this.props.statistics && this.props.statistics.returned?this.props.statistics.returned.regular:0)}</Badge>
                }
                </p>
              </ListGroupItem>
              <ListGroupItem className={!this.state.editList && !this.state.showTotalExpressOrders? 'display_none' : ''}>
                <p>{gettext("TOTAL-WITH-EXPRESS")}
                {
                  this.state.editList
                  ?<input type="checkbox"
                    checked={this.state.showTotalExpressOrders}
                    className="float_right check_doublescale"
                    onChange={() => {
                      this.setState({showTotalExpressOrders: !this.state.showTotalExpressOrders});
                    }}/>
                  :<Badge>{(this.props.statistics && this.props.statistics.delivered?this.props.statistics.delivered.express:0)
                            + (this.props.statistics && this.props.statistics.returned?this.props.statistics.returned.express:0)}</Badge>
                }
                </p>
              </ListGroupItem>
              <ListGroupItem className={!this.state.editList && !this.state.showTotalOutOfCityOrders? 'display_none' : ''}>
                <p>{gettext("TOTAL-OUT-OF-CITY-ORDERS")}
                {
                  this.state.editList
                  ?<input type="checkbox"
                    checked={this.state.showTotalOutOfCityOrders}
                    className="float_right check_doublescale"
                    onChange={() => {
                      this.setState({showTotalOutOfCityOrders: !this.state.showTotalOutOfCityOrders});
                    }}/>
                  :<Badge>{(this.props.statistics && this.props.statistics.delivered?this.props.statistics.delivered.outOfCity:0)
                            + (this.props.statistics &&this.props.statistics.returned?this.props.statistics.returned.outOfCity:0)}</Badge>
                }
                </p>
              </ListGroupItem>*/}
              <ListGroupItem className={!this.state.editList && !this.state.showTotalDeliveredOrders? 'display_none' : ''}>
                <p>{gettext("TOTAL-DELIVERED")}
                  {
                    this.state.editList
                    ?<input type="checkbox"
                      checked={this.state.showTotalDeliveredOrders}
                      className="float_right check_doublescale"
                      onChange={() => {
                        this.setState({showTotalDeliveredOrders: !this.state.showTotalDeliveredOrders});
                      }}/>
                    :<Badge>{this.props.statistics && this.props.statistics.delivered?this.props.statistics.delivered.count:0}</Badge>
                  }
                </p>
              </ListGroupItem>
              <ListGroupItem className={!this.state.editList && !this.state.showTotalReturnedOrders? 'display_none' : ''}>
                <p>{gettext("TOTAL-RETURNED")}
                  {
                    this.state.editList
                    ?<input type="checkbox"
                      checked={this.state.showTotalReturnedOrders}
                      className="float_right check_doublescale"
                      onChange={() => {
                        this.setState({showTotalReturnedOrders: !this.state.showTotalReturnedOrders});
                      }}/>
                    :<Badge>{this.props.statistics && this.props.statistics.returned?this.props.statistics.returned.count:0}</Badge>
                  }
                </p>
              </ListGroupItem>
              <ListGroupItem className={!this.state.editList && !this.state.showTotalCanceledOrders? 'display_none' : ''}>
                <p>{gettext("TOTAL-CANCELED")}
                  {
                    this.state.editList
                    ?<input type="checkbox"
                      checked={this.state.showTotalCanceledOrders}
                      className="float_right check_doublescale"
                      onChange={() => {
                        this.setState({showTotalCanceledOrders: !this.state.showTotalCanceledOrders});
                      }}/>
                    :<Badge>{this.props.statistics && this.props.statistics.canceled?this.props.statistics.canceled.count:0}</Badge>
                  }
                </p>
              </ListGroupItem>
              <ListGroupItem className={!this.state.editList && !this.state.showTotalCodAmount? 'display_none' : ''}>
                <p>{gettext("TOTAL-COD-AMOUNT")}
                {
                  this.state.editList
                  ?<input type="checkbox"
                    checked={this.state.showTotalCodAmount}
                    className="float_right check_doublescale"
                    onChange={() => {
                      this.setState({showTotalCodAmount: !this.state.showTotalCodAmount});
                    }}/>
                  :<Badge>{this.props.statistics && this.props.statistics.total.cashOnDeliveryTotal? this.props.statistics.total.cashOnDeliveryTotal:0}{' SAR'}</Badge>
                }
                </p>
              </ListGroupItem>
              <ListGroupItem className={!this.state.editList && !this.state.showTotalDeliveryCost? 'display_none' : ''}>
                <p>{gettext("TOTAL-DELIVERY-COST")}
                  {
                    this.state.editList
                    ?<input type="checkbox"
                      checked={this.state.showTotalDeliveryCost}
                      className="float_right check_doublescale"
                      onChange={() => {
                        this.setState({showTotalDeliveryCost: !this.state.showTotalDeliveryCost});
                      }}/>
                    :<Badge>{this.props.statistics && this.props.statistics.total.subTotal?this.props.statistics.total.subTotal:0}{' SAR'}</Badge>
                  }
                </p>
              </ListGroupItem>
              <ListGroupItem className={!this.state.editList && !this.state.showSettlement? 'display_none' : ''}>
                <p>{gettext("SETTLEMENT")}
                  {
                    this.state.editList
                    ?<input type="checkbox"
                      checked={this.state.showSettlement}
                      className="float_right check_doublescale"
                      onChange={() => {
                        this.setState({showSettlement: !this.state.showSettlement});
                      }}/>
                    :<Badge>{this.props.statistics && this.props.statistics.total.settlement?this.props.statistics.total.settlement:0}{' SAR'}</Badge>
                  }
                </p>
              </ListGroupItem>
          </ListGroup>
        </div>
        <div className="edit_reports_btn">
          <button className="btn btn-success"
            onClick={() => {
              this.setState({editList: !this.state.editList});
              if(this.state.editList) {
                let settings = this.state;
                this.state.editList = false;
                localStorage.setItem('statistic_settings', JSON.stringify(settings));
                this.forceUpdate();
              }
            }}>
            {this.state.editList ? gettext('SAVE'): gettext('EDIT')}
          </button>
        </div>
      </div>

      <div className="lists csv_container">
        <CSVLink
          filename={"report"+moment(this.props.dateValue).zone('+0300').format('L')+".csv"}
          className="btn btn-success button_csv"
          data={createDataForCSV(this.props.statistics, this.state.startDate, this.state.endDate, this.props.orders, this.props.company)}
          target="_blank"
          separator={"|"}>
            {gettext('DOWNLOAD-CSV')}
        </CSVLink>
      </div>
      {/*<div className="graphics_container">
          <div className="graphic">
            <h2 className="text-center">{gettext('TOTAL-DELIVERED')}</h2>
              <MetricsGraphics
                title="Delivered"
                data={ this.props.deliveredOrdersDataForGraphic }
                min_y_from_data={0}
                min_y={0}
                height={300}
                european_clock={true}
                full_width={true}
                point_size={4}
                x_label={this.state.byValue==='day'?'Hours':'Date'}
                y_label="Count"
                x_accessor="Date"
                y_accessor="Count"/>

          </div>
          <div className="graphic">
            <h2 className="text-center">{gettext('TOTAL-CANCELED')}</h2>
            <MetricsGraphics
              title="Canceled"
              data={ this.props.canceledOrdersDataForGraphic }
              min_y={0}
              height={300}
              european_clock={true}
              full_width={true}
              point_size={4}
              x_label={this.state.byValue==='day'?'Hours':'Date'}
              y_label="Count"
              x_accessor="Date"
              y_accessor="Count"/>
          </div>
        </div>*/}
    </div>

    );
  }
}




ReportsComponent.propTypes = {
  deliveredOrders: PropTypes.array,
  canceledOrders: PropTypes.array,
  returnedOrders: PropTypes.array,
  ordersWithCOD:PropTypes.array,
  totalCOD: PropTypes.number,
  filterUpdate: PropTypes.func,
  dateValue: PropTypes.number,
  allDispatchers: PropTypes.array,
  emailValue: PropTypes.string,
  byValue: PropTypes.string,
  deliveredOrdersDataForGraphic: PropTypes.array,
  canceledOrdersDataForGraphic: PropTypes.array,
  averageDeliveredOrders: PropTypes.string,
  averageCanceledOrders: PropTypes.string,
  averageCOD_Orders: PropTypes.string,
  dispatcher: PropTypes.object,
  totalRegularCost: PropTypes.number,
  totalExpressCost: PropTypes.number,
  ordersWithExpress: PropTypes.array,
  averageExpressOrders: PropTypes.string,
  clearFilter: PropTypes.func,
  dataForCSV: PropTypes.array
};
