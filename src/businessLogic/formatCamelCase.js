export default function formatCamelCase(string) {
  if ( !string ) { return ''; }
  return string
  .replace(/([A-Z])/g, ' $1')
  .replace(/^./, (str) => str.toUpperCase());
}
