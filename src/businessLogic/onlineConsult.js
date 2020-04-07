export function addConsult(account) {
  if(typeof Smooch === 'undefined') {
    var script = document.createElement('script');
     script.src='https://cdn.smooch.io/smooch.min.js';
     script.type = 'text/javascript';
     script.onload = function() {
          Smooch.init({ appToken: 'd55jjnytraubavc1lfeh663kg', givenName: account.shopName, surname: account.firstName, userId: account.id });
     };
     document.getElementsByTagName('body')[0].appendChild(script);
  }
}
