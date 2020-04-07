import * as types from '../constants/actionTypes';
import * as constants from '../constants/onDemandConstants';

function toggleOrders(dispatch, orderType) {
    dispatch({
        type: types.TOGGLE_ORDERS,
        orderType
    })
}

function toggleSidebar(dispatch, sidebarType) {
    dispatch({
        type: types.TOGGLE_SIDEBAR,
        sidebarType
    })
}

export function toggleNewOrders() { return dispatch => toggleOrders(dispatch, constants.newOrdersExpand); }

export function toggleInProgressOrders() { return dispatch => toggleOrders(dispatch, constants.inProgressOrdersExpand); }

export function toggleLeftSidebar() { return dispatch => toggleSidebar(dispatch, constants.leftSidebar); }

export function toggleRightSidebar() { return dispatch => toggleSidebar(dispatch, constants.rightSidebar); }