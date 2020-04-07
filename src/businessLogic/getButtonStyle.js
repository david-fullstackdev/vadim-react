export function getDashboardButtonStyle(order) {
  if(order.express)
    return 'btn btn-danger express-btn dashboard_button';
  else if(order.isOutOfCity)
    return 'btn btn-primary dashboard_button';
  else
    return 'btn btn-success btn-order-detail dashboard_button';
}
