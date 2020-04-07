import moment from 'moment';

export function formatTime(time) {

  if (!time) {
    return 'invalid time';
  }
  const date = moment(time).zone('+0300').format('MM/DD');
  const endTime = moment(time).zone('+0300').format('HH:mm');
  const startTime = moment(time-3600*1000).zone('+0300').format('HH:mm');

  return `${startTime} - ${endTime} ${date}`;
}

export function formatOnlyTime(time) {

  if (!time) {
    return 'invalid time';
  }
  const endTime = moment(time).zone('+0300').format('HH:mm');
  const startTime = moment(time-3600*1000).zone('+0300').format('HH:mm');

  return `${startTime} - ${endTime}`;
}
