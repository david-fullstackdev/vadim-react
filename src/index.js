import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createHistory, useBasename } from 'history';
import { Router, useRouterHistory, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'

import { appRoutes, recipientRoutes } from './routes';
import configureStore from './store/configureStore';
require('./images/logo.png');
require('./images/mapdrop.png');
require('./images/settings.png');
require('./images/title.png');
require('./images/title1.png');
require('./images/favicon.png');require('./images/location-icon.png');require('./images/ios-icon.png');require('./images/android-icon.png');require('./images/logo-dook.png'); // Tell webpack to load favicon.ico
require('./images/mot.png');require('./images/van.png');require('./images/pic.png');require('./images/sed.png');require('./images/suv.png');require('./images/img_icon_cars.png');require('./images/flags.png');

import './styles/styles.scss'; // Yep, that's right. You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.
require("babel-polyfill");
require('./images/warning2.png');
require('./images/danger2.png');
const store = configureStore();
// const browserHistory = useRouterHistory(createHistory)({
//   basename: '/#'
// });
// let browserHistory = useBasename(createHistory)({
//   basename: '/#'
// });
const history = syncHistoryWithStore(browserHistory, store);


const historyForRecipient = useRouterHistory(createHistory)({
  basename: '/#'
});


function isRecipient(url) {
  if (url.indexOf('recipient') !== -1) {
    localStorage.setItem('isRecipient', 1);
    return true;
  }
  else
    return false;
}

render(
  <Provider store={store}>
    <Router
      history={!isRecipient(document.location.href) ? history : historyForRecipient}
      routes={!isRecipient(document.location.href) ? appRoutes : recipientRoutes} />
  </Provider>, document.getElementById('app')
);
