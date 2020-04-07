import * as types from '../constants/actionTypes';
import LoopbackHttp from '../businessLogic/LoopbackHttp.js';

export function deleteUser(role, id) {
  return (dispatch) => {
    LoopbackHttp.deleteUser(role, id)
      .then(() => {
        dispatch({
          type: types.USER_DELETED
        });
      })
      .catch(() => {
        dispatch({
          type: types.USER_DELETED_FAILED
        });
      });
  };
}

export function deleteOrder({id}) {
  return (dispatch) => {
    LoopbackHttp.deleteOrder(id)
      .then(() => {
        dispatch({
          type: types.ORDER_DELETED
        });
      })
      .catch(() => {
        dispatch({
          type: types.ORDER_DELETED_FAILED
        });
      });
  };
}

export function addCountry(country) {
  return (dispatch) => {
    LoopbackHttp.addCountry(country)
      .then((data) => {
        dispatch({
          type: types.COUNTRY_CREATED,
          country: data
        });
      })
      .catch(() => {
        dispatch({
          type: types.COUNTRY_CREATE_FAILED
        });
      });
  };
}

export function updateCountry(id, country) {
  return (dispatch) => {
    LoopbackHttp.updateCountry(id, country)
      .then((data) => {
        dispatch({
          type: types.COUNTRY_UPDATED,
          country: data
        });
      })
      .catch(() => {

      });
  };
}

export function deleteCountry(country) {
  return (dispatch) => {
    LoopbackHttp.deleteCountry(country)
      .then(() => {
        dispatch({
          type: types.COUNTRY_DELETED
        });
      })
      .catch(() => {
        dispatch({
          type: types.COUNTRY_DELETE_FAILED
        });
      });
  };
}

export function addCity(city) {
  return (dispatch) => {
    LoopbackHttp.addCity(city)
      .then((data) => {
        dispatch({
          type: types.CITY_CREATED,
          city: data
        });
      })
      .catch(() => {
        dispatch({
          type: types.CITY_CREATE_FAILED
        });
      });
  };
}

export function updateCity(id, city) {
  return (dispatch) => {
    LoopbackHttp.updateCity(id, city)
      .then((data) => {
        dispatch({
          type: types.CITY_UPDATED,
          country: data
        });
      })
      .catch(() => {

      });
  };
}

export function deleteCity(city) {
  return (dispatch) => {
    LoopbackHttp.deleteCity(city)
      .then(() => {
        dispatch({
          type: types.CITY_DELETED,
        });
      })
      .catch(() => {
        dispatch({
          type: types.CITY_DELETE_FAILED
        });
      });
  };
}

export function updateAdministrator(id, fields) {
  return (dispatch) => {
    LoopbackHttp.updateAdministrator(id, fields)
      .then((data) => {
        dispatch({
          type: types.ADMIN_UPDATED,
          newAdmin: data
        });
      })
      .catch(() => {
        dispatch({
          type: types.ADMIN_UPDATE_FAILED
        });
      });
  };
}

export function addCompany(company) {
  return (dispatch) => {
    LoopbackHttp.addCompany(company)
      .then((data) => {
        dispatch({
          type: types.COMPANY_CREATED,
          company: data
        });
      })
      .catch(() => {

      });
  };
}

export function updateCompany(id, company) {
  return (dispatch) => {
    LoopbackHttp.updateCompany(id, company)
      .then((data) => {
        dispatch({
          type: types.COMPANY_UPDATED,
          company: data
        });
      })
      .catch(() => {

      });
  };
}

export function updateLocalCompany(id, company) {
  return {
    type: types.COMPANY_UPDATED,
    company: company
  };
}

export function updateCompanyFromSettings(id, company) {
  return (dispatch) => {
    LoopbackHttp.updateCompany(id, company)
      .then((data) => {
        dispatch({
          type: types.COMPANY_UPDATED_ADMIN,
          company: data
        });
      })
      .catch(() => {

      });
  };
}

export function deleteCompany(company) {
  return (dispatch) => {
    LoopbackHttp.deleteCompany(company)
      .then(() => {
        dispatch({
          type: types.COMPANY_DELETED,
        });
      })
      .catch(() => {

      });
  };
}

export function updateCoefficient(coefficient) {
  return (dispatch) => {
    LoopbackHttp.updateCoefficient(coefficient)
      .then((data) => {
        dispatch({
          type: types.COEFFICIENT_UPDATED,
          coefficient: data
        });
      })
      .catch(() => {

      });
  };
}

export function getFleets() {
  return (dispatch) => {
    LoopbackHttp.getFleets()
      .then((data) => {
        dispatch({
          type: types.FLEETS_FETCHED,
          fleets: data
        });
      })
      .catch(() => {

      });
  };
}

export function updateFleet(fields) {
  return (dispatch) => {
    LoopbackHttp.updateFleet(fields)
      .then((data) => {
        dispatch({
          type: types.FLEET_UPDATED,
          fleet: data
        });
      })
      .catch(() => {

      });
  };
}

export function getCompanies() {
  return (dispatch) => {
    LoopbackHttp.getCompanies()
      .then((data) => {
        dispatch({
          type: types.COMPANIES_FETCHED,
          companies: data
        });
      })
      .catch(() => {

      });
  };
}

export function createFleet(fields) {
  return (dispatch) => {
    LoopbackHttp.createFleet(fields)
      .then((data) => {
        dispatch({
          type: types.FLEET_CREATED,
          fleet: data
        });
      })
      .catch(() => {

      });
  };
}

export function createCompany(fields) {
  return (dispatch) => {
    LoopbackHttp.createCompany(fields)
      .then((data) => {
        dispatch({
          type: types.COMPANY_CREATED,
          company: data
        });
      })
      .catch(() => {

      });
  };
}
