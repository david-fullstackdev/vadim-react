import {SetCorrectDeliveryTime, ConvertExpPickUpTime} from '../convertExpPickUpTime.js';
import {expect} from 'chai';


describe('ConvertExpPickUpTime', () => {
  describe('ConvertExpPickUpTime', () => {
    it('must return 13:00', () => {
      expect(ConvertExpPickUpTime('12:00-13:00')).to.be.equal('13:00');
    });
  });
  describe('SetCorrectDeliveryTime', () => {
    it('must return 13:00', () => {
      expect(SetCorrectDeliveryTime('12')).to.be.equal('13:00');
    });
    it('must return 09:00', () => {
      expect(SetCorrectDeliveryTime('8')).to.be.equal('09:00');
    });
  });
});
