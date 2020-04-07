import parseTimeWindow from './parseTimeWindow.js';

export default function sortTimeWindow(a, b){
  return parseTimeWindow(a) - parseTimeWindow(b);
}
