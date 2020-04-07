import * as Regulars from '../constants/regulars.js';
import { gettext } from '../i18n/service.js';
import _ from 'lodash';

export function nameValidation(firstName, showMessage) {
  let validation = true;

  if(!firstName) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-NAME'),
      level: 'error'
    });
  }

  if(!Regulars.name.test(firstName)) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-TRUE-NAME'),
      level: 'error'
    });
  }

  if(firstName.length > 30) {
    validation = false;
    return showMessage({
      message: gettext('NAME-IS-TOO-LONG'),
      level: 'error'
    });
  }

  return validation;
}

///Allows N and N.N
export function numberWithDotValdation(commission, showMessage) {
  let validation = true;

  if(!commission) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-DELIVERY-COST'),
      level: 'error'
    });
  }

  if(!Regulars.number.test(commission)) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-CORRECT-DELIVERY-COST'),
      level: 'error'
    });
  }

  return validation;
}

export function phoneValdation(phoneNumber, showMessage) {
  let validation = true;

  if(!phoneNumber) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-PHONE-NUMBER'),
      level: 'error'
    });
  }

  if(!Regulars.phone.test(phoneNumber)) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-CORRECT-PHONE-NUMBER'),
      level: 'error'
    });
  }

  return validation;
}

export function mobileValdation(phoneNumber, showMessage) {
  let validation = true;

  if(!phoneNumber) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-MOBILE-NUMBER'),
      level: 'error'
    });
  }

  if(!Regulars.phone.test(phoneNumber)) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-CORRECT-MOBILE-NUMBER'),
      level: 'error'
    });
  }

  return validation;
}

export function dispatcherDeliveryCostValidation(deliveryCost, showMessage) {
  let validation = true;

  if(!deliveryCost) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-DELIVERY-COST'),
      level: 'error'
    });
  }

  if(!Regulars.number.test(deliveryCost)) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-CORRECT-DELIVERY-COST'),
      level: 'error'
    });
  }

  return validation;
}

export function dispatcherExpressDeliveryCostValidation(expressDeliveryCost, showMessage) {
  let validation = true;

  if(!expressDeliveryCost) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-EXPRESS-DELIVERY-COST'),
      level: 'error'
    });
  }

  if(!Regulars.number.test(expressDeliveryCost)) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-CORRECT-EXPRESS-DELIVERY-COST'),
      level: 'error'
    });
  }

  return validation;
}

export function cityValdation(cityId, showMessage) {
  let validation = true;

  if(!cityId) {
    validation = false;
    return showMessage({
      message: gettext('SELECT-CITY'),
      level: 'error'
    });
  }

  return validation;
}

export function outOfCityValidation(outOfCIty, showMessage) {
  let validation = true;

  if(!outOfCIty.country) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-COUNTRY'),
      level: 'error'
    });
  }

  if(outOfCIty.country && outOfCIty.country.length < 3) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-CORRECT-COUNTRY'),
      level: 'error'
    });
  }

  if(!outOfCIty.city) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-CITY'),
      level: 'error'
    });
  }

  if(outOfCIty.city && outOfCIty.city.length < 3) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-CORRECT-CITY'),
      level: 'error'
    });
  }

  if(!outOfCIty.addressFirst) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-ADDRESS'),
      level: 'error'
    });
  }

  if(outOfCIty.addressFirst && outOfCIty.addressFirst.length < 10) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-FULL-ADDRESS'),
      level: 'error'
    });
  }

  if(!outOfCIty.zipCode) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-ZIP'),
      level: 'error'
    });
  }

  if(outOfCIty.zipCode && !Regulars.number.test(outOfCIty.zipCode)) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-CORRECT-ZIP'),
      level: 'error'
    });
  }

  return validation;
}

export function driverCommissionPercentValdation(percent, showMessage) {
  let validation = true;

  if(!percent) {
    validation = false;
    return showMessage({
      message: gettext('SET-DRIVER-COMMISSION-PERCENT'),
      level: 'error'
    });
  }

  if(!Regulars.number.test(percent)) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-CORRECT-DRIVER-COMMISSION'),
      level: 'error'
    });
  }

  return validation;
}

export function countryValdation(countryId, showMessage) {
  let validation = true;

  if(!countryId) {
    validation = false;
    return showMessage({
      message: gettext('SELECT-COUNTRY'),
      level: 'error'
    });
  }

  return validation;
}

export function vehicleValdation(vehicleSize, showMessage) {
  let validation = true;

  if(!vehicleSize) {
    validation = false;
    return showMessage({
      message: gettext('SELECT-VEHICLE'),
      level: 'error'
    });
  }

  return validation;
}

export function emailValdation(myEmail, showMessage) {
  let validation = true;

  if(!myEmail) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-EMAIL'),
      level: 'error'
    });
  }

  if(!Regulars.emailRegular.test(myEmail)) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-CORRECT-EMAIL'),
      level: 'error'
    });
  }

  return validation;
}

