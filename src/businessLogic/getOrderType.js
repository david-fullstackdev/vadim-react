import { gettext } from '../i18n/service.js';

export default function getOrderType(order){
  if(order.express)
    return gettext('EXPRESS');
  else if(order.isOutOfCity)
    return gettext('OUT-OF-CITY');
  else if(!order.isOutOfCity && !order.express)
    return gettext('REGULAR');
}
