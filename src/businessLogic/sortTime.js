export default function sortTime(a, b) {
  return Date.parse(a) - Date.parse(b);
}