export function passValdation(pass, confirmPass, showMessage) {
  let validation = true;

  if(pass && pass !== confirmPass) {
    validation = false;
    return showMessage({
      message: gettext('UNEQUILE-PASSES'),
      level: 'error'
    });
  } else if(pass && pass.length<6) {
    validation = false;
    return showMessage({
      message: gettext('PASSWORD-LENGTH-SHOULD-BE-NO-LESS'),
      level: 'error'
    });
  }

  return validation;
}

export function passValdationForCreating(pass, showMessage) {
  let validation = true;

  if(!pass) {
    validation = false;
    return showMessage({
      message: gettext('INSER-PASS'),
      level: 'error'
    });

  } else if(pass.length<6) {
    validation = false;
    return showMessage({
      message: gettext('PASSWORD-LENGTH-SHOULD-BE-NO-LESS'),
      level: 'error'
    });
  }

  return validation;
}

export function teamValdation(teamId, showMessage) {
  let validation = true;

  if(!teamId) {
    validation = false;
    return showMessage({
      message: gettext('SELECT-TEAM'),
      level: 'error'
    });
  }

  return validation;
}

export function pickupPointValidation(point, showMessage) {
  let validation = true;

  if(!point.title) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-POINT-TITLE'),
      level: 'error'
    });
  } else if(point.title.length > 30) {
      validation = false;
      return showMessage({
        message: gettext('TITLE-IS-TOO-LONG'),
        level: 'error'
      });
  }



  if(!Regulars.name.test(point.contactName)) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-CORRECT-CONTACT-NAME'),
      level: 'error'
    });
  }

  if(point.contactName && point.contactName.length >30) {
    validation = false;
    return showMessage({
      message: gettext('CONTACT-NAME-IS-TOO-LONG'),
      level: 'error'
    });
  }

  if(!Regulars.phone.test(point.phone)) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-CORRECT-POINT-PHONE'),
      level: 'error'
    });
  }

  if(!point.address || !point.gpsLocation) {
    validation = false;
    return showMessage({
      message: gettext('SELECT-POINT-ADDRESS'),
      level: 'error'
    });
  }

  return validation;
}

export function recipientDetailsValidation(recipient, showMessage) {
  let validation = true;

  if(!recipient) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-RECIPIENT-INFO'),
      level: 'error'
    });
  }

  if(recipient && !Regulars.name.test(recipient.firstName)) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-TRUE-RECIPIENT-NAME'),
      level: 'error'
    });
  }

  if(recipient && !Regulars.phone.test(recipient.mobile)) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-CORRECT-RECIPIENT-PHONE'),
      level: 'error'
    });
  }

  if(recipient && !recipient.deliveryPoint && !recipient.outOfCityAddress ) {
    validation = false;
    return showMessage({
      message: gettext('SELECT-RECIPIENT-DELIVERY-POINT'),
      level: 'error'
    });
  }

  if(recipient && !recipient.gpsLocation && !recipient.outOfCityAddress) {
    validation = false;
    return showMessage({
      message: gettext('SELECT-RECIPIENT-DELIVERY-POINT'),
      level: 'error'
    });
  }

  return validation;
}

export function orderDetailsValidation(order, showMessage) {
  let validation = true;
  if(!order) {
    validation = false;
    return showMessage({
      message: gettext('INSERT-ORDER-INFO'),
      level: 'error'
    });
  } else if(!order.expectedPickUpTime && !order.express) {
    validation = false;
    return showMessage({
      message: gettext('SELECT-EXPECTED-PICKUP-TIME'),
      level: 'error'
    });
  } else if((!order.expectedPickUpTime.startTime || !order.expectedPickUpTime.endTime) && !order.express) {
    validation = false;
    return showMessage({
      message: gettext('SELECT-EXPECTED-PICKUP-TIME-START-AND-END'),
      level: 'error'
    });
  } else if(order.expectedPickUpTime.startTime >= order.expectedPickUpTime.endTime) {
    validation = false;
    return showMessage({
      message: gettext('START-TIME-CANNOT-BE-HIGHER'),
      level: 'error'
    });
  } else if(!order.vehicleType) {
    validation = false;
    return showMessage({
      message: gettext('SELECT-VEHICLE'),
      level: 'error'
    });
  } else if(order.cashOnDelivery && !order.cashOnDeliveryAmount) {
    validation = false;
    return showMessage({
      message: gettext('INSER-CASH-AMOUNT'),
      level: 'error'
    });
  }
  return validation;
}

export function itemsValidation(items, showMessage) {
  let validation = true;
  if(items.length === 0) {
    validation = false;
    return showMessage({
      message: gettext('ADD-ITEM'),
      level: 'error'
    });
  }
  _.map(items, (item) => {
    if(!item.pickupPointId) {
      validation = false;
      return showMessage({
        message: gettext('SELECT-ITEM-PICKUPPOINT'),
        level: 'error'
      });
    } else if(typeof item.pickupPointId === 'object') {
        item.pickupPointId.title = 'Floating';
        validation = pickupPointValidation(item.pickupPointId, showMessage);
    } else if(!item.packingList) {
        validation = false;
        return showMessage({
          message: gettext('INSERT-PACKLIST'),
          level: 'error'
        });
    }
  });
  return validation;
}
