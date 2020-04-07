import { default as translations } from '../translation-files/translations.js';
import changeLangAttr from '../businessLogic/changeLangAttr.js';

export function gettext(key, locale = getLocale()) {
  if (translations[locale] && translations[locale][key]) {
    return translations[locale][key];
  } else {
    return key;
  }
}

export function getLocale() {
  var lan = localStorage.getItem('user-language') || (navigator.languages && navigator.languages[0].split('-')[0]) || navigator.language.split('-')[0];
  if(lan!=='en'&&lan!=='ar') {
    changeLangAttr('ar');
    return 'ar';
  }
  else {
    changeLangAttr(lan);
    return lan;
  }
}

export function setLocale(locale) {
  localStorage.removeItem('last_settings_tab');
  return localStorage.setItem('user-language', locale);
}

export function formatRequiredVehicleType(type) {
  return gettext(`REQUIRED-VEHICLE.${type.trim().toUpperCase()}`);
}

export function getStatus(status) {
  return gettext(`STATUS.${status.trim().toUpperCase()}`);
}
