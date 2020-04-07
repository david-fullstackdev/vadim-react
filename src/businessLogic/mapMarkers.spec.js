import chai from 'chai';
import _ from 'lodash';

const expect = chai.expect;

import {calculateMarkerOpacity, markerIcons, buildMapMarkersList} from './mapMarkers';

describe('Map markres', () => {
  describe('buildMapMarkersList', () => {
    it('should return nothing on empty input', () => {
      let markers = buildMapMarkersList(
        [],
        [],
        [],
        []
      );
      expect(markers).to.be.instanceOf(Array);
      expect(markers).to.be.empty;
    });

    // it('should return one on one delivery point', () => {
    //   let markers = buildMapMarkersList(
    //     [{
    //       items: [
    //         {pickupPointId: 'position1'}
    //       ]
    //     }],
    //     [],
    //     [],
    //     {position1: {address: 'address', gpsLocation: { lat: 10, lng: 10}}},
    //     []
    //   );
    //   expect(markers).to.be.instanceOf(Array);
    //   expect(markers.length).to.be.equal(1);
    //   expect(_.first(markers).orders.length).to.be.equal(1);
    //   expect(_.first(markers).position).to.eql({ lat: 10, lng: 10});
    // });

    // it('should return one maker on two same pickup locations ', () => {
    //   let markers = buildMapMarkersList(
    //     [{
    //       items: [
    //         {pickupPointId: 'position1'},
    //         {pickupPointId: 'position1'}
    //       ]
    //     }],
    //     [],
    //     [],
    //     {position1: {address: 'address', gpsLocation: { lat: 10, lng: 10}}},
    //     []
    //   );
    //   expect(markers).to.be.instanceOf(Array);
    //   expect(markers.length).to.be.equal(1);
    //   expect(_.first(markers).icon).to.eql(markerIcons.unassigned);
    //   expect(_.first(markers).orders.length).to.be.equal(2);
    // });
    //
    // it('should return one maker on two same pickup locations and one is selected', () => {
    //   const order1 = {
    //     items: [
    //       {pickupPointId: 'position1'},
    //       {pickupPointId: 'position1'}
    //     ]
    //   };
    //
    //   const order2 = {
    //     items: [
    //       {pickupPointId: 'position2'},
    //       {pickupPointId: 'position2'}
    //     ]
    //   };
    //   let markers = buildMapMarkersList(
    //     [ order1, order2 ],
    //     [],
    //     [],
    //     {
    //       position1: {address: 'address 1', gpsLocation: { lat: 10, lng: 10}},
    //       position2: {address: 'address 2', gpsLocation: { lat: 20, lng: 20}}
    //     },
    //     [ order1 ]
    //   );
    //   expect(markers).to.be.instanceOf(Array);
    //   expect(markers.length).to.be.equal(2);
    //
    //   expect(_.filter(markers, { address: 'address 1', icon: markerIcons.highlighted}).length).to.eql(1);
    //   expect(_.filter(markers, { address: 'address 2', icon: markerIcons.unassigned}).length).to.eql(1);
    //   expect(markers[0].opacity).to.be.equal(1);
    //   expect(markers[1].opacity).to.be.not.equal(1);
    //   expect(_.first(markers).orders.length).to.be.equal(2);
    // });
    //
    // it('should show selected icon on two orders with same location', () => {
    //   const order1 = {
    //     items: [
    //       {pickupPointId: 'position1'},
    //       {pickupPointId: 'position1'}
    //     ]
    //   };
    //
    //   const order2 = {
    //     items: [
    //       {pickupPointId: 'position1'}
    //     ]
    //   };
    //   let markers = buildMapMarkersList(
    //     [ order1, order2 ],
    //     [],
    //     [],
    //     {
    //       position1: {address: 'address 1', gpsLocation: { lat: 10, lng: 10}},
    //       position2: {address: 'address 2', gpsLocation: { lat: 20, lng: 20}}
    //     },
    //     [ order1 ]
    //   );
    //
    //   expect(markers).to.be.instanceOf(Array);
    //   expect(markers.length).to.be.equal(1);
    //   expect(_.filter(markers, { address: 'address 1', icon: markerIcons.highlighted}).length).to.eql(1);
    //   expect(_.first(markers).orders.length).to.be.equal(3);
    //   expect(_.first(markers).opacity).to.be.equal(1);
    // });
  });


  describe('calculateMarkerOpacity', () => {
    it('should return 1 if item is selected', () => {

      // Should be 1 if item is selected
      let order1 = { order: 'order' };
      let order2 = { order: 'order2' };
      let selectedOrders = [order1];
      let opacity = calculateMarkerOpacity({
          orders: [ { order: order1}, {order: order2 } ]
        }, selectedOrders);
      expect(opacity).to.be.equal(1);
    });

    it('should not return 1 if item not selected and there are selected items', () => {
      let order1 = { order: 'order' };
      let order2 = { order: 'order2' };
      let order3 = { order: 'order3' };
      let selectedOrders = [order3];
      let opacity = calculateMarkerOpacity({
          orders: [ { order: order1}, {order: order2 } ]
        }, selectedOrders);

      expect(opacity).to.be.not.equal(1);
    });

    it('should return 1 if nothing is selected', () => {
      let order1 = { order: 'order' };
      let order2 = { order: 'order2' };
      let selectedOrders = [];
      let opacity = calculateMarkerOpacity({
          orders: [ { order: order1}, {order: order2 } ]
        }, selectedOrders);

      expect(opacity).to.be.equal(1);
    });
  });
});
