import moment from 'moment';

export function parseExpectedPickUpTime(expectedPickUpTime) {
  if (!expectedPickUpTime) {
    return 'invalid time';
  }
  const date = moment(expectedPickUpTime.startTime).zone('+0300').format('MM/DD');
  const startTime = moment(expectedPickUpTime.startTime).zone('+0300').format('HH:mm');
  const endTime = moment(expectedPickUpTime.endTime).zone('+0300').format('HH:mm');
  return `${startTime} - ${endTime} ${date}`;
}

export function parseExpectedPickUpTimeOnlyTime(expectedPickUpTime) {
  if (!expectedPickUpTime) {
    return 'invalid time';
  }
  const startTime = moment(expectedPickUpTime.startTime).zone('+0300').format('HH:mm');
  const endTime = moment(expectedPickUpTime.endTime).zone('+0300').format('HH:mm');
  return `${startTime} - ${endTime}`;
}

export function parseExpectedPickUpTimeDate(expectedPickUpTime) {
  if (!expectedPickUpTime) {
    return 'invalid time';
  }
  const date = moment(expectedPickUpTime.startTime).zone('+0300').format('MM/DD/YYYY');
  return `${date}`;
}
