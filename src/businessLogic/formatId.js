export default function formatId(id) {
  if (!id || !id.length) {
    return 'invalid id';
  }
  return id.slice(id.length - 5, id.length);
}
