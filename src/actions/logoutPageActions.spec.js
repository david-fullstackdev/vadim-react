import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
import {expect} from 'chai';
import LoopbackHttp from '../businessLogic/LoopbackHttp';
import * as logOut from './logoutPageActions';
import _ from 'lodash';


LoopbackHttp.configure({apiUrl: 'https://dev-api.dook.sa:3000/api/'});

GLOBAL.localStorage.setItem('userType', 'dispatcher');
GLOBAL.localStorage.setItem('auth_token', 'Yx5YpOKUMjBw6fcfjfR7Ot2Br7sA3eJEdSJGmIHp160UFuw6eBCgB8Bg09X7lcoy');
GLOBAL.localStorage.setItem('userId', '57efd8e45bf9bd000fe2dcdb');
GLOBAL.window = undefined;

describe('LogoutPageActions', () => {

  it('Check logOut feature', (done) => {
      const store = mockStore({isLoggedIn: true});

      store.dispatch(
        logOut.logout()
      );

      var actions = store.getActions();
      expect(_.first(actions).type).to.be.equal('LOGGED_OUT');
      done();
  });
});
