export default function parseTimeWindow(time) {
  if (typeof time !== 'string') {
    return;
  }
  return Date.parse(time.split(' - ')[1]);
}
