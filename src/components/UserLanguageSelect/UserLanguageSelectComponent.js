import React, { Component, PropTypes } from 'react';
import './UserLanguageSelectComponent.scss';
import getCurLang from '../../businessLogic/getCurLang.js';
import {Glyphicon} from 'react-bootstrap';
import soundNotification from '../../businessLogic/soundNotification';


var lan = getCurLang();

const floatLeft = {
    right: 'auto',
    float: 'left',
    left: '2em'
};

const hideUnderline = {
  textDecoration: 'none'
};

const dottedUnderline = {
  textDecoration: 'none',
  borderBottom: '1px dashed'
};

export default class DispatcherOrdersListComponent extends Component {
  renderSoundNotificationButton() {
    soundNotification.checkOrderAndPlayNotification({});
    return (<Glyphicon glyph="bell" className="sound_button"
              style={localStorage.getItem('sound_notifications')==='true'
                      ?{color: 'white'}
                      :{color: 'grey'}}
              onClick={() => {
                  localStorage.setItem('sound_notifications', localStorage.getItem('sound_notifications')==='true'?false :true);
                  this.forceUpdate();
                }}/>
      );
  }
  render() {
    return (
      <div className="user-language-select">

        {lan==='en'? this.renderSoundNotificationButton() : ''}
        <a href="#"
          name="user-language-select"
          style={this.props.value==='en'?dottedUnderline:hideUnderline}
          onClick={this.props.onChange}
          value="en">EN</a>

        <font color="black"> | </font>

        <a href="#"
          name="user-language-select"
          style={this.props.value==='ar'?dottedUnderline:hideUnderline}
          onClick={this.props.onChange}
          value="ar">AR</a>

        {lan==='ar'? this.renderSoundNotificationButton() : ''}
      </div>
    );
  }
}



DispatcherOrdersListComponent.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string
};
