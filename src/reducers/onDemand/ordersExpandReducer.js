import * as actionTypes from '../../constants/actionTypes';

export function createOrdersExpandDefault(orderType, sidebarType) {
    return {
        isOpen: false,
        orderType,
        sidebarType
    };
}

function toggleOrders(state) {
    return Object.assign({}, state, { isOpen: !state.isOpen });
}

function collapseOrders(state) {
    return Object.assign({}, state, { isOpen: false });
}

export function reduce(state, action) {
    switch (action.type) {
        case actionTypes.TOGGLE_ORDERS:
            if (action.orderType !== state.orderType) return state;
            return toggleOrders(state, action.orderType)
        case actionTypes.TOGGLE_SIDEBAR:
            if (action.sidebarType !== state.sidebarType) return state;
            return collapseOrders(state, action.orderType)
        default:
            return state;
    }
}