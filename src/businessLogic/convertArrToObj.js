export const convertArrToObj = (arr) => {
  return arr.reduce(function(prev, curr) {
    prev[curr.id] = curr;
    return prev;
  }, {});
};
