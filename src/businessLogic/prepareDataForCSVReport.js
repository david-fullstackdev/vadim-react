import moment from 'moment';
import { gettext } from '../i18n/service.js';
import _ from 'lodash';
import { formatCashOn } from '../businessLogic/formatCashOnDelivery.js';

export default function createDataForCSV(data, startDate, endDate, allOrders, company) {
    let dataForCSV = [];

    dataForCSV.push({name: "Start Date", value: moment(startDate).zone('+0300').format('L HH:mm')});
    dataForCSV.push({name: "End Date", value: moment(endDate).zone('+0300').format('L HH:mm')});


  dataForCSV.push({name: "", value: ""});
  if(data) {
    if(data.user && data.user.instance) {
      dataForCSV.push({name: "User", value: ""});
      dataForCSV.push({name: gettext("NAME"), value: data.user.instance.firstName || data.user.instance.name});
      dataForCSV.push({name: gettext("MOBILE"), value: data.user.instance.phone || data.user.instance.mobile});
      dataForCSV.push({name: gettext("EMAIL"), value: data.user.instance.email});
      dataForCSV.push({name: gettext("DELIVERY-COST"), value: data.instance && data.instance.deliveryCommission
                                                                ?data.instance.deliveryCommission
                                                                :company.deliveryCommission});

      dataForCSV.push({name: gettext("EXPRESS-DELIVERY-COST"), value: data.instance && data.instance.expressDeliveryCommission
                                                                        ?data.instance.expressDeliveryCommission
                                                                        :company.expressDeliveryCommission});

      dataForCSV.push({name: gettext("ADDITIONAL-PICKUP-COST"), value:  data.instance && data.instance.additionalPickupPointCost
                                                                        ?data.instance.additionalPickupPointCost
                                                                        :company.additionalPickupPointCost});
      dataForCSV.push({name: "", value: ""});

      dataForCSV.push({name: "Totals", value: ""});
    }


    // let totalRegular = (data.delivered?data.delivered.regular:0)
    //                     + (data.returned?data.returned.regular:0);
    // dataForCSV.push({name: gettext("TOTAL-REGULAR-ORDERS"), value: totalRegular});
    //
    // let totalExpress = (data.delivered?data.delivered.express:0)
    //                     + (data.returned?data.returned.express:0);
    // dataForCSV.push({name: gettext("TOTAL-WITH-EXPRESS"), value: totalExpress});
    //
    // let totalOut = (data.delivered?data.delivered.outOfCity:0)
    //                     + (data.returned?data.returned.outOfCity:0);
    // dataForCSV.push({name: gettext("TOTAL-OUT-OF-CITY-ORDERS"), value: totalOut});

    let totalDelivered = data.delivered ? data.delivered.count: 0;
    dataForCSV.push({name: gettext("TOTAL-DELIVERED"), value: totalDelivered});

    let totalCanceled = data.canceled ? data.canceled.count: 0;
    dataForCSV.push({name: gettext("TOTAL-CANCELED"), value: totalCanceled});

    let totalReturned = data.returned ? data.returned.count: 0;
    dataForCSV.push({name: gettext("TOTAL-RETURNED"), value: totalReturned});


    let totalCOD = data.total.cashOnDeliveryTotal ? data.total.cashOnDeliveryTotal: 0;
    dataForCSV.push({name: gettext("TOTAL-COD-AMOUNT"), value: totalCOD});

    let totalCost = data.total.subTotal ? data.total.subTotal:0
    dataForCSV.push({name: gettext("TOTAL-DELIVERY-COST"), value: totalCost});

    let totalSet = data.total.settlement ? data.total.settlement:0
    dataForCSV.push({name: gettext("SETTLEMENT"), value: totalSet});

    dataForCSV.push({name: "", value: ""});

    let deliveredOrders = data.delivered?getOrders(data.delivered.ids, allOrders):[];
    let canceledOrders = data.canceled?getOrders(data.canceled.ids, allOrders):[];
    let returnedOrders = data.returned?getOrders(data.returned.ids, allOrders):[];







    dataForCSV.push({name: gettext("ORDERS"), value: ""});
    dataForCSV.push({name: gettext("ORDER-#"), value: gettext("PICKUP-TIME"), processedAt: gettext("PROCESSED-TIME"), cost: gettext("COST"), cod: gettext("COD"), type: gettext("TYPE"), status: gettext("STATUS"), createdBy: gettext("CREATED-BY")});

    let orders = deliveredOrders.concat(returnedOrders, canceledOrders);
    orders = _.uniqBy(orders, 'id');

    _.map(orders, (order) => {
      let orderType;
      if(order) {
        if(order.express)
          orderType = 'express';
        if(order.isOutOfCity)
          orderType = 'out of city';
        if(!order.express&&!order.isOutOfCity)
          orderType = 'regular';

        dataForCSV.push({
          name: order.id.slice(order.id.length - 5, order.id.length),
          value: moment(order.expectedPickUpTime.endTime).zone('+0300').format('YYYY-MM-DD HH:mm'),
          processedAt: moment(order.processedAt).zone('+0300').format('YYYY-MM-DD HH:mm'),
          cost: order.deliveryCommission,
          cod: formatCashOn(order.cashOnDelivery, order.cashOnDeliveryAmount),
          type: orderType,
          status: order.orderStatus,
          createdBy: order.createdBy?order.createdBy.companyName:'Can not get creator'
          });

        dataForCSV.push({name: '', value: ''});
      }
    });
  }

  return dataForCSV;
}

function getOrders(ids, allOrders) {
  let orders = [];
  _.map(ids, (id) => {
    orders.push(_.find(allOrders, {id: id}));
  });

  return orders;
}
