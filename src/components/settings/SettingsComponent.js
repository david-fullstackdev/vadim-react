import React, { PropTypes } from 'react';
import { PageHeader, ListGroup, ListGroupItem, Col, Link } from 'react-bootstrap';
import { gettext } from '../../i18n/service.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { Button, Alert } from 'react-bootstrap';
import getCurLang from '../../businessLogic/getCurLang.js';
import LoopbackHttp from '../../businessLogic/LoopbackHttp.js';
import ApiComponent from './components/ApiComponent';
import OperatorsComponent from './components/OperatorsComponent';
import DispatchersComponent from './components/DispatchersComponent';
import DriversComponent from './components/DriversComponent';
import BillingComponent from './components/BillingComponent';
import UserProfileComponent from './components/UserProfileComponent';
import CompanyComponent from './components/CompanyComponent';
import TeamsComponent from './components/TeamsComponent';
import ReportsComponent from './components/ReportsComponent';
import DispatcherProfileComponent from './components/DispatcherProfileComponent';
import DispatcherPlatformComponent from './components/DispatcherPlatformComponent';
import FleetOwnersComponent from './components/FleetOwnersComponent';
import CompaniesComponent from './components/CompaniesComponent';
import './SettingsComponent.scss';
import { getCurrendDashboardUrl } from '../../businessLogic/getCurrendDashboardUrl';


