import React, {Component, PropTypes} from 'react';import _ from 'lodash';import { Image, Button, Modal, Checkbox } from 'react-bootstrap';import {parseExpectedPickUpTime} from '../../businessLogic/expectedPickUpTimeParser.js';import {formatTime} from '../../businessLogic/deliveryTimeFormatter.js';import orderTime from '../../businessLogic/orderTimeFormatter.js';import formatUserName from '../../businessLogic/userNameFormatter.js';import sortTimeWindow from '../../businessLogic/sortTimeWindow.js';import sortTime from '../../businessLogic/sortTime.js';import getPlatformLogo from '../../businessLogic/getPlatformLogo.js';import {Table, Tr, unsafe, Td} from 'reactable';import DateTimeField from 'react-bootstrap-datetimepicker';import '../../styles/dispatcherDashboardPageStyles.scss';import { gettext, getStatus } from '../../i18n/service.js';import {termsConditions} from '../../constants/termsConditions.js';import formatCamelCase from '../../businessLogic/formatCamelCase.js';import setOrderStatusColor from '../../businessLogic/setOrderStatusColor.js';export class DispatcherOrdersListComponent extends Component {  constructor(props) {    super(props);    this.formatDispatcherName = this.formatDispatcherName.bind(this);    this.account = this.props.account;  }  shouldComponentUpdate(nextProps, nextState) {  //    if (nextProps.account && !nextProps.account.isAccepted) {  //      this.account = nextProps.account;  //      return true;  //    } else {  //    return true;  //  }    return true;
   }  formatDispatcherName(dispatcherId) {
    const dispatcher = _.find(this.props.users, {id: dispatcherId});    if (!dispatcher) {    return '';
    }  return formatUserName(dispatcher);
  }  render() {    const TermsConditions = React.createClass({      getInitialState() {        return {          showModal: false,          isAgree: false        };      },      componentWillMount() {        var that = this;        setTimeout(function() {            that.open();        }, 1000);      },      close() {        this.setState({ showModal: false });      },      open() {        this.setState({ showModal: true });      },
      render() {
        return (
            <Modal className="terms_modal" data-keyboard="false" show={this.state.showModal}>
                <div className="content" dangerouslySetInnerHTML={{__html: termsConditions}}></div>
                <Modal.Footer>
                  <Checkbox checked={this.state.isAgree} onChange={() => this.setState({ isAgree: !this.state.isAgree })}>{gettext('AGREE-TERMS')}</Checkbox>
                  <Button onClick={() => {this.close(); this.props.acceptTerms(this.props.dispatcherId);}} disabled={!this.state.isAgree} bsStyle="success">{gettext('ACCEPT-TERMS')}</Button>
                </Modal.Footer>
            </Modal>
        );
      }
    });


    const { orders, vehicles } = this.props;
    const ordirsWithExpEndTime = orders.filter((order) => order.expectedPickUpTime!==undefined || order.express);
    const tableRows = (this.props.dateFilter && this.props.dateFilter!== 'Invalid Date'?
      _(ordirsWithExpEndTime).filter((order) => new Date(order.expectedPickUpTime.endTime).toDateString() === this.props.dateFilter
                                            && (new Date(order.deliveryTime).toDateString() === 'Invalid Date'
                                            || new Date(order.deliveryTime).toDateString() === this.props.dateFilter
                                            ))
      :
      _(ordirsWithExpEndTime))
      .sortBy('orderCreatedTime')
      .reverse()
      .map((order) => {
        const orderVehicle = _.find(vehicles, {size: +order.vehicleType});
        const renderVehicle = orderVehicle ? unsafe(`<img src="${orderVehicle.icon}" alt="${orderVehicle.type}"/>`) : '';
        const id = order.id;
        order.items = _.uniqBy(order.items, 'pickupPointId');
        const renderOrder = {
          [gettext('ORDER-#')]: order.id.slice(order.id.length - 5, order.id.length),
          [gettext('REQUIRED-VEHICLE')]: renderVehicle,
          [gettext('#-OF-ITEMS')]: _.uniqBy(order.items, 'id').length,
          [gettext('ORDER.ORDER-TIME')]: orderTime(order.orderCreatedTime),
          [gettext('EXPECTED-PICKUP-TIME')]: parseExpectedPickUpTime(order.expectedPickUpTime),
          [gettext('DELIVERY-TIME')]: order.express
                                        ?<strong className="express">{gettext('EXPRESS-DELIVERY')+'!'}</strong>
                                        :formatTime(order.deliveryTime)
        };
        return (
          <Tr
            key={`order_${order.id}`}
            data={renderOrder}
            onClick={() => this.props.showOrderDetails({id})}>

            <Td column={gettext('STATUS')}>
              <span style={setOrderStatusColor(order.orderStatus)}>{formatCamelCase(order.orderStatus)}</span>
            </Td>

          </Tr>
        );
      })
      .value();
      const defaultDateFilterInputText = this.props.dateFilter !== gettext('INVALID-DATE') ?
        new Date(this.props.dateFilter).toLocaleDateString() :
        '';
        // const defaultDateFilterInputText = this.props.dateFilter !== gettext('INVALID-DATE') ?
        //   moment(this.props.dateFilter).format('HH:mm MM/DD') :
        //   '';
    return (

      <div className="DispOrderListComponent">
        {/* !this.props.account.isAccepted?
             <TermsConditions acceptTerms={this.props.acceptTerms} dispatcherId={this.props.account.id}/>
          : ''
        */}
        <DateTimeField
          mode="date"
          defaultText={defaultDateFilterInputText}
          onChange={(e) => this.props.onDateFilterChange(e)}
          showToday={true}
          inputProps={{
            className: `dateFilterInput form-control`
          }}
        />
        <Table
          className="dispatcherDashboardPageOrdersTable"
          itemsPerPage={15}
          pageButtonLimit={5}
          previousPageLabel={gettext('NAV-PREVIOUS')}
          nextPageLabel={gettext('NAV-NEXT')}
          sortable={[
            gettext('ORDER-#'), gettext('#-OF-ITEMS'), {                column: gettext('ORDER.ORDER-TIME'),
                sortFunction: sortTime
              },
              {
                column: gettext('EXPECTED-PICKUP-TIME'),
                sortFunction: sortTimeWindow
              },
              {
                column: gettext('DELIVERY-TIME'),
                sortFunction: sortTime
              },
              gettext('DISPATCHER'), gettext('STATUS')
          ]}
          currentPage={this.currentTablePage || 0}
          onPageChange={(pageNumber) => this.currentTablePage = pageNumber}
          noDataText={gettext('NOTHING-TO-SHOW')}
          filterable={[gettext('ORDER-#'), gettext('#-OF-ITEMS'), gettext('ORDER.ORDER-TIME'), gettext('EXPECTED-PICKUP-TIME'), gettext('DELIVERY-TIME'), gettext('DISPATCHER'), gettext('STATUS')]}
          >
          {tableRows}
        </Table>
      </div>
    );
  }
}

DispatcherOrdersListComponent.propTypes = {  users: PropTypes.array,  orders: PropTypes.array,  groupages: PropTypes.array,  showOrderDetails: PropTypes.func,  onDateFilterChange: PropTypes.func.isRequired,  dateFilter: PropTypes.string,  vehicles: PropTypes.array.isRequired,  platforms: PropTypes.array.isRequired,  account: PropTypes.object,  updateLastLogin: PropTypes.func};