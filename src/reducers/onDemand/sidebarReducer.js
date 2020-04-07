import * as actionTypes from '../../constants/actionTypes';

export function createSidebarDefault(sidebarType) {
    return {
        isOpen: false,
        sidebarType
    };
}

export function toggleSidebar(state) {
    return Object.assign({}, state, { isOpen: !state.isOpen });
}

export function reduce(state, action) {
    if (action.sidebarType !== state.sidebarType) return state;
    switch (action.type) {
        case actionTypes.TOGGLE_SIDEBAR:
            return toggleSidebar(state)
        default:
            return state;
    }
}
