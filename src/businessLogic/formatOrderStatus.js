import formatCamelCase from './formatCamelCase.js';

export default function formatOrderStatus(orderStatus) {
  const orderStatusWithoutCamelCase = formatCamelCase(orderStatus);
  switch(orderStatus) {
    case 'onWayToDelivery':
    case 'delivered':
    case 'pickedUp':
      return (
        `<span class="successText">${orderStatusWithoutCamelCase}</span>`
      );
    case 'canceled':
    case 'waitingForReturn':
    case 'returned':
      return (
        `<span class="warningText">${orderStatusWithoutCamelCase}</span>`
      );
    default:
      return orderStatusWithoutCamelCase;
  }
}
