import _ from 'lodash';

export default function getCommissionAndCurrency(id, users){

  let dispatcher = _.find(users, { 'id': id, 'role': 'dispatcher' });
  if(dispatcher && dispatcher.currency)
    return dispatcher.currency;
  else
    return 'cur not found';
}