export default class SettingsComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.profileMenuTitles = [gettext('COMPANY'), gettext('USER-PROFILE'), gettext('BILLING'), gettext('STATISTICS')];
    this.teamMenuTitles = [gettext('TEAMS'), gettext('OPERATORS'), gettext('DISPATCHERS'), gettext('DRIVERS'), gettext('DISPATCHER-PLATFORMS')];
    // this.infoMenuTitles = [gettext('API-INTEGRATION'), gettext('DOCUMENTATION'), gettext('SUPPORT')];
    this.infoMenuTitles = [gettext('API-INTEGRATION')];

    if (LoopbackHttp.isOperator) {
      this.profileMenuTitles = _.pull(this.profileMenuTitles, gettext('COMPANY'), gettext('BILLING'));
    }


    if (LoopbackHttp.isDispatcher) {
      this.profileMenuTitles = _.pull(this.profileMenuTitles, gettext('COMPANY'), gettext('BILLING'));
      this.teamMenuTitles = [];
    }

    if (LoopbackHttp.isAdministrator) {
      this.teamMenuTitles.push(gettext('FLEETS'), gettext('COMPANIES'));
      this.profileMenuTitles = _.pull(this.profileMenuTitles, gettext('BILLING'));
    }


    _.bindAll(this, ['renderLeftMenu', 'getTeamName']);
    this.props.appActions.endSpinner()
  }

  getTeamName(id) {
    let team = _.find(this.props.teams, { id: id });
    if (team)
      return team.name;
    else {
      return gettext('CANNOT-GET-TEAM');
    }
  }

  getRedirectDashboard() {
    const { account } = this.props;
    return getCurrendDashboardUrl(account);
  }

  renderLeftMenu() {
    const profileMenuTitles = _.map(this.profileMenuTitles, (title, id) => {
      const isItemSelected = this.props.selectedMenuItem === title;
      const className = isItemSelected ? 'list_element active unclickable' : 'list_element';
      return (
        <ListGroupItem
          key={`profile_${id}`}
          className={className}
          onClick={() => this.props.selectMenuItem(title)}>
          {title}
          <span className="float_right">&#x276F;</span>
        </ListGroupItem>
      );
    });
    const teamMenuTitles = _.map(this.teamMenuTitles, (title, id) => {
      const isItemSelected = this.props.selectedMenuItem === title;
      const className = isItemSelected ? 'list_element active unclickable' : 'list_element';
      return (
        <ListGroupItem
          key={`team_${id}`}
          className={className}
          onClick={() => this.props.selectMenuItem(title)}>
          {title}
          <span className="float_right">&#x276F;</span>
        </ListGroupItem>
      );
    });
    const infoMenuTitles = _.map(this.infoMenuTitles, (title, id) => {
      const isItemSelected = this.props.selectedMenuItem === title;
      const className = isItemSelected ? 'list_element active unclickable' : 'list_element';
      return (
        <ListGroupItem
          key={`info_${id}`}
          className={className}
          onClick={() => this.props.selectMenuItem(title)}>
          {title}
          <span className="float_right">&#x276F;</span>
        </ListGroupItem>
      );
    });
    return (
      <div className="settings_left_menu">
        <ListGroup>
          {profileMenuTitles}
        </ListGroup>
        <ListGroup>
          {teamMenuTitles}
        </ListGroup>
        <ListGroup>
          {infoMenuTitles}
        </ListGroup>
      </div>
    );
  }

  render() {
    const rendermenuItem = () => {

      if (this.props.selectedMenuItem === gettext('API-INTEGRATION'))
        return <ApiComponent
          showMessage={this.props.showMessage} />;

      else if (this.props.selectedMenuItem === gettext('STATISTICS'))
        return (<ReportsComponent
          showMessage={this.props.showMessage}
          users={this.props.users}
          orders={this.props.orders}
          account={this.props.account}
          coefficients={this.props.coefficients}
          getStatistics={this.props.appActions.getStatistics}
          account={this.props.account}
          startSpinner={this.props.appActions.startSpinner}
          endSpinner={this.props.appActions.endSpinner}
          company={this.props.company} />);

      else if (this.props.selectedMenuItem === gettext('OPERATORS'))
        return (<OperatorsComponent
          operators={_.filter(this.props.users, { role: 'operator' })}
          cities={this.props.cities}
          countries={this.props.countries}
          showMessage={this.props.showMessage}
          createOperator={this.props.fleetActions.createUser}
          updateOperator={this.props.fleetActions.updateUser}
          deleteOperator={this.props.fleetActions.removeUser}
          getCountryByCityId={this.props.getCountryByCityId}
          getCityById={this.props.getCityById}
          getCountries={this.props.getCountries}
          getCities={this.props.getCities}
          startSpinner={this.props.appActions.startSpinner}
          teams={this.props.teams}
          company={this.props.company}
          account={this.props.account}
          getCitiesByText={this.props.appActions.getCitiesByText}
          fetchCityForInfo={this.props.appActions.fetchCityForInfo}
          cityForInfo={this.props.cityForInfo} />);

      else if (this.props.selectedMenuItem === gettext('FLEETS'))
        return (<FleetOwnersComponent
          fleets={this.props.fleets}
          cities={this.props.cities}
          countries={this.props.countries}
          showMessage={this.props.showMessage}
          createFleet={this.props.adminActions.createFleet}
          updateFleet={this.props.adminActions.updateFleet}
          deleteFleet={this.props.fleetActions.removeUser}
          getCountryByCityId={this.props.getCountryByCityId}
          getCityById={this.props.getCityById}
          getCountries={this.props.getCountries}
          getCities={this.props.getCities}
          startSpinner={this.props.appActions.startSpinner}
          teams={this.props.teams}
          company={this.props.company}
          companies={this.props.companies}
          getCitiesByText={this.props.appActions.getCitiesByText} />);

      else if (this.props.selectedMenuItem === gettext('BILLING'))
        return <BillingComponent
          orders={this.props.orders}
          getBills={this.props.appActions.getBills}
          addBilling={this.props.addBilling}
          bills={this.props.bills}
          startSpinner={this.props.appActions.startSpinner}
          router={this.props.router} />;

      else if (this.props.selectedMenuItem === gettext('TEAMS'))
        return <TeamsComponent
          teams={this.props.teams}
          cities={this.props.cities}
          countries={this.props.countries}
          users={this.props.users}
          showMessage={this.props.showMessage}
          getCountryByCityId={this.props.getCountryByCityId}
          getCityById={this.props.getCityById}
          getCountries={this.props.getCountries}
          getCities={this.props.getCities}
          createTeam={this.props.fleetActions.createTeam}
          updateTeam={this.props.fleetActions.updateTeam}
          deleteTeam={this.props.fleetActions.deleteTeam}
          addToTeam={this.props.fleetActions.addToTeam}
          removeFromTeam={this.props.fleetActions.removeFromTeam}
          startSpinner={this.props.appActions.startSpinner}
          endSpinner={this.props.appActions.endSpinner}
          company={this.props.company}
          pickUpPoints={this.props.pickUpPoints}
          deletePickUpPoint={this.props.appActions.deletePickUpPoint}
          deleteLocalPickUpPoint={this.props.appActions.deleteLocalPickUpPoint}
          updatePickUpPoint={this.props.createUserActions.updatePickUpPoint}
          createDefaultPickUpPoint={this.props.createUserActions.createDefaultPickUpPoint}
          addNewTeamToStore={this.props.appActions.addNewTeamToStore}
          getCitiesByText={this.props.appActions.getCitiesByText}
          fetchCityForInfo={this.props.appActions.fetchCityForInfo}
          cityForInfo={this.props.cityForInfo} />;

      else if (this.props.selectedMenuItem === gettext('USER-PROFILE')) {
        if (!LoopbackHttp.isDispatcher)
          return <UserProfileComponent
            updateUserProfile={this.props.fleetActions.updateUserProfile}
            account={this.props.account}
            startSpinner={this.props.appActions.startSpinner}
            endSpinner={this.props.appActions.endSpinner}
            showMessage={this.props.showMessage}
            getAccount={this.props.appActions.getAccount}
            addBilling={this.props.addBilling}
            router={this.props.router}
            cards={this.props.cards}
            deleteCard={this.props.fleetActions.deleteCard}
            changeAvatar={this.props.appActions.addAvatar}
            getCards={this.props.fleetActions.getCards} />;
        else
          return <DispatcherProfileComponent
            account={this.props.account}
            cities={this.props.cities}
            countries={this.props.countries}
            showMessage={this.props.showMessage}
            createDispatcher={this.props.fleetActions.createUser}
            updateDispatcher={this.props.appActions.updateDispatcher}
            deleteDispatcher={this.props.fleetActions.removeUser}
            getCountryByCityId={this.props.getCountryByCityId}
            getCityById={this.props.getCityById}
            getCountries={this.props.getCountries}
            getCities={this.props.getCities}
            startSpinner={this.props.appActions.startSpinner}
            endSpinner={this.props.appActions.endSpinner}
            updatePickUpPoint={this.props.createUserActions.updatePickUpPoint}
            teams={this.props.teams}
            createDefaultPickUpPoint={this.props.createUserActions.createDefaultPickUpPoint}
            pickUpPoints={this.props.pickUpPoints}
            deletePickUpPoint={this.props.appActions.deletePickUpPoint}
            deleteLocalPickUpPoint={this.props.appActions.deleteLocalPickUpPoint}
            company={this.props.company}
            changeAvatar={this.props.appActions.addAvatar}
            getCitiesByText={this.props.appActions.getCitiesByText} />
      }


      else if (this.props.selectedMenuItem === gettext('COMPANY'))
        return <CompanyComponent
          company={this.props.company}
          showMessage={this.props.showMessage}
          updateThisCompany={this.props.adminActions.updateCompany}
          getCompany={this.props.appActions.getCompany}
          startSpinner={this.props.appActions.startSpinner}
          endSpinner={this.props.appActions.endSpinner}
          account={this.props.account}
          changeAvatar={this.props.appActions.addAvatar} />;

      else if (this.props.selectedMenuItem === gettext('DISPATCHERS'))
        return (<DispatchersComponent
          dispatchers={_.filter(this.props.users, { role: 'dispatcher' })}
          cities={this.props.cities}
          countries={this.props.countries}
          showMessage={this.props.showMessage}
          createDispatcher={this.props.fleetActions.createUser}
          updateDispatcher={this.props.fleetActions.updateUser}
          deleteDispatcher={this.props.fleetActions.removeUser}
          getCountryByCityId={this.props.getCountryByCityId}
          getCityById={this.props.getCityById}
          getCountries={this.props.getCountries}
          getCities={this.props.getCities}
          startSpinner={this.props.appActions.startSpinner}
          endSpinner={this.props.appActions.endSpinner}
          updatePickUpPoint={this.props.createUserActions.updatePickUpPoint}
          teams={this.props.teams}
          createDefaultPickUpPoint={this.props.createUserActions.createDefaultPickUpPoint}
          pickUpPoints={this.props.pickUpPoints}
          deletePickUpPoint={this.props.appActions.deletePickUpPoint}
          deleteLocalPickUpPoint={this.props.appActions.deleteLocalPickUpPoint}
          company={this.props.company}
          account={this.props.account}
          getCitiesByText={this.props.appActions.getCitiesByText}
          getCitiesByText={this.props.appActions.getCitiesByText}
          fetchCityForInfo={this.props.appActions.fetchCityForInfo}
          cityForInfo={this.props.cityForInfo} />);

      else if (this.props.selectedMenuItem === gettext('DISPATCHER-PLATFORMS'))
        return (<DispatcherPlatformComponent
          dispatcherPlatforms={_.filter(this.props.users, { role: 'dispatcherPlatform' })}
          cities={this.props.cities}
          countries={this.props.countries}
          showMessage={this.props.showMessage}
          createDispatcherPlatform={this.props.fleetActions.createUser}
          updateDispatcherPlatform={this.props.fleetActions.updateUser}
          deleteDispatcherPlatform={this.props.fleetActions.removeUser}
          getCountryByCityId={this.props.getCountryByCityId}
          getCityById={this.props.getCityById}
          getCountries={this.props.getCountries}
          getCities={this.props.getCities}
          startSpinner={this.props.appActions.startSpinner}
          endSpinner={this.props.appActions.endSpinner}
          teams={this.props.teams}
          company={this.props.company}
          getCitiesByText={this.props.appActions.getCitiesByText}
          fetchCityForInfo={this.props.appActions.fetchCityForInfo}
          cityForInfo={this.props.cityForInfo} />);

      else if (this.props.selectedMenuItem === gettext('DRIVERS'))
        return (<DriversComponent
          drivers={_.filter(this.props.users, { role: 'driver' })}
          vehicles={this.props.vehicles}
          cities={this.props.cities}
          countries={this.props.countries}
          showMessage={this.props.showMessage}
          createDriver={this.props.fleetActions.createUser}
          updateDriver={this.props.fleetActions.updateUser}
          resetCashOnDelivery={this.props.fleetActions.resetCashOnDelivery}
          deleteDriver={this.props.fleetActions.removeUser}
          getCountryByCityId={this.props.getCountryByCityId}
          getCityById={this.props.getCityById}
          getCountries={this.props.getCountries}
          getCities={this.props.getCities}
          startSpinner={this.props.appActions.startSpinner}
          teams={this.props.teams}
          getVehicles={this.props.getVehicles}
          company={this.props.company}
          getTeamName={this.getTeamName}
          account={this.props.account}
          getCitiesByText={this.props.appActions.getCitiesByText}
          fetchCityForInfo={this.props.appActions.fetchCityForInfo}
          cityForInfo={this.props.cityForInfo} />);

      else if (this.props.selectedMenuItem === gettext('COMPANIES'))
        return (<CompaniesComponent
          companies={this.props.companies}
          fleets={this.props.fleets}
          showMessage={this.props.showMessage}
          createCompany={this.props.adminActions.createCompany}
          updateCompany={this.props.adminActions.updateCompanyFromSettings}
          deleteCompany={this.props.fleetActions.removeUser}
          startSpinner={this.props.appActions.startSpinner}
          company={this.props.company}
          fleets={this.props.fleets} />);

    }
    return (
      <div className="SettingsComponent">

        <PageHeader>
          <Button className="back_link" bsStyle="link"

            onClick={() => this.props.router.push(this.getRedirectDashboard())}>{gettext('BACK-TO')}</Button>
          {gettext('DOOK-SETTINGS')}
        </PageHeader>
        <Col sm={2}>
          {this.renderLeftMenu()}
        </Col>

        <Col sm={10}>
          <div className="settings_content">
            {this.props.account.isBlocked ?
              <Alert bsStyle="danger" className="pay_div" onDismiss={this.handleAlertDismiss}>
                <h4>Company is blocked!</h4>
                <Button onClick={() => this.props.router.push('/pay')}>{gettext('PAY')}</Button>
              </Alert> : ''}
            {rendermenuItem()}

          </div>
        </Col>
      </div >
    );
  }
}




SettingsComponent.propTypes = {
  selectMenuItem: PropTypes.func,
  selectedMenuItem: PropTypes.string
};
