
export function filterByIntValue(objValue, filterValue){
  return objValue.length === parseInt(filterValue);
}

export function filterByStringValue(objValue, filterValue){
  return objValue.indexOf(filterValue) != -1;
}

export  function disabledMinutes() {
  return generateOptions(60, [0]);
}

function generateOptions(length, excludedOptions) {
  const arr = [];
  for (let value = 0; value < length; value++) {
    if (excludedOptions.indexOf(value) < 0) {
      arr.push(value);
    }
  }
  return arr;
}
