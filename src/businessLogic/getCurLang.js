import changeLangAttr from './changeLangAttr.js';

export default function getCurLang() {
  var lan = localStorage.getItem('user-language')
              || (navigator.languages && navigator.languages[0].split('-')[0])
              || navigator.language.split('-')[0];
              
  changeLangAttr(lan);
  if(lan!=='en'&&lan!=='ar')
      return 'en';
    else
      return lan;
}
