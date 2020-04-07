import React, {PropTypes} from 'react';
import {FormControl,ListGroup, ListGroupItem  } from 'react-bootstrap';
import _ from 'lodash';
import { gettext } from '../../../i18n/service.js';
import onClickOutside from 'react-onclickoutside';

class CitiesComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.currentCity = props.currentCity;

    _.bindAll(this, ['renderCityList', 'hideList', 'handleClickOutside', 'showList']);

    this.state = {
      text: undefined,
      showList: false
    }
  }

  hideList() {
    this.setState({showList: false});
  }

  showList() {
    this.setState({showList: true});
  }

  handleClickOutside(e) {
    this.setState({showList: false});
  }

  renderCityList() {
    return _.map(this.props.cities, (city) => (
      <ListGroupItem
        onClick={() => {this.props.onSelect(city); this.hideList(); this.setState({text: city.name.en});}}>{this.props.getCityById(city.id)}</ListGroupItem>
    ));
  }

  render() {
    return (
      <div className='cities'>
        <FormControl
           type="text"
           required={true}
           onChange={(e) => {
             this.currentCity = undefined;
             this.showList();
             this.setState({text: e.target.value});
             this.props.getCitiesByText(e.target.value, this.props.countryId);
           }}
           placeholder={gettext('CITY')}
           value={this.currentCity?this.props.getCityById(this.props.currentCity):this.state.text}
           onFocus={() => this.setState({showList: true})}/>
        {this.state.showList ?
          <div className='cities_autocomplette'>
            <div className='cities_autocomplette_scrollable'>
              <ListGroup>
                {this.renderCityList()}
              </ListGroup>
            </div>
          </div> : ''
        }
      </div>
    );
  }
}




CitiesComponent.propTypes = {
  operators: PropTypes.array
};

export default onClickOutside(CitiesComponent);
