import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
// import nock from 'nock';
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
import {expect} from 'chai';
import LoopbackHttp from '../businessLogic/LoopbackHttp';
import * as loginActions from './loginFormActions';
import _ from 'lodash';

LoopbackHttp.configure({apiUrl: 'https://dev-api.dook.sa:3000/api/'});

describe('LoginFormActions', () => {
  beforeEach(() => {
    GLOBAL.fetch = undefined;
  });

  afterEach(() => {
    GLOBAL.fetch = undefined;
  });

  it('Should create proper login action', (done) => {
      const store = mockStore({isLoggedIn: false});

      GLOBAL.fetch = function(url, options) {
        expect(options.method).to.equal('POST');
  
        return new Promise((resolve) => {
          resolve({ json: () => ({id: 'token'}) });
        });
      };

      store.dispatch(
        loginActions.submit(
          { email: "operator@dook.sa", password: "1234567" }
        )
      );

      var actions = store.getActions();
      expect(_.first(actions).type).to.be.equal('LOGIN_REQUEST_SENT');
      done();
  });
});

describe('LoginFormActions', () => {

  it('Should create proper onLoginSuccess action', (done) => {
      const store = mockStore({isLoggedIn: false});

      store.dispatch(
        loginActions.onLoginSuccess(
          {
            user: {
              id: '21321sdfsf321',
              userId: '234',
              role: 'operator'
            }
          }
        )
      );

      var actions = store.getActions();
      expect(_.first(actions).type).to.be.equal('LOGGED_IN');
      done();
  });
});
