import React, {PropTypes} from 'react';
import { Jumbotron, Button, Row, PageHeader,FormGroup, FormControl, Col  } from 'react-bootstrap';
import { gettext } from '../../../i18n/service.js';
import _ from 'lodash';
import Reports from '../../../containers/ReportsContainer';


export default class ReportsComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

  }

  render() {
    return (
      <div className="new_reports">
        <Reports
          showMessage={this.props.showMessage}
          users={this.props.users}
          orders={this.props.orders}
          account={this.props.account}
          coefficients={this.props.coefficients}
          getStatistics={this.props.getStatistics}
          startSpinner={this.props.startSpinner}
          endSpinner={this.props.endSpinner}
          company={this.props.company}/>
      </div>
    );
  }
}




ReportsComponent.propTypes = {

};
