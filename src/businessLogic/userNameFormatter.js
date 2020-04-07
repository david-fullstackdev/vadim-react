export default function formatUserName(user) {
  if (!user) {
    return 'invalid user';
  }
  return `${user.firstName.slice(0, 1)}`;
}
