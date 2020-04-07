import {formatCashOn, summCashOn} from '../formatCashOnDelivery.js';
import {expect} from 'chai';

const orders = [
  {
    cashOnDelivery: false,
    cashOnDeliveryAmount: 100
  },
  {
    cashOnDelivery: true,
    cashOnDeliveryAmount: 50
  },
  {
    cashOnDelivery: null,
    cashOnDeliveryAmount: null
  },
  {
    cashOnDelivery: null,
    cashOnDeliveryAmount: 50
  },
  {
    cashOnDelivery: undefined,
    cashOnDeliveryAmount: undefined
  },
  {
    cashOnDelivery: undefined,
    cashOnDeliveryAmount: 50
  },
  {
    cashOnDelivery: true,
    cashOnDeliveryAmount: null
  },
  {
    cashOnDelivery: true,
    cashOnDeliveryAmount: undefined
  },
  {
    cashOnDelivery: true,
    cashOnDeliveryAmount: NaN
  },
  {
    cashOnDelivery: false,
    cashOnDeliveryAmount: NaN
  }
];

describe('formatCashOnDelivery', () => {
  describe('formatCashOn', () => {
    it('must return not NaN', () => {
      for (let i = 0; i < orders.length; i++) {
        expect(formatCashOn(orders[i].cashOnDelivery, orders[i].cashOnDeliveryAmount)).not.to.be.equal(NaN);
      }
    });
  });

  describe('summCashOn', () => {
    it('must return 50', () => {
      expect(summCashOn(orders)).to.be.equal(50);
    });
  });
});
