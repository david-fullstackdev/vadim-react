import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/appActions';
import UserLanguageSelectComponent from '../components/UserLanguageSelect/UserLanguageSelectComponent';
import { getLocale } from '../i18n/service';
import { getUserType } from '../businessLogic/LoopbackHttp';


export class UserLanguageSelectContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  onChange = (e) => {
    this.props.actions.setUserLocale(e.target.getAttribute('value'));
  };
  render() {
    return (
      <UserLanguageSelectComponent
      value={ getLocale() }
      onChange={ this.onChange } />
    );
  }
}

UserLanguageSelectContainer.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserLanguageSelectContainer);
