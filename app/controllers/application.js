import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { assert } from '@ember/debug';

export default Controller.extend({
  targetBondAllocation: 0.1,
  currentStocks: 0,
  currentBonds: 0,
  purchaseAmount: 0,

  computedTarget: computed("targetBondAllocation", {
    get() {
      let target = this.get('targetBondAllocation');
      assert("targetBondAllocation should be a number", typeof target === "number");
      assert("targetBondAllocation is between 0-1, inclusive", target >= 0 && target <= 1);
      return target;
    },
    set(key, value) {
      assert("value should be string or number", typeof value === "number" || typeof value === "string");
      let target = parseInt(value);
      assert("target should be non-negative", target >= 0);
      this.set('targetBondAllocation', target);
      return value;
    },
  }),


  computedStocks: computed("currentStocks", {
    get() {
      let stocks = this.get('currentStocks');
      assert("stocks should be a number", typeof stocks === "number");
      return stocks;
    },
    set(key, value) {
      assert("value should be string or number", typeof value === "number" || typeof value === "string");
      let stocks = parseInt(value);
      this.set('currentStocks', stocks);
      return value;
    },
  }),

  computedBonds: computed("currentBonds", {
    get() {
      let bonds = this.get('currentBonds');
      assert("bonds should be a number", typeof bonds === "number");
      return bonds;
    },
    set(key, value) {
      assert("value should be string or number", typeof value === "number" || typeof value === "string");
      let bonds = parseInt(value);
      this.set('currentBonds', bonds);
      return value;
    },
  }),

  computedPurchaseAmount: computed("purchaseAmount", {
    get() {
      let purchaseAmount = this.get('purchaseAmount');
      assert("purchaseAmount should be a number", typeof purchaseAmount === "number");
      return purchaseAmount;
    },
    set(key, value) {
      assert("value should be string or number", typeof value === "number" || typeof value === "string");
      let amount = parseInt(value);
      assert("value should be non-negative", amount >= 0);
      this.set('purchaseAmount', amount);
      return value;
    },
  }),

  currentBondAllocation: computed(
    "currentStocks",
    "currentBonds",
    function() {
      let stocks = parseInt(this.get('currentStocks'));
      let bonds = parseInt(this.get('currentBonds'));
      assert("stocks should be a number", typeof stocks === "number");
      assert("bonds should be a number", typeof bonds === "number");
      assert("stocks should be non-negative", stocks >= 0);
      assert("bonds should be non-negative", bonds >= 0);

      let total = stocks + bonds;
      let allocation = (total === 0 ? 0 : (bonds / total)).toFixed(2);
      assert("allocation is a string", typeof allocation === "string");

      return allocation;
    }
  ),

  bondsPurchaseAmount: computed(
    "currentStocks",
    "currentBonds",
    "targetBondAllocation",
    "purchaseAmount",
    function() {
      let stocks = this.get("currentStocks");
      let bonds = this.get("currentBonds");
      let targetBondAllocation = this.get("targetBondAllocation");
      let purchaseAmount = this.get("purchaseAmount");

      assert("stocks is a number", typeof stocks === "number");
      assert("stocks is non-negative", stocks >= 0);
      assert("bonds is a number", typeof bonds === "number");
      assert("bonds is non-negative", bonds >= 0);
      assert("targetBondAllocation is a number", typeof targetBondAllocation === "number");
      assert("targetBondAllocation is non-negative", targetBondAllocation >= 0);
      assert("targetBondAllocation is less than or equal to 1", targetBondAllocation <= 1);
      assert("purchaseAmount is a number", typeof purchaseAmount === "number");
      assert("purchaseAmount is non-negative", purchaseAmount >= 0);

      let purchase = targetBondAllocation * (bonds + stocks + purchaseAmount) - bonds;
      purchase = purchase < 0 ? 0 : purchase;
      assert("purchase is non-negative", purchase >= 0);

      return purchase;
    }
  ),

  stocksPurchaseAmount: computed(
    "currentStocks",
    "currentBonds",
    "targetBondAllocation",
    "purchaseAmount",
    function() {
      let bondsPurchaseAmount = this.get("bondsPurchaseAmount");
      let purchaseAmount = this.get("purchaseAmount");

      assert("purchaseAmount is a number", typeof purchaseAmount === "number");
      assert("purchaseAmount is non-negative", purchaseAmount >= 0);
      assert("bondsPurchaseAmount is a number", typeof bondsPurchaseAmount === "number");
      assert("bondsPurchaseAmount is non-negative", bondsPurchaseAmount >= 0);

      let purchase = purchaseAmount - bondsPurchaseAmount;
      assert("purchase is non-negative", purchase >= 0);
      assert("purchase is less than or equal to purchaseAmount", purchase <= purchaseAmount);

      return purchase;
    }
  ),
});
