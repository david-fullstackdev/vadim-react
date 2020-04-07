import React, { PropTypes } from 'react';
import { Router } from 'react-router';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/appActions';
import * as fleetActions from '../actions/fleetOwnerActions';
import * as logoutPageActions from '../actions/logoutPageActions';
import * as adminActions from '../actions/adminActions';

import LoopbackHttp from '../businessLogic/LoopbackHttp.js';
import { Navbar, Nav, NavItem, Button, Link, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import UserLanguageSelectContainer from './UserLanguageSelectContainer';
import AutoassignContainer from './AutoassignContainer';

import objectAssign from 'object-assign';
import NotificationSystem from 'react-notification-system';
import _ from 'lodash';
import { gettext } from '../i18n/service';
import getCurLang from '../businessLogic/getCurLang.js';
import Spinner from 'react-spinner';
import { addConsult } from '../businessLogic/onlineConsult.js';
import soundNotification from '../businessLogic/soundNotification';
import { getDashboardButtonStyle } from '../businessLogic/getButtonStyle.js';
import LoadingBar from 'react-redux-loading-bar';
import { makePurchase, showPurchaseResults } from '../businessLogic/pay';
import { fleetDashLoader } from '../businessLogic/dashboardLoader';



var lan = getCurLang();

const floatRight = {
  float: 'right'
};

const zeroMargin = {
  marginLeft: '0'
};

export class App extends React.Component {
  getInitialState() {
    return { buildNum: { build_num: 0 } };
  }
  constructor(props, context) {
    super(props, context);
    this.isDispatcher = LoopbackHttp.isDispatcher;
    this.isOperator = LoopbackHttp.isOperator;
    this.isFleet = LoopbackHttp.isFleet;
    this.showMessage = this.showMessage.bind(this);
    this.subscribeOnStreamUpdates = this.subscribeOnStreamUpdates.bind(this);
    this.isSubscribed = false;
    this.card = undefined;

    this.state = {
      showSettingsMenu: false
    };

    if (!localStorage.getItem('sound_notifications'))
      localStorage.setItem('sound_notifications', true);

    this.getBuildNum();

  }

  componentDidMount() {

    if (!LoopbackHttp.isAuthenticated()) {
      return;
    } else {
      this.props.actions.getDriversCount();
    }

    if (localStorage.getItem('isRecipient') !== null) {
      localStorage.removeItem('isRecipient');
      this.props.actions.endSpinner();
      return false;
    }

    this.props.actions.startSpinner();
    this.props.actions.getAccount();
    this.props.actions.getCountries();
    this.props.actions.getPickUpPoints();
    this.props.actions.getRecipients();
    if (!LoopbackHttp.isDispatcher)
      this.props.actions.getCoefficients();
  }

  subscribeOnStreamUpdates() {
    this.isSubscribed = true;
    // this.props.actions.subscribeOnServerEvents();

    const { addNewOrderToStore, updateLocalRecipient, addNewTeamToStore, updateLocalTeam, updateLocalOrder, addNewUserToStore, updateLocalUser, addNewGroupageToStore, updateLocalGroupage, addNewRecipientToStore, addNewPickUpPointToStore, updateLocalPickUpPoint } = this.props.actions;

    var eventStream = LoopbackHttp.subscribeOnServerEvents();

    eventStream.addEventListener('data', (msg) => {

      let data = JSON.parse(msg.data);

      if (data.model === 'Order') {
        if (data.type === 'create') {
          soundNotification.checkOrderAndPlayNotification(data.data);

          this.showMessage({
            level: 'success',
            children: (
              <span>
                {gettext('ORDER#') + ' '}
                <a onClick={() => this.props.router.push(`/orderDetails/${data.data.id}`)}>
                  {data.data.id.slice(data.data.id.length - 5, data.data.id.length)}
                </a>
                {' ' + gettext('HAS-BEEN-CREATED')}
              </span>
            )
          });
          return addNewOrderToStore(data.data);
        } else if (data.type === 'update') {
          soundNotification.checkOrderAndPlayNotification(data.data);
          let oldOrder = _.find(this.props.orders, { id: data.data.id });

          if (data.data.autoAssign === false) {
            this.showMessage({
              level: 'error',
              children: (
                <span>
                  {gettext('AUTOASSIGNING-FOR-ORDER') + ' '}
                  <a onClick={() => this.props.router.push(`/orderDetails/${data.data.id}`)}>
                    {data.data.id.slice(data.data.id.length - 5, data.data.id.length)}
                  </a>
                  {' ' + gettext('FAILED')}
                </span>
              )
            });

            return updateLocalOrder(data.data, { autoAssign: 'fail' });
          }
          else if (data.data.orderStatus === 'new' && data.data.driverId) {
            data.data.driverId = undefined;
            return updateLocalOrder(data.data, { autoAssign: 'fail' });
          }
          else if (data.data.orderStatus === 'delivered') {
            if (oldOrder && oldOrder.orderStatus !== data.data.orderStatus) {
              this.showMessage({
                level: 'success',
                children: (
                  <span>
                    {gettext('ORDER#') + ' '}
                    <a onClick={() => this.props.router.push(`/orderDetails/${data.data.id}`)}>
                      {data.data.id.slice(data.data.id.length - 5, data.data.id.length)}
                    </a>
                    {' ' + gettext('HAS-BEEN-DELIVERED')}
                  </span>
                )
              });
            }
          }
          else if (data.data.orderStatus === 'returned') {
            if (oldOrder && oldOrder.orderStatus !== data.data.orderStatus) {
              this.showMessage({
                level: 'success',
                children: (
                  <span>
                    {gettext('ORDER#') + ' '}
                    <a onClick={() => this.props.router.push(`/orderDetails/${data.data.id}`)}>
                      {data.data.id.slice(data.data.id.length - 5, data.data.id.length)}
                    </a>
                    {' ' + gettext('HAS-BEEN-RETURNED')}
                  </span>
                )
              });
            }
          }
          else if (data.data.driverId) {
            if (oldOrder && oldOrder.driverId !== data.data.driverId) {
              let driver = _.find(this.props.users, { id: data.data.driverId });
              if (driver)
                this.showMessage({
                  level: 'success',
                  children: (
                    <span>
                      {gettext('ORDER#') + ' '}
                      <a onClick={() => this.props.router.push(`/orderDetails/${data.data.id}`)}>
                        {data.data.id.slice(data.data.id.length - 5, data.data.id.length)}
                      </a>
                      {' ' + gettext('ASSIGNED-TO')}
                      {' ' + driver.firstName}
                    </span>
                  )
                });
            }
          }
          else if (oldOrder && oldOrder.orderStatus === data.data.orderStatus) {
            this.showMessage({
              level: 'success',
              children: (
                <span>
                  {gettext('ORDER#') + ' '}
                  <a onClick={() => this.props.router.push(`/orderDetails/${data.data.id}`)}>
                    {data.data.id.slice(data.data.id.length - 5, data.data.id.length)}
                  </a>
                  {' ' + gettext('HAS-BEEN-UPDATED')}
                </span>
              )
            });
          }
          return updateLocalOrder(data.data);
        }
      } else if (data.model === 'Item') {
        if (data.type === 'create') {
          const order = _.find(this.props.orders, { id: data.data.orderId });
          if (!order) {
            return;
          }
          let orderItems = order.items || [];
          if (_.some(order.items, { id: data.data.id })) {
            return;
          }
          return updateLocalOrder(order, { items: orderItems.concat([data.data]) });
        } else if (data.type === 'update') {
          const order = _.find(this.props.orders, { id: data.data.orderId });
          if (!order) {
            return;
          }
          let orderItems = objectAssign([], order.items);
          let item = _.find(orderItems, { id: data.data.id });
          objectAssign(item, data.data);
          return updateLocalOrder(order, { items: orderItems });
        }
      } else if (data.model === 'Groupage') {
        if (data.type === 'create') {
          addNewGroupageToStore(data.data);
        } else if (data.type === 'update') {
          updateLocalGroupage(data.data);
        }
      } else if (data.model === 'Company') {
        if (data.type === 'update') {
          this.props.adminActions.updateLocalCompany(data.data.id, data.data);
        }
      } else if (data.model === 'PickUpPoint') {
        if (data.type === 'create') {
          addNewPickUpPointToStore(data.data);
        } else if (data.type === 'update') {
          updateLocalPickUpPoint(data.data);
        }
      } else if (data.model === 'Driver' || data.model === 'Dispatcher' || data.model === 'Operator') {
        if (data.type === 'create') {
          addNewUserToStore(data.data);
        } else if (data.type === 'update') {
          updateLocalUser(data.data);
        }
      } else if (data.model === 'Recipient') {
        if (data.type === 'create') {
          addNewRecipientToStore(data.data);
        } else if (data.type === 'update') {
          return updateLocalRecipient(data.data);
        }
      } else if (data.model === 'Team') {
        if (data.type === 'create') {
          addNewTeamToStore(data.data);
        } else if (data.type === 'update') {
          updateLocalTeam(data.data);
        }
      }
    });
  }

  componentWillReceiveProps(nextProps) {

    if (!LoopbackHttp.isAuthenticated()) {
      this.props.actions.endSpinner();
      return;
    }

    if (localStorage.getItem('userType') === 'driver') {
      this.props.logoutPageActions.logout();
    }

    if (localStorage.getItem('isRecipient') !== null) {
      localStorage.removeItem('isRecipient');
      this.props.actions.endSpinner();
    }

    if (nextProps.redirectAfterLogin) {
      this.props.actions.startSpinner();
      this.props.actions.getAccount();
      this.props.actions.getCountries();
      this.props.actions.getPickUpPoints();
      this.props.actions.getRecipients();



      this.isAuthenticated = true;
    }

    if (LoopbackHttp.isOperator) {
      if (nextProps.account !== this.props.account) {
        this.props.actions.getCompany(nextProps.account.companyId);
        // this.props.fleetActions.getOperatorUsers(nextProps.account.id);
      }
    }

    if (LoopbackHttp.isFleet) {

      if (nextProps.account !== this.props.account) {
        if (nextProps.account.isBlocked) {
          this.props.actions.endSpinner();
        }
        this.props.actions.getCompany(nextProps.account.id);
        this.props.fleetActions.getCards(nextProps.account.id);
        this.props.actions.getBills();

        if (localStorage.getItem('fort_token')) {
          let response = JSON.parse(localStorage.getItem('fort_token'));

          this.card = {
            title: response.card_number,
            pftoken: response.token_name,
            fleetOwnerId: nextProps.account.id,
            merchant_reference: response.merchant_reference
          }

          if (response.response_message === 'Success') {
            if (localStorage.getItem('addCard') !== null) {
              this.props.fleetActions.addNewCard(this.card);
              localStorage.removeItem('addCard');
              localStorage.removeItem('fort_token');
              return this.showMessage({
                message: gettext('CARD-ADDED'),
                level: 'success'
              });
            }
          }
          else {
            return this.showMessage({
              message: response.response_message,
              level: 'error'
            });
          }
        }
      }

      if (nextProps.bills !== this.props.bills && localStorage.getItem('fort_token') && localStorage.getItem('purchase') !== null) {
        let bill = _.find(nextProps.bills.billings, { status: 'unpaid' });
        let request = makePurchase(bill.cost * 100, this.card, this.props.account.email);
        this.props.fleetActions.purchase(request, bill.id);
      }

      if (nextProps.fortResponse !== this.props.fortResponse && localStorage.getItem('purchase') !== null) {
        if (nextProps.fortResponse['3ds_url'])
          window.location.replace(nextProps.fortResponse['3ds_url']);
      }
    }

    if (LoopbackHttp.isDispatcher) {
      if (nextProps.account !== this.props.account) {
        this.props.actions.getCompany(nextProps.account.companyId);
        this.props.actions.getOrders();
      }
    }

    if (LoopbackHttp.isAdministrator) {
      if (nextProps.account !== this.props.account) {
        this.props.actions.getCompany(nextProps.account.companyId);
      }

    }

    if (!this.isSubscribed) {
      this.subscribeOnStreamUpdates();
    }

    if (this.props.bills && localStorage.getItem('success_purchase') !== null && localStorage.getItem('purchase') !== null) {
      let dataForMessage = showPurchaseResults();
      if (dataForMessage.fortId) {
        let bill = _.find(this.props.bills.billings, { status: 'unpaid' });
        this.props.fleetActions.updateBill({ billId: bill.id, fortId: dataForMessage.fortId, status: 'paid' });
      }
      localStorage.removeItem('purchase');
      return this.showMessage({
        message: dataForMessage.message,
        level: dataForMessage.level
      });
    }
  }

  showMessage(opts) {
    if (!this._notificationSystem) {
      return;
    }
    this._notificationSystem.addNotification(opts);
  }

  toggleSettingsMenu() {
    this.setState({ showSettingsMenu: !this.state.showSettingsMenu });
  }

  getBuildNum() {
    fetch(`https://circleci.com/api/v1.1/recent-builds?circle-token=919c3edaadd2d87050cb6af83608a53770f81258`)
      .then((result) => result.json())
      .then(data => { this.setState({ buildNum: data[0] }) })

  }

  calculateActiveOrders() {
    const { orders } = this.props;
    if (orders && orders.length) {
      let count = 0;
      for (let i = 0; i < orders.length; i++) {
        if (orders[i].orderStatus !== 'returned' && orders[i].orderStatus !== 'canceled' && orders[i].orderStatus !== 'delivered') {
          count++;
        }
      }
      return count;
    } else {
      return 0;
    }
  }

  render() {
    const isAuthenticated = LoopbackHttp.isAuthenticated();
    const isDispatcherActive = LoopbackHttp.isUserActive();
    const navLinksForDispatcher = [];
    if (LoopbackHttp.isDispatcher) {
      if (isDispatcherActive) {
        navLinksForDispatcher.push(
          <LinkContainer key="navLinkDDashboard" to="/dispatcherDashboard">
            <NavItem eventKey={1}>
              {gettext('DISPATCHER.DISPATCHER-DASHBOARD')}
            </NavItem>
          </LinkContainer>
        );
        navLinksForDispatcher.push(
          <LinkContainer key="navLinkSettings" to="/fleetSettings">
            <NavItem eventKey={5}>
              {gettext('SETTINGS')}
            </NavItem>
          </LinkContainer>
        );
      }
      else {
        navLinksForDispatcher.push(
          <LinkContainer key="navLinkConfirmation" to="/Confirmation">
            <NavItem eventKey={1}>
              {'Confirmation'}
            </NavItem>
          </LinkContainer>
        );
      }

    }

    const navLinksForOperator = [];
    if (LoopbackHttp.isOperator || LoopbackHttp.isAdministrator) {
      navLinksForOperator.push(
        <LinkContainer key="navLinkDashboard" to="/dashboard">
          <NavItem eventKey={1}>
            {LoopbackHttp.isAdministrator ? gettext('ADMIN.ADMIN-DASHBOARD') : ''}
            {LoopbackHttp.isOperator ? gettext('OPERATOR.OPERATOR-DASHBOARD') : ''}
          </NavItem>
        </LinkContainer>
      );

      navLinksForOperator.push(
        <LinkContainer key="navLinkSettings" to="/fleetSettings">
          <NavItem eventKey={5}>
            {gettext('SETTINGS')}
          </NavItem>
        </LinkContainer>
      );

      // {
      //   LoopbackHttp.isAdministrator
      //   ? navLinksForOperator.push(
      //     <LinkContainer key="navLinkAdminSettings" to="/settings">
      //       <NavItem eventKey={5}>
      //         {gettext('SETTINGS')}
      //       </NavItem>
      //     </LinkContainer>
      //   ) : '';
      // }
    }

    const navLinksForFleet = [];
    if (LoopbackHttp.isFleet) {
      navLinksForFleet.push(
        <LinkContainer key="navLinkDashboard" to="/fleetOwnerDashboard">
          <NavItem eventKey={1}>
            {gettext('FLEET.FLEET-DASHBOARD')}
          </NavItem>
        </LinkContainer>
      );

      navLinksForFleet.push(
        <LinkContainer key="navLinkOnDemand" to="/onDemandDashboard">
          <NavItem eventKey={2}>
            OnDemand Dashboard
          </NavItem>
        </LinkContainer>
      );

      navLinksForFleet.push(
        <LinkContainer key="navLinkSettings" to="/fleetSettings">
          <NavItem eventKey={5}>
            {gettext('SETTINGS')}
          </NavItem>
        </LinkContainer>
      );
    }
    const { showHeadersInfo } = this.props;
    return (
      <div>
        <LoadingBar className="loader_bar" updateTime={1000} maxProgress={100} progressIncrease={4} />

        <div className={this.props.loaded ? "spinner" : "spinnerActive"}>
          <Spinner />
        </div>
        {document.location.href.indexOf('recipient') === -1 ?
          <div>
            {
              showHeadersInfo ? <Button className="new_order_btn" className="new_order_btn"
                onClick={() => this.props.router.push('/createNewOrder')}>
                <Glyphicon glyph="plus" />
              </Button> : null
            }

            {LoopbackHttp.isFleet ?
              <div>
                <label className="autoassign_header_switcher autoassign_header_switcher_label">{gettext('AUTO-ASSIGN')}</label>

                <div className="autoassign_header_switcher">
                  <AutoassignContainer />
                </div>
              </div> : ''
            }
            {/*<UserLanguageSelectContainer />*/}
            <NotificationSystem ref={(it) => {
              if (!it || this._notificationSystem) {
                return;
              }
              this._notificationSystem = it;
            }} />
            <Navbar>
              <Nav pullRight className="settings_link">

                {
                  showHeadersInfo ? <NavItem>
                    <div onClick={() => { this.toggleSettingsMenu() }}>
                      <img src="./settings.png" width="18px" height="18px" />
                    </div>
                    <div className={this.state.showSettingsMenu ? 'settings_menu' : 'hidden'}>
                      <ul>
                        <li>
                          <LinkContainer key="navLinkSettings" to="/fleetSettings">
                            <NavItem eventKey={2} onClick={() => this.setState({ showSettingsMenu: false })}>
                              {gettext('SETTINGS')}
                            </NavItem>
                          </LinkContainer>
                        </li>
                        <li>
                          <NavItem eventKey={2} onClick={() => {
                            this.props.logoutPageActions.logout();
                            location.href = "/";
                          }}>{isAuthenticated ? gettext('LOG-OUT') : gettext('LOG-IN')}
                          </NavItem>
                        </li>
                      </ul>
                    </div>
                  </NavItem> : null
                }

              </Nav>
              <Navbar.Brand>
                <img src="./logo.png" />
              </Navbar.Brand>
              <Nav>
                {
                  showHeadersInfo ? <NavItem>
                    <div className="orders_active">
                      {this.calculateActiveOrders()}
                    </div>
                    Orders Active
                </NavItem> : null
                }

                {
                  showHeadersInfo ? <NavItem>
                    <div className="drivers_assigned">
                      {this.props.driversCount ? this.props.driversCount : 'n/a'}
                    </div>
                    {gettext('DRIVER-ACTIVE')}
                  </NavItem> : null
                }


              </Nav>
            </Navbar>
          </div>

          :
          <NotificationSystem ref={(it) => {
            if (!it || this._notificationSystem) {
              return;
            }
            this._notificationSystem = it;
          }} />
        }
        {React.cloneElement(this.props.children, { showMessage: this.showMessage })}
        <div className="appVersion"><strong>DOOK v2.1.{this.state.buildNum ? this.state.buildNum.build_num : ''}</strong></div>

      </div>
    );
  }
}

App.propTypes = {
  account: PropTypes.object,
  actions: PropTypes.object.isRequired,
  children: PropTypes.element,
  orders: PropTypes.array,
  redirectAfterLogin: PropTypes.bool,
  loaded: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    users: state.appReducer.users,
    orders: state.appReducer.orders,
    account: state.appReducer.account,
    redirectAfterLogin: state.loginFormReducer.redirect,
    loaded: state.appReducer.loaded,
    subscribed: state.appReducer.subscribed,
    cards: state.appReducer.cards,
    company: state.appReducer.company,
    bills: state.appReducer.bills,
    fortResponse: state.appReducer.fortResponse,
    driversCount: state.appReducer.driversCount,
    showHeadersInfo: state.appReducer.showHeadersInfo
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    fleetActions: bindActionCreators(fleetActions, dispatch),
    logoutPageActions: bindActionCreators(logoutPageActions, dispatch),
    adminActions: bindActionCreators(adminActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
