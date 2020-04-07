import moment from 'moment';

export default function expPikcupTimeValidator(selectedOrders) {

  const date = moment(selectedOrders[0].expectedPickUpTime.startTime).zone('+0300').format('MM/DD');
  for (var order of selectedOrders) {
    if(moment(order.expectedPickUpTime.startTime).zone('+0300').format('MM/DD')!==date) {
      return false;
    }
  }
  return true;
}
