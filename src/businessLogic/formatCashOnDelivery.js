export function formatCashOn(cashOn, cost) {
  cost = (cashOn && cashOn!==null && cost && cost!==null && !isNaN(cost) && cost>=0) ? cost : 0;
    return cost;
}

export function summCashOn(orders) {
  var cost = 0;
  for (var ord of orders) {
    if(ord.cashOnDelivery
        && ord.cashOnDeliveryAmount
        && ord.cashOnDeliveryAmount!==null
        && !isNaN(ord.cashOnDeliveryAmount)
        && ord.cashOnDeliveryAmount >= 0)
      cost = cost + ord.cashOnDeliveryAmount;
  }
  return cost;
}
