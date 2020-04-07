import moment from 'moment';

export default function orderTime(time) {

  if (!time) {
    return 'invalid time';
  }
  const date = moment(time).zone('+0300').format('MM/DD');
  const startTime = moment(time).zone('+0300').format('HH:mm');

  return `${startTime} ${date}`;
}
