;(function (w, d) {

  // TODO:
  // 2. Add descriptions to each step and every option

  // Don't collide with hugo template delimiters
  Vue.options.delimiters = ['${', '}'];

  var config = calculatorConfig;

  /**
   * Radio picker component. Used for design type and delivery type selections.
   */
  Vue.component('radio-picker', {
    props: {
      label: {
        type: String,
        required: true,
      },
      index: {
        type: [String, Number],
        required: true,
      },
      options: {
        type: Array,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
      totalPrice: {
        type: Number,
        default: 0,
      },
      priceText: String,
    },
    template: '#radio-picker-template'
  });

  /**
   * Products component. Used for selecting products.
   */
  Vue.component('products', {
    props: {
      label: {
        type: String,
        required: true,
      },
      index: {
        type: [String, Number],
        required: true,
      },
      options: {
        type: Array,
        required: true,
      },
      designPrice: {
        type: Function,
        required: true,
      },
      designPriceTotal: {
        type: Number,
        required: true,
      },
    },
    template: '#products-template'
  });

  /**
   * Printing component. Used for selecting variants and their amounts.
   */
  Vue.component('printing', {
    props: {
      label: {
        type: String,
        required: true,
      },
      index: {
        type: [String, Number],
        required: true,
      },
      pickedProducts: {
        type: Array,
        required: true,
      },
      printingPrice: {
        type: Function,
        required: true,
      },
      printingPriceTotal: {
        type: Number,
        required: true,
      },
    },
    template: '#printing-template',
    methods: {
      /**
       * List all available variants for a given product
       */
      variants: function (product) {
        if (!config.products.hasOwnProperty(product)) {
          return [];
        }

        return config.products[product].variants;
      }
    }
  });

  /**
   * Main application state
   */
  var state = {
    designTypes: {
      picked: config.defaultDesignType,
      options: Object.keys(config.designTypes)
    },
    products: {
      picked: [],
      options: Object.keys(config.products)
    },
    variants: {
      picked: [],
    },
    delivery: {
      picked: config.defaultDelivery,
      options: Object.keys(config.delivery)
    },
  };

  /**
   * Main calculator application
   */
  var app = new Vue({
    el: '#calculator',
    data: state,
    computed: {
      /**
       * Calculate total design price
       */
      designPriceTotal: function () {
        return this.products.picked.reduce(function (acc, p) {
          return acc + app.designPrice(p);
        }, 0);
      },

      /**
       * Calculate total printing price
       */
      printingPriceTotal: function () {
        return this.variants.picked.reduce(function (acc, v) {
          return acc + app.printingPrice(v.product, v.variant);
        }, 0);
      },

      /**
       * Calculate total delivery price
       */
      deliveryPriceTotal: function () {
        return config.delivery[this.delivery.picked].price;
      },

      /**
       * Calculate total order price
       */
      totalPrice: function () {
        return this.printingPriceTotal + this.designPriceTotal + this.deliveryPriceTotal;
      }
    },
    methods: {
      /**
       * Calculate price for a given product
       */
      designPrice: function (product) {
        var index = this.products.picked.indexOf(product);
        if (index === -1) {
          return 0;
        }

        return config.designTypes[this.designTypes.picked].price;
      },

      /**
       * Calculate price for a given product and variant
       */
      printingPrice: function (product, variant) {
        var found = this.variants.picked.filter(function (v) {
          return v.product === product && v.variant === variant;
        });

        var price = found.reduce(function (acc, v) {
          // Find printing costs for this variant
          var variant = config.products[v.product].variants[v.variant];
          return acc + calculateTotalPrice(v.value, variant.price, variant.priceType);
        }, 0);

        return Math.ceil(price);
      },

      /**
       * Check/uncheck the product
       */
      toggleProduct: function (product) {
        var index = this.products.picked.indexOf(product);
        if (index === -1) {
          this.products.picked.push(product);
        } else {
          // Remove product
          this.products.picked.splice(index, 1);
          // Remove picked variants from that product
          this.variants.picked = this.variants.picked.filter(function (el) {
            return el.product !== product;
          });
        }
      },

      /**
       * Choose the amount to print for a variant
       */
      chooseVariant: function (d) {
        var existing = this.variants.picked.filter(function (el) {
          return el.product === d.product && el.variant === d.variant;
        });

        if (existing.length) {
          // If this variant is already picked, remove
          this.variants.picked.splice(this.variants.picked.indexOf(existing[0]), 1);
        }

        // Pick only variants with valid positive amounts
        d.value = parseInt(d.value, 10);
        if (!isNaN(d.value) && d.value > 0) {
          this.variants.picked.push(d);
        }
      }
    }
  });

  /**
   * Calculate total printing price
   */
  function calculateTotalPrice(amount, price, priceType) {
    switch (priceType) {
      case 'perProduct':
        return totalPricePerProduct(amount, price);
      case 'perAmount':
      default:
        return totalPricePerAmount(amount, price);
    }
  }

  /**
   * Calculate total printing price when variant's price type is per product
   */
  function totalPricePerProduct(amount, price) {
    if (amount < 20) {
      amount = 20
    }

    return totalPricePerAmount(amount, price);
  }

  /**
   * Calculate total printing price when variant's price type is per amount.
   * Uses linear function.
   */
  function totalPricePerAmount(amount, price) {
    return amount * price;
  }

})(window, document);
