import moment from 'moment';

export default function formatOrderedTime(time) {

  if (!time) {
    return 'invalid time';
  }
  const date = moment(time).zone('+0300').format('MM/DD');
  const endTime = moment(time).zone('+0300').format('HH:mm');

  return `${endTime} ${date}`;
}
