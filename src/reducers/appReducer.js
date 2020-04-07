import * as types from '../constants/actionTypes';

import objectAssign from 'object-assign';
import initialState from './initialState';
import _ from 'lodash';


export default function dashboardPageReducer(state = initialState.appState, action) {
  let newUsers;
  let newGroupages;
  let newOrders;
  let newPickUpPoints;
  let groupageIndex;
  let newRecipients;

  switch (action.type) {

    case types.CITY_FETCHED:
      return objectAssign({}, state, { cityForInfo: action.city });

    case types.USER_CREATION_FAILED:
      return objectAssign({}, state, { error: action.error });

    case types.AVATAR_ADDED:
      let account = state.account;
      account.avatar = action.user.avatar;
      return objectAssign({}, state, { account: account });

    case types.BILL_UPDATED:
      let newBills = objectAssign([], state.bills);
      objectAssign(newBills.billings.find((bill) => bill.id === action.response.id), action.response);
      return objectAssign({}, state, { bills: newBills });

    case types.RESET_CASH_ON_DELIVERY:
      return objectAssign({}, state);

    case types.PURCHASE_SUCCEED:
      return objectAssign({}, state, { fortResponse: action.response });
    case types.GET_NEAREST_DRIVERS:
      return objectAssign({}, state, { nearestDrivers: action.nearestDrivers })
    case types.PURCHASE_NOT_SUCCEED:
      return state;

    case types.ORDERS_ADDED_TO_HISTORY:
      return objectAssign({}, state, { orders: state.orders.concat(action.orders), loaded: true });

    case types.FLEET_CREATED:
      return objectAssign({}, state, { fleets: state.fleets.concat([action.fleet.fleetOwner]), companies: state.companies.concat([action.fleet.company]), loaded: true });

    case types.DRIVER_LIST_VIEW_MODE_CHANGED:
      return objectAssign({}, state, { driverListViewMode: action.driverListViewMode });

    case types.STATISTIC_FETCHED:
      return objectAssign({}, state, { statistics: action.statistic.statistics });

    case types.STATISTIC_FETCH_FAILED:
      return state;

    case types.FLEET_UPDATED:
      let newFleets = objectAssign([], state.fleets);
      objectAssign(newFleets.find((fleet) => fleet.id === action.fleet.id), action.fleet);
      return objectAssign({}, state, { fleets: newFleets, loaded: true });

    case types.FLEETS_FETCHED:
      return objectAssign({}, state, { fleets: action.fleets });

    case types.LOCAL_TEAM_UPDATED:
      let newTeams = objectAssign([], state.teams);
      objectAssign(newTeams.find((team) => team.id === action.team.id), action.team);
      return objectAssign({}, state, { teams: newTeams });

    case types.LOCAL_TEAM_ADDED:
      if (_.some(state.teams, { id: action.team.id })) {
        return state;
      }
      return objectAssign({}, state, { teams: state.teams.concat([action.team]) });

    case types.ACCOUNT_FETCHED:
      return objectAssign({}, state, { account: action.account });

    case types.ORDERS_FETCHED:
      return objectAssign({}, state, { orders: action.orders, loaded: true });

    case types.ORDERS_FETCH_FAILED:
      return state;

    case types.CARD_ADDED:
      console.log(action)
      if (action.card) {
        if (action.card.secureUrl)
          window.location.replace(action.card.secureUrl);
      }
      return state;

    case types.CARD_DELETED:
      let cards = state.cards;
      _.pull(cards, _.find(cards, { id: action.cardId }));
      return objectAssign({}, state, { cards: cards });

    case types.CARDS_FETCHED:
      return objectAssign({}, state, { cards: action.cards });

    case types.BILLS_FETCHED:
      return objectAssign({}, state, { bills: action.bills });

    case types.SUBSCRIBED:
      return objectAssign({}, state, { subscribed: true });

    case types.ORDER_FOR_RETURN_ADDED:
      return objectAssign({}, state, { orderForReturn: action.order });

    case types.ORDER_FOR_RETURN_REMOVED:
      return objectAssign({}, state, { orderForReturn: {} });

    case types.ORDER_FOR_UPDATE_ADDED:
      return objectAssign({}, state, { orderForUpdate: action.order });

    case types.PICKUP_POINTS_SAVED:
      return objectAssign({}, state, { pickUpPoints: action.pickUpPoints, loaded: true });

    case types.USERS_SAVED:
      return objectAssign({}, state, { users: action.users, loaded: true });

    case types.POINTS_FOR_UPDATE_ADDED:
      return objectAssign({}, state, { pickUpPoints: action.pickUpPoints });

    case types.ORDER_FOR_UPDATE_REMOVED:
      return objectAssign({}, state, { orderForUpdate: {} });

    case types.USER_ADDED_TO_TEAM:
      return objectAssign({}, state, { addedToTeam: Date.now() });

    case types.USER_REMOVED_FROM_TEAM:
      return objectAssign({}, state, { removedFromTeam: Date.now() });

    case types.PICKPOINT_CREATED:
      newPickUpPoints = objectAssign({}, state.pickUpPoints);
      newPickUpPoints[action.createdPickUpPoint.id] = action.createdPickUpPoint;
      return objectAssign({}, state, { pickUpPoints: newPickUpPoints, createdPickUpPoint: action.createdPickUpPoint });

    case types.PICKPOINT_UPDATED:
      newPickUpPoints = objectAssign({}, state.pickUpPoints);
      newPickUpPoints[action.updatedPickUpPoint.id] = action.updatedPickUpPoint;
      return objectAssign({}, state, { pickUpPoints: newPickUpPoints, loaded: true });

    case types.SAVE_PAGE_ORDER_LIST:
      return objectAssign({}, state, { orderListPageNumber: action.orderListPageNumber });

    case types.TEAM_UPDATED:
      return objectAssign({}, state, { teamUpdated: action.team });

    case types.TEAM_DELETED:
      let teamToDelete = _.find(state.teams, { id: action.teamToDelete });
      let teams = _.pull(state.teams, teamToDelete);
      return objectAssign({}, state, { teams: teams, teamDeleted: Date.now() });

    case types.UNASSIGN_ORDER:
      return objectAssign({}, state, { loaded: true });

    case types.TEAM_CREATED:
      return objectAssign({}, state, { teamCreated: action.team });

    case types.SAVE_PAGE_GROUPAGE_LIST:
      return objectAssign({}, state, { groupageListPageNumber: action.groupageListPageNumber });

    case types.SAVE_PAGE_HISTORY_LIST:
      return objectAssign({}, state, { orderHistoryPageNumber: action.orderHistoryPageNumber });

    case types.TIMEOUT_MES:
      function showMessage() {
        if (document.getElementsByClassName('spinnerActive').length > 0) {
          alert("Loading takes more than normally ... Redirecting to Dashboard");
        }
      }
      // setTimeout(showMessage, 15000);
      return state;

    case types.START_SPINNER:
      return objectAssign({}, state, { loaded: action.loaded });

    case types.COMPANY_FETCHED:
      return objectAssign({}, state, { company: action.company });

    case types.TEAMS_FETCHED:
      return objectAssign({}, state, { teams: action.teams });

    case types.END_SPINNER:
      return objectAssign({}, state, { loaded: action.loaded });

    case types.GROUPAGE_CREATED:
      return objectAssign({}, state, { loaded: action.loaded });

    case types.GROUPAGE_DESTROYED:
      return objectAssign({}, state, { loaded: action.loaded });

    case types.ORDER_FETCHED:
      return objectAssign({}, state, { orders: action.orders });

    case types.ORDER_FETCH_FAILED:
      return state;

    case types.PICKUPPOINTS_FETCHED:
      return objectAssign({}, state, { pickUpPoints: action.pickUpPoints });

    case types.PICKUPPOINT_FETCHED:
      return objectAssign({}, state, { floatingPickUpPoint: action.pickUpPoint });

    case types.GROUPAGES_FETCHED:
      return objectAssign({}, state, { groupages: action.groupages });

    case types.GROUPAGES_FETCH_FAILED:
      return state;

    case types.USERS_FETCHED:
      return objectAssign({}, state, { users: action.users });

    case types.ADMIN_UPDATED:
      return objectAssign({}, state, { account: action.newAdmin });

    case types.ADMIN_UPDATE_FAILED:
      return state;

    case types.COMPANIES_FETCHED:
      return objectAssign({}, state, { companies: action.companies });

    case types.COUNTRY_CREATED:
      return objectAssign({}, state, { countries: action.country });

    case types.COMPANY_WITH_DRIVERS_FETCHED:


    case types.COUNTRY_UPDATED:
      return state;

    case types.ORDER_UPDATED_LOGGED:
      newOrders = objectAssign([], state.orders);
      objectAssign(_.find(newOrders, { id: action.order.id }), action.order);

      newRecipients = objectAssign([], state.recipients);
      objectAssign(_.find(newRecipients, { id: action.order.recipient.id }), action.order.recipient);

      return objectAssign({}, state, { recipients: newRecipients, orders: newOrders });

    case types.COEFFICIENT_UPDATED:
      return state;

    case types.CITY_UPDATED:
      return state;

    case types.CITY_CREATED:
      return objectAssign({}, state, { cities: action.city });

    case types.CITY_CREATE_FAILED:
      return state;

    case types.COEFFICIENTS_FETCHED:
      return objectAssign({}, state, { coefficients: action.coefficients });

    case types.COEFFICIENTS_FETCH_FAILED:
      return state;

    case types.COMPANY_CREATED:
      return objectAssign({}, state, { companies: state.companies.concat([action.company]), loaded: true });

    case types.COMPANY_DELETED:
      return state;

    case types.COMPANY_UPDATED:
      return objectAssign({}, state, { company: action.company });

    case types.COMPANY_UPDATED_ADMIN:
      let newCompanies = objectAssign([], state.companies);
      objectAssign(newCompanies.find((company) => company.id === action.company.id), action.company);
      return objectAssign({}, state, { companies: newCompanies, loaded: true });

    case types.CITY_DELETED:
      return state;

    case types.CITY_DELETE_FAILED:
      return state;

    case types.COUNTRY_CREATE_FAILED:
      return state;

    case types.RECIPIENTSORDERS_FETCHED:
      return objectAssign({}, state, { orders: action.users });

    case types.RECIPIENTSORDERS_FETCH_FAILED:
      return state;

    case types.COUNTRY_DELETED:
      return state;

    case types.COUNTRY_DELETE_FAILED:
      return state;

    case types.ORDER_UPDATED_RECIPIENT:
      return state;

    case types.ORDER_UPDATED:
      return state;

    case types.RECIPIENT_UPDATED:
      return state;

    case types.USERS_FETCH_FAILED:
      return state;

    case types.DISPATCHER_FETCHED:
      return objectAssign({}, state, { users: action.account.dispatcher, orders: action.account.order, recipients: action.account.recipient });

    case types.USER_DELETED:
      return objectAssign({}, state, { userDeleted: Date.now() });;

    case types.USER_DELETED_FAILED:
      return state;

    case types.ORDER_DELETED_FAILED:
      return state;

    case types.RECIPIENTS_FETCHED:
      return objectAssign({}, state, { recipients: action.recipients });

    case types.RECIPIENT_FETCHED:
      return objectAssign({}, state, { fetched_recipient: action.fetched_recipient });

    case types.COUNTRYES_FETCHED:
      return objectAssign({}, state, { countries: action.countries });

    case types.COUNTRYES_FETCH_FAILED:
      return state;

    case types.CITYES_FETCHED:
      return objectAssign({}, state, { cities: action.cities });

    case types.CITYES_FETCH_FAILED:
      return state;

    case types.LOCAL_USER_ADDED:
      if (_.some(state.users, { id: action.user.id })) {
        return state;
      }
      return objectAssign({}, state, { users: state.users.concat([action.user]) });

    case types.LOCAL_USER_UPDATED:
      newUsers = objectAssign([], state.users);
      if (newUsers.find((user) => user.id === action.user.id)) {
        objectAssign(newUsers.find((user) => user.id === action.user.id), action.user);
        return objectAssign({}, state, { users: newUsers, loaded: true });
      }
      else
        return state;


    case types.LOCAL_GROUPAGE_ADDED:
      if (_.some(state.groupages, { id: action.groupage.id })) {
        return state;
      }
      return objectAssign({}, state, { groupages: state.groupages.concat([action.groupage]) });

    case types.LOCAL_GROUPAGE_UPDATED:
      newGroupages = objectAssign([], state.groupages);
      groupageIndex = _.findIndex(newGroupages, { id: action.groupage.id });
      if (action.groupage.groupageStatus === 'rejected') {
        newGroupages.splice(groupageIndex, 1);
      } else {
        objectAssign(newGroupages[groupageIndex], action.groupage);
      }
      return objectAssign({}, state, { groupages: newGroupages });

    case types.LOCAL_ORDER_ADDED:
      if (_.some(state.orders, { id: action.order.id })) {
        newOrders = Object.assign([], state.orders);
        objectAssign(_.find(newOrders, { id: action.order.id }), action.order);
        return objectAssign({}, state, { orders: newOrders });
      }
      return objectAssign({}, state, { orders: state.orders.concat([action.order]) });

    case types.LOCAL_ORDER_UPDATED:
      newOrders = objectAssign([], state.orders);
      let order = _.find(newOrders, { id: action.order.id });

      if (action.fields && action.fields.autoAssign === 'fail') {
        delete order.driverId;
        delete action.fields.autoAssign;
      }

      if (order.autoAssign === false)
        delete order.autoAssign;

      if (order)
        objectAssign(order, action.order, action.fields);
      return objectAssign({}, state, { orders: newOrders, loaded: true });


    case types.LOCAL_RECIPIENT_UPDATED:
      newRecipients = objectAssign([], state.recipients);
      objectAssign(_.find(newRecipients, { id: action.recipient.id }), action.recipient, action.fields);
      return objectAssign({}, state, { recipients: newRecipients });

    case types.LOCAL_RECIPIENT_ADDED:
      if (_.some(state.recipients, { id: action.recipient.id })) {
        return state;
      }
      return objectAssign({}, state, { recipients: state.recipients.concat([action.recipient]) });

    case types.LOCAL_PICKUPPOINT_ADDED:
      newPickUpPoints = objectAssign({}, state.pickUpPoints);
      newPickUpPoints[action.pickUpPoint.id] = action.pickUpPoint;
      return objectAssign({}, state, { pickUpPoints: newPickUpPoints });

    case types.LOCAL_PICKUPPOINT_UPDATED:
      newPickUpPoints = objectAssign({}, state.pickUpPoints);
      newPickUpPoints[action.pickUpPoint.id] = action.pickUpPoint;
      return objectAssign({}, state, { pickUpPoints: newPickUpPoints });

    case types.LOCAL_POINT_REMOVED:
      newPickUpPoints = objectAssign({}, state.pickUpPoints);
      delete newPickUpPoints[action.pickUpPoint.id];
      return objectAssign({}, state, { pickUpPoints: newPickUpPoints });

    case types.ACCOUNT_UPDATED:
      return objectAssign({}, state, { account: action.account, accountUpdated: action.accountUpdated });

    case types.DRIVER_UPDATED:
      return objectAssign({}, state, { account: action.driver, accountUpdated: action.driver });

    case types.DRIVERS_LOCATION_UPDATED:
      return objectAssign({}, state, { driversLocations: action.driversLocations });

    case types.PICKUPPOINT_REMOVED:
      return objectAssign({}, state, { pickUpPointRemoved: action.pickUpPointRemoved, removedPickUpPoint: action.removedPickUpPoint });

    case types.ASSIGN_ON_DRIVER:
      return objectAssign({}, state, { loaded: action.loaded });

    case types.GET_DRIVERS_COUNT:
      return objectAssign({}, state, { driversCount: action.count });

    case types.SHOW_HEADER_INFO:
      return objectAssign({}, state, { showHeadersInfo: action.show });

    default:
      return state;
  }
}
