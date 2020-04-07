export function success(pos) {
  if(!pos) {
    return 'Can not get position';
  }

  var crd = pos.coords;

  const location = {
    lat: crd.latitude,
    lng: crd.longitude
  };
  return location;
}

export function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}
