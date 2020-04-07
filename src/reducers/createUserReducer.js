import {USER_CREATED, USER_CREATION_FAILED, PICKPOINT_CREATED} from '../constants/actionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';


export default function createUserReducer(state = initialState.createUserState, action) {

  switch (action.type) {
    case USER_CREATED:
      return objectAssign({}, state, {userCreated: action.userCreated, createdUser: action.createdUser});

    default:
      return state;
  }
}
