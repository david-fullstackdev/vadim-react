import getCommissionAndCurrency from '../getCommissionAndCurrency.js';
import {expect} from 'chai';


describe('getCommissionAndCurrency', () => {
    it('must return SAR', () => {
      const id = '2';
      const users = [
        {
          id: '1',
          role: 'dispatcher',
          currency: 'SAR'
        },
        {
          id: '2',
          role: 'dispatcher',
          currency: 'SAR'
        }

      ];
      expect(getCommissionAndCurrency(id, users)).to.be.equal('SAR');
    });

    it('must return -incorrect id-', () => {
      const id = '3';
      const users = [
        {
          id: '1',
          role: 'dispatcher',
          currency: 'SAR'
        },
        {
          id: '2',
          role: 'dispatcher',
          currency: 'SAR'
        }

      ];
      expect(getCommissionAndCurrency(id, users)).to.be.equal('cur not found');
    });

    it('must return -incorrect role-', () => {
      const id = '2';
      const users = [
        {
          id: '1',
          role: 'dispatcher',
          currency: 'SAR'
        },
        {
          id: '2',
          role: 'driver',
          currency: 'SAR'
        }

      ];
      expect(getCommissionAndCurrency(id, users)).to.be.equal('cur not found');
    });

    it('must return -undefined id-', () => {
      const id = undefined;
      const users = [
        {
          id: '1',
          role: 'dispatcher',
          currency: 'SAR'
        },
        {
          id: '2',
          role: 'driver',
          currency: 'SAR'
        }

      ];
      expect(getCommissionAndCurrency(id, users)).to.be.equal('cur not found');
    });

    it('must return -have no currency-', () => {
      const id = 2;
      const users = [
        {
          id: '1',
          role: 'dispatcher',
          currency: 'SAR'
        },
        {
          id: '2',
          role: 'driver'
        }

      ];
      expect(getCommissionAndCurrency(id, users)).to.be.equal('cur not found');
    });
});
