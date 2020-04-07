import * as constants from '../../constants/onDemandConstants';
import * as sidebarReducer from './sidebarReducer';
import * as ordersExpandReducer from './ordersExpandReducer';

function createDefaultState() {
    return {
        leftSidebar: sidebarReducer.createSidebarDefault(constants.leftSidebar),
        rightSidebar: sidebarReducer.createSidebarDefault(constants.rightSidebar),
        newOrdersExpand: ordersExpandReducer.createOrdersExpandDefault(constants.newOrdersExpand, constants.leftSidebar),
        inProgressOrdersExpand: ordersExpandReducer.createOrdersExpandDefault(constants.inProgressOrdersExpand, constants.leftSidebar)
    }
}

export function onDemandReducer(state, action) {
    if (state == undefined) return createDefaultState();
    return {
        leftSidebar: sidebarReducer.reduce(state.leftSidebar, action),
        rightSidebar: sidebarReducer.reduce(state.rightSidebar, action),
        newOrdersExpand: ordersExpandReducer.reduce(state.newOrdersExpand, action),
        inProgressOrdersExpand: ordersExpandReducer.reduce(state.inProgressOrdersExpand, action)
    };
}
